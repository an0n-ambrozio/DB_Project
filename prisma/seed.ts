
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10)

    // 1. Create Admin
    const adminEmail = 'admin@talenthub.com'
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Admin User',
            password: hashedPassword,
            role: 'recruiter', // or 'admin' based on schema comments
        },
    })
    console.log({ admin })

    // 2. Create Candidate User
    const candidateEmail = 'candidate@talenthub.com'
    const candidateUser = await prisma.user.upsert({
        where: { email: candidateEmail },
        update: {},
        create: {
            email: candidateEmail,
            name: 'John Candidate',
            password: hashedPassword,
            role: 'candidate',
        },
    })
    console.log({ candidateUser })

    // 3. Create Candidate Profile linked to User
    const candidateProfile = await prisma.candidate.upsert({
        where: { userId: candidateUser.id },
        update: {
            name: 'Alex Morgan',
            role: 'Senior Full Stack Engineer',
            status: 'qualified',
            score: 94.5,
            phone: '+1 (555) 012-3456',
            photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=200&h=200',
            experience: [
                {
                    company: 'TechFlow Solutions',
                    role: 'Senior Developer',
                    duration: '2021 - Present',
                    description: 'Leading a team of 5 developers in building scalable microservices.'
                },
                {
                    company: 'InnovaSoft',
                    role: 'Backend Engineer',
                    duration: '2019 - 2021',
                    description: 'Optimized database queries reducing load times by 40%.'
                }
            ],
            scoreBreakdown: {
                "Technical Skills": 95,
                "Experience": 90,
                "Communication": 98
            }
        },
        create: {
            name: 'Alex Morgan',
            email: candidateEmail,
            role: 'Senior Full Stack Engineer',
            status: 'qualified',
            score: 94.5,
            phone: '+1 (555) 012-3456',
            photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=200&h=200',
            userId: candidateUser.id,
            experience: [
                {
                    company: 'TechFlow Solutions',
                    role: 'Senior Developer',
                    duration: '2021 - Present',
                    description: 'Leading a team of 5 developers in building scalable microservices.'
                },
                {
                    company: 'InnovaSoft',
                    role: 'Backend Engineer',
                    duration: '2019 - 2021',
                    description: 'Optimized database queries reducing load times by 40%.'
                }
            ],
            scoreBreakdown: {
                "Technical Skills": 95,
                "Experience": 90,
                "Communication": 98
            },
            skills: {
                create: [
                    { skillName: 'React' },
                    { skillName: 'Node.js' },
                    { skillName: 'TypeScript' },
                    { skillName: 'PostgreSQL' },
                    { skillName: 'AWS' }
                ]
            }
        },
    })

    // If updating, ensure skills are re-synced (simple approach for seeding)
    if (candidateProfile) {
        // We catch error in case we are in 'create' block where transaction handles it, 
        // but for upsert 'update' path we need to handle skills separately or use nested update if supported perfectly.
        // For seed simplicity:
        try {
            await prisma.candidateSkill.deleteMany({ where: { candidateId: candidateProfile.id } });
            await prisma.candidateSkill.createMany({
                data: [
                    { candidateId: candidateProfile.id, skillName: 'React' },
                    { candidateId: candidateProfile.id, skillName: 'Node.js' },
                    { candidateId: candidateProfile.id, skillName: 'TypeScript' },
                    { candidateId: candidateProfile.id, skillName: 'PostgreSQL' },
                    { candidateId: candidateProfile.id, skillName: 'AWS' }
                ]
            });
        } catch (e) { }
    }

    console.log({ candidateProfile })

    // 4. Create Additional Premium Candidates
    const candidates = [
        {
            name: "Sarah Chen",
            email: "sarah.chen@example.com",
            role: "Lead Product Designer",
            status: "qualified",
            score: 92.5,
            phone: "+1 (555) 123-4567",
            photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=200&h=200",
            experience: [
                { company: "Creative Studio", role: "Senior Designer", duration: "2019 - Present" },
                { company: "Tech Startup", role: "UI Designer", duration: "2017 - 2019" }
            ],
            scoreBreakdown: { "Design": 95, "UX Research": 90, "Collaboration": 92 },
            skills: ["Figma", "Design Systems", "Prototyping", "User Research"]
        },
        {
            name: "Michael Ross",
            email: "m.ross@example.com",
            role: "DevOps Engineer",
            status: "scheduled",
            score: 88.0,
            phone: "+1 (555) 234-5678",
            photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=200&h=200",
            experience: [
                { company: "CloudCorp", role: "DevOps Lead", duration: "2020 - Present" },
                { company: "NetworkSys", role: "System Admin", duration: "2018 - 2020" }
            ],
            scoreBreakdown: { "Infrastructure": 92, "Automation": 88, "Security": 85 },
            skills: ["Kubernetes", "Docker", "Terraform", "CI/CD", "AWS"]
        },
        {
            name: "Emily Watson",
            email: "emily.w@example.com",
            role: "Product Manager",
            status: "qualified",
            score: 91.0,
            phone: "+1 (555) 345-6789",
            photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=200&h=200",
            experience: [
                { company: "Product Labs", role: "Product Manager", duration: "2021 - Present" },
                { company: "Marketing Agency", role: "Project Manager", duration: "2019 - 2021" }
            ],
            scoreBreakdown: { "Strategy": 94, "Execution": 90, "Leadership": 89 },
            skills: ["Agile", "Roadmapping", "Data Analysis", "Jira", "SQL"]
        },
        {
            name: "David Kim",
            email: "d.kim@example.com",
            role: "Frontend Architect",
            status: "pending",
            score: 89.5,
            phone: "+1 (555) 456-7890",
            photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=200&h=200",
            experience: [
                { company: "WebFlow Inc", role: "Senior Frontend Dev", duration: "2020 - Present" },
                { company: "DesignCo", role: "Web Developer", duration: "2018 - 2020" }
            ],
            scoreBreakdown: { "Architecture": 92, "Performance": 88, "React": 95 },
            skills: ["React", "Next.js", "Performance", "Three.js", "TypeScript"]
        },
        {
            name: "Jessica Lee",
            email: "j.lee@example.com",
            role: "Data Scientist",
            status: "rejected",
            score: 86.5,
            phone: "+1 (555) 567-8901",
            photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=200&h=200",
            experience: [
                { company: "DataMinda", role: "Data Scientist", duration: "2021 - Present" },
                { company: "University Lab", role: "Research Assistant", duration: "2019 - 2021" }
            ],
            scoreBreakdown: { "Math": 95, "Coding": 85, "Visualization": 82 },
            skills: ["Python", "TensorFlow", "Pandas", "Machine Learning", "SQL"]
        },
        {
            name: "Robert Taylor",
            email: "rob.taylor@example.com",
            role: "Cybersecurity Analyst",
            status: "qualified",
            score: 93.0,
            phone: "+1 (555) 678-9012",
            photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?fit=crop&w=200&h=200",
            experience: [
                { company: "SecureNet", role: "Security Analyst", duration: "2020 - Present" },
                { company: "GovTech", role: "Network Admin", duration: "2017 - 2020" }
            ],
            scoreBreakdown: { "Threat Analysis": 95, "Encryption": 92, "Compliance": 90 },
            skills: ["Penetration Testing", "Encryption", "Network Security", "Python", "Linux"]
        }
    ];

    for (const c of candidates) {
        await prisma.candidate.upsert({
            where: { email: c.email },
            update: {
                name: c.name, role: c.role, status: c.status, score: c.score,
                phone: c.phone, photoUrl: c.photoUrl,
                experience: c.experience, scoreBreakdown: c.scoreBreakdown
            },
            create: {
                name: c.name, email: c.email, role: c.role, status: c.status,
                score: c.score, phone: c.phone, photoUrl: c.photoUrl,
                experience: c.experience, scoreBreakdown: c.scoreBreakdown,
                skills: {
                    create: c.skills.map(s => ({ skillName: s }))
                }
            }
        });

        const created = await prisma.candidate.findUnique({ where: { email: c.email } });
        if (created) {
            try {
                await prisma.candidateSkill.deleteMany({ where: { candidateId: created.id } });
                await prisma.candidateSkill.createMany({
                    data: c.skills.map(s => ({ candidateId: created.id, skillName: s }))
                });
            } catch (e) { }
        }
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
