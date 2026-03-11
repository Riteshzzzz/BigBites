"use client";

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Tag, Percent } from 'lucide-react';

const mockMenuItems = [
  { id: 'MNU-1', name: 'Veg Biryani', category: 'Main Course', price: 200, status: 'Active', restaurant: 'Spice Garden' },
  { id: 'MNU-2', name: 'Paneer Tikka', category: 'Starters', price: 250, status: 'Active', restaurant: 'Spice Garden' },
  { id: 'MNU-3', name: 'Chicken Burger', category: 'Fast Food', price: 150, status: 'Active', restaurant: 'Burger King' },
  { id: 'MNU-4', name: 'Cold Coffee', category: 'Beverages', price: 120, status: 'Inactive', restaurant: 'Cafe Mocha' },
  { id: 'MNU-5', name: 'Chocolate Brownie', category: 'Desserts', price: 180, status: 'Active', restaurant: 'Cafe Mocha' },
];

export default function MenuItemsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-gray-900">Menu Items</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all food items across restaurants.</p>
        </div>
        <button className="flex items-center bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-5 h-5 mr-1" />
          Add Item
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search items by name, category, or restaurant..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex shadow-sm rounded-lg border border-gray-300 overflow-hidden">
            <button className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-900 border-r border-gray-300">All Items</button>
            <button className="px-4 py-2 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">Categories</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockMenuItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
                        {/* Image Placeholder */}
                        <span className="text-gray-400 font-bold text-xs">{item.name.substring(0,2)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.restaurant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Tag className="w-4 h-4 mr-1.5 text-gray-400" />
                      {item.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    ₹{item.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1.5 rounded-md hover:bg-blue-100 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md hover:bg-red-100 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-sm text-gray-500">Showing 1 to 5 of 5 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 bg-white opacity-50 cursor-not-allowed">Prev</button>
            <button className="px-3 py-1 border border-[var(--color-primary)] rounded text-sm text-white bg-[var(--color-primary)]">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
