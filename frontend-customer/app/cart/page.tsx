"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, MapPin, CreditCard } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCartStore } from '../../store/cartStore';

export default function CartPage() {
  const router = useRouter();
  const { items, restaurantName, removeItem, updateQuantity, getSubtotal, getTotalItems } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = items.length > 0 ? 40 : 0;
  const taxes = subtotal * 0.05; // 5% GST
  const total = subtotal + deliveryFee + taxes;

  const handleCheckout = () => {
    setIsProcessing(true);
    // In a real app, this would redirect to a checkout/payment page
    // For now, we simulate order placement
    setTimeout(() => {
      router.push('/checkout');
    }, 800);
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 pb-20 flex flex-col items-center justify-center bg-gray-50">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-sm text-center">Looks like you haven't added anything to your cart yet. Browse our top restaurants to find something delicious.</p>
          <Link href="/restaurants" className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-medium hover:bg-[var(--color-primary-dark)] transition-colors">
            Browse Restaurants
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-28 pb-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="text-3xl font-bold font-outfit text-gray-900 mb-8">Secure Checkout</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column: Cart Items & Details */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              
              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <div>
                    <h2 className="font-bold text-lg text-gray-900">Order Summary</h2>
                    <p className="text-sm text-gray-500">From <span className="font-medium text-[var(--color-primary)]">{restaurantName}</span></p>
                  </div>
                  <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary-dark)] px-3 py-1 rounded-full text-xs font-bold">
                    {getTotalItems()} Items
                  </span>
                </div>
                
                <div className="p-6 flex flex-col gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {item.image ? (
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 relative">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                          <ShoppingBag className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900 line-clamp-2 md:line-clamp-1 flex-1">{item.name}</h3>
                          <p className="font-bold text-gray-900 ml-4">₹{item.price * item.quantity}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm disabled:opacity-50 transition-all font-medium text-gray-700"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center font-bold text-sm text-gray-900">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all font-medium text-gray-700"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address Placeholder */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                    Delivery Address
                  </h2>
                  <button className="text-[var(--color-primary)] text-sm font-semibold hover:underline">Change</button>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-gray-900 mb-1">Home</p>
                  <p className="text-gray-600 text-sm">Apt 4B, 123 Tech Park Road, HSR Layout, Sector 2, Bangalore 560102</p>
                  <p className="text-gray-600 text-sm mt-2 font-medium">Phone: +91 98765 43210</p>
                </div>
              </div>

            </div>

            {/* Right Column: Bill Details & Payment */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="font-bold text-lg text-gray-900">Bill Details</h2>
                </div>
                
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-center text-gray-600 text-sm">
                    <span>Item Total</span>
                    <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 text-sm">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 text-sm pb-4 border-b border-gray-100 hover:border-dashed">
                    <span>Taxes & Charges (5%)</span>
                    <span>₹{taxes.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-gray-900 text-lg">To Pay</span>
                    <span className="font-extrabold text-[var(--color-primary)] text-xl">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-between disabled:opacity-75 disabled:cursor-not-allowed group shadow-md hover:shadow-lg"
                  >
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      {isProcessing ? 'Processing...' : 'Proceed to Pay'}
                    </span>
                    {!isProcessing && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
