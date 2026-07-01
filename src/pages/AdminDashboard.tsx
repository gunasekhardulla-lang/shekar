import React, { useState } from 'react';
import { useAppDispatch, useAppSelector, createCoupon, removeCoupon } from '../store';
import { 
  Users, DollarSign, Settings, Award, PlusCircle, Trash2, ChartPie, CheckCircle, BarChart2, ShieldAlert, Key, Globe, Compass, Star
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Coupon } from '../types';

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { coupons, bookingsList, vehicles } = useAppSelector(state => state.booking);

  // States
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percent' | 'flat'>('percent');
  const [couponDiscount, setCouponDiscount] = useState('15');
  const [couponMin, setCouponMin] = useState('1000');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  // Stats
  const totalRevenue = bookingsList.reduce((acc, b) => acc + b.totalAmount, 0) + 124500;
  const activeBookingsCount = bookingsList.length + 42;
  const activeCouponsCount = coupons.length;
  const mockUsersCount = 1840;

  // Chart data: Bookings metrics by transport categories
  const chartData = [
    { category: 'Flights', count: bookingsList.filter(b => b.category === 'flight').length + 15, revenue: 64500 },
    { category: 'Trains', count: bookingsList.filter(b => b.category === 'train').length + 28, revenue: 38200 },
    { category: 'Buses', count: bookingsList.filter(b => b.category === 'bus').length + 35, revenue: 14500 },
    { category: 'Movies', count: bookingsList.filter(b => b.category === 'movie').length + 50, revenue: 12100 },
    { category: 'Events', count: bookingsList.filter(b => b.category === 'event').length + 18, revenue: 26800 }
  ];

  const handleCouponCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode || !couponDiscount) return;

    const newCoupon: Coupon = {
      code: couponCode.trim().toUpperCase(),
      discount: parseFloat(couponDiscount) || 10,
      type: couponType,
      minAmount: parseFloat(couponMin) || 500,
      description: couponDesc || `Get ${couponDiscount} discount on your bookings.`
    };

    dispatch(createCoupon(newCoupon));
    setCouponMessage(`Successfully minted promo code ${newCoupon.code}! This coupon is now redeemable at checkout.`);
    
    // Clear
    setCouponCode('');
    setCouponDesc('');
    setTimeout(() => setCouponMessage(null), 3000);
  };

  const handleCouponDelete = (code: string) => {
    if (confirm(`Are you sure you want to revoke promotional code: ${code}?`)) {
      dispatch(removeCoupon()); // Clear active in store
      alert(`Coupon code ${code} revoked successfully from the system.`);
    }
  };

  const mockUsersList = [
    { name: 'Gunasekhar Dulla', email: 'gunasekhardulla@gmail.com', role: 'Customer', status: 'Active' },
    { name: 'Sarah Concierge', email: 'sarah.c@omnibook-tickets.com', role: 'Staff', status: 'Active' },
    { name: 'Alex Fleet Services', email: 'alex@fleetpartner.com', role: 'Vendor', status: 'Active' },
    { name: 'System Auditor', email: 'auditor@sandbox.com', role: 'Admin', status: 'Active' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans" id="admin-hub-page">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">Admin Control Console</h2>
          <p className="text-xs text-slate-400 font-medium">Global platform settings, mint promo coupons, monitor transactions revenue logs.</p>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold">
          <Key className="h-4 w-4 text-amber-500" />
          <span>System Root Authorization Granted</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-xs font-medium">
        
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 uppercase tracking-wider font-semibold">Consolidated Revenue</span>
            <DollarSign className="h-4.5 w-4.5 text-emerald-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-slate-950 dark:text-white">₹{totalRevenue}</p>
          <p className="text-[10px] text-slate-400 mt-1">Platform commissions: 12%</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 uppercase tracking-wider font-semibold">Reservations Log</span>
            <Globe className="h-4.5 w-4.5 text-teal-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-slate-950 dark:text-white">{activeBookingsCount} Passes</p>
          <p className="text-[10px] text-slate-400 mt-1">Active transit pathways</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 uppercase tracking-wider font-semibold">Minted Promos</span>
            <Award className="h-4.5 w-4.5 text-pink-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-slate-950 dark:text-white">{activeCouponsCount} Coupons</p>
          <p className="text-[10px] text-slate-400 mt-1">Redeemable on all categories</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 uppercase tracking-wider font-semibold">Accounts ledger</span>
            <Users className="h-4.5 w-4.5 text-emerald-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-slate-950 dark:text-white">{mockUsersCount} Users</p>
          <p className="text-[10px] text-slate-400 mt-1">Fully KYC verified profiles</p>
        </div>

      </div>

      {/* Middle Grid: Recharts graph + Mint Promo Coupon form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recharts Booking Volume bar graphs */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-lg space-y-4">
          <h3 className="font-bold text-slate-950 dark:text-white text-base">Booking analytics indicators</h3>
          <p className="text-xs text-slate-500 font-medium">Inspect total reservation volume count across different transport & entertainment categories.</p>

          <div className="h-72 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="category" stroke="#888888" fontSize={10} />
                <YAxis stroke="#888888" fontSize={10} />
                <Tooltip 
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#ffffff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} name="Ticket Vol" />
                <Bar dataKey="revenue" fill="#14b8a6" radius={[8, 8, 0, 0]} name="Comm Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mint promo coupons form */}
        <div className="lg:col-span-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-lg space-y-4">
          <h3 className="font-bold text-slate-950 dark:text-white text-base">Mint Promo Voucher</h3>
          <p className="text-xs text-slate-500 font-medium">Create and deploy high-conversion coupons live instantly.</p>

          {couponMessage && (
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start space-x-2 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{couponMessage}</span>
            </div>
          )}

          <form onSubmit={handleCouponCreate} className="space-y-3.5 text-xs font-medium">
            <div>
              <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1">Coupon code name</label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/50 outline-none uppercase font-bold font-mono"
                placeholder="e.g. MONSOON20"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1">Discount type</label>
                <select
                  value={couponType}
                  onChange={(e) => setCouponType(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white rounded-xl outline-none cursor-pointer"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Cash (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1">Discount value</label>
                <input
                  type="number"
                  value={couponDiscount}
                  onChange={(e) => setCouponDiscount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl outline-none"
                  placeholder="e.g. 15"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1">Min booking amount (₹)</label>
              <input
                type="number"
                value={couponMin}
                onChange={(e) => setCouponMin(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/50 outline-none"
                placeholder="Min total"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1">Short description</label>
              <textarea
                value={couponDesc}
                onChange={(e) => setCouponDesc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl outline-none resize-none h-14"
                placeholder="e.g. 20% off on first flight ticket..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow hover:opacity-95 flex items-center justify-center space-x-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Deploy Coupon Code</span>
            </button>
          </form>
        </div>

      </div>

      {/* Global accounts manager ledger */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-lg space-y-4 mt-8 text-xs font-medium">
        <div>
          <h3 className="font-bold text-slate-950 dark:text-white text-base">Global User Accounts</h3>
          <p className="text-xs text-slate-500">Manage user security, adjust clearance profile authorizations, reset password credentials.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockUsersList.map((user, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/40 rounded-2xl space-y-3 shadow-sm">
              <div>
                <h5 className="font-bold text-slate-950 dark:text-white">{user.name}</h5>
                <p className="text-slate-400">{user.email}</p>
                <div className="flex space-x-1.5 mt-2">
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-wider">{user.role}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-wider">{user.status}</span>
                </div>
              </div>

              <div className="flex gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
                <button 
                  onClick={() => alert(`Reset password dispatch link sent successfully to ${user.email}!`)}
                  className="flex-1 py-1 px-2.5 bg-emerald-50 text-emerald-600 font-bold rounded-lg text-[10px]"
                >
                  Reset Pwd
                </button>
                <button 
                  onClick={() => alert(`Warning: Security restrictions applied on ${user.name}'s profile!`)}
                  className="py-1 px-2.5 bg-rose-50 text-rose-600 font-bold rounded-lg text-[10px]"
                >
                  Block
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
