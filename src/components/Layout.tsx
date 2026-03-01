import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Receipt, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  FileText,
  Printer,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { name: 'ড্যাশবোর্ড', path: '/', icon: LayoutDashboard },
  { name: 'ইনভেন্টরি', path: '/inventory', icon: Package },
  { name: 'বিক্রয়', path: '/sales', icon: ShoppingCart },
  { name: 'কাস্টমার', path: '/customers', icon: Users },
  { name: 'খরচ', path: '/expenses', icon: Receipt },
  { name: 'রিপোর্ট', path: '/reports', icon: BarChart3 },
  { name: 'ইনভয়েস', path: '/invoice', icon: FileText },
  { name: 'প্রিন্টেড', path: '/printed', icon: Printer },
  { name: 'সেটিংস', path: '/settings', icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for Desktop */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:relative lg:translate-x-0 no-print",
          !isSidebarOpen && "-translate-x-full lg:w-20"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-bottom border-slate-100">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            {isSidebarOpen && (
              <span className="ml-3 font-bold text-slate-800 truncate">আতিকা ইলেকট্রিক</span>
            )}
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-xl transition-colors group",
                    isActive 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                  {isSidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
                  {isActive && isSidebarOpen && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Logout */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center px-2 py-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                {user?.email[0].toUpperCase()}
              </div>
              {isSidebarOpen && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-slate-900 truncate">{user?.business_name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center px-3 py-2 mt-2 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors",
                !isSidebarOpen && "justify-center"
              )}
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span className="ml-3 font-medium">লগআউট</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 no-print">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 lg:block"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="ml-4 text-lg font-semibold text-slate-800">
              {navItems.find(item => item.path === location.pathname)?.name || 'Page'}
            </h1>
          </div>
          
          <div className="flex items-center space-y-4">
            {/* Search or notifications could go here */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
