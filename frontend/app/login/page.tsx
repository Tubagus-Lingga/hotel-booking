'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/login', formData);

            const { user, role } = res.data;

            // Store user info and role
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', role);

            // RBAC Redirect Logic
            if (role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/'); // Redirect customers to Home
                // Optionally show a "Logged in" toast here
            }

        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Invalid credentials');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark-900)] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-none shadow-2xl border-t-4 border-[var(--color-gold-500)]">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-serif text-[var(--color-dark-900)] tracking-widest">KANZLER</h1>
                        <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-600)]">Hotel & Resorts</span>
                    </Link>
                    <h2 className="mt-6 text-xl text-gray-600 font-light">Welcome Back</h2>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 border border-red-200">{error}</div>}

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Email</label>
                        <input
                            type="text"
                            required
                            className="w-full border-b border-gray-300 py-2 focus:border-[var(--color-gold-500)] outline-none transition-colors bg-transparent placeholder-gray-400"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full border-b border-gray-300 py-2 focus:border-[var(--color-gold-500)] outline-none transition-colors bg-transparent placeholder-gray-400"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--color-dark-900)] text-white py-3 uppercase tracking-widest text-sm hover:bg-[var(--color-gold-600)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Don't have an account? <Link href="/register" className="text-[var(--color-gold-600)] hover:underline">Register</Link></p>
                </div>
            </div>
        </div>
    );
}
