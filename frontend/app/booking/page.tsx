'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Users, ArrowLeft, ShoppingBag, History } from 'lucide-react';
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

    const [availableRoomsByType, setAvailableRoomsByType] = useState<Map<string, Kamar[]>>(new Map());

    const calculateTotalPrice = (basePrice: number) => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        if (start >= end) return 0;
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return basePrice * days;
    };

    const processRooms = (rooms: Kamar[]) => {
        const available = rooms.filter(r => r.statusKamar === 'Available');

        const groups = new Map<string, Kamar[]>();
        available.forEach(room => {
            if (!groups.has(room.tipe)) {
                groups.set(room.tipe, []);
            }
            groups.get(room.tipe)?.push(room);
        });

        groups.forEach((list) => {
            list.sort((a, b) => a.nomorKamar.localeCompare(b.nomorKamar, undefined, { numeric: true }));
        });

        return groups;
    };

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) router.push('/login');

        api.get('/public/kamar')
            .then(res => {
                const groups = processRooms(res.data || []);
                setAvailableRoomsByType(groups);
            })
            .catch(console.error);
    }, [router]);
    const formatIDR = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    const handleBookRoom = async (type: string, basePrice: number, image?: string) => {
        if (!checkIn || !checkOut) {
            alert('Please select check-in and check-out dates.');
            return;
        }

        const roomsOfType = availableRoomsByType.get(type);
        if (!roomsOfType || roomsOfType.length === 0) {
            alert('Sorry, this room type is no longer available.');
            return;
        }

        const roomId = roomsOfType[0].id;
        try {
            await api.post('/customer/booking', {
                kamarId: roomId,
                namaPemesan: 'Guest',
                checkIn: checkIn,
                checkOut: checkOut,
                tipeKasur: type === 'Standard' ? 'Queen' : 'King',
                sarapan: type === 'Deluxe'
            });
            router.push('/cart');
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-cream-50)] text-[var(--color-dark-900)] font-sans">
            <nav className="bg-[var(--color-dark-900)] text-white px-8 py-6 flex justify-between items-center shadow-lg">
                <Link href="/" className="flex items-center gap-2 hover:text-[var(--color-gold-400)] transition">
                    <ArrowLeft size={20} /> Back to Home
                </Link>
                <h1 className="text-2xl font-serif tracking-widest text-[var(--color-gold-400)]">KANZLER</h1>
                <div className="flex items-center gap-4">
                    <Link href="/history" className="hover:text-[var(--color-gold-400)] transition" title="My Bookings">
                        <History size={24} />
                    </Link>
                    <Link href="/cart" className="hover:text-[var(--color-gold-400)] transition" title="Cart">
                        <ShoppingBag size={24} />
                    </Link>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-12">
                <h2 className="text-4xl font-serif text-center mb-12">Select Your Stay</h2>

                <div className="bg-white p-8 rounded-xl shadow-xl mb-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                            <Calendar size={16} /> Check-in / Check-out
                        </label>
                        <div className="flex gap-4">
                            <input type="date" className="w-full border-b border-gray-300 py-2 focus:border-[var(--color-gold-500)] focus:outline-none bg-transparent" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                            <input type="date" className="w-full border-b border-gray-300 py-2 focus:border-[var(--color-gold-500)] focus:outline-none bg-transparent" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                            <Users size={16} /> Guests
                        </label>
                        <select className="w-full border-b border-gray-300 py-2 focus:border-[var(--color-gold-500)] focus:outline-none bg-transparent appearance-none" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                            {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>)}
                        </select>
                    </div>
                    <div className="text-sm text-gray-500 pb-2 italic">*Price calculated based on selected dates.</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {availableRoomsByType.size === 0 ? (
                        <div className="col-span-2 text-center text-gray-500 py-12">
                            <p className="text-xl italic">No rooms available for booking at the moment.</p>
                        </div>
                    ) : (
                        Array.from(availableRoomsByType.entries()).map(([type, rooms]) => {
                            const displayRoom = rooms[0];
                            const totalPrice = calculateTotalPrice(displayRoom.harga);
                            const hasDates = checkIn && checkOut;

                            return (
                                <div key={type} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent">
                                    <div className="h-64 bg-gray-200 relative">
                                        {displayRoom.gambar ? (
                                            <img src={displayRoom.gambar} alt={displayRoom.tipe} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">No Image</div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                                            {type}
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="mb-4">
                                            <h3 className="text-2xl font-serif mb-1">{type} Room</h3>
                                            <div className="flex flex-col mb-4">
                                                <span className="text-xl font-bold text-gray-700">{formatIDR(displayRoom.harga)} <span className="text-xs text-gray-400 font-normal">/ night</span></span>
                                                {hasDates && totalPrice > 0 && (
                                                    <span className="text-sm text-[var(--color-gold-600)] font-bold">Total: {formatIDR(totalPrice)}</span>
                                                )}
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-sm text-green-600 font-bold flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                    {rooms.length} Room{rooms.length > 1 ? 's' : ''} Available
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                                            {displayRoom.fasilitasTambahan || 'Enjoy a comfortable stay with premium amenities.'}
                                        </p>

                                        <button
                                            onClick={() => handleBookRoom(type, displayRoom.harga)}
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
        </div >
    );
}
