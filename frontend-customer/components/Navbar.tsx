"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Use Zustand store
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.svg" 
              alt="Big Bites Logo" 
              width={40} 
              height={40} 
              className="object-contain drop-shadow-sm"
              unoptimized
            />
            <span className="font-outfit font-bold text-2xl tracking-tight text-[var(--color-secondary)]">
              Big Bites
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`font-medium transition-colors hover:text-[var(--color-primary)] ${isScrolled ? 'text-gray-700' : 'text-[var(--color-text-main)]'}`}>Home</Link>
            <Link href="/restaurants" className={`font-medium transition-colors hover:text-[var(--color-primary)] ${isScrolled ? 'text-gray-700' : 'text-[var(--color-text-main)]'}`}>Restaurants</Link>
            <Link href="/offers" className={`font-medium transition-colors hover:text-[var(--color-primary)] ${isScrolled ? 'text-gray-700' : 'text-[var(--color-text-main)]'}`}>Offers</Link>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <button className={`${isScrolled ? 'text-gray-700' : 'text-[var(--color-text-main)]'} hover:text-[var(--color-primary)] transition-colors`}>
              <Search className="w-5 h-5" />
            </button>
            <Link href="/cart" className={`relative ${isScrolled ? 'text-gray-700' : 'text-[var(--color-text-main)]'} hover:text-[var(--color-primary)] transition-colors`}>
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={totalItems} // re-animate on change
                  className="absolute -top-1 -right-1 bg-[var(--color-accent)] text-[var(--color-secondary)] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
            <Link href="/login" className={`flex items-center gap-2 font-medium px-4 py-2 rounded-full transition-all bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-sm hover:shadow-md`}>
              <User className="w-4 h-4" />
              <span>Log In</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/cart" className={`relative ${isScrolled ? 'text-gray-700' : 'text-[var(--color-text-main)]'}`}>
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--color-accent)] text-[var(--color-text-main)] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${isScrolled ? 'text-gray-900' : 'text-[var(--color-text-main)]'}`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-white shadow-xl md:hidden border-t border-gray-100"
        >
          <div className="flex flex-col px-4 py-6 space-y-4">
            <Link href="/" className="text-gray-800 font-medium text-lg border-b border-gray-50 pb-2">Home</Link>
            <Link href="/restaurants" className="text-gray-800 font-medium text-lg border-b border-gray-50 pb-2">Restaurants</Link>
            <Link href="/offers" className="text-gray-800 font-medium text-lg border-b border-gray-50 pb-2">Offers</Link>
            <div className="pt-4 flex gap-4">
              <Link href="/login" className="flex-1 bg-[var(--color-primary)] text-white text-center py-3 rounded-xl font-medium">Log In</Link>
              <Link href="/register" className="flex-1 bg-gray-100 text-gray-800 text-center py-3 rounded-xl font-medium">Sign Up</Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
