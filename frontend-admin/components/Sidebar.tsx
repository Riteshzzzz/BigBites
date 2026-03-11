"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  ClipboardList, 
  Store, 
  UtensilsCrossed, 
  Users, 
  Bike, 
  CreditCard, 
  LineChart, 
  Settings, 
  LifeBuoy, 
  Megaphone,
  Bell,
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react';

const menuItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
  { icon: ClipboardList, label: 'Orders', href: '/orders' },
  { icon: Store, label: 'Restaurants', href: '/restaurants' },
  { icon: UtensilsCrossed, label: 'Menu Items', href: '/menus' },
  { icon: Users, label: 'Customers', href: '/customers' },
  { icon: Bike, label: 'Delivery', href: '/delivery' },
  { icon: CreditCard, label: 'Payments', href: '/payments' },
  { icon: LineChart, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: LifeBuoy, label: 'Support', href: '/support' },
  { icon: Megaphone, label: 'Marketing', href: '/marketing' },
  { icon: Bell, label: 'Notifications', href: '/notifications' }
];

export default function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div 
        className={`fixed inset-0 bg-gray-900/50 z-20 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />
      
      <aside 
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.svg" 
              alt="Admin Logo" 
              width={32} 
              height={32} 
              className="object-contain"
              unoptimized
            />
            <span className="text-xl font-bold font-poppins text-[var(--color-primary)]">Big Bites Admin</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700">
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-4rem)] py-4">
          <ul className="space-y-1 font-medium px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.label}>
                  <Link 
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg group transition-colors ${
                      isActive 
                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary-dark)]' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[var(--color-primary)]' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-white">
            <button className="flex items-center w-full p-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
