
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const candidates = [
    {
        name: 'Sarah Jenkins',
        email: 'sarah.j@example.com',
        role: 'Senior React Developer',
        phone: '+1 (415) 555-0123',
        status: 'qualified',
        score: 92,
        photoUrl: '/candidates/sarah.png',
        skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS'],
        experience: [
            { role: 'Senior Frontend Dev', company: 'Tech Corp', duration: '3 years' },
            { role: 'Web Developer', company: 'StartUp Inc', duration: '2 years' }
        ],
        scoreBreakdown: { "Technical": 95, "Experience": 90, "Culture": 91 }
    },
    {
        name: 'Michael Chang',
        email: 'michael.c@example.com',
        role: 'Full Stack Engineer',
        phone: '+1 (650) 555-0456',
        status: 'scheduled',
        score: 88,
        photoUrl: '/candidates/michael.png',
        skills: ['Node.js', 'PostgreSQL', 'React', 'AWS'],
        experience: [
            { role: 'Backend Lead', company: 'DataFlow', duration: '4 years' }
        ],
        scoreBreakdown: { "Technical": 88, "Experience": 92, "Culture": 85 }
    },
    {
        name: 'Jessica Reynolds',
        email: 'jess.r@example.com',
        role: 'UI/UX Designer',
        phone: '+1 (323) 555-0789',
        status: 'qualified',
        score: 95,
        photoUrl: '/candidates/jessica.png',
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
        experience: [
            { role: 'Lead Designer', company: 'Creative Agency', duration: '5 years' }
        ],
        scoreBreakdown: { "Technical": 90, "Experience": 96, "Culture": 99 }
    },
    {
        name: 'David Miller',
        email: 'david.m@example.com',
        role: 'DevOps Engineer',
        phone: '+1 (206) 555-0192',
        status: 'pending',
        score: 85,
        photoUrl: '/candidates/david.png',
        skills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
        experience: [
            { role: 'SRE', company: 'CloudNet', duration: '3 years' }
        ],
        scoreBreakdown: { "Technical": 88, "Experience": 80, "Culture": 87 }
    },
    {
        name: 'Emily Watson',
        email: 'emily.w@example.com',
        role: 'Product Manager',
        phone: '+1 (646) 555-0345',
        status: 'scheduled',
        score: 91,
        photoUrl: '/candidates/emily.png',
        skills: ['Agile', 'Scrum', 'Roadmapping', 'Jira'],
        experience: [
            { role: 'Product Owner', company: 'FinTech Sol', duration: '4 years' }
        ],
        scoreBreakdown: { "Technical": 70, "Experience": 95, "Culture": 98 }
    },
    {
        name: 'James Peterson',
        email: 'james.p@example.com',
        role: 'Mobile Developer',
        phone: '+1 (312) 555-0678',
        status: 'rejected',
        score: 74,
        photoUrl: '/candidates/james.png',
        skills: ['React Native', 'Swift', 'Redux', 'Jest'],
        experience: [
            { role: 'Junior Dev', company: 'AppWorks', duration: '2 years' }
        ],
        scoreBreakdown: { "Technical": 75, "Experience": 70, "Culture": 77 }
    },
    {
        name: 'Olivia Brown',
        email: 'olivia.b@example.com',
        role: 'Data Scientist',
        phone: '+1 (512) 555-0912',
        status: 'qualified',
        score: 94,
        photoUrl: '/candidates/olivia.png',
        skills: ['Python', 'Pandas', 'Machine Learning', 'SQL'],
        experience: [
            { role: 'Data Analyst', company: 'Big Corp', duration: '3 years' }
        ],
        scoreBreakdown: { "Technical": 98, "Experience": 90, "Culture": 94 }
    },
    {
        name: 'Robert Wilson',
        email: 'robert.w@example.com',
        role: 'Cybersecurity Analyst',
        phone: '+1 (702) 555-0444',
        status: 'pending',
        score: 89,
        photoUrl: '/candidates/robert.png',
        skills: ['Network Security', 'Penetration Testing', 'Firewalls', 'Compliance'],
        experience: [
            { role: 'SecOps', company: 'SecureIT', duration: '5 years' }
        ],
        scoreBreakdown: { "Technical": 92, "Experience": 88, "Culture": 87 }
    },
    {
        name: 'Sophia Davis',
        email: 'sophia.d@example.com',
        role: 'Marketing Lead',
        phone: '+1 (917) 555-0777',
        status: 'scheduled',
        score: 90,
        photoUrl: '/candidates/sophia.png',
        skills: ['SEO', 'Content Strategy', 'Google Analytics', 'Brand Management'],
        experience: [
            { role: 'Marketing Specialist', company: 'GrowthHack', duration: '4 years' }
        ],
        scoreBreakdown: { "Technical": 80, "Experience": 92, "Culture": 97 }
    },
    {
        name: 'William Anderson',
        email: 'william.a@example.com',
        role: 'Backend Developer',
        phone: '+1 (202) 555-0888',
        status: 'qualified',
        score: 87,
        photoUrl: '/candidates/william.png',
        skills: ['Java', 'Spring Boot', 'Microservices', 'AWS'],
        experience: [
            { role: 'Java Dev', company: 'Ent Corp', duration: '3 years' }
        ],
        scoreBreakdown: { "Technical": 85, "Experience": 85, "Culture": 90 }
    }
]

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10)

    console.log(`Searching for admin user to link candidates...`)
    const admin = await prisma.user.findFirst({ where: { role: 'recruiter' } })
    const adminId = admin ? admin.id : undefined;

    for (const cand of candidates) {
        // 1. Create User account for them so they can login if they want
        const user = await prisma.user.upsert({
            where: { email: cand.email },
            update: {},
            create: {
                email: cand.email,
                name: cand.name,
                password: hashedPassword,
                role: 'candidate',
            },
        })

        // 2. Create Candidate Profile
        await prisma.candidate.upsert({
            where: { userId: user.id },
            update: {
                name: cand.name, // Update name in case of correction
                phone: cand.phone, // Update phone
                role: cand.role, // Update role
                status: cand.status, // Update status
                score: cand.score, // Update score
                photoUrl: cand.photoUrl, // CRITICAL: Update photo URL
                scoreBreakdown: cand.scoreBreakdown, // Update score breakdown
                experience: cand.experience, // Update experience
                createdById: adminId,
                // Note: For skills, logic is more complex in update, usually demanding deleteMany then create.
                // For simplicity/seeding, we assume skills might just be appended or we leave them.
                // A robust seed would wipe skills or check differences.
                // Given this is a seed script for demo, we can optionaly delete existing skills first or just leave them.
                // Let's trying deleting previous skills to ensure a clean slate if possible,
                // but prisma update doesn't support deleteMany easily inside here without a separate query.
                // We will stick to updating the main fields for now which includes the PHOTO.
            },
            create: {
                name: cand.name,
                email: cand.email,
                phone: cand.phone,
                role: cand.role,
                status: cand.status,
                score: cand.score,
                photoUrl: cand.photoUrl,
                scoreBreakdown: cand.scoreBreakdown,
                experience: cand.experience,
                userId: user.id,
                createdById: adminId,
                skills: {
                    create: cand.skills.map(s => ({ skillName: s }))
                }
            },
        })

        console.log(`Processed ${cand.name}`)
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
