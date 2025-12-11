import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        // const search = searchParams.get('search');

        const where: Prisma.CandidateWhereInput = {};
        if (status && status !== 'all') {
            where.status = status;
        }

        const candidates = await prisma.candidate.findMany({
            where,
            orderBy: { appliedDate: 'desc' },
            include: {
                skills: true,
                createdBy: {
                    select: { name: true }
                }
            }
        });

        return NextResponse.json(candidates);
    } catch (error) {
        console.error('Failed to fetch candidates:', error);
        return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, role, status, score, skills, experience, scoreBreakdown, photoUrl } = body;

        // Check duplicate
        const existing = await prisma.candidate.findUnique({
            where: { email }
        });

        if (existing) {
            return NextResponse.json({ error: 'Candidate with this email already exists' }, { status: 400 });
        }

        const newCandidate = await prisma.candidate.create({
            data: {
                name,
                email,
                phone,
                role,
                status: status || 'pending',
                score: parseFloat(score) || 0,
                experience: experience || [],
                scoreBreakdown: scoreBreakdown || {},
                photoUrl: photoUrl || '',
                skills: {
                    create: skills?.map((s: string) => ({ skillName: s }))
                }
            },
            include: { skills: true }
        });

        return NextResponse.json(newCandidate, { status: 201 });
    } catch (error) {
        console.error('Failed to create candidate:', error);
        return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
    }
}
