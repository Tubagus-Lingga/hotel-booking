'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar } from 'lucide-react';

interface Booking {
    id: number;
    namaPemesan: string;
    checkIn: string;
    checkOut: string;
    tipeKasur: string;
    sarapan: boolean;
    kamar: {
        nomorKamar: string;
        harga: number;
    }
}

export default function ReportsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8081/api/admin/reservasi')
            .then(res => {
                setBookings(res.data);
                setIsLoading(false);
            })
            .catch(err => setIsLoading(false));
    }, []);

    return (
        <div>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-serif text-[var(--color-dark-900)]">Booking Reports</h1>
                    <p className="text-gray-500 text-sm">Detailed history of all reservations</p>
                </div>
                <button className="text-[var(--color-gold-600)] font-medium hover:text-[var(--color-gold-500)] border border-[var(--color-gold-600)] px-4 py-2 rounded-lg hover:bg-yellow-50 transition-colors">
                    Download PDF
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[var(--color-dark-900)] text-gray-300">
                        <tr>
                            <th className="px-6 py-4 font-normal">Booking ID</th>
                            <th className="px-6 py-4 font-normal">Guest Name</th>
                            <th className="px-6 py-4 font-normal">Room</th>
                            <th className="px-6 py-4 font-normal">Check-In / Out</th>
                            <th className="px-6 py-4 font-normal">Details</th>
                            <th className="px-6 py-4 font-normal text-right">Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center">Loading data...</td></tr>
                        ) : bookings.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No bookings yet.</td></tr>
                        ) : (
                            bookings.map((b) => (
                                <tr key={b.id} className="hover:bg-gray-50 group">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{b.id}</td>
                                    <td className="px-6 py-4 font-medium text-[var(--color-dark-900)]">{b.namaPemesan}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                                            Room {b.kamar.nomorKamar}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            {b.checkIn} <span className="text-gray-300">→</span> {b.checkOut}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {b.tipeKasur} {b.sarapan && <span className="text-green-600 ml-2">• Breakfast</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-[var(--color-gold-600)]">
                                        Rp {b.kamar.harga.toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
