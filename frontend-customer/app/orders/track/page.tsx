"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import { MapPin, Clock, Bike, CheckCircle2, ChevronLeft, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../../../components/Navbar';

export default function OrderTrackingPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [orderStatus, setOrderStatus] = useState('preparing'); // Default for mock
  const [deliveryLocation, setDeliveryLocation] = useState({ lat: 12.9716, lng: 77.5946 });

  useEffect(() => {
    // In a real app, URL config from environment
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      withCredentials: true,
    });

    setSocket(newSocket);

    // Mock order ID constraint
    const mockOrderId = 'ORD-12345';
    
    newSocket.emit('join_order_room', mockOrderId);

    newSocket.on('order_status_updated', (data) => {
      if (data.orderId === mockOrderId) {
        setOrderStatus(data.status);
      }
    });

    newSocket.on('location_updated', (location) => {
      setDeliveryLocation(location);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
  const currentIndex = statuses.indexOf(orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium">
            <ChevronLeft className="w-5 h-5 mr-1" /> Back to Home
          </Link>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-bold text-gray-900">
            Order #ORD-1894
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Tracking Status Pane */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-28">
              
              <div className="p-6 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white">
                <h2 className="text-2xl font-bold font-outfit mb-1">
                  {orderStatus === 'delivered' ? 'Order Delivered!' : 'Arriving in 25 mins'}
                </h2>
                <p className="text-white/80 text-sm">Your order from Spice Garden is on the way.</p>
              </div>

              {/* Progress Stepper */}
              <div className="p-6">
                <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 py-4">
                  
                  {[
                    { id: 'confirmed', title: 'Order Confirmed', time: '12:30 PM', icon: CheckCircle2 },
                    { id: 'preparing', title: 'Food is being prepared', time: '12:35 PM', icon: Clock },
                    { id: 'out_for_delivery', title: 'Out for delivery', time: 'Pending', icon: Bike },
                    { id: 'delivered', title: 'Delivered', time: 'Pending', icon: MapPin },
                  ].map((step, index) => {
                     
                     // Mapping our 6 statuses to these 4 visual steps for simplicity
                     let stepIndex = statuses.indexOf(step.id);
                     if (step.id === 'preparing') stepIndex = statuses.indexOf('preparing'); // covers ready too
                     
                     const isCompleted = currentIndex >= stepIndex;
                     const isCurrent = currentIndex === stepIndex || (step.id === 'preparing' && orderStatus === 'ready');
                     
                     const Icon = step.icon;

                     return (
                       <div key={step.id} className="relative pl-8">
                         {/* Circle Indicator */}
                         <div className={`absolute -left-[17px] top-0.5 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center transition-colors duration-500 ${
                           isCompleted ? 'bg-green-500' : isCurrent ? 'bg-[var(--color-primary)] animate-pulse' : 'bg-gray-200'
                         }`}>
                           <Icon className={`w-3.5 h-3.5 ${isCompleted || isCurrent ? 'text-white' : 'text-gray-400'}`} />
                         </div>
                         
                         <div>
                           <h3 className={`font-bold ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</h3>
                           <p className="text-sm text-gray-500">{isCompleted ? step.time : '...'}</p>
                         </div>
                       </div>
                     );
                  })}
                </div>
              </div>

              {/* Delivery Partner Details (Mock) */}
              {(orderStatus === 'out_for_delivery' || orderStatus === 'delivered') && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                      <img src="https://ui-avatars.com/api/?name=Ravi+Kumar&background=random" alt="Driver" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Ravi Kumar</h4>
                      <p className="text-xs text-gray-500">Delivery Partner • ★ 4.8</p>
                    </div>
                  </div>
                  <button className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors">
                    <PhoneCall className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

            </div>
          </div>

          {/* Map View Pane */}
          <div className="w-full lg:w-2/3 h-[500px] lg:h-auto min-h-[600px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
            {/* 
              In a real application, we would use react-google-maps or leaflets here.
              For this mockup, we'll use a stylized static image mimicking a live map 
              with a moving marker if location updates.
            */}
            <div className="absolute inset-0 bg-gray-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5925348842!2d77.6384!3d12.9344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU2JzA0LjMiTiA3N8KwMzgnMTguMiJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(0.5) contrast(1.2)' }} 
                allowFullScreen={false} 
                loading="lazy"
              ></iframe>

              {/* Mock Overlay elements on map */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100 max-w-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="text-[var(--color-primary)] w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Delivery Address</p>
                    <p className="text-sm font-medium text-gray-900">Apt 4B, 123 Tech Park Road, HSR Layout, Sector 2</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
