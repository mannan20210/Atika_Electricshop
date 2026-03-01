import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Building2, Bell, Shield, Palette, Globe, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [businessName, setBusinessName] = useState(user?.business_name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user?.business_name) {
      setBusinessName(user.business_name);
    }
  }, [user]);

  const handleSave = async () => {
    if (!businessName.trim()) return;
    
    setIsSaving(true);
    setMessage(null);
    try {
      await updateProfile(businessName);
      setMessage({ type: 'success', text: 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <h3 className="text-lg font-bold text-slate-900">ব্যবসায়িক প্রোফাইল</h3>
          <p className="text-sm text-slate-500">আপনার দোকানের তথ্য এবং ব্র্যান্ডিং পরিচালনা করুন</p>
        </div>
        <div className="p-8 space-y-6">
          {message && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ব্যবসার নাম</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ইমেইল ঠিকানা</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving || !businessName.trim()}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? 'সেভ হচ্ছে...' : 'পরিবর্তনগুলো সেভ করুন'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl mr-4">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">নোটিফিকেশন</h4>
              <p className="text-xs text-slate-500">অ্যালার্ট এবং আপডেট কনফিগার করুন</p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
              <span className="text-sm font-medium text-slate-700">কম স্টকের অ্যালার্ট</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-indigo-600" />
            </label>
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
              <span className="text-sm font-medium text-slate-700">দৈনিক বিক্রয় রিপোর্ট</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-indigo-600" />
            </label>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl mr-4">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">সিকিউরিটি</h4>
              <p className="text-xs text-slate-500">আপনার অ্যাকাউন্ট সুরক্ষিত রাখুন</p>
            </div>
          </div>
          <button className="w-full py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
            পাসওয়ার্ড পরিবর্তন করুন
          </button>
          <button className="w-full mt-3 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
            টু-ফ্যাক্টর অথেনটিকেশন
          </button>
        </div>
      </div>
    </div>
  );
}
