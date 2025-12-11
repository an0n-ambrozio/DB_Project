
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
