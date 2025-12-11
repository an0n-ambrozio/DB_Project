'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Code, Briefcase, Calendar } from 'lucide-react';

interface Skill {
    id: number;
    skillName: string;
}

interface CandidateData {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    status: string;
    role: string;
    updatedAt: string | Date;
    skills: Skill[];
}

export default function MyProfilePage() {
    const [profile, setProfile] = useState<CandidateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        skills: ''
    });

    useEffect(() => {
        fetch('/api/candidate-profile')
            .then(res => {
                if (!res.ok) throw new Error('Failed to load');
                return res.json();
            })
            .then(data => {
                setProfile(data);
                setFormData({
                    name: data.name,
                    phone: data.phone || '',
                    skills: data.skills.map((s: Skill) => s.skillName).join(', ')
                });
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);

        const res = await fetch('/api/candidate-profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: formData.name,
                phone: formData.phone,
                skills: skillsArray
            })
        });

        if (res.ok) {
            const updated = await res.json();
            setProfile(updated);
            setIsEditing(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[50vh]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!profile) return <div className="text-white p-8">Error loading profile.</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            {/* Header Section */}
            <header className="relative overflow-hidden rounded-2xl glass-panel p-8 border border-white/10">
                <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                    <div className="w-64 h-64 bg-primary/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-primary/20">
                            {profile.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                            <div className="flex items-center gap-3 text-gray-400">
                                <span className="flex items-center gap-1.5 text-sm">
                                    <Briefcase size={14} />
                                    {profile.role || 'Candidate'}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                <span className="flex items-center gap-1.5 text-sm">
                                    <Mail size={14} />
                                    {profile.email}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="glass-btn glass-btn-primary px-8 py-3 rounded-xl font-semibold flex items-center gap-2"
                    >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Personal Info & Status */}
                <div className="space-y-8 lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel p-8 border-zinc-800 bg-[#0a0a0a]/50"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <User size={20} className="text-primary" />
                            Personal Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</label>
                                {isEditing ? (
                                    <input
                                        className="glass-input w-full"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                ) : (
                                    <div className="text-white text-lg font-medium">{profile.name}</div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</label>
                                {isEditing ? (
                                    <input
                                        className="glass-input w-full"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-white text-lg font-medium">
                                        <Phone size={16} className="text-gray-500" />
                                        {profile.phone || <span className="text-gray-600 italic">Not provided</span>}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</label>
                                <div className="text-white text-lg font-medium opacity-75">{profile.email}</div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Member Since</label>
                                <div className="flex items-center gap-2 text-white text-lg font-medium">
                                    <Calendar size={16} className="text-gray-500" />
                                    {new Date().getFullYear()}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-8 border-zinc-800 bg-[#0a0a0a]/50"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Code size={20} className="text-accent" />
                            Professional Skills
                        </h2>

                        {isEditing ? (
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Add skills (comma separated)
                                </label>
                                <textarea
                                    className="glass-input w-full h-32 resize-none"
                                    value={formData.skills}
                                    onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                    placeholder="React, TypeScript, Node.js, UI/UX Design..."
                                />
                                <p className="text-xs text-gray-500">Separated by commas</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {profile.skills.length > 0 ? profile.skills.map((skill, i) => (
                                    <motion.span
                                        key={skill.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm border border-white/5 transition-colors cursor-default flex items-center gap-2"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                                        {skill.skillName}
                                    </motion.span>
                                )) : (
                                    <div className="text-gray-500 italic p-4 text-center w-full border border-dashed border-white/10 rounded-lg">
                                        No skills added yet. Click &quot;Edit Profile&quot; to highlight your expertise.
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Right Column: Status Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel p-8 border-zinc-800 bg-gradient-to-b from-primary/5 to-transparent h-fit"
                >
                    <h2 className="text-xl font-bold text-white mb-6">Application Status</h2>

                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-500
                            ${profile.status === 'qualified' ? 'bg-green-500/20 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.2)]' :
                                profile.status === 'rejected' ? 'bg-red-500/20 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.2)]' :
                                    'bg-yellow-500/20 text-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.2)]'}`}>
                            <Briefcase size={32} />
                        </div>

                        <h3 className="text-2xl font-bold text-white capitalize mb-1">{profile.status}</h3>
                        <p className="text-sm text-gray-500">Current Application Stage</p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Last Activity:</span>
                            <span className="text-white font-medium">{new Date(profile.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Profile Strength:</span>
                            <span className="text-primary font-medium">85%</span>
                        </div>
                    </div>

                    <button className="w-full mt-8 glass-btn hover:bg-white/5 text-gray-400 hover:text-white">
                        View Application History
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
}
