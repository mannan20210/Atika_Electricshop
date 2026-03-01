import React, { useState } from 'react';
import { Plus, Search, Receipt, Calendar, Tag, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Expenses() {
  const { expenses, addExpense, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: 0,
    category: 'Utilities',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addExpense(newExpense);
      setIsModalOpen(false);
      setNewExpense({ description: '', amount: 0, category: 'Utilities', date: new Date().toISOString().split('T')[0] });
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('খরচ যোগ করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">মোট মাসিক খরচ</p>
            <p className="text-xl font-black text-rose-600">{formatCurrency(expenses.reduce((acc, e) => acc + e.amount, 0))}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          খরচ যোগ করুন
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500">লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">বিবরণ</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ক্যাটাগরি</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">তারিখ</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">পরিমাণ</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-slate-500">এখনো কোনো খরচ রেকর্ড করা হয়নি।</td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                            <Receipt className="w-5 h-5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-semibold text-slate-900">{expense.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          {expense.category === 'Utilities' ? 'ইউটিলিটি' : expense.category === 'Rent' ? 'ভাড়া' : expense.category === 'Salaries' ? 'বেতন' : expense.category === 'Inventory Purchase' ? 'ইনভেন্টরি ক্রয়' : expense.category === 'Marketing' ? 'মার্কেটিং' : 'অন্যান্য'}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-slate-600 text-sm">
                        {new Date(expense.date).toLocaleDateString('bn-BD')}
                      </td>
                      <td className="px-8 py-4 font-bold text-rose-600">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-8 py-4">
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
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
                <h3 className="text-xl font-bold text-slate-900">নতুন খরচ যোগ করুন</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <Plus className="w-6 h-6 rotate-45 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">বিবরণ</label>
                  <input
                    type="text"
                    required
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="যেমন: বিদ্যুৎ বিল"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">পরিমাণ</label>
                    <input
                      type="number"
                      required
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">ক্যাটাগরি</label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Utilities">ইউটিলিটি</option>
                      <option value="Rent">ভাড়া</option>
                      <option value="Salaries">বেতন</option>
                      <option value="Inventory Purchase">ইনভেন্টরি ক্রয়</option>
                      <option value="Marketing">মার্কেটিং</option>
                      <option value="Other">অন্যান্য</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">তারিখ</label>
                  <input
                    type="date"
                    required
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
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
                    {isSubmitting ? 'সেভ হচ্ছে...' : 'খরচ সেভ করুন'}
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
