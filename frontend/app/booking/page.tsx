'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Users, Check, User, ArrowLeft } from 'lucide-react';

export default function BookingPage() {
    const router = useRouter();
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [priceDetails, setPriceDetails] = useState({ standard: 0, deluxe: 0 });

    useEffect(() => {
        // Check if user is logged in
        const user = localStorage.getItem('user');
        if (!user) {
            router.push('/login');
        }
    }, [router]);

    useEffect(() => {
        if (checkIn && checkOut) {
            calculatePrices();
        }
    }, [checkIn, checkOut, guests]);

    const calculatePrices = () => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);

        if (start >= end) {
            setPriceDetails({ standard: 0, deluxe: 0 });
            return;
        }

        let standardTotal = 0;
        let deluxeTotal = 0;

        for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
            const day = d.getDay();
            // Weekend: Friday (5), Saturday (6), Sunday (0)
            const isWeekend = day === 5 || day === 6 || day === 0;

            if (isWeekend) {
                standardTotal += 550000;
                deluxeTotal += 1260000;
            } else {
                standardTotal += 459000;
                deluxeTotal += 830000;
            }
        }

        setPriceDetails({ standard: standardTotal, deluxe: deluxeTotal });
    };

    const formatIDR = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    const handleBookRoom = (roomType: string, price: number) => {
        if (!checkIn || !checkOut) {
            alert('Please select check-in and check-out dates.');
            return;
        }
        alert(`Booking initiated for ${roomType} Room\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${guests}\nTotal Price: ${formatIDR(price)}`);
    };

    return (
        <div className="min-h-screen bg-[var(--color-cream-50)] text-[var(--color-dark-900)] font-sans">
            {/* Navigation */}
            <nav className="bg-[var(--color-dark-900)] text-white px-8 py-6 flex justify-between items-center shadow-lg">
                <Link href="/" className="flex items-center gap-2 hover:text-[var(--color-gold-400)] transition">
                    <ArrowLeft size={20} /> Back to Home
                </Link>
                <h1 className="text-2xl font-serif tracking-widest text-[var(--color-gold-400)]">KANZLER</h1>
                <div className="w-24"></div> {/* Spacer for centering */}
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-12">
                <h2 className="text-4xl font-serif text-center mb-12">Select Your Stay</h2>

                {/* Search Bar */}
                <div className="bg-white p-8 rounded-xl shadow-xl mb-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-end">

                    {/* Dates */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                            <Calendar size={16} /> Check-in / Check-out
                        </label>
                        <div className="flex gap-4">
                            <input
                                type="date"
                                className="w-full border-b border-gray-300 py-2 focus:border-[var(--color-gold-500)] focus:outline-none bg-transparent"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                            />
                            <input
                                type="date"
                                className="w-full border-b border-gray-300 py-2 focus:border-[var(--color-gold-500)] focus:outline-none bg-transparent"
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Guests */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                            <Users size={16} /> Guests
                        </label>
                        <div className="relative">
                            <select
                                className="w-full border-b border-gray-300 py-2 focus:border-[var(--color-gold-500)] focus:outline-none bg-transparent appearance-none"
                                value={guests}
                                onChange={(e) => setGuests(Number(e.target.value))}
                            >
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="text-sm text-gray-500 pb-2 italic">
                        *Dynamic pricing applies. Weekend rates (Fri-Sun) may vary.
                    </div>
                </div>

                {/* Room Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Standard Room */}
                    <div className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${selectedRoom === 'Standard' ? 'border-[var(--color-gold-500)]' : 'border-transparent'}`}>
                        <div className="h-64 bg-gray-200 relative">
                            <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80" alt="Standard Room" className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                                Standard
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="mb-4">
                                <h3 className="text-2xl font-serif mb-1">Urban Comfort</h3>
                                {priceDetails.standard > 0 ? (
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-[var(--color-gold-600)]">{formatIDR(priceDetails.standard)}</span>
                                        <span className="text-xs text-gray-400">Total for selected nights</span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-400 italic">Select dates to see price</span>
                                )}
                            </div>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                A cozy retreat tailored for modern travelers. Features a plush queen bed, smart workspace, and rain shower.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-500 mb-8">
                                <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Queen Size Bed</li>
                                <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> City View</li>
                                <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Free Wi-Fi</li>
                            </ul>
                            <button
                                onClick={() => handleBookRoom('Standard', priceDetails.standard)}
                                disabled={priceDetails.standard === 0}
                                className={`w-full py-3 uppercase tracking-widest text-sm font-bold transition-all ${priceDetails.standard > 0 ? 'bg-black text-white hover:bg-[var(--color-gold-500)] hover:text-black cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            >
                                Select Room
                            </button>
                        </div>
                    </div>

                    {/* Deluxe Room */}
                    <div className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${selectedRoom === 'Deluxe' ? 'border-[var(--color-gold-500)]' : 'border-transparent'}`}>
                        <div className="h-64 bg-gray-200 relative">
                            <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80" alt="Deluxe Room" className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4 bg-[var(--color-gold-500)] text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                                Best Value
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="mb-4">
                                <h3 className="text-2xl font-serif mb-1">Executive Deluxe</h3>
                                {priceDetails.deluxe > 0 ? (
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-[var(--color-gold-600)]">{formatIDR(priceDetails.deluxe)}</span>
                                        <span className="text-xs text-gray-400">Total for selected nights</span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-400 italic">Select dates to see price</span>
                                )}
                            </div>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Elevate your stay with extra space and premium amenities. Includes a king bed, lounge area, and bathtub.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-500 mb-8">
                                <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> King Size Bed</li>
                                <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Ocean/Park View</li>
                                <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Bathtub & Smart TV</li>
                            </ul>
                            <button
                                onClick={() => handleBookRoom('Deluxe', priceDetails.deluxe)}
                                disabled={priceDetails.deluxe === 0}
                                className={`w-full py-3 uppercase tracking-widest text-sm font-bold transition-all ${priceDetails.deluxe > 0 ? 'bg-[var(--color-gold-500)] text-black hover:bg-black hover:text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            >
                                Select Room
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
