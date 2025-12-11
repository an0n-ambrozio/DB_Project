import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { name, email, password, role } = await request.json();

        const existing = await prisma.user.findUnique({
            where: { email }
        });

        if (existing) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'recruiter' // Default to recruiter
            }
        });

        return NextResponse.json({
            message: 'User created successfully',
            user: { id: user.id, email: user.email }
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
    }
}
