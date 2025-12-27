'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, ArrowRight, Wifi, Coffee, MapPin, User } from 'lucide-react';

export default function Home() {
  const router = useRouter();

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
          <Link href="/login" className="text-white hover:text-[var(--color-gold-400)] transition">
            <User size={24} />
          </Link>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto font-sans">

          {/* Standard Room Card */}
          <div className="group cursor-default">
            <div className="h-[400px] overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80" alt="Standard Room" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            </div>
            <div className="pt-8 text-center bg-white relative -mt-16 mx-8 shadow-xl p-6">
              <h3 className="text-2xl font-serif text-[var(--color-dark-900)] mb-2">Urban Comfort</h3>
              <p className="text-gray-500 text-sm mb-4">Standard Room</p>
              <div className="flex justify-center gap-4 text-xs text-gray-400 mb-6 uppercase tracking-wider">
                <span>Queen Bed</span> • <span>City View</span> • <span>2 Guests</span>
              </div>
              <p className="text-[var(--color-gold-600)] font-bold text-lg mb-6">Starts from Rp 459.000</p>
              <button onClick={handleBookNow} className="border-b border-black pb-1 uppercase text-xs tracking-[0.2em] hover:text-[var(--color-gold-600)] hover:border-[var(--color-gold-600)] transition-all cursor-pointer">
                Book This Room
              </button>
            </div>
          </div>

          {/* Deluxe Room Card */}
          <div className="group cursor-default">
            <div className="h-[400px] overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80" alt="Deluxe Room" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            </div>
            <div className="pt-8 text-center bg-white relative -mt-16 mx-8 shadow-xl p-6">
              <h3 className="text-2xl font-serif text-[var(--color-dark-900)] mb-2">Executive Deluxe</h3>
              <p className="text-gray-500 text-sm mb-4">Deluxe Room</p>
              <div className="flex justify-center gap-4 text-xs text-gray-400 mb-6 uppercase tracking-wider">
                <span>King Bed</span> • <span>Ocean View</span> • <span>Bathtub</span>
              </div>
              <p className="text-[var(--color-gold-600)] font-bold text-lg mb-6">Starts from Rp 830.000</p>
              <button onClick={handleBookNow} className="border-b border-black pb-1 uppercase text-xs tracking-[0.2em] hover:text-[var(--color-gold-600)] hover:border-[var(--color-gold-600)] transition-all cursor-pointer">
                Book This Room
              </button>
            </div>
          </div>

        </div>
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

function CheckIcon() {
  return <span className="text-[var(--color-gold-500)]">✓</span>
}
