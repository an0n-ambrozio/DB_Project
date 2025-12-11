'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check, User, Mail, Briefcase, Star, Sparkles } from 'lucide-react';
import clsx from 'clsx';

interface CandidateData {
    name: string;
    email: string;
    role: string;
    score: number;
    status: string;
    photoUrl?: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CandidateData) => Promise<void>;
}

export default function AddCandidateModal({ isOpen, onClose, onSave }: Props) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<CandidateData>({
        name: '', email: '', role: '', score: 85, status: 'pending', photoUrl: ''
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setLoading(true);
        await onSave(formData);
        setLoading(false);
        onClose();
        // Reset form after short delay
        setTimeout(() => {
            setFormData({ name: '', email: '', role: '', score: 85, status: 'pending' });
            setStep(1);
        }, 300);
    };

    const steps = [
        { id: 1, title: 'Basic Info', icon: User },
        { id: 2, title: 'Role & Score', icon: Briefcase },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg glass-panel overflow-hidden border-zinc-800 bg-[#0a0a0a] shadow-2xl shadow-black/50"
            >
                {/* Progress Header */}
                <div className="bg-white/5 p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {steps.map((s, i) => {
                            const isActive = step >= s.id;
                            const Icon = s.icon;
                            return (
                                <div key={s.id} className="flex items-center gap-2">
                                    <div className={clsx(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                                        isActive ? "bg-primary text-white" : "bg-white/10 text-gray-500"
                                    )}>
                                        {step > s.id ? <Check size={14} /> : s.id}
                                    </div>
                                    <span className={clsx("text-sm font-medium", isActive ? "text-white" : "text-gray-600 hidden sm:block")}>
                                        {s.title}
                                    </span>
                                    {i < steps.length - 1 && <div className="w-8 h-[1px] bg-white/10 mx-2 hidden sm:block" />}
                                </div>
                            )
                        })}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <User size={14} /> Full Name
                                    </label>
                                    <input
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Alex Morgan"
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Mail size={14} /> Email Address
                                    </label>
                                    <input
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="alex@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Sparkles size={14} /> Photo URL (Optional)
                                    </label>
                                    <input
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
                                        value={formData.photoUrl || ''}
                                        onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Briefcase size={14} /> Target Role
                                    </label>
                                    <input
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        placeholder="e.g. Senior Product Designer"
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Star size={14} /> Initial Fit Score
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="0" max="100"
                                            className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                            value={formData.score}
                                            onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
                                        />
                                        <div className="w-16 py-2 rounded-lg bg-white/10 text-center font-bold text-primary">
                                            {formData.score}%
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer Actions */}
                    <div className="flex justify-between pt-8 mt-4">
                        {step > 1 ? (
                            <button onClick={() => setStep(s => s - 1)} className="text-sm font-medium text-gray-400 hover:text-white px-4 transition-colors">
                                Back
                            </button>
                        ) : <div />}

                        {step < 2 ? (
                            <button onClick={() => setStep(s => s + 1)} className="glass-btn glass-btn-primary px-8 py-3 flex items-center gap-2 shadow-lg hover:shadow-primary/40 rounded-full">
                                Continue <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={loading} className="glass-btn glass-btn-primary px-8 py-3 flex items-center gap-2 shadow-lg hover:shadow-primary/40 rounded-full">
                                {loading ? 'Adding...' : 'Add Candidate'} <Sparkles size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
