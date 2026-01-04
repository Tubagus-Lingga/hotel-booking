'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, CreditCard, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function CheckoutPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            router.push('/login');
            return;
        }

        api.get('/customer/cart')
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                setBookings(data);
                if (data.length > 0) {
                    // Check if any has details already
                    const first = data[0];
                    if (first.namaPemesan) setName(first.namaPemesan);
                    if (first.catatan) setNote(first.catatan);
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

        setProcessing(true);
        try {
            // Update details for all bookings
            // We use the first booking ID to update details? actually we should update all or at least the 'main' one.
            // But since we want to apply Name to all rooms in this group checkout:
            const bookingIds = bookings.map(b => b.bookingID);

            // Parallel update is fine
            await Promise.all(bookings.map(b =>
                api.put(`/customer/booking/${b.bookingID}/details`, {
                    nama: name,
                    note: note
                })
            ));

            const total = bookings.reduce((sum, b) => {
                const days = Math.max(1, (new Date(b.tanggalCheckOut).getTime() - new Date(b.tanggalCheckIn).getTime()) / (1000 * 3600 * 24));
                return sum + (b.kamar.harga * days);
            }, 0);

            // Redirect to QRIS
            const idsParam = bookingIds.join(',');
            router.push(`/payment/qris?bookingIds=${idsParam}&amount=${total}`);
        } catch (error: any) {
            console.error(error);
            alert('Error proceeding to payment.');
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream-50)]">
            <Loader2 className="animate-spin text-gray-500" />
        </div>
    );

    if (bookings.length === 0) {
        router.push('/cart'); // Redirect back if empty
        return null;
    }

    const total = bookings.reduce((sum, b) => {
        const days = Math.max(1, (new Date(b.tanggalCheckOut).getTime() - new Date(b.tanggalCheckIn).getTime()) / (1000 * 3600 * 24));
        return sum + (b.kamar.harga * days);
    }, 0);

    return (
        <div className="min-h-screen bg-[var(--color-cream-50)] text-[var(--color-dark-900)] font-sans">
            <nav className="bg-[var(--color-dark-900)] text-white px-8 py-6 flex items-center shadow-lg sticky top-0 z-50">
                <Link href="/cart" className="flex items-center gap-2 hover:text-[var(--color-gold-400)] transition">
                    <ArrowLeft size={20} /> Back to Cart
                </Link>
                <div className="flex-1 text-center">
                    <h1 className="text-2xl font-serif tracking-widest text-[var(--color-gold-400)]">CHECKOUT</h1>
                </div>
                <div className="w-24"></div>
            </nav>

            <div className="max-w-3xl mx-auto px-6 py-12">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h3 className="text-xl font-serif mb-6 border-b pb-4">Guest Information</h3>

                    <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h4 className="font-bold text-sm text-gray-600 uppercase mb-2">Order Summary</h4>
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>{bookings.length} Item{bookings.length > 1 ? 's' : ''}</span>
                            <span>Rp {total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Full Name <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded focus:border-[var(--color-gold-500)] focus:outline-none transition-colors"
                                    placeholder="Who is checking in?"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Special Requests (Optional)</label>
                            <textarea
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded focus:border-[var(--color-gold-500)] focus:outline-none min-h-[120px] transition-colors"
                                placeholder="Arrival time estimate, connectivity needs, etc."
                                value={note}
                                onChange={e => setNote(e.target.value)}
                            />
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="w-full bg-[var(--color-gold-500)] text-black py-4 uppercase text-sm font-bold tracking-[0.2em] hover:bg-black hover:text-white transition-all flex justify-center gap-2 items-center disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <CreditCard size={18} /> Proceed to Payment
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
