'use client';

import { motion } from 'framer-motion';
import { MapPin, DollarSign, Building2, ArrowRight } from 'lucide-react';

export default function CompaniesPage() {
    const companies = [
        { id: 1, name: 'Google', role: 'Frontend Engineer', location: 'Remote', salary: '$120k - $160k', color: 'from-blue-500 to-cyan-500', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
        { id: 2, name: 'Netflix', role: 'Senior Backend Developer', location: 'Los Gatos, CA', salary: '$180k - $240k', color: 'from-red-500 to-orange-500', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
        { id: 3, name: 'Spotify', role: 'Mobile Engineer (iOS)', location: 'New York, NY', salary: '$140k - $190k', color: 'from-green-500 to-emerald-500', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1024px-Spotify_logo_without_text.svg.png' },
        { id: 4, name: 'Meta', role: 'Full Stack Engineer', location: 'Menlo Park, CA', salary: '$160k - $220k', color: 'from-blue-600 to-indigo-600', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
        { id: 5, name: 'Amazon', role: 'DevOps Engineer', location: 'Seattle, WA', salary: '$130k - $170k', color: 'from-yellow-500 to-orange-500', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
        { id: 6, name: 'Apple', role: 'UI/UX Designer', location: 'Cupertino, CA', salary: '$150k - $200k', color: 'from-gray-500 to-slate-500', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    ];

    return (
        <div className="space-y-8">
            <header className="mb-10">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-white mb-3"
                >
                    Hiring Companies
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-400 text-lg"
                >
                    Explore premium opportunities tailored to your expertise
                </motion.p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company, index) => (
                    <motion.div
                        key={company.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="glass-panel p-6 border-zinc-800 bg-[#0a0a0a]/50 group cursor-pointer relative overflow-hidden flex flex-col"
                    >
                        {/* Gradient Flash on Hover */}
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${company.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                        {/* Large Logo Header */}
                        <div className="flex flex-col items-center justify-center mb-6 pt-4 pb-2">
                            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md p-4 flex items-center justify-center shadow-xl shadow-black/20 mb-4 transition-transform duration-300 group-hover:scale-110 border border-white/10">
                                <img
                                    src={company.logo}
                                    alt={`${company.name} Logo`}
                                    className="w-full h-full object-contain filter drop-shadow-lg"
                                />
                            </div>
                        </div>

                        <div className="flex-1 text-center">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{company.role}</h3>
                            <div className="flex items-center justify-center gap-2 text-gray-400 mb-6 font-medium">
                                <Building2 size={16} />
                                {company.name}
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/5 bg-white/5 rounded-xl p-4 mt-auto">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <MapPin size={14} />
                                    <span>Location</span>
                                </div>
                                <span className="text-white font-medium">{company.location}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <DollarSign size={14} />
                                    <span>Salary</span>
                                </div>
                                <span className="text-green-400 font-bold">{company.salary}</span>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-center text-sm text-primary font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            Apply Now
                            <ArrowRight size={16} className="ml-2" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
