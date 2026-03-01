import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ShoppingCart, User, CreditCard, Banknote, Send, Trash2, Package, Eye } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Sales() {
  const { products, customers, sales, addSale, loading } = useData();
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cart, setCart] = useState<{product_id: string, quantity: number}[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');

  const addToCart = (productId: string) => {
    const existing = cart.find(item => item.product_id === productId);
    if (existing) {
      setCart(cart.map(item => item.product_id === productId ? {...item, quantity: item.quantity + 1} : item));
    } else {
      setCart([...cart, { product_id: productId, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const product = products.find(p => p.id === item.product_id);
      return acc + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleCompleteSale = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    try {
      const saleItems = cart.map(item => {
        const product = products.find(p => p.id === item.product_id)!;
        return {
          product_id: item.product_id,
          product_name: product.name,
          quantity: item.quantity,
          unit_price: product.price,
          subtotal: product.price * item.quantity
        };
      });

      await addSale({
        customer_id: selectedCustomerId || undefined,
        items: saleItems,
        total_amount: calculateTotal(),
        discount: 0,
        payment_method: paymentMethod,
        status: 'completed'
      });
      
      setCart([]);
      setSelectedCustomerId('');
      setIsNewSaleModalOpen(false);
    } catch (error) {
      console.error('Error completing sale:', error);
      alert('বিক্রয় সম্পন্ন করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">বিক্রয়ের ইতিহাস</h2>
        <button 
          onClick={() => setIsNewSaleModalOpen(true)}
          className="flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          নতুন বিক্রয়
        </button>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="বিক্রয় সার্চ করুন..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
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
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">বিক্রয় আইডি</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">কাস্টমার</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">তারিখ</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">পরিমাণ</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">স্ট্যাটাস</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">মাধ্যম</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sales.length === 0 ? (
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td colSpan={7} className="px-8 py-12 text-center text-slate-500">
                      লেনদেন রেকর্ড করা শুরু করতে "নতুন বিক্রয়" এ ক্লিক করুন।
                    </td>
                  </tr>
                ) : (
                  sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-4 font-bold text-slate-900">#{sale.id.substring(0, 8)}</td>
                      <td className="px-8 py-4 text-slate-600">
                        {customers.find(c => c.id === sale.customer_id)?.name || 'গেস্ট কাস্টমার'}
                      </td>
                      <td className="px-8 py-4 text-slate-500 text-sm">
                        {new Date(sale.created_at).toLocaleDateString('bn-BD')}
                      </td>
                      <td className="px-8 py-4 font-bold text-slate-900">{formatCurrency(sale.total_amount)}</td>
                      <td className="px-8 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                          সম্পন্ন
                        </span>
                      </td>
                      <td className="px-8 py-4 text-slate-600 text-sm capitalize">
                        {sale.payment_method === 'cash' ? 'নগদ' : sale.payment_method === 'card' ? 'কার্ড' : 'ট্রান্সফার'}
                      </td>
                      <td className="px-8 py-4">
                        <Link 
                          to={`/invoice?id=${sale.id}`}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity inline-block"
                          title="ইনভয়েস দেখুন"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Sale Modal */}
      <AnimatePresence>
        {isNewSaleModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* Product Selection */}
              <div className="flex-1 p-6 border-r border-slate-100 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">প্রোডাক্ট নির্বাচন করুন</h3>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="সার্চ করুন..."
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>কোনো প্রোডাক্ট পাওয়া যায়নি। অনুগ্রহ করে প্রথমে ইনভেন্টরিতে প্রোডাক্ট যোগ করুন।</p>
                    </div>
                  ) : (
                    products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product.id)}
                        className="p-4 bg-white border border-slate-100 rounded-2xl text-left hover:border-indigo-500 hover:shadow-md transition-all group"
                      >
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 mb-3 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                          <ShoppingCart className="w-5 h-5" />
                        </div>
                        <p className="font-bold text-slate-900 text-sm line-clamp-1">{product.name}</p>
                        <p className="text-xs text-slate-500 mb-2">{product.category}</p>
                        <p className="text-lg font-black text-indigo-600">{formatCurrency(product.price)}</p>
                        <p className="text-[10px] text-slate-400 mt-1">স্টক: {product.stock} {product.unit === 'pcs' ? 'পিস' : product.unit === 'roll' ? 'রোল' : product.unit === 'meter' ? 'মিটার' : 'বক্স'}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="w-full md:w-96 bg-slate-50 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">কার্ট সামারি</h3>
                  <button onClick={() => setIsNewSaleModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                    <Plus className="w-6 h-6 rotate-45 text-slate-400" />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">কাস্টমার</label>
                  <select 
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="">গেস্ট কাস্টমার</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 mb-6">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
                      <p className="text-sm">আপনার কার্ট খালি</p>
                    </div>
                  ) : (
                    cart.map((item) => {
                      const product = products.find(p => p.id === item.product_id);
                      if (!product) return null;
                      return (
                        <div key={item.product_id} className="bg-white p-3 rounded-xl flex items-center justify-between shadow-sm">
                          <div className="flex-1 min-w-0 mr-3">
                            <p className="text-sm font-bold text-slate-900 truncate">{product.name}</p>
                            <p className="text-xs text-slate-500">{item.quantity} x {formatCurrency(product.price)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-900">{formatCurrency(product.price * item.quantity)}</p>
                            <button 
                              onClick={() => removeFromCart(product.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">সাবটোটাল</span>
                    <span className="text-slate-900 font-bold">{formatCurrency(calculateTotal())}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">ডিসকাউন্ট</span>
                    <span className="text-emerald-600 font-bold">-{formatCurrency(0)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="text-lg font-bold text-slate-900">মোট</span>
                    <span className="text-2xl font-black text-indigo-600">{formatCurrency(calculateTotal())}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-4">
                    <button 
                      onClick={() => setPaymentMethod('cash')}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                        paymentMethod === 'cash' ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <Banknote className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold uppercase">নগদ</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                        paymentMethod === 'card' ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <CreditCard className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold uppercase">কার্ড</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('transfer')}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                        paymentMethod === 'transfer' ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <Send className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold uppercase">ট্রান্সফার</span>
                    </button>
                  </div>

                  <button 
                    onClick={handleCompleteSale}
                    disabled={cart.length === 0 || isSubmitting}
                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                  >
                    {isSubmitting ? 'প্রসেসিং হচ্ছে...' : 'বিক্রয় সম্পন্ন করুন'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
