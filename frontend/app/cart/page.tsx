'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Calendar, CreditCard } from 'lucide-react';
import api from '@/lib/api';

export default function CartPage() {
    const router = useRouter();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            router.push('/login');
            return;
        }

        api.get('/customer/cart')
            .then(res => {
                if (res.data) {
                    setBooking(res.data);
                    // Pre-fill if exists
                    if (res.data.namaPemesan) setName(res.data.namaPemesan);
                    if (res.data.catatan) setNote(res.data.catatan);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [router]);

    const handlePayment = async () => {
        if (!name) {
            alert('Please fill in your name.');
            return;
        }

        if (!booking) return;

        try {
            // Update details first
            await api.put(`/customer/booking/${booking.bookingID}/details`, {
                nama: name,
                note: note // Send note instead of dob/gender
            });

            // Redirect to QRIS
            router.push(`/payment/qris?bookingId=${booking.bookingID}&amount=${total}`); // Pass verified total
        } catch (error: any) {
            alert('Error proceeding to payment.');
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading cart...</div>;

    if (!booking) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-cream-50)]">
            <h2 className="text-2xl font-serif text-[var(--color-dark-800)] mb-4">Your Cart is Empty</h2>
            <Link href="/booking" className="bg-[var(--color-gold-500)] text-black px-6 py-2 uppercase text-xs font-bold tracking-widest hover:bg-white transition-colors">
                Book a Room
            </Link>
        </div>
    );

    // Calculate total days
    const start = new Date(booking.tanggalCheckIn);
    const end = new Date(booking.tanggalCheckOut);
    const days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);

    // Simplified total calculation (flat rate)
    const total = booking.kamar.harga * days;

    return (
        <div className="min-h-screen bg-[var(--color-cream-50)] text-[var(--color-dark-900)] font-sans">
            {/* Nav */}
            <nav className="bg-[var(--color-dark-900)] text-white px-8 py-6 flex items-center shadow-lg">
                <Link href="/booking" className="flex items-center gap-2 hover:text-[var(--color-gold-400)] transition">
                    <ArrowLeft size={20} /> Back to Booking
                </Link>
                <div className="flex-1 text-center">
                    <h1 className="text-2xl font-serif tracking-widest text-[var(--color-gold-400)]">YOUR CART</h1>
                </div>
                <div className="w-24"></div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Booking Summary */}
                <div className="bg-white p-8 rounded-xl shadow-lg h-fit">
                    <h3 className="text-xl font-serif mb-6 border-b pb-4">Booking Summary</h3>

                    <div className="mb-6">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Room</span>
                        <p className="text-lg font-bold text-[var(--color-dark-800)] flex justify-between">
                            {booking.kamar.tipe} Room
                        </p>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Check In</span>
                            <p className="font-semibold">{booking.tanggalCheckIn}</p>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Check Out</span>
                            <p className="font-semibold">{booking.tanggalCheckOut}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between mb-2 text-sm text-gray-600">
                            <span>Price per night</span>
                            <span>Rp {booking.kamar.harga.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mb-4 text-sm text-gray-600">
                            <span>Nights</span>
                            <span>{days}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-[var(--color-gold-600)] border-t pt-4">
                            <span>Total</span>
                            <span>Rp {total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Guest Form */}
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h3 className="text-xl font-serif mb-6 border-b pb-4">Guest Details</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded focus:border-[var(--color-gold-500)] focus:outline-none"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Note (Optional)</label>
                            <textarea
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded focus:border-[var(--color-gold-500)] focus:outline-none min-h-[120px]"
                                placeholder="Special requests, estimated arrival time, etc."
                                value={note}
                                onChange={e => setNote(e.target.value)}
                            />
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={handlePayment}
                                className="w-full bg-[var(--color-gold-500)] text-black py-4 uppercase text-sm font-bold tracking-[0.2em] hover:bg-black hover:text-white transition-all flex justify-center gap-2 items-center"
                            >
                                <CreditCard size={18} />
                                Pay with QRIS
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
