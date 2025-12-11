
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
        where: { userId: candidateUser.id }, // Now we can use userId unique
        update: {},
        create: {
            name: 'John Candidate',
            email: candidateEmail,
            role: 'Software Engineer',
            status: 'pending',
            userId: candidateUser.id,
        },
    })
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
