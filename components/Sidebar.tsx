'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UserPlus, LogOut } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
    role?: 'recruiter' | 'candidate';
}

export default function Sidebar({ role = 'recruiter' }: SidebarProps) {
    const pathname = usePathname();

    const links = role === 'recruiter' ? [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Candidates', href: '/candidates', icon: Users },
    ] : [
        { name: 'My Profile', href: '/my-profile', icon: UserPlus },
        { name: 'Companies', href: '/companies', icon: LayoutDashboard },
    ];

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
    };

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 glass-panel border-r border-glass-border flex flex-col p-6 z-50">
            <div className="mb-10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                    T
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">TALENTHUB</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group',
                                isActive
                                    ? 'bg-primary/20 text-white shadow-lg shadow-primary/10 border border-primary/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            )}
                        >
                            <Icon size={20} className={clsx(isActive ? 'text-primary' : 'group-hover:text-white')} />
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-6 border-t border-glass-border space-y-2">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
