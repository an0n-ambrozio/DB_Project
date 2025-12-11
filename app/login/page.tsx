'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (res.ok) {
            const data = await res.json();
            if (data.user.role === 'candidate') {
                router.push('/my-profile');
            } else {
                router.push('/dashboard');
            }
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen bg-main-gradient flex items-center justify-center p-4">
            <div className="glass-panel p-8 w-full max-w-md border-zinc-800 bg-[#0a0a0a]/50">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to TALENTHUB</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">{error}</div>}

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full glass-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@talenthub.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full glass-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button className="w-full glass-btn glass-btn-primary py-3 font-bold mt-4">
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Don&apos;t have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
                </div>
            </div>
        </div>
    );
}
