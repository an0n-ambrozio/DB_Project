import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { candidateId } = body;

        if (!candidateId) {
            return NextResponse.json({ error: 'Candidate ID is required' }, { status: 400 });
        }

        // Create connection record (use upsert to be safe)
        const connection = await prisma.connectedCandidate.upsert({
            where: { candidateId: parseInt(candidateId) },
            create: { candidateId: parseInt(candidateId) },
            update: {}
        });

        // Optionally update candidate status to reflect contact
        await prisma.candidate.update({
            where: { id: parseInt(candidateId) },
            data: { status: 'scheduled' }
        });

        return NextResponse.json(connection, { status: 201 });
    } catch (error) {
        console.error('Failed to connect candidate:', error);
        return NextResponse.json({ error: 'Already connected or internal error' }, { status: 500 });
    }
}
