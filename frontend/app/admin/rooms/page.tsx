'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Edit, Trash2, Search, CheckCircle, XCircle, Image as ImageIcon, Copy } from 'lucide-react';

interface Kamar {
    id: number;
    nomorKamar: string;
    tipe: string;
    harga: number;
    statusKamar: string;
    fasilitasTambahan: string;
    gambar: string;
}

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Kamar[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Kamar | null>(null);
    const [formData, setFormData] = useState<{
        nomorKamar: string;
        tipe: string;
        harga: number | string;
        statusKamar: string;
        fasilitasTambahan: string;
        gambar: string;
    }>({
        nomorKamar: '',
        tipe: 'Standard',
        harga: '',
        statusKamar: 'Available',
        fasilitasTambahan: '',
        gambar: ''
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = () => {
        api.get('/admin/kamar')
            .then(res => {
                setRooms(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching rooms:", err);
                setIsLoading(false);
            });
    };

    const handleDuplicate = (room: Kamar) => {
        setEditingRoom(null); // Create mode
        setFormData({
            nomorKamar: '', // Reset room number as it must be unique
            tipe: room.tipe,
            harga: room.harga,
            statusKamar: 'Available', // Reset status just in case
            fasilitasTambahan: room.fasilitasTambahan,
            gambar: room.gambar || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this room?')) {
            api.delete(`/admin/kamar/${id}`)
                .then(() => fetchRooms())
                .catch(err => alert('Failed to delete room'));
        }
    };

    const handleCreateOrUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { ...formData };

        if (editingRoom) {
            api.put(`/admin/kamar/${editingRoom.id}`, data)
                .then(() => {
                    setIsModalOpen(false);
                    fetchRooms();
                })
                .catch(err => alert('Failed to update room'));
        } else {
            api.post('/admin/kamar', data)
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
                fasilitasTambahan: room.fasilitasTambahan,
                gambar: room.gambar || ''
            });
        } else {
            setEditingRoom(null);
            setFormData({
                nomorKamar: '',
                tipe: 'Standard',
                harga: '',
                statusKamar: 'Available',
                fasilitasTambahan: '',
                gambar: ''
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
                            <th className="px-6 py-4 font-medium text-gray-500">Image</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Type</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Price (Night)</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Facilities</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Loading rooms...</td></tr>
                        ) : filteredRooms.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No rooms found.</td></tr>
                        ) : (
                            filteredRooms.map((room) => (
                                <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[var(--color-dark-900)]">{room.nomorKamar}</td>
                                    <td className="px-6 py-4">
                                        {room.gambar ? (
                                            <img src={room.gambar} alt="Room" className="w-12 h-12 rounded object-cover border" />
                                        ) : (
                                            <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                    </td>
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
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDuplicate(room)}
                                                className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-md transition-colors"
                                                title="Duplicate"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(room.id)}
                                                className="p-1.5 hover:bg-red-50 text-red-500 rounded-md transition-colors"
                                                title="Delete"
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
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-gold-400)] focus:border-transparent outline-none transition-all text-gray-900"
                                    value={formData.nomorKamar}
                                    onChange={e => setFormData({ ...formData, nomorKamar: e.target.value })}
                                />
                            </div>



                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none text-gray-900"
                                        value={formData.tipe}
                                        onChange={e => setFormData({ ...formData, tipe: e.target.value })}
                                    >
                                        <option value="Standard">Standard</option>
                                        <option value="Deluxe">Deluxe</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none text-gray-900"
                                        value={formData.harga}
                                        onChange={e => setFormData({ ...formData, harga: e.target.value === '' ? '' : Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Image</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            // Rename to avoid shadowing
                                            const uploadData = new FormData();
                                            uploadData.append('file', file);

                                            try {
                                                const res = await api.post('/admin/upload', uploadData, {
                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                });
                                                setFormData({ ...formData, gambar: res.data.url });
                                            } catch (err) {
                                                console.error("Upload failed", err);
                                                alert("Upload failed");
                                            }
                                        }}
                                        className="hidden"
                                        id="upload-btn"
                                    />
                                    <label htmlFor="upload-btn" className="bg-gray-200 px-4 py-2 rounded cursor-pointer hover:bg-gray-300 text-sm text-gray-800">
                                        Choose File
                                    </label>
                                    <span className="text-sm text-gray-500 truncate max-w-xs ">{formData.gambar ? 'Image Selected' : 'No file chosen'}</span>
                                </div>
                                {formData.gambar && (
                                    <div className="mt-2">
                                        <img src={formData.gambar} alt="Preview" className="h-20 w-auto object-cover rounded border" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none text-gray-900"
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
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-gold-400)] outline-none text-gray-900"
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
