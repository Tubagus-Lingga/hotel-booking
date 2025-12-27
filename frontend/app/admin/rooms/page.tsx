'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search, CheckCircle, XCircle } from 'lucide-react';

interface Kamar {
    id: number;
    nomorKamar: string;
    tipe: string;
    harga: number;
    statusKamar: string;
    fasilitasTambahan: string;
}

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Kamar[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Kamar | null>(null);
    const [formData, setFormData] = useState({
        nomorKamar: '',
        tipe: 'Standard',
        harga: 0,
        statusKamar: 'Available',
        fasilitasTambahan: ''
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = () => {
        axios.get('http://localhost:8081/api/admin/kamar')
            .then(res => {
                setRooms(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching rooms:", err);
                setIsLoading(false);
            });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this room?')) {
            axios.delete(`http://localhost:8081/api/admin/kamar/${id}`)
                .then(() => fetchRooms())
                .catch(err => alert('Failed to delete room'));
        }
    };

    const handleCreateOrUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { ...formData };

        if (editingRoom) {
            axios.put(`http://localhost:8081/api/admin/kamar/${editingRoom.id}`, data)
                .then(() => {
                    setIsModalOpen(false);
                    fetchRooms();
                })
                .catch(err => alert('Failed to update room'));
        } else {
            axios.post('http://localhost:8081/api/admin/kamar', data)
                .then(() => {
                    setIsModalOpen(false);
                    fetchRooms();
                })
                .catch(err => alert('Failed to create room'));
        }
    };

    const openModal = (room?: Kamar) => {
        if (room) {
            setEditingRoom(room);
            setFormData({
                nomorKamar: room.nomorKamar,
                tipe: room.tipe,
                harga: room.harga,
                statusKamar: room.statusKamar,
                fasilitasTambahan: room.fasilitasTambahan
            });
        } else {
            setEditingRoom(null);
            setFormData({
                nomorKamar: '',
                tipe: 'Standard',
                harga: 0,
                statusKamar: 'Available',
                fasilitasTambahan: ''
            });
        }
        setIsModalOpen(true);
    };

    const filteredRooms = rooms.filter(r =>
        r.nomorKamar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tipe.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-serif text-[var(--color-dark-900)]">Room Management</h1>
                    <p className="text-gray-500 text-sm">Manage hotel rooms availability and pricing</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-[var(--color-gold-500)] hover:bg-[var(--color-gold-600)] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-yellow-900/20"
                >
                    <Plus size={18} /> Add New Room
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by room number or type..."
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
                            <th className="px-6 py-4 font-medium text-gray-500">Room No</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Type</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Price (Night)</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Facilities</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Loading rooms...</td></tr>
                        ) : filteredRooms.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No rooms found.</td></tr>
                        ) : (
                            filteredRooms.map((room) => (
                                <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[var(--color-dark-900)]">{room.nomorKamar}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-100">
                                            {room.tipe}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">Rp {room.harga.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        {room.statusKamar === 'Available' ? (
                                            <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                                                <CheckCircle size={14} /> Available
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-red-500 text-sm font-medium">
                                                <XCircle size={14} /> {room.statusKamar}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate" title={room.fasilitasTambahan}>
                                        {room.fasilitasTambahan}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openModal(room)}
                                                className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-md transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(room.id)}
                                                className="p-1.5 hover:bg-red-50 text-red-500 rounded-md transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                            <h3 className="font-serif text-lg font-medium text-[var(--color-dark-900)]">
                                {editingRoom ? 'Edit Room' : 'Add New Room'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleCreateOrUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-gold-400)] focus:border-transparent outline-none transition-all"
                                    value={formData.nomorKamar}
                                    onChange={e => setFormData({ ...formData, nomorKamar: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none"
                                        value={formData.tipe}
                                        onChange={e => setFormData({ ...formData, tipe: e.target.value })}
                                    >
                                        <option value="Standard">Standard</option>
                                        <option value="Deluxe">Deluxe</option>
                                        <option value="Executive">Executive</option>
                                        <option value="Suite">Suite</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none"
                                        value={formData.harga}
                                        onChange={e => setFormData({ ...formData, harga: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none"
                                    value={formData.statusKamar}
                                    onChange={e => setFormData({ ...formData, statusKamar: e.target.value })}
                                >
                                    <option value="Available">Available</option>
                                    <option value="Booked">Booked</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Facilities</label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none"
                                    rows={3}
                                    value={formData.fasilitasTambahan}
                                    onChange={e => setFormData({ ...formData, fasilitasTambahan: e.target.value })}
                                    placeholder="e.g. WiFi, AC, Breakfast..."
                                ></textarea>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[var(--color-dark-900)] text-white rounded-lg hover:bg-black transition-colors"
                                >
                                    Save Room
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
