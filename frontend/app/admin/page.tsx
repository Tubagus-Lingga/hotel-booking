'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { BedDouble, Users, CreditCard, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalKamar: 0,
        totalReservasi: 0,
        totalPelanggan: 0,
        totalRevenue: 0
    });

    const [recentBookings, setRecentBookings] = useState<any[]>([]);

    useEffect(() => {
        // Fetch stats from our new API
        // Fetch stats from our new API
        api.get('/admin/dashboard-stats')
            .then(res => setStats(res.data))
            .catch(err => console.error("Failed to fetch stats", err));

        // Fetch recent bookings
        api.get('/admin/bookings')
            .then(res => {
                // Get 5 most recent bookings
                const sorted = res.data.sort((a: any, b: any) => {
                    return new Date(b.tanggalCheckIn).getTime() - new Date(a.tanggalCheckIn).getTime();
                });
                setRecentBookings(sorted.slice(0, 5));
            })
            .catch(err => console.error("Failed to fetch bookings", err));
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif text-[var(--color-dark-900)]">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Here is what's happening with your hotel today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    title="Total Revenue"
                    value={`Rp ${stats.totalRevenue.toLocaleString()}`}
                    icon={<TrendingUp className="text-[var(--color-gold-600)]" size={24} />}
                />
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-medium mb-4 text-[var(--color-dark-800)]">Recent Bookings</h3>
                {recentBookings.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-gray-400 bg-gray-50 rounded border border-dashed">
                        No recent bookings
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b">
                                <tr className="text-left text-gray-500">
                                    <th className="pb-3 font-medium">Booking ID</th>
                                    <th className="pb-3 font-medium">Customer</th>
                                    <th className="pb-3 font-medium">Check-In</th>
                                    <th className="pb-3 font-medium">Room</th>
                                    <th className="pb-3 font-medium">Total</th>
                                    <th className="pb-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {recentBookings.map((booking) => (
                                    <tr key={booking.bookingID} className="hover:bg-gray-50">
                                        <td className="py-3 font-medium text-gray-900">#{booking.bookingID.substring(0, 12)}</td>
                                        <td className="py-3 text-gray-700">{booking.namaPemesan || booking.customer?.nama || 'Guest'}</td>
                                        <td className="py-3 text-gray-600">{new Date(booking.tanggalCheckIn).toLocaleDateString()}</td>
                                        <td className="py-3 text-gray-700">
                                            {booking.kamar ? `Room ${booking.kamar.nomorKamar}` : '-'}
                                        </td>
                                        <td className="py-3 font-semibold text-[var(--color-gold-600)]">
                                            {booking.payment ? `Rp ${booking.payment.totalPembayaran.toLocaleString()}` : '-'}
                                        </td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.statusPembayaran === 'Paid'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {booking.statusPembayaran}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
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
