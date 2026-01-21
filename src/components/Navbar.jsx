"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // <--- 1. Import Image component
import { Search, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO IMAGE */}
        <Link href="/" onClick={closeMenu} className="flex items-center">
          {/* 2. Ganti Text dengan Image */}
          <Image 
            src="/logo.png" // Pastikan file logo.png ada di folder 'public'
            alt={process.env.NEXT_PUBLIC_SITE_NAME || 'Logo Website'}
            width={150} // Tentukan lebar aspek rasio (bukan ukuran layar)
            height={40} // Tentukan tinggi aspek rasio
            className="h-8 md:h-10 w-auto object-contain" // Atur tinggi responsif (h-8 di HP, h-10 di PC)
            priority // Agar logo dimuat paling duluan (LCP optimization)
          />
        </Link>
        
        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-red-400 transition">Home</Link>
          <Link href="/anime" className="hover:text-red-400 transition">Daftar Hentai</Link>
          <Link href="/episodes" className="hover:text-red-400 transition">Episode Baru</Link>
          <Link href="/genres" className="hover:text-red-400 transition">Genre</Link>
          <Link href="/trending" className="hover:text-red-400 transition">Trending</Link>
        </div>

        {/* SEARCH BAR & MOBILE BUTTON */}
        <div className="flex items-center gap-4">
          <form action="/search" className="relative hidden md:block">
            <input 
              type="text" 
              name="q" 
              placeholder="Cari anime..." 
              className="bg-slate-800 rounded-full px-4 py-1.5 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 w-64"
            />
            <button type="submit" className="absolute left-3 top-2 text-slate-400">
              <Search size={16} />
            </button>
          </form>

          <button 
            className="md:hidden text-slate-300 hover:text-white transition p-1"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-slate-900 border-b border-slate-800 shadow-xl flex flex-col p-4 gap-4 animate-in slide-in-from-top-5 duration-200">
          
          <form action="/search" className="relative w-full">
            <input 
              type="text" 
              name="q" 
              placeholder="Cari anime..." 
              className="bg-slate-800 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 w-full text-white"
            />
            <button type="submit" className="absolute left-3 top-3.5 text-slate-400">
              <Search size={18} />
            </button>
          </form>

          <div className="flex flex-col gap-2 font-medium text-slate-300">
            <Link href="/" onClick={closeMenu} className="px-4 py-3 hover:bg-slate-800 rounded-lg transition hover:text-red-500">Home</Link>
            <Link href="/anime" onClick={closeMenu} className="px-4 py-3 hover:bg-slate-800 rounded-lg transition hover:text-red-500">Daftar Hentai</Link>
            <Link href="/episodes" onClick={closeMenu} className="px-4 py-3 hover:bg-slate-800 rounded-lg transition hover:text-red-500">Episode Baru</Link>
            <Link href="/genres" onClick={closeMenu} className="px-4 py-3 hover:bg-slate-800 rounded-lg transition hover:text-red-500">Genre</Link>
            <Link href="/trending" onClick={closeMenu} className="px-4 py-3 hover:bg-slate-800 rounded-lg transition hover:text-red-500">Trending</Link>
          </div>
        </div>
      )}
    </nav>
  );
}