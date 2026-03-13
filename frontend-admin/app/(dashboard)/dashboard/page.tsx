"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Store
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const fallbackRevenueData = [
  { name: 'Mon', total: 0 },
  { name: 'Tue', total: 0 },
  { name: 'Wed', total: 0 },
  { name: 'Thu', total: 0 },
  { name: 'Fri', total: 0 },
  { name: 'Sat', total: 0 },
  { name: 'Sun', total: 0 },
];

const fallbackCategoryData = [
  { name: 'No Data', value: 100 }
];

const COLORS = ['#FF6B35', '#004E89', '#2ECC71', '#F39C12'];

const fallbackRecentOrders: any[] = [];

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalRestaurants: 0, totalCustomers: 0 });
  const [revenueData, setRevenueData] = useState(fallbackRevenueData);
  const [categoryData, setCategoryData] = useState(fallbackCategoryData);
  const [recentOrders, setRecentOrders] = useState(fallbackRecentOrders);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = Cookies.get('token') || localStorage.getItem('adminToken');
        if (!token) {
          router.push('/login');
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${apiUrl}/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setStats(res.data.data.stats);
          setRecentOrders(res.data.data.recentOrders);
          
          if (res.data.data.revenueByDay && res.data.data.revenueByDay.length > 0) {
              setRevenueData(res.data.data.revenueByDay.map((item: any) => ({ name: item._id.split('-')[2], total: item.revenue })));
          }
          
          if (res.data.data.categoryData && res.data.data.categoryData.length > 0) {
              setCategoryData(res.data.data.categoryData);
          }
        }
      } catch (err) {
        console.error('Failed to fetch analytics', err);
        // If unauthorized, redirect to login
        if (axios.isAxiosError(err) && err.response?.status === 401) {
             router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [router]);

  if (isLoading) {
    return <div className="flex h-[80vh] items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, Admin! Here's what's happening today.</p>
        </div>
        
        <div className="flex bg-white border border-gray-200 rounded-lg p-1 w-max">
          <button className="px-4 py-1.5 text-sm font-medium bg-gray-100 rounded-md shadow-sm text-gray-900">Today</button>
          <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">7 Days</button>
          <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">30 Days</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5 hidden md:block select-none" />
        
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-[var(--color-primary)]/10 rounded-md p-3">
              <DollarSign className="h-6 w-6 text-[var(--color-primary)]" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <ArrowUpRight className="self-center flex-shrink-0 h-4 w-4" />
                    12%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <ArrowUpRight className="self-center flex-shrink-0 h-4 w-4" />
                    5.4%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5">
          <div className="flex items-center">
             <div className="flex-shrink-0 bg-orange-100 rounded-md p-3">
              <Store className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Restaurants</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalRestaurants}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-5 lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4 font-poppins">Revenue Trend</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dx={-10} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="total" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4 font-poppins">Popular Categories</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.map((category, idx) => (
              <div key={category.name} className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-xs text-gray-600 truncate">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 font-poppins">Recent Orders</h2>
          <button className="text-sm text-[var(--color-primary)] font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                 <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">No recent orders found.</td></tr>
              ) : recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderID}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerID?.name || 'Guest'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.restaurantID?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">₹{order.totalAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' : 
                        order.orderStatus === 'preparing' ? 'bg-blue-100 text-blue-800' :
                        order.orderStatus === 'out_for_delivery' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
