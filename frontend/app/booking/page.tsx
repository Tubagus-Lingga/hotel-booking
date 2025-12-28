'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Users, Check, User, ArrowLeft, ShoppingBag } from 'lucide-react';
import api from '@/lib/api';

interface Kamar {
    id: number;
    nomorKamar: string;
    tipe: string;
    harga: number;
    statusKamar: string;
    gambar: string;
    fasilitasTambahan: string;
}

export default function BookingPage() {
    const router = useRouter();
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    // Group unique room types to display as cards
    const [roomTypes, setRoomTypes] = useState<Kamar[]>([]);

    // Helper to calculate total price for a room based on dates
    const calculateTotalPrice = (basePrice: number) => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        if (start >= end) return 0;

        let total = 0;
        for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
            const day = d.getDay();
            // Weekend: Friday (5), Saturday (6), Sunday (0)
            const isWeekend = day === 5 || day === 6 || day === 0;
            total += basePrice + (isWeekend ? 200000 : 0);
        }
        return total;
    };

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) router.push('/login');

        api.get('/public/kamar') // Fetch all public rooms
            .then(res => {
                const rooms: Kamar[] = res.data || [];
                // Filter only available rooms
                const available = rooms.filter(r => r.statusKamar === 'Available');

                // Group by type (Standard, Deluxe) to show unique cards
                // We pick the first available room of each type to display details
                const uniqueTypes = new Map();
                available.forEach(room => {
                    if (!uniqueTypes.has(room.tipe)) {
                        uniqueTypes.set(room.tipe, room);
                    }
                });
                setRoomTypes(Array.from(uniqueTypes.values()));
            })
            .catch(console.error);
    }, [router]);

    const formatIDR = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    const handleBookRoom = async (room: Kamar) => {
        if (!checkIn || !checkOut) {
            alert('Please select check-in and check-out dates.');
            return;
        }

        try {
            await api.post('/customer/booking', {
                kamarId: room.id,
                namaPemesan: 'Guest',
                checkIn: checkIn,
                checkOut: checkOut,
                tipeKasur: room.tipe === 'Standard' ? 'Queen' : 'King',
                sarapan: room.tipe === 'Deluxe'
            });
            router.push('/cart');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-cream-50)] text-[var(--color-dark-900)] font-sans">
            {/* Navigation */}
            <nav className="bg-[var(--color-dark-900)] text-white px-8 py-6 flex justify-between items-center shadow-lg">
                <Link href="/" className="flex items-center gap-2 hover:text-[var(--color-gold-400)] transition">
                    <ArrowLeft size={20} /> Back to Home
                </Link>
                <h1 className="text-2xl font-serif tracking-widest text-[var(--color-gold-400)]">KANZLER</h1>
                <div className="flex items-center gap-4">
                    <Link href="/cart" className="hover:text-[var(--color-gold-400)] transition">
                        <ShoppingBag size={24} />
                    </Link>
                </div>
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
                        *Price calculated based on selected dates.
                    </div>
                </div>

                {/* Room Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {roomTypes.length === 0 ? (
                        <div className="col-span-2 text-center text-gray-500 py-12">
                            <p className="text-xl italic">No rooms available for booking at the moment.</p>
                            <p className="text-sm mt-2">Please check back later.</p>
                        </div>
                    ) : (
                        roomTypes.map((room) => {
                            const totalPrice = calculateTotalPrice(room.harga);
                            const hasDates = checkIn && checkOut;

                            return (
                                <div key={room.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent">
                                    <div className="h-64 bg-gray-200 relative">
                                        {room.gambar ? (
                                            <img src={room.gambar} alt={room.tipe} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                                            {room.tipe}
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="mb-4">
                                            <h3 className="text-2xl font-serif mb-1">{room.tipe} Room</h3>
                                            {hasDates && totalPrice > 0 ? (
                                                <div className="flex flex-col">
                                                    <span className="text-2xl font-bold text-[var(--color-gold-600)]">{formatIDR(totalPrice)}</span>
                                                    <span className="text-xs text-gray-400">Total for selected nights</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="text-xl font-bold text-gray-700">{formatIDR(room.harga)}</span>
                                                    <span className="text-xs text-gray-400">per night</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                                            {room.fasilitasTambahan || 'Enjoy a comfortable stay with premium amenities.'}
                                        </p>

                                        <button
                                            onClick={() => handleBookRoom(room)}
                                            disabled={!hasDates || totalPrice === 0}
                                            className={`w-full py-3 uppercase tracking-widest text-sm font-bold transition-all ${hasDates && totalPrice > 0 ? 'bg-[var(--color-gold-500)] text-black hover:bg-black hover:text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                        >
                                            {hasDates ? 'Add to Cart' : 'Select Dates first'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
