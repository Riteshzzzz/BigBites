"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    // Clear cart after successful order
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100 relative overflow-hidden">
        {/* Confetti-like background blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl z-0 pointer-events-none"></div>

        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        
        <h1 className="text-3xl font-extrabold font-outfit text-gray-900 mb-2 relative z-10">Order Placed!</h1>
        <p className="text-gray-500 mb-8 relative z-10">Your food is being prepared and will be delivered shortly. Track your order status in the app.</p>
        
        <div className="bg-gray-50 p-4 rounded-xl mb-8 border border-gray-100 text-left relative z-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Order ID</span>
            <span className="font-bold text-gray-900">#ORD-{(Math.random() * 10000).toFixed(0)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Estimated Delivery</span>
            <span className="font-medium text-[var(--color-primary)]">30-45 mins</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 relative z-10">
          <button onClick={() => router.push('/orders/track')} className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-6 py-4 rounded-xl font-bold transition-all shadow-md">
            Track Order
          </button>
          <Link href="/" className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
