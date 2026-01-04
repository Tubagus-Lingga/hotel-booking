'use client';

import Link from 'next/link';
import { LayoutDashboard, BedDouble, Users, FileBarChart, LogOut, Home } from 'lucide-react';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Safe check for localStorage
        const role = localStorage.getItem('role');
        if (role !== 'ADMIN') {
            router.push('/login'); // Redirect unauthorized users
        } else {
            setAuthorized(true);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        router.push('/login');
    };

    if (!authorized) {
        return null; // Don't show anything while checking
    }

    return (
        <div className="flex h-screen bg-[var(--color-cream-50)]">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--color-dark-900)] text-white flex flex-col shadow-2xl">
                <div className="p-6 border-b border-[var(--color-gold-600)]">
                    <h1 className="text-2xl font-serif text-[var(--color-gold-400)] tracking-wider">
                        KANZLER<br />
                        <span className="text-sm text-gray-400 font-sans tracking-widest">ADMIN PANEL</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem href="/admin/rooms" icon={<BedDouble size={20} />} label="Room Management" />
                    <NavItem href="/admin/bookings" icon={<FileBarChart size={20} />} label="Bookings" />
                </nav>

                <div className="p-4 border-t border-gray-800 space-y-2">
                    <Link href="/" className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-[var(--color-dark-800)] rounded-lg transition-all duration-300">
                        <Home size={20} />
                        <span className="font-medium">Back to Website</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-red-900/20 rounded-lg transition-all duration-300"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 bg-white shadow-sm border-b flex items-center px-8 justify-between">
                    <h2 className="text-xl font-medium text-gray-800">Welcome Back, Admin</h2>
                    <div className="h-8 w-8 rounded-full bg-[var(--color-gold-500)]"></div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-[var(--color-gold-400)] hover:bg-[var(--color-dark-800)] rounded-lg transition-all duration-300 group"
        >
            <span className="group-hover:text-[var(--color-gold-400)] transition-colors">{icon}</span>
            <span className="font-medium tracking-wide">{label}</span>
        </Link>
    );
}
