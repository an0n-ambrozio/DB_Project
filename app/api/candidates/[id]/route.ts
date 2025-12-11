import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const candidateId = parseInt(id);
        const candidate = await prisma.candidate.findUnique({
            where: { id: candidateId },
            include: { skills: true, interviews: true }
        });

        if (!candidate) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json(candidate);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const candidateId = parseInt(id);
        const body = await request.json();
        const { name, email, phone, role, status, score, skills, experience, scoreBreakdown, photoUrl } = body;

        // Transaction to handle updates and side effects (like creating Rejected/Connected records)
        const updatedCandidate = await prisma.$transaction(async (tx) => {

            // Handle Rejected Side Effects
            if (status === 'rejected') {
                await tx.rejectedCandidate.upsert({
                    where: { candidateId },
                    create: { candidateId },
                    update: {}
                });
            } else if (status !== undefined) {
                // If status is updated and NOT rejected, ensure it's removed from rejected list
                await tx.rejectedCandidate.deleteMany({ where: { candidateId } });
            }

            // Handle Scheduled Side Effects
            if (status !== undefined && status !== 'scheduled') {
                // If status is updated and NOT scheduled, ensure it's removed from connected list
                await tx.connectedCandidate.deleteMany({ where: { candidateId } });
            }

            // Prepare update data dynamicially to allow partial updates
            const updateData: Prisma.CandidateUpdateInput = {};
            if (name !== undefined) updateData.name = name;
            if (email !== undefined) updateData.email = email;
            if (phone !== undefined) updateData.phone = phone;
            if (role !== undefined) updateData.role = role;
            if (status !== undefined) updateData.status = status;
            if (score !== undefined) updateData.score = parseFloat(score);
            if (experience !== undefined) updateData.experience = experience;
            if (scoreBreakdown !== undefined) updateData.scoreBreakdown = scoreBreakdown;
            if (photoUrl !== undefined) updateData.photoUrl = photoUrl;

            // Update standard candidate fields
            const c = await tx.candidate.update({
                where: { id: candidateId },
                data: updateData
            });

            // Update skills if provided
            if (skills) {
                await tx.candidateSkill.deleteMany({ where: { candidateId } });
                if (Array.isArray(skills) && skills.length > 0) {
                    await tx.candidateSkill.createMany({
                        data: skills.map((s: string) => ({ candidateId, skillName: s }))
                    });
                }
            }

            return c;
        });

        return NextResponse.json(updatedCandidate);
    } catch (error) {
        console.error('Update Error:', error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        // Prisma handles Cascade delete for Skills/Interviews automatically via schema
        // But logs are SetNull.

        await prisma.candidate.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Delete Error:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
