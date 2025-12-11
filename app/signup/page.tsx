'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('recruiter');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });

        if (res.ok) {
            router.push('/login');
        } else {
            const data = await res.json();
            setError(data.error || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen bg-main-gradient flex items-center justify-center p-4">
            <div className="glass-panel p-8 w-full max-w-md border-zinc-800 bg-[#0a0a0a]/50">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400">Join TALENTHUB</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    {error && <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">{error}</div>}

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
                        <input
                            className="w-full glass-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full glass-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
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

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">I am a...</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setRole('recruiter')}
                                className={`py-2 text-sm rounded-lg border transition-colors ${role === 'recruiter' ? 'bg-primary border-primary text-white' : 'bg-transparent border-glass-border text-gray-400 hover:text-white'}`}
                            >
                                Recruiter
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('candidate')}
                                className={`py-2 text-sm rounded-lg border transition-colors ${role === 'candidate' ? 'bg-primary border-primary text-white' : 'bg-transparent border-glass-border text-gray-400 hover:text-white'}`}
                            >
                                Candidate
                            </button>
                        </div>
                    </div>

                    <button className="w-full glass-btn glass-btn-primary py-3 font-bold mt-4">
                        Create Account
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
}
