'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Calendar, Award, TrendingUp } from 'lucide-react';

interface DashboardData {
    stats: {
        total: number;
        interviews: number;
        qualified: number;
        avgScore: number;
    };
    chartData: Array<{
        name: string;
        value: number;
    }>;
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);

    useEffect(() => {
        fetch('/api/dashboard').then(res => res.json()).then(setData);
    }, []);

    if (!data) return <div className="text-white">Loading...</div>;

    const cards = [
        { title: 'Total Candidates', value: data.stats.total, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { title: 'Scheduled Interviews', value: data.stats.interviews, icon: Calendar, color: 'text-violet-400', bg: 'bg-violet-500/10' },
        { title: 'Qualified', value: data.stats.qualified, icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { title: 'Avg Score', value: data.stats.avgScore + '%', icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Overview of your recruitment performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="glass-panel p-6 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
                                <Icon className={card.color} size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{card.value}</div>
                                <div className="text-sm text-gray-400">{card.title}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="glass-panel p-6">
                <h3 className="text-lg font-bold text-white mb-6">Applications Overview</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.chartData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#555" />
                            <YAxis stroke="#555" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
