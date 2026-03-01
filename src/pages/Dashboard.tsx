import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  ShoppingCart
} from 'lucide-react';
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
  AreaChart,
  Area
} from 'recharts';

export default function Dashboard() {
  const { products, customers, sales, expenses, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">ড্যাশবোর্ড লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // Calculate chart data from sales
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  }).reverse();

  const chartData = last7Days.map(day => {
    const daySales = sales.filter(s => {
      const saleDate = new Date(s.created_at).toLocaleDateString('en-US', { weekday: 'short' });
      return saleDate === day;
    });
    return {
      name: day,
      sales: daySales.reduce((acc, s) => acc + s.total_amount, 0)
    };
  });

  const totalSales = sales.reduce((acc, curr) => acc + curr.total_amount, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const profit = totalSales - totalExpenses;

  const stats = [
    { 
      name: 'মোট বিক্রয়', 
      value: formatCurrency(totalSales), 
      change: '+12.5%', 
      trend: 'up', 
      icon: ShoppingCart,
      color: 'bg-emerald-50 text-emerald-600'
    },
    { 
      name: 'মোট খরচ', 
      value: formatCurrency(totalExpenses), 
      change: '+3.2%', 
      trend: 'up', 
      icon: TrendingDown,
      color: 'bg-rose-50 text-rose-600'
    },
    { 
      name: 'নিট লাভ', 
      value: formatCurrency(profit), 
      change: '+18.4%', 
      trend: 'up', 
      icon: TrendingUp,
      color: 'bg-indigo-50 text-indigo-600'
    },
    { 
      name: 'সক্রিয় কাস্টমার', 
      value: customers.length.toString(), 
      change: '+4', 
      trend: 'up', 
      icon: Users,
      color: 'bg-amber-50 text-amber-600'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4 ml-1" /> : <ArrowDownRight className="w-4 h-4 ml-1" />}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">বিক্রয়ের ওভারভিউ</h3>
              <p className="text-sm text-slate-500">সাপ্তাহিক আয়ের পারফরম্যান্স</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500">
              <option>গত ৭ দিন</option>
              <option>গত ৩০ দিন</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">কম স্টকের সতর্কতা</h3>
          <div className="space-y-6">
            {products.filter(p => p.stock < 50).slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-rose-600">{product.stock} {product.unit}</p>
                  <p className="text-xs text-slate-400">অবশিষ্ট</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
            ইনভেন্টরি দেখুন
          </button>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">সাম্প্রতিক বিক্রয়</h3>
          <button className="text-indigo-600 font-bold text-sm hover:underline">সব দেখুন</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">কাস্টমার</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">তারিখ</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">পরিমাণ</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">স্ট্যাটাস</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">মাধ্যম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-500">এখনো কোনো বিক্রয় রেকর্ড করা হয়নি।</td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 font-medium text-slate-900">
                      {customers.find(c => c.id === sale.customer_id)?.name || 'গেস্ট কাস্টমার'}
                    </td>
                    <td className="px-8 py-4 text-slate-600 text-sm">
                      {new Date(sale.created_at).toLocaleDateString('bn-BD')}
                    </td>
                    <td className="px-8 py-4 font-bold text-slate-900">
                      {formatCurrency(sale.total_amount)}
                    </td>
                    <td className="px-8 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                        সম্পন্ন
                      </span>
                    </td>
                    <td className="px-8 py-4 text-slate-600 text-sm capitalize">
                      {sale.payment_method === 'cash' ? 'নগদ' : sale.payment_method === 'card' ? 'কার্ড' : 'ট্রান্সফার'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
