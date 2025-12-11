'use client';

import Image from 'next/image';

import { motion } from 'framer-motion';
import { Eye, Check, Trash2, X } from 'lucide-react';
import clsx from 'clsx';

interface CandidateProps {
    id: number;
    name: string;
    role: string;
    status: string;
    score: number;
    photoUrl?: string;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onReject: (id: number) => void;
    onConnect: (id: number) => void;
    onRestore?: (id: number) => void;
}

export default function CandidateCard({ id, name, role, status, score, photoUrl, onEdit, onDelete, onReject, onConnect, onRestore }: CandidateProps) {
    // ... (keep existing render logic)


    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative h-[400px] w-full rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-2xl"
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={photoUrl || `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=512`}
                    alt={name}
                    fill
                    unoptimized
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
            </div>

            {/* Score Badge (Top Right) */}
            <div className="absolute top-4 right-4 z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{score}</span>
                </div>
            </div>

            {/* Status Indicator (Top Left) */}
            <div className="absolute top-4 left-4 z-10">
                <div className={clsx(
                    "w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                    status === 'qualified' ? "bg-emerald-500 shadow-emerald-500/50" :
                        status === 'scheduled' ? "bg-blue-500 shadow-blue-500/50" :
                            status === 'rejected' ? "bg-red-500 shadow-red-500/50" : "bg-amber-500 shadow-amber-500/50"
                )} title={status} />
            </div>

            {/* Content (Bottom) */}
            <div className="absolute bottom-0 inset-x-0 p-5 z-10 flex flex-col gap-4">
                {/* Text Info */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-1 leading-tight">{name}</h3>
                    <p className="text-gray-400 font-medium text-sm">{role}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(id); }}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors border border-white/5 shrink-0"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </button>

                    {status !== 'scheduled' && status !== 'rejected' && (
                        <div className="flex-1 flex gap-2 h-10">
                            <button
                                onClick={(e) => { e.stopPropagation(); onConnect(id); }}
                                className="flex-1 h-full rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center gap-2 text-emerald-400 font-medium text-sm transition-colors backdrop-blur-md group/btn"
                            >
                                <Check size={16} className="group-hover/btn:scale-110 transition-transform" />
                                Connect
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onReject(id); }}
                                className="w-10 h-full rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 flex items-center justify-center text-red-400 transition-colors backdrop-blur-md shrink-0"
                                title="Reject Candidate"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    {(status === 'scheduled') && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onRestore?.(id); }}
                            className="flex-1 h-10 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-xs font-medium backdrop-blur-md uppercase tracking-wider flex items-center justify-center transition-colors"
                        >
                            Unschedule
                        </button>
                    )}

                    {(status === 'rejected') && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onRestore?.(id); }}
                            className="flex-1 h-10 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium backdrop-blur-md uppercase tracking-wider flex items-center justify-center transition-colors"
                        >
                            Reconsider
                        </button>
                    )}



                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 backdrop-blur-md flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors border border-white/5 shrink-0"
                        title="Delete Permanently"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
