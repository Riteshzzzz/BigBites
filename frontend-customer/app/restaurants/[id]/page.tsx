"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Star, Clock, MapPin, Search, Info, Plus } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useCartStore } from '../../../store/cartStore';

// Use same mock data structure
const mockRestaurant = { 
  id: '1', 
  name: 'Spice Garden', 
  cuisine: 'North Indian, Chinese', 
  rating: 4.8, 
  reviewCount: 420,
  time: '30-40 min', 
  location: '123 Food Street, Indiranagar',
  image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
  minimumOrder: 150,
  deliveryFee: 40
};

const mockMenuCategories = [
  {
    name: 'Recommended',
    items: [
      { id: 'm1', name: 'Veg Biryani', desc: 'Aromatic basmati rice cooked with fresh vegetables and secret spices.', price: 220, type: 'veg', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80' },
      { id: 'm2', name: 'Paneer Butter Masala', desc: 'Cottage cheese cubes in a rich tomato and butter gravy.', price: 280, type: 'veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&w=300&q=80' },
      { id: 'm3', name: 'Chicken Tikka Masala', desc: 'Roasted marinated chicken chunks in spiced curry sauce.', price: 320, type: 'non-veg', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=300&q=80' },
    ]
  },
  {
    name: 'Starters',
    items: [
      { id: 'm4', name: 'Crispy Corn', desc: 'Fried corn kernels tossed with spices.', price: 180, type: 'veg', image: null },
      { id: 'm5', name: 'Chicken 65', desc: 'Spicy, deep-fried chicken dish originating from Chennai.', price: 240, type: 'non-veg', image: null },
    ]
  }
];

export default function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const [activeCategory, setActiveCategory] = useState(mockMenuCategories[0].name);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      restaurantId: mockRestaurant.id,
      restaurantName: mockRestaurant.name
    });
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-20 pb-20 bg-gray-50">
        
        {/* Restaurant Header */}
        <div className="bg-white px-4 sm:px-6 lg:px-8 py-8 md:py-12 border-b border-gray-200">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb could go here */}
            
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-sm">
                <Image src={mockRestaurant.image} alt={mockRestaurant.name} fill className="object-cover" />
              </div>
              
              <div className="flex-1 w-full flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start">
                    <h1 className="text-3xl md:text-4xl font-bold font-outfit text-gray-900 mb-2">{mockRestaurant.name}</h1>
                    <div className="bg-green-600 text-white flex flex-col items-center justify-center p-2 rounded-lg shadow-sm w-16 h-16 flex-shrink-0">
                      <div className="flex items-center font-bold text-lg leading-none mb-1">
                        {mockRestaurant.rating} <Star className="w-4 h-4 ml-0.5 fill-white" />
                      </div>
                      <span className="text-[10px] font-medium border-t border-white/30 w-full text-center pt-1">{mockRestaurant.reviewCount}+</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-lg mb-4">{mockRestaurant.cuisine}</p>
                  
                  <div className="flex flex-col gap-2 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-[var(--color-primary)] flex-shrink-0" />
                      {mockRestaurant.location}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-[var(--color-primary)] flex-shrink-0" />
                      Open now • {mockRestaurant.time}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <span className="font-bold">₹</span>
                    </div>
                    <div>
                      <p className="text-gray-900">₹{mockRestaurant.minimumOrder}</p>
                      <p className="text-gray-500 text-xs font-normal">Min. Order</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <span className="font-bold">₹</span>
                    </div>
                    <div>
                      <p className="text-gray-900">₹{mockRestaurant.deliveryFee}</p>
                      <p className="text-gray-500 text-xs font-normal">Delivery Fee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Layout */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for dishes..." 
              className="w-full pl-12 pr-4 py-3 bg-white shadow-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar Categories (Desktop) */}
            <div className="hidden md:block w-48 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 font-bold font-outfit text-gray-900">
                  Menu
                </div>
                <div className="flex flex-col py-2">
                  {mockMenuCategories.map((cat) => (
                    <button 
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`text-left px-4 py-3 text-sm transition-colors border-l-4 ${
                        activeCategory === cat.name 
                          ? 'border-[var(--color-primary)] text-[var(--color-primary)] font-semibold bg-[var(--color-primary)]/5' 
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Menu Items List */}
            <div className="flex-1 min-w-0">
              {mockMenuCategories.map((category) => (
                <div key={category.name} id={category.name} className="mb-12">
                  <h2 className="text-2xl font-bold font-outfit text-gray-900 mb-6 pb-2 border-b-2 border-gray-200">{category.name}</h2>
                  
                  <div className="flex flex-col gap-6">
                    {category.items.map((item) => (
                      <div key={item.id} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 flex gap-4 sm:gap-6 group hover:shadow-md transition-shadow">
                        
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {/* Veg / Non-veg Indicator */}
                              <div className={`w-4 h-4 rounded-sm border ${item.type === 'veg' ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
                                <div className={`w-2 h-2 rounded-full ${item.type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                              </div>
                              <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-[var(--color-primary)] transition-colors">{item.name}</h3>
                            </div>
                            <p className="text-gray-900 font-medium mb-3">₹{item.price}</p>
                            <p className="text-gray-500 text-sm line-clamp-2 pr-4">{item.desc}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-3">
                          {item.image ? (
                            <div className="relative w-28 sm:w-36 aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-200 flex-shrink-0">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-28 sm:w-36 h-0 flex-shrink-0"></div>
                          )}
                          
                          <button 
                            onClick={() => handleAddToCart(item)}
                            className={`relative ${item.image ? '-mt-6' : 'mt-0'} bg-white text-green-600 border border-green-600 px-6 py-1.5 rounded-lg shadow-sm font-bold text-sm hover:bg-green-50 uppercase tracking-widest transition-colors z-10 w-24 flex items-center justify-center gap-1 hover:scale-105 active:scale-95`}
                          >
                            ADD <Plus className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2" />
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
