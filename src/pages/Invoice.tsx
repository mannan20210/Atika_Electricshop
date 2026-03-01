import React, { useRef } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../lib/utils';
import { Printer, Download, Mail, FileText, Zap, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Invoice() {
  const { user } = useAuth();
  const { sales, customers, loading } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">ইনভয়েস লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }
  
  const searchParams = new URLSearchParams(location.search);
  const saleId = searchParams.get('id');
  
  const sale = saleId 
    ? sales.find(s => s.id === saleId) 
    : sales[0]; // Default to first (most recent) if no ID

  if (!sale) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
          <FileText className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">কোনো বিক্রয় পাওয়া যায়নি</h2>
        <p className="text-slate-500 mt-2">ইনভয়েস তৈরি করতে আগে একটি বিক্রয় সম্পন্ন করুন।</p>
        <button 
          onClick={() => navigate('/sales')}
          className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold"
        >
          বিক্রয় পেজে যান
        </button>
      </div>
    );
  }

  const invoiceData = {
    number: `INV-${sale.id.substring(0, 8).toUpperCase()}`,
    date: new Date(sale.created_at).toLocaleDateString('bn-BD'),
    customer: customers.find(c => c.id === sale.customer_id) || { name: 'গেস্ট কাস্টমার', address: '', phone: '' },
    items: sale.items || [],
    subtotal: sale.total_amount + sale.discount,
    discount: sale.discount,
    total: sale.total_amount
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!invoiceRef.current) return;
    
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${invoiceData.number}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('পিডিএফ ডাউনলোড করতে সমস্যা হয়েছে।');
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`ইনভয়েস - ${invoiceData.number}`);
    const body = encodeURIComponent(`আপনার ইনভয়েসটি সংযুক্ত করা হলো। ধন্যবাদ!`);
    window.location.href = `mailto:${invoiceData.customer.email || ''}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between no-print">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ফিরে যান
        </button>
        <div className="flex gap-3">
          <button 
            onClick={handleEmail}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            ইমেইল
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            ডাউনলোড
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            প্রিন্ট করুন
          </button>
        </div>
      </div>

      {/* Actual Invoice Card */}
      <div 
        ref={invoiceRef}
        className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl print:shadow-none print:border-none print:p-0"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-200">
              <Zap className="w-8 h-8 fill-current" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{user?.business_name || 'আতিকা ইলেকট্রিক'}</h1>
            <p className="text-slate-500 text-sm mt-1">প্রফেশনাল ইলেকট্রিক্যাল সাপ্লাই এবং সার্ভিস</p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-black text-slate-200 uppercase mb-2">ইনভয়েস</h2>
            <p className="text-slate-900 font-bold">#{invoiceData.number}</p>
            <p className="text-slate-500 text-sm">{invoiceData.date}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">বিল টু</p>
            <h3 className="text-lg font-bold text-slate-900">{invoiceData.customer.name}</h3>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">
              {invoiceData.customer.address || 'কোনো ঠিকানা দেওয়া হয়নি'}<br />
              {invoiceData.customer.phone}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="mb-12">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="py-4 text-left text-xs font-black text-slate-900 uppercase tracking-widest">বিবরণ</th>
                <th className="py-4 text-center text-xs font-black text-slate-900 uppercase tracking-widest">পরিমাণ</th>
                <th className="py-4 text-right text-xs font-black text-slate-900 uppercase tracking-widest">মূল্য</th>
                <th className="py-4 text-right text-xs font-black text-slate-900 uppercase tracking-widest">মোট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoiceData.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-6 text-slate-900 font-bold">{item.product_name}</td>
                  <td className="py-6 text-center text-slate-600">{item.quantity}</td>
                  <td className="py-6 text-right text-slate-600">{formatCurrency(item.unit_price)}</td>
                  <td className="py-6 text-right text-slate-900 font-black">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-slate-500">
              <span>সাবটোটাল</span>
              <span className="font-bold">{formatCurrency(invoiceData.subtotal)}</span>
            </div>
            {invoiceData.discount > 0 && (
              <div className="flex justify-between text-rose-500">
                <span>ডিসকাউন্ট</span>
                <span className="font-bold">-{formatCurrency(invoiceData.discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t-2 border-slate-900">
              <span className="text-lg font-black text-slate-900 uppercase">মোট</span>
              <span className="text-2xl font-black text-indigo-600">{formatCurrency(invoiceData.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-24 pt-12 border-t border-slate-100 text-center">
          <p className="text-slate-900 font-bold mb-1">আমাদের সাথে ব্যবসা করার জন্য ধন্যবাদ!</p>
          <p className="text-slate-400 text-xs">এই ইনভয়েস সম্পর্কে কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন।</p>
        </div>
      </div>
    </div>
  );
}
