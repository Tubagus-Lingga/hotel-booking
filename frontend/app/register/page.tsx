'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            // If successful, redirect to login
            router.push('/login');
        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark-900)] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-none shadow-2xl border-t-4 border-[var(--color-gold-500)]">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block cursor-pointer relative z-20">
                        <h1 className="text-3xl font-serif text-[var(--color-dark-900)] tracking-widest">KANZLER</h1>
                        <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-600)]">Hotel & Resorts</span>
                    </Link>
                    <h2 className="mt-6 text-xl text-gray-600 font-light">Join the Elite</h2>
                </div>

                <form onSubmit={handleRegister} className="space-y-6 relative z-20">
                    {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 border border-red-200 animate-pulse">{error}</div>}

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full border-b border-gray-300 py-2 focus:border-[var(--color-gold-500)] outline-none transition-colors bg-transparent placeholder-gray-400 text-black"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full border-b border-gray-300 py-2 focus:border-[var(--color-gold-500)] outline-none transition-colors bg-transparent placeholder-gray-400 text-black"
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
                            minLength={8}
                            className="w-full border-b border-gray-300 py-2 focus:border-[var(--color-gold-500)] outline-none transition-colors bg-transparent placeholder-gray-400 text-black"
                            placeholder="Min. 8 characters"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            className="w-full border-b border-gray-300 py-2 focus:border-[var(--color-gold-500)] outline-none transition-colors bg-transparent placeholder-gray-400 text-black"
                            placeholder="Retype password"
                            value={formData.confirmPassword}
                            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--color-dark-900)] text-white py-3 uppercase tracking-widest text-sm hover:bg-[var(--color-gold-600)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500 relative z-20">
                    <p>Already a member? <Link href="/login" className="text-[var(--color-gold-600)] hover:underline">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
}
