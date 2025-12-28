'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, RefreshCcw } from 'lucide-react';
import api from '@/lib/api';

function QRISContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    const amountStr = searchParams.get('amount');
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (amountStr) setAmount(Number(amountStr));
        else if (bookingId) {
            // Fetch booking to get price if missing
            // Skip for now, assume passed correctly
        }
    }, [amountStr, bookingId]);

    const handleCheckPayment = async () => {
        setLoading(true);
        try {
            // Simulate payment verification call
            // In real world, this endpoint might check gateway status.
            // Here we just mark it as paid.
            console.log('Sending payment with amount:', amount);
            await api.put(`/customer/booking/${bookingId}/pay`, {
                amount: amount,
                method: 'QRIS'
            });

            router.push(`/payment/success?amount=${amount}`);
        } catch (error) {
            alert("Payment verification failed. Please try again or contact staff.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-dark-900)] flex items-center justify-center p-6 text-white font-sans">
            <div className="bg-white text-[var(--color-dark-900)] max-w-md w-full rounded-2xl shadow-2xl overflow-hidden text-center relative">
                <div className="bg-[var(--color-gold-500)] h-2"></div>
                <div className="p-8">
                    <h2 className="text-2xl font-serif mb-2">Scan to Pay</h2>
                    <p className="text-gray-500 text-sm mb-6">Use your mobile banking app</p>

                    <div className="bg-gray-100 p-6 rounded-xl mb-6 inline-block">
                        {/* Dummy QR Code */}
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ExamplePaymentQR"
                            alt="QRIS Code"
                            className="w-48 h-48 mix-blend-multiply opacity-90"
                        />
                    </div>

                    <div className="mb-8">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="text-3xl font-bold font-serif text-[var(--color-gold-600)]">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)}
                        </p>
                    </div>

                    <button
                        onClick={handleCheckPayment}
                        disabled={loading}
                        className="w-full bg-[var(--color-dark-900)] text-white py-4 rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-[var(--color-gold-600)] hover:text-black transition-all flex justify-center items-center gap-2"
                    >
                        {loading ? 'Verifying...' : 'Check Payment Status'}
                        {!loading && <CheckCircle size={18} />}
                    </button>

                    <button onClick={() => window.location.reload()} className="mt-4 text-xs text-gray-400 flex items-center justify-center gap-1 hover:text-[var(--color-gold-600)] mx-auto">
                        <RefreshCcw size={12} /> Refresh QR
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function QRISPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <QRISContent />
        </Suspense>
    );
}
