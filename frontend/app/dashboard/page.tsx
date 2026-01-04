'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Kamar {
  id: number;
  tipe: string;
  harga: number;
  statusKamar: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Kamar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get('/public/kamar');
        setRooms(response.data);
      } catch (err) {
        console.error('Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      router.push('/login');
    } catch (e) {
      console.error("Logout failed", e);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Grand Choco-Pink</h1>
        <div className="flex items-center gap-6">
          <Link href="/cart" className="text-gray-600 hover:text-gray-900 transition">
            <ShoppingBag size={24} />
          </Link>
          <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-medium">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Available Rooms</h2>

        {loading ? (
          <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.length === 0 ? (
              <p className="text-gray-500">No rooms available at the moment.</p>
            ) : (
              rooms.map((room) => (
                <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="h-48 bg-gray-200 w-full relative">
                    <img
                      src={room.tipe === 'Standard' ? '/images/standard.jpg' : '/images/executive.jpg'}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' }}
                    />
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-xs font-bold shadow">
                      {room.tipe}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-bold">Room {room.tipe}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${room.statusKamar === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {room.statusKamar || 'Booked'}
                      </span>
                    </div>

                    <div className="text-2xl font-bold text-blue-600 mb-4">
                      Rp {room.harga?.toLocaleString()} <span className="text-sm text-gray-400 font-normal">/ night</span>
                    </div>

                    <button className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
