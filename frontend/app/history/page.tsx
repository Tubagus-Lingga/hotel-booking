'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/api';

interface Booking {
    bookingID: string;
    namaPemesan: string;
    tanggalCheckIn: string;
    tanggalCheckOut: string;
    statusPembayaran: string;
    metodePembayaran?: string;
    kamar: {
        id: number;
        nomorKamar: string;
        tipe: string;
        harga: number;
        gambar: string;
    };
    payment?: {
        totalPembayaran: number;
    }
}

export default function HistoryPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            router.push('/login');
            return;
        }

        api.get('/customer/history')
            .then(res => {
                setBookings(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.response?.data?.message || err.message || 'Failed to fetch history (Backend might need restart)');
                setLoading(false);
            });
    }, [router]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Paid': return <CheckCircle size={14} />;
            case 'Completed': return <CheckCircle size={14} />;
            case 'Cancelled': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark-900)]">
            <div className="text-[var(--color-gold-500)] font-serif animate-pulse">Loading History...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--color-cream-50)] text-[var(--color-dark-900)] font-sans">
            <nav className="bg-[var(--color-dark-900)] text-white px-8 py-6 flex justify-between items-center shadow-lg sticky top-0 z-40">
                <Link href="/" className="flex items-center gap-2 hover:text-[var(--color-gold-400)] transition">
                    <ArrowLeft size={20} /> Back to Home
                </Link>
                <h1 className="text-2xl font-serif tracking-widest text-[var(--color-gold-400)]">MY BOOKINGS</h1>
                <div style={{ width: 24 }}></div>
            </nav>

            <div className="max-w-5xl mx-auto px-6 py-12">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        <strong>Error:</strong> {error}
                        <p className="text-sm mt-1">Please ensure the Backend server is running and has been restarted to apply the latest updates.</p>
                    </div>
                )}

                {bookings.length === 0 && !error ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg border-t-4 border-[var(--color-gold-500)]">
                        <p className="text-xl text-gray-500 mb-6 font-serif">You haven't made any bookings yet.</p>
                        <Link href="/booking" className="px-8 py-3 bg-[var(--color-dark-900)] text-white rounded hover:bg-[var(--color-gold-600)] transition-colors uppercase tracking-widest text-sm font-bold">
                            Book a Room
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => {
                            const start = new Date(booking.tanggalCheckIn);
                            const end = new Date(booking.tanggalCheckOut);
                            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
                            const totalPrice = booking.payment?.totalPembayaran || (booking.kamar.harga * days);

                            return (
                                <div key={booking.bookingID} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="w-full md:w-48 h-48 md:h-auto bg-gray-200 relative">
                                            {booking.kamar.gambar ? (
                                                <img src={booking.kamar.gambar} alt="Room" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">No Image</div>
                                            )}
                                        </div>
                                        <div className="flex-1 p-6 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="text-xl font-serif text-[var(--color-dark-900)] font-bold">{booking.kamar.tipe} Room</h3>
                                                        <p className="text-sm text-gray-500">Booking ID: #{booking.bookingID}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 uppercase tracking-wider ${getStatusColor(booking.statusPembayaran)}`}>
                                                        {getStatusIcon(booking.statusPembayaran)}
                                                        {booking.statusPembayaran}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        <Calendar className="text-[var(--color-gold-600)]" size={18} />
                                                        <div>
                                                            <p className="text-xs text-gray-400 uppercase tracking-widest">Check-In</p>
                                                            <p className="font-semibold">{booking.tanggalCheckIn}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        <Clock className="text-[var(--color-gold-600)]" size={18} />
                                                        <div>
                                                            <p className="text-xs text-gray-400 uppercase tracking-widest">Check-Out</p>
                                                            <p className="font-semibold">{booking.tanggalCheckOut} ({days} Nights)</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-end">
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                                                    <p className="text-xl font-serif text-[var(--color-gold-600)] font-bold">
                                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPrice)}
                                                    </p>
                                                </div>
                                                {/* Optional: Add "Book Again" or details button */}
                                                <Link href="/booking" className="text-sm text-[var(--color-dark-900)] underline hover:text-[var(--color-gold-600)]">
                                                    Book Again
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
