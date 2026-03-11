"use client";

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Phone, 
  Mail, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Paperclip,
  Send
} from 'lucide-react';
import Image from 'next/image';

const mockTickets = [
  { id: 'TKT-1042', customer: 'Sarah Jenkins', subject: 'Order #ORD-1892 extremely late', status: 'Open', priority: 'High', time: '10 mins ago' },
  { id: 'TKT-1041', customer: 'Mike Ross', subject: 'Missing item in the delivery', status: 'In Progress', priority: 'Medium', time: '1 hour ago' },
  { id: 'TKT-1040', customer: 'Anita Desai', subject: 'Payment deducted but order failed', status: 'Open', priority: 'Critical', time: '2 hours ago' },
  { id: 'TKT-1039', customer: 'Rahul Sharma', subject: 'Restaurant cancelled my order', status: 'Closed', priority: 'Medium', time: 'Yesterday' },
  { id: 'TKT-1038', customer: 'Jessica Alba', subject: 'Quality issue with the food', status: 'Closed', priority: 'Low', time: 'Yesterday' },
];

export default function SupportPage() {
  const [activeTicket, setActiveTicket] = useState(mockTickets[0]);

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-gray-900">Customer Support</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and resolve customer issues</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 min-h-0">
        
        {/* Left Side: Ticket List */}
        <div className="w-full md:w-1/3 border-r border-gray-100 flex flex-col h-full hidden md:flex">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tickets..."
                className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button className="text-sm font-bold text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] pb-1">Unresolved (3)</button>
              <button className="text-sm font-medium text-gray-500 hover:text-gray-900 pb-1">All Tickets</button>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 p-2">
            {mockTickets.map((ticket) => (
              <div 
                key={ticket.id}
                onClick={() => setActiveTicket(ticket)}
                className={`p-3 rounded-xl cursor-pointer mb-2 transition-colors border ${activeTicket.id === ticket.id ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)]/30' : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-gray-500">{ticket.id}</span>
                  <span className="text-xs text-gray-400">{ticket.time}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">{ticket.subject}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-600 font-medium">{ticket.customer}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                    ${ticket.priority === 'Critical' ? 'bg-red-100 text-red-700' : 
                      ticket.priority === 'High' ? 'bg-orange-100 text-orange-700' : 
                      'bg-blue-100 text-blue-700'}`}
                  >
                    {ticket.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Chat / Ticket View */}
        <div className="w-full md:w-2/3 flex flex-col h-full bg-[#f8fafc]">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-white flex justify-between items-center flex-shrink-0">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-lg font-bold text-gray-900">{activeTicket.subject}</h2>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                  ${activeTicket.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 
                    activeTicket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'}`}
                >
                  {activeTicket.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">Ticket {activeTicket.id} • Opened by <span className="font-bold text-gray-700">{activeTicket.customer}</span></p>
            </div>
            
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 bg-gray-50">
              <button className="p-2 text-gray-500 hover:text-[var(--color-primary)] hover:bg-white rounded-md transition-colors" title="Call Customer">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-[var(--color-primary)] hover:bg-white rounded-md transition-colors" title="Email Customer">
                <Mail className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-white rounded-md transition-colors" title="Mark Resolved">
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            <div className="flex justify-center">
              <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-medium">Today</span>
            </div>

            {/* Customer Message */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-700 font-bold text-sm">SJ</span>
              </div>
              <div className="flex flex-col gap-1 max-w-[80%]">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-gray-900">{activeTicket.customer}</span>
                  <span className="text-xs text-gray-500">10:42 AM</span>
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-gray-700 text-sm">
                  Hi, I ordered food almost an hour ago and it still shows as "Preparing". The estimated time was 30 minutes! Can you please check what's going on? Order #ORD-1892.
                </div>
              </div>
            </div>

            {/* System Message */}
            <div className="flex justify-center">
              <span className="text-xs text-gray-500 font-medium">Ticket assigned to You</span>
            </div>

          </div>

          {/* Reply Box */}
          <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
            <div className="flex gap-2">
              <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                placeholder="Type your reply here..." 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
              />
              <button className="p-3 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] rounded-full transition-colors flex-shrink-0">
                <Send className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
