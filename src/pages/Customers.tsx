import React, { useState } from 'react';
import { Plus, Search, User, Phone, Mail, MapPin, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Customers() {
  const { customers, sales, addCustomer, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addCustomer(newCustomer);
      setIsModalOpen(false);
      setNewCustomer({ name: '', phone: '', email: '', address: '' });
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('কাস্টমার যোগ করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="কাস্টমার সার্চ করুন..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          কাস্টমার যোগ করুন
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-20 text-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500">লোড হচ্ছে...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="col-span-full p-20 text-center bg-white rounded-3xl border border-slate-100">
            <p className="text-slate-500">কোনো কাস্টমার পাওয়া যায়নি।</p>
          </div>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm card-hover relative group">
              <button className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-5 h-5" />
              </button>
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-xl font-bold">
                  {customer.name[0]}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-slate-900">{customer.name}</h3>
                  <p className="text-sm text-slate-500">কাস্টমার আইডি: {customer.id.substring(0, 8)}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-slate-600">
                  <Phone className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="text-sm font-medium">{customer.phone}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center text-slate-600">
                    <Mail className="w-4 h-4 mr-3 text-slate-400" />
                    <span className="text-sm font-medium">{customer.email}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center text-slate-600">
                    <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                    <span className="text-sm font-medium line-clamp-1">{customer.address}</span>
                  </div>
                )}
              </div>
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট অর্ডার</div>
                <div className="text-sm font-black text-slate-900">
                  {sales.filter(s => s.customer_id === customer.id).length} বিক্রয়
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">নতুন কাস্টমার যোগ করুন</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <Plus className="w-6 h-6 rotate-45 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">পুরো নাম</label>
                  <input
                    type="text"
                    required
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">ফোন নম্বর</label>
                  <input
                    type="tel"
                    required
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">ইমেইল ঠিকানা (ঐচ্ছিক)</label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">ঠিকানা</label>
                  <textarea
                    rows={3}
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    বাতিল
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'সেভ হচ্ছে...' : 'কাস্টমার সেভ করুন'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
