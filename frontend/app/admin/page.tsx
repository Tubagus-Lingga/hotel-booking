'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { BedDouble, Users, CreditCard, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalKamar: 0,
        totalReservasi: 0,
        totalPelanggan: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        // Fetch stats from our new API
        axios.get('http://localhost:8081/api/admin/dashboard-stats')
            .then(res => setStats(res.data))
            .catch(err => console.error("Failed to fetch stats", err));
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif text-[var(--color-dark-900)]">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Here is what's happening with your hotel today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Rooms"
                    value={stats.totalKamar}
                    icon={<BedDouble className="text-[var(--color-gold-500)]" size={24} />}
                />
                <StatCard
                    title="Active Bookings"
                    value={stats.totalReservasi}
                    icon={<CreditCard className="text-blue-500" size={24} />}
                />
                <StatCard
                    title="Total Customers"
                    value={stats.totalPelanggan}
                    icon={<Users className="text-green-500" size={24} />}
                />
                <StatCard
                    title="Total Revenue"
                    value={`Rp ${stats.totalRevenue.toLocaleString()}`}
                    icon={<TrendingUp className="text-[var(--color-gold-600)]" size={24} />}
                />
            </div>

            {/* Placeholder for Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-medium mb-4 text-[var(--color-dark-800)]">Recent Bookings</h3>
                <div className="h-40 flex items-center justify-center text-gray-400 bg-gray-50 rounded border border-dashed">
                    Chart or Recent Table will go here in Reports Page
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[var(--color-cream-50)] rounded-lg">{icon}</div>
            </div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-2xl font-bold text-[var(--color-dark-900)] mt-1">{value}</p>
        </div>
    );
}
