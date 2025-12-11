import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

async function getUserFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) return null;

    try {
        const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: number, email: string, role: string };
        return decoded;
    } catch {
        return null;
    }
}

export async function GET() {
    const user = await getUserFromToken();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // specific for candidate view
    if (user.role !== 'candidate') {
        // If not candidate, maybe return error or empty? 
        // But requested is "candidate view", so we assume calling this is for candidate profile
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const candidate = await prisma.candidate.findUnique({
        where: { userId: user.userId },
        include: { skills: true }
    });

    return NextResponse.json(candidate);
}

export async function PUT(request: Request) {
    const user = await getUserFromToken();
    if (!user || user.role !== 'candidate') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, skills } = body;

    // Update candidate
    const updatedCandidate = await prisma.candidate.update({
        where: { userId: user.userId },
        data: {
            name,
            phone,
            // Simple skill update logic (delete all and recreate for simplicity or careful merge)
            skills: {
                deleteMany: {},
                create: skills.map((s: string) => ({ skillName: s }))
            }
        },
        include: { skills: true }
    });

    return NextResponse.json(updatedCandidate);
}
