import Link from 'next/link';
import { Star, Clock, MapPin, Search, Filter } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Use same mock data structure as Admin for now
const mockRestaurants = [
  { id: '1', name: 'Spice Garden', cuisine: 'North Indian', rating: 4.8, time: '30-40 min', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80', location: 'Indiranagar' },
  { id: '2', name: 'Burger King', cuisine: 'Fast Food', rating: 4.2, time: '20-30 min', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80', location: 'Koramangala' },
  { id: '3', name: 'Cafe Mocha', cuisine: 'Desserts', rating: 4.6, time: '40-50 min', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80', location: 'Jayanagar' },
  { id: '4', name: 'Sushi Zen', cuisine: 'Japanese', rating: 4.9, time: '35-45 min', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80', location: 'MG Road' },
  { id: '5', name: 'Pizza Hub', cuisine: 'Italian', rating: 4.1, time: '25-35 min', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80', location: 'BTM Layout' },
  { id: '6', name: 'Healthy Bowl', cuisine: 'Healthy', rating: 4.5, time: '15-25 min', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', location: 'HSR Layout' },
];

export default function RestaurantsPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold font-outfit text-gray-900 leading-tight">Restaurants Delivery in Bangalore</h1>
              <p className="text-gray-500 mt-2">Find the best food combinations nearby.</p>
            </div>
            
            <div className="flex gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search restaurants..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                />
              </div>
              <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {['All', 'Pure Veg', 'Fast Delivery', 'Great Offers', 'Rating 4.0+', 'New Arrivals'].map((f, i) => (
              <button key={i} className={`whitespace-nowrap px-5 py-2 rounded-full font-medium text-sm transition-colors ${i === 0 ? 'bg-gray-900 text-white' : 'bg-white border text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {mockRestaurants.map((restaurant) => (
              <Link href={`/restaurants/${restaurant.id}`} key={restaurant.id} className="group">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-100">
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1 z-10">
                    <Star className="w-3.5 h-3.5 text-green-600 fill-green-600" /> {restaurant.rating}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1 z-10">
                    <Clock className="w-3.5 h-3.5 text-gray-500" /> {restaurant.time}
                  </div>
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500 ease-in-out" style={{ backgroundImage: `url(${restaurant.image})` }} />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-bold font-outfit text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{restaurant.name}</h3>
                
                <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
                  <span className="line-clamp-1">{restaurant.cuisine}</span>
                  <span className="flex-shrink-0 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {restaurant.location}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          
        </div>
      </main>

      <Footer />
    </>
  );
}
