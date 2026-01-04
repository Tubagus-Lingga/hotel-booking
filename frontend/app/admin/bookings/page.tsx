'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Search, Calendar, User, CheckCircle, Clock } from 'lucide-react';

interface Booking {
    bookingID: string;
    namaPemesan: string; // Or Customer object, depending on API response. Let's check Booking model.
    customer?: {
        nama: string;
        username: string;
    };
    tanggalCheckIn: string; // Date
    tanggalCheckOut: string; // Date
    statusPembayaran: string;
    kamar?: {
        id: number;
        nomorKamar: string;
        tipe: string;
    };
    payment?: {
        paymentID: string;
        totalPembayaran: number;
        metodePembayaran: string;
    };
}

interface Kamar {
    id: number;
    nomorKamar: string;
    tipe: string;
    statusKamar: string;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [rooms, setRooms] = useState<Kamar[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    // Edit Dates Modal State
    const [isEditDatesModalOpen, setIsEditDatesModalOpen] = useState(false);
    const [newCheckIn, setNewCheckIn] = useState('');
    const [newCheckOut, setNewCheckOut] = useState('');

    useEffect(() => {
        fetchBookings();
        fetchRooms();
    }, []);

    const fetchBookings = () => {
        api.get('/admin/bookings')
            .then(res => {
                setBookings(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching bookings:", err);
                setIsLoading(false);
            });
    };

    const fetchRooms = () => {
        api.get('/admin/kamar')
            .then(res => {
                setRooms(res.data);
            })
            .catch(err => console.error(err));
    };

    const handleAssignRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBooking || !selectedRoomId) return;

        api.put(`/admin/bookings/${selectedBooking.bookingID}/assign-room/${selectedRoomId}`)
            .then(() => {
                setIsAssignModalOpen(false);
                fetchBookings(); // Refresh list
                fetchRooms(); // Refresh room status
                alert('Room assigned successfully!');
            })
            .catch(err => {
                console.error(err);
                alert('Failed to assign room');
            });
    };

    const openAssignModal = (booking: Booking) => {
        setSelectedBooking(booking);
        // If booking already has room, pre-select it
        if (booking.kamar) {
            setSelectedRoomId(booking.kamar.id);
        } else {
            setSelectedRoomId(null);
        }
        setIsAssignModalOpen(true);
    };

    const openEditDatesModal = (booking: Booking) => {
        setSelectedBooking(booking);
        setNewCheckIn(booking.tanggalCheckIn);
        setNewCheckOut(booking.tanggalCheckOut);
        setIsEditDatesModalOpen(true);
    };

    const handleUpdateDates = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBooking) return;

        api.put(`/admin/bookings/${selectedBooking.bookingID}/update-dates`, {
            checkIn: newCheckIn,
            checkOut: newCheckOut
        })
            .then(() => {
                setIsEditDatesModalOpen(false);
                fetchBookings();
                alert('Booking dates updated successfully!');
            })
            .catch(err => {
                console.error(err);
                alert('Failed to update dates');
            });
    };

    const filteredBookings = bookings.filter(b =>
        b.bookingID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.namaPemesan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.customer?.nama || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get available rooms + the room currently assigned to this booking (if any)
    const availableRooms = rooms.filter(r =>
        r.statusKamar === 'Available' || (selectedBooking?.kamar && r.id === selectedBooking.kamar.id)
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-serif text-[var(--color-dark-900)]">Booking Management</h1>
                    <p className="text-gray-500 text-sm">View bookings and assign rooms</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by Booking ID or Customer Name..."
                    className="flex-1 outline-none text-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">Booking ID</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Customer</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Dates</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Total Price</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Assigned Room</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-400">Loading bookings...</td></tr>
                        ) : filteredBookings.length === 0 ? (
                            <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-400">No bookings found.</td></tr>
                        ) : (
                            filteredBookings.map((booking) => (
                                <tr key={booking.bookingID} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[var(--color-dark-900)]">
                                        #{booking.bookingID}
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{booking.namaPemesan || booking.customer?.nama || 'Guest'}</p>
                                            <p className="text-xs text-gray-500">{booking.customer?.nama ? `Account: ${booking.customer.nama}` : '-'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        <div className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(booking.tanggalCheckIn).toLocaleDateString()}</div>
                                        <div className="flex items-center gap-1.5 mt-1"><Clock size={14} /> {new Date(booking.tanggalCheckOut).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {booking.payment ? (
                                            <div>
                                                <p className="font-bold text-[var(--color-gold-600)] text-lg">
                                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(booking.payment.totalPembayaran)}
                                                </p>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic text-sm">No Payment</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${booking.statusPembayaran === 'Completed' || booking.statusPembayaran === 'Paid'
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                            }`}>
                                            {booking.statusPembayaran || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {booking.kamar ? (
                                            <div>
                                                <p className="font-bold text-[var(--color-dark-900)]">Room {booking.kamar.nomorKamar}</p>
                                                <p className="text-xs text-gray-500">{booking.kamar.tipe}</p>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic text-sm">Not Assigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditDatesModal(booking)}
                                                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Edit Dates
                                            </button>
                                            <button
                                                onClick={() => openAssignModal(booking)}
                                                className="text-sm bg-[var(--color-dark-900)] text-white px-3 py-1.5 rounded-md hover:bg-black transition-colors"
                                            >
                                                {booking.kamar ? 'Change Room' : 'Assign Room'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Assign Room Modal */}
            {isAssignModalOpen && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
                        <h3 className="text-xl font-serif font-bold mb-4 text-gray-900">Assign Room for #{selectedBooking.bookingID}</h3>

                        <form onSubmit={handleAssignRoom}>
                            <div className="mb-4">
                                <label htmlFor="roomId" className="block text-sm font-bold text-gray-800 mb-2">Select Room</label>
                                <select
                                    id="roomId"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none text-gray-900 font-medium"
                                    value={selectedRoomId || ''}
                                    onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                                >
                                    <option value="">-- Select Room --</option>
                                    {availableRooms.map(room => (
                                        <option key={room.id} value={room.id}>
                                            {room.nomorKamar} - {room.tipe} ({room.statusKamar})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-2">Only "Available" rooms are shown.</p>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAssignModalOpen(false)}
                                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedRoomId}
                                    className="px-4 py-2 bg-[var(--color-dark-900)] text-white rounded-lg hover:bg-black disabled:opacity-50"
                                >
                                    Confirm Assignment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Dates Modal */}
            {isEditDatesModalOpen && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
                        <h3 className="text-xl font-serif font-bold mb-4 text-gray-900">Edit Dates for #{selectedBooking.bookingID}</h3>

                        <form onSubmit={handleUpdateDates}>
                            <div className="space-y-4 mb-4">
                                <div>
                                    <label htmlFor="checkInDate" className="block text-sm font-bold text-gray-800 mb-2">Check-In Date</label>
                                    <input
                                        id="checkInDate"
                                        type="date"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-900 font-medium"
                                        value={newCheckIn}
                                        onChange={(e) => setNewCheckIn(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="checkOutDate" className="block text-sm font-bold text-gray-800 mb-2">Check-Out Date</label>
                                    <input
                                        id="checkOutDate"
                                        type="date"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-900 font-medium"
                                        value={newCheckOut}
                                        onChange={(e) => setNewCheckOut(e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
                                    ℹ️ Payment amount will be automatically recalculated based on new dates.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsEditDatesModalOpen(false)}
                                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Update Dates
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
