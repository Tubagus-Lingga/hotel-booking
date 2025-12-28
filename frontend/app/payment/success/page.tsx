'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Home } from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const amountStr = searchParams.get('amount') || '0';
    const amount = Number(amountStr);

    return (
        <div className="min-h-screen bg-[var(--color-cream-50)] flex items-center justify-center p-6 text-[var(--color-dark-900)] font-sans">
            <div className="text-center max-w-lg w-full">
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                </div>

                <h1 className="text-4xl font-serif mb-4 text-[var(--color-dark-900)]">Payment Successful!</h1>
                <p className="text-gray-500 mb-8">Thank you for your booking. We look forward to hosting you.</p>

                <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
                    <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                    <p className="text-3xl font-bold text-[var(--color-gold-600)]">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)}
                    </p>
                </div>

                <Link href="/" className="inline-flex items-center gap-2 border-b-2 border-black pb-1 hover:text-[var(--color-gold-600)] hover:border-[var(--color-gold-600)] transition-all font-bold tracking-widest uppercase text-sm">
                    <Home size={16} /> Return Home
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
