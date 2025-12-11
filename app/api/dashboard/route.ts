import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const totalCandidates = await prisma.candidate.count();
        const interviews = await prisma.interview.count({ where: { status: 'scheduled' } });
        const qualified = await prisma.candidate.count({ where: { status: 'qualified' } });

        // Calculate Average Score
        const aggr = await prisma.candidate.aggregate({
            _avg: { score: true }
        });

        // Mock Chart Data (Real data aggregation is complex in SQL/Prisma raw, keeping simple for now)
        const chartData = [
            { name: 'Mon', value: 4 },
            { name: 'Tue', value: 7 },
            { name: 'Wed', value: 3 },
            { name: 'Thu', value: 8 },
            { name: 'Fri', value: 6 },
            { name: 'Sat', value: 2 },
            { name: 'Sun', value: 5 },
        ];

        return NextResponse.json({
            stats: {
                total: totalCandidates,
                interviews,
                qualified,
                avgScore: Math.round(aggr._avg.score || 0)
            },
            chartData
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
