'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ArrowRight, User, Image as ImageIcon, ShoppingBag } from 'lucide-react';

interface Kamar {
  id: number;
  nomorKamar: string;
  tipe: string;
  harga: number;
  gambar: string;
  fasilitasTambahan: string;
  statusKamar: string;
}

export default function Home() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Kamar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    // Check login status
    const user = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    if (user) {
      setIsLoggedIn(true);
      if (storedRole) setRole(storedRole);
    }

    api.get('/public/kamar')
      .then(res => {
        const allRooms = res.data || [];
        const available = allRooms.filter((r: Kamar) => r.statusKamar === 'Available');

        // Group unique types
        const uniqueTypes = new Map();
        available.forEach((room: Kamar) => {
          if (!uniqueTypes.has(room.tipe)) {
            uniqueTypes.set(room.tipe, room);
          }
        });

        setRooms(Array.from(uniqueTypes.values()));
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching public rooms:", err);
        setIsLoading(false);
      });
  }, []);

  const handleBookNow = () => {
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/booking');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white text-[var(--color-dark-900)] font-sans">

      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 px-8 py-6 flex justify-between items-center text-white">
        <h1 className="text-2xl font-serif tracking-widest text-[var(--color-gold-400)]">KANZLER</h1>
        <div className="hidden md:flex gap-8 text-sm tracking-wide uppercase">
          <Link href="#experience" className="hover:text-[var(--color-gold-400)] transition">Experience</Link>
          <Link href="#accommodations" className="hover:text-[var(--color-gold-400)] transition">Accommodations</Link>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={handleBookNow} className="bg-[var(--color-gold-500)] text-black px-6 py-2 rounded-none uppercase text-xs font-bold tracking-widest hover:bg-white transition-colors cursor-pointer">
            Book Now
          </button>
          <Link href="/cart" className="text-white hover:text-[var(--color-gold-400)] transition">
            <ShoppingBag size={24} />
          </Link>
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-white hover:text-[var(--color-gold-400)] transition flex items-center gap-2 focus:outline-none"
              >
                <User size={24} />
                <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Account</span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-4 w-48 bg-white rounded shadow-xl overflow-hidden text-black py-2 origin-top-right z-50 animate-fade-in-down">
                  {role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 border-b border-gray-100 font-medium text-[var(--color-dark-900)]"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      localStorage.removeItem('user');
                      localStorage.removeItem('role');
                      setIsLoggedIn(false);
                      setShowDropdown(false);
                      router.refresh();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-white hover:text-[var(--color-gold-400)] transition">
              <User size={24} />
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80"
            alt="Hotel Lobby"
            className="w-full h-full object-cover brightness-50"
          />
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <p className="text-[var(--color-gold-400)] uppercase tracking-[0.3em] text-sm mb-4">Welcome to</p>
          <h1 className="text-6xl md:text-8xl font-serif mb-6 tracking-tight">KANZLER</h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto mb-10 text-gray-200 leading-relaxed">
            Where timeless elegance meets modern luxury. <br />
            An unforgettable sanctuary in the heart of the city.
          </p>
          <button onClick={handleBookNow} className="inline-flex items-center gap-2 border border-white px-8 py-3 uppercase text-sm tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer">
            Start Your Journey <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Facilities Section */}
      <div id="experience" className="py-24 px-8 bg-[var(--color-cream-50)] scroll-mt-20">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <span className="text-[var(--color-gold-600)] uppercase tracking-widest text-xs font-bold">Experience</span>
          <h2 className="text-4xl font-serif text-[var(--color-dark-800)] mt-2">World-Class Facilities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FacilityCard
            image="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80"
            title="Infinity Pool"
            desc="Relax in our temperature-controlled rooftop pool with breathtaking city views."
          />
          <FacilityCard
            image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
            title="Signature Dining"
            desc="Savor exquisite culinary creations crafted by our award-winning chefs."
          />
          <FacilityCard
            image="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
            title="State-of-the-Art Gym"
            desc="Stay active with premium equipment and personal training sessions."
          />
        </div>
      </div>

      {/* Room Listing Section */}
      <div id="accommodations" className="py-24 px-8 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <span className="text-[var(--color-gold-600)] uppercase tracking-widest text-xs font-bold">Accommodations</span>
          <h2 className="text-4xl font-serif text-[var(--color-dark-800)] mt-2">Your Private Sanctuary</h2>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading available rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12 text-gray-500 italic">
            <p>No rooms available at the moment.</p>
            <p className="text-sm mt-2">Please check back later or contact us directly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-5xl mx-auto font-sans">
            {rooms.map((room) => (
              <div key={room.id} className="group cursor-default">
                <div className="h-[400px] overflow-hidden relative bg-gray-100 flex items-center justify-center">
                  {room.gambar ? (
                    <img src={room.gambar} alt={room.tipe} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="text-gray-300 flex flex-col items-center">
                      <ImageIcon size={48} />
                      <span className="text-sm mt-2">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  {/* Badge Status - Hide for aggregated view or show 'Available' */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--color-dark-900)] shadow-sm">
                    {room.statusKamar}
                  </div>
                </div>
                <div className="pt-8 text-center bg-white relative -mt-16 mx-8 shadow-xl p-6">
                  <h3 className="text-2xl font-serif text-[var(--color-dark-900)] mb-2">{room.tipe}</h3>
                  {/* REMOVED ROOM NUMBER HERE */}

                  {room.fasilitasTambahan && (
                    <div className="flex justify-center flex-wrap gap-2 text-xs text-gray-400 mb-6 uppercase tracking-wider max-w-xs mx-auto">
                      {room.fasilitasTambahan.split(',').map((f, i) => (
                        <span key={i} className="border px-2 py-0.5 rounded-full">{f.trim()}</span>
                      ))}
                    </div>
                  )}

                  <p className="text-[var(--color-gold-600)] font-bold text-lg mb-6">
                    Runs from Rp {room.harga.toLocaleString()}
                  </p>

                  <button onClick={handleBookNow} className="border-b border-black pb-1 uppercase text-xs tracking-[0.2em] hover:text-[var(--color-gold-600)] hover:border-[var(--color-gold-600)] transition-all cursor-pointer">
                    Book This Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-[var(--color-dark-900)] text-white py-12 text-center">
        <h2 className="text-2xl font-serif text-[var(--color-gold-400)] mb-6">KANZLER</h2>
        <div className="flex justify-center gap-6 text-gray-400 text-sm mb-8">
          <Link href="#" className="hover:text-white">Privacy Policy</Link>
          <Link href="#" className="hover:text-white">Terms of Service</Link>
          <Link href="#" className="hover:text-white">Contact Us</Link>
        </div>
        <p className="text-gray-600 text-xs">© 2025 Kanzler Hotel. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FacilityCard({ image, title, desc }: { image: string, title: string, desc: string }) {
  return (
    <div className="group relative h-[300px] overflow-hidden rounded-lg cursor-default shadow-lg">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 text-white">
        <h3 className="text-xl font-serif mb-2">{title}</h3>
        <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">{desc}</p>
      </div>
    </div>
  )
}
