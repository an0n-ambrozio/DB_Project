import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const SECRET = process.env.JWT_SECRET || 'secret';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create Token
        const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: '1d' });

        // Set Cookie
        const cookie = serialize('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        const response = NextResponse.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

        response.headers.set('Set-Cookie', cookie);

        return response;
    } catch (error) {
        console.error('Login API Error:', error);
        return NextResponse.json({ error: 'Login failed', details: String(error) }, { status: 500 });
    }
}
