'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CandidateCard from '@/components/CandidateCard';
import AddCandidateModal from '@/components/AddCandidateModal';
import { Plus, Search, Filter } from 'lucide-react';

interface Candidate {
    id: number;
    name: string;
    role: string;
    email: string;
    status: string;
    score: number;
    photoUrl?: string;
}

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchCandidates = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/candidates?status=${statusFilter}`, { cache: 'no-store' });
            const data = await res.json();
            setCandidates(data);
        } catch (error) {
            console.error('Failed to fetch candidates', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, [statusFilter]); // Added statusFilter to dependency array to refetch when filter changes

    // Filter Logic
    useEffect(() => {
        let result = candidates;
        if (statusFilter !== 'all') {
            result = result.filter(c => c.status === statusFilter);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.role.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q)
            );
        }
        setFilteredCandidates(result);
    }, [searchQuery, statusFilter, candidates]);

    const handleCreate = async (data: Omit<Candidate, 'id'>) => {
        await fetch('/api/candidates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        fetchCandidates();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this candidate?')) return;
        await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
        fetchCandidates();
    };

    const statuses = ['all', 'qualified', 'scheduled', 'pending', 'rejected'];

    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Premium Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-white tracking-tight">Talent Pool</h1>
                <p className="text-gray-400 text-sm">Manage and track your top candidates</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                {/* Search & Filter Group */}
                <div className="glass-panel p-1.5 flex items-center gap-2 bg-[#0a0a0a]/40 w-full md:w-auto flex-1 max-w-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 pl-10 pr-4 py-2 text-sm h-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="h-6 w-[1px] bg-white/10 mx-1" />
                    <div className="flex gap-1 overflow-x-auto scrollbar-none max-w-[300px] md:max-w-none">
                        {statuses.map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all whitespace-nowrap ${statusFilter === s ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="glass-btn glass-btn-primary h-12 px-6 flex items-center gap-2 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 shrink-0"
                >
                    <Plus size={18} /> Add Candidate
                </button>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-gray-500 min-h-[400px]">
                    <div className="flex flex-col items-center gap-4 animate-pulse">
                        <div className="w-10 h-10 bg-white/10 rounded-full" />
                        <span className="text-sm">Loading talent...</span>
                    </div>
                </div>
            ) : (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    <AnimatePresence mode="popLayout">
                        {filteredCandidates.map(c => (
                            <CandidateCard
                                key={c.id}
                                {...c}
                                onEdit={() => { }}
                                onDelete={handleDelete}
                                onReject={async (id) => {
                                    await fetch(`/api/candidates/${id}`, {
                                        method: 'PUT',
                                        body: JSON.stringify({ status: 'rejected' })
                                    });
                                    fetchCandidates();
                                }}
                                onConnect={async (id) => {
                                    await fetch('/api/connect', {
                                        method: 'POST',
                                        body: JSON.stringify({ candidateId: id })
                                    });
                                    fetchCandidates();
                                }}
                                onRestore={async (id) => {
                                    await fetch(`/api/candidates/${id}`, {
                                        method: 'PUT',
                                        body: JSON.stringify({ status: 'qualified' })
                                    });
                                    fetchCandidates();
                                }}
                            />
                        ))}
                    </AnimatePresence>

                    {filteredCandidates.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-32 text-gray-500 border border-dashed border-white/10 rounded-2xl bg-[#0a0a0a]/20">
                            <Filter size={32} className="mb-4 opacity-20" />
                            <p className="text-sm">No candidates found.</p>
                            <button onClick={() => { setSearchQuery(''); setStatusFilter('all') }} className="mt-2 text-primary hover:text-primary/80 text-xs font-medium">Clear Filters</button>
                        </div>
                    )}
                </motion.div>
            )}

            <AddCandidateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleCreate}
            />
        </div>
    );
}
