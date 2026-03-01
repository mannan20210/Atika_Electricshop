import React from 'react';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Download, Filter, Calendar } from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export default function Reports() {
  const { sales, expenses, products, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">রিপোর্ট লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // Calculate sales by category
  const categorySalesMap: Record<string, number> = {};
  // Since we don't store items in sales, we'll estimate based on products
  // In a real app, you'd iterate over sale items
  products.forEach(p => {
    if (!categorySalesMap[p.category]) categorySalesMap[p.category] = 0;
  });

  // For demo purposes, if sales exist, distribute them among categories
  const totalSales = sales.reduce((acc, s) => acc + s.total_amount, 0);
  const categories = Object.keys(categorySalesMap);
  
  const categoryData = categories.map((cat, idx) => ({
    name: cat,
    value: totalSales > 0 ? (totalSales / categories.length) : 0
  })).filter(d => d.value > 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">ব্যবসায়িক রিপোর্ট</h2>
          <p className="text-sm text-slate-500">আপনার দোকানের পারফরম্যান্স বিশ্লেষণ করুন</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors">
            <Calendar className="w-4 h-4 mr-2" />
            এই মাস
          </button>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            পিডিএফ এক্সপোর্ট
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales by Category */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8">ক্যাটাগরি অনুযায়ী বিক্রয়</h3>
          <div className="h-[300px]">
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
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit & Loss Summary */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8">লাভ ও ক্ষতির সামারি</h3>
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট রাজস্ব</p>
                <p className="text-2xl font-black text-slate-900">{formatCurrency(sales.reduce((acc, s) => acc + s.total_amount, 0))}</p>
              </div>
              <div className="text-emerald-600 font-bold">+১৫%</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট খরচ</p>
                <p className="text-2xl font-black text-slate-900">{formatCurrency(expenses.reduce((acc, e) => acc + e.amount, 0))}</p>
              </div>
              <div className="text-rose-600 font-bold">+৫%</div>
            </div>
            <div className="p-6 bg-indigo-600 rounded-2xl flex items-center justify-between text-white shadow-lg shadow-indigo-200">
              <div>
                <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider">নিট লাভ</p>
                <p className="text-3xl font-black">{formatCurrency(sales.reduce((acc, s) => acc + s.total_amount, 0) - expenses.reduce((acc, e) => acc + e.amount, 0))}</p>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">লক্ষ্য: ৮৫%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
