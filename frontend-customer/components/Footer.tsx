import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-secondary)] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image 
                src="/logo.svg" 
                alt="Big Bites Logo" 
                width={40} 
                height={40} 
                className="object-contain"
                unoptimized
              />
              <span className="font-outfit font-bold text-2xl tracking-tight text-white">
                Big Bites
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Delivering happiness to your doorstep. Explore top restaurants, amazing deals, and lightning-fast delivery with Big Bites.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-primary)] transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-primary)] transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-primary)] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h3 className="font-outfit font-bold text-lg mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors text-sm">About Us</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors text-sm">Careers</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors text-sm">Blog</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h3 className="font-outfit font-bold text-lg mb-4 text-white">For Users</h3>
            <ul className="space-y-3">
              <li><Link href="/login" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors text-sm">Login</Link></li>
              <li><Link href="/register" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors text-sm">Register</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors text-sm">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors text-sm">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="font-outfit font-bold text-lg mb-4 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                <span>123 Food Street, Tech Hub, Bangalore, India 560001</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                <span>support@bigbites.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Big Bites Technologies. All rights reserved.
          </p>
          <div className="flex gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  );
}
