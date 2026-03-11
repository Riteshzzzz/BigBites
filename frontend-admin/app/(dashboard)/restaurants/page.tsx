"use client";

import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Star, Clock } from 'lucide-react';

// Mock data based on INSTRUCTION.md schema
const mockRestaurants = [
  {
    id: 'REST-001',
    name: 'Spice Garden',
    cuisine: ['North Indian', 'Chinese'],
    rating: 4.5,
    totalReviews: 234,
    isOpen: true,
    deliveryTime: '30-40 min',
    location: 'Indiranagar, Bangalore'
  },
  {
    id: 'REST-002',
    name: 'Burger King',
    cuisine: ['Fast Food', 'Beverages'],
    rating: 4.2,
    totalReviews: 890,
    isOpen: true,
    deliveryTime: '20-30 min',
    location: 'Koramangala, Bangalore'
  },
  {
    id: 'REST-003',
    name: 'Cafe Mocha',
    cuisine: ['Continental', 'Desserts'],
    rating: 4.7,
    totalReviews: 156,
    isOpen: false,
    deliveryTime: '45-55 min',
    location: 'Jayanagar, Bangalore'
  }
];

export default function RestaurantsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-gray-900">Restaurants</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all restaurant profiles and settings.</p>
        </div>
        <button className="flex items-center bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-5 h-5 mr-1" />
          Add Restaurant
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search restaurants..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white">
              <Filter className="w-4 h-4 mr-2 text-gray-500" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white">
              <div className="h-32 bg-gray-200 relative">
                {/* Placeholder for cover image */}
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  {restaurant.rating}
                </div>
                {!restaurant.isOpen && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-full">CLOSED</span>
                  </div>
                )}
              </div>
              <div className="p-5 relative">
                <div className="absolute -top-10 left-5 w-16 h-16 bg-white rounded-lg shadow-md border border-gray-100 flex items-center justify-center font-bold text-xl text-gray-300 overflow-hidden">
                  {/* Logo placeholder */}
                  {restaurant.name.charAt(0)}
                </div>
                
                <div className="flex justify-end mb-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 font-poppins">{restaurant.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{restaurant.location}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {restaurant.cuisine.map(c => (
                    <span key={c} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {c}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm">
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {restaurant.deliveryTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
