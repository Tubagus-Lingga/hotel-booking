'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import api from '@/lib/api';

export default function CartPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            const res = await api.get('/customer/cart');
            if (Array.isArray(res.data)) {
                setBookings(res.data);
            }
        } catch (err: any) {
            console.error('Fetch cart error:', err);
            // Silent error or retry login
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            router.push('/login');
            return;
        }
        fetchCart();
    }, [router]);

    const handleDelete = async (bookingId: string) => {
        if (!confirm('Are you sure you want to remove this item?')) return;
        try {
            await api.delete(`/customer/booking/${bookingId}`);
            fetchCart(); // Refresh
        } catch (error) {
            alert('Failed to remove item');
        }
    };

    const handleBookNow = () => {
        if (bookings.length === 0) return;
        router.push('/checkout');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark-900)] fixed inset-0 z-50">
            <div className="text-[var(--color-gold-500)] font-serif animate-pulse">Loading Cart...</div>
        </div>
    );

    // Calculate totals
    const calculateItemTotal = (booking: any) => {
        const start = new Date(booking.tanggalCheckIn);
        const end = new Date(booking.tanggalCheckOut);
        const days = Math.max(1, (end.getTime() - start.getTime()) / (1000 * 3600 * 24));
        return booking.kamar.harga * days;
    };

    const grandTotal = bookings.reduce((sum, b) => sum + calculateItemTotal(b), 0);

    return (
        <div className="min-h-screen bg-[var(--color-cream-50)] text-[var(--color-dark-900)] font-sans">
            {/* Navigation */}
            <nav className="bg-[var(--color-dark-900)] text-white px-8 py-6 flex justify-between items-center shadow-lg sticky top-0 z-40">
                <Link href="/booking" className="flex items-center gap-2 hover:text-[var(--color-gold-400)] transition">
                    <ArrowLeft size={20} /> Continue Shopping
                </Link>
                <h1 className="text-2xl font-serif tracking-widest text-[var(--color-gold-400)]">YOUR CART</h1>
                <div style={{ width: 24 }}></div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-[var(--color-gold-500)]">

                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h2 className="text-xl font-serif text-[var(--color-dark-900)] flex items-center gap-3">
                            <ShoppingBag className="text-[var(--color-gold-600)]" />
                            Reservation Summary
                        </h2>
                    </div>

                    {/* Body */}
                    <div className="p-8">
                        {bookings.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="mb-6 text-gray-500">Your cart is currently empty.</p>
                                <Link href="/booking" className="inline-block px-8 py-3 bg-[var(--color-dark-900)] text-white hover:bg-[var(--color-gold-600)] transition-all uppercase tracking-widest text-sm font-bold">
                                    Browse Rooms
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {bookings.map((booking) => {
                                    const start = new Date(booking.tanggalCheckIn);
                                    const end = new Date(booking.tanggalCheckOut);
                                    const days = Math.max(1, (end.getTime() - start.getTime()) / (1000 * 3600 * 24));
                                    const itemTotal = booking.kamar.harga * days;

                                    return (
                                        <div key={booking.bookingID} className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50 rounded-lg border border-gray-100 hover:border-[var(--color-gold-200)] transition duration-300">

                                            {/* Info */}
                                            <div className="flex-1 min-w-0 md:mr-8 mb-4 md:mb-0 w-full md:w-auto">
                                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                                    <span>{booking.tanggalCheckIn} — {booking.tanggalCheckOut}</span>
                                                    <span>•</span>
                                                    <span>{days} Night(s)</span>
                                                </div>
                                                <h4 className="font-serif text-[var(--color-dark-900)] text-xl mb-1">
                                                    {booking.kamar.tipe} Room
                                                </h4>

                                            </div>

                                            {/* Actions & Price */}
                                            <div className="flex items-center justify-between w-full md:w-auto gap-8">
                                                <div className="text-right">
                                                    <span className="block text-xs text-gray-400 uppercase tracking-wider">Total</span>
                                                    <span className="font-serif text-xl text-[var(--color-dark-900)]">
                                                        Rp {itemTotal.toLocaleString()}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => handleDelete(booking.bookingID)}
                                                    className="w-10 h-10 rounded-full border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-all"
                                                    title="Remove item"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {bookings.length > 0 && (
                        <div className="p-8 bg-gray-50 border-t border-gray-100">
                            <div className="flex justify-between items-end mb-8">
                                <span className="text-sm uppercase tracking-widest font-bold text-gray-500">Grand Total</span>
                                <span className="text-3xl font-serif text-[var(--color-dark-900)]">Rp {grandTotal.toLocaleString()}</span>
                            </div>

                            <div className="flex flex-col md:flex-row justify-end gap-4">
                                <Link href="/booking" className="px-8 py-4 border border-[var(--color-dark-900)] text-[var(--color-dark-900)] hover:bg-[var(--color-dark-900)] hover:text-white transition-all uppercase tracking-widest text-xs font-bold text-center">
                                    Add More Rooms
                                </Link>
                                <button
                                    onClick={handleBookNow}
                                    className="px-8 py-4 bg-[var(--color-gold-500)] text-black hover:bg-black hover:text-white hover:shadow-xl transition-all uppercase tracking-widest text-xs font-bold shadow-lg"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
