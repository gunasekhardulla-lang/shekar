import React, { useState } from 'react';
import { useAppDispatch, useAppSelector, updateProfile, cancelBooking, markAsRead, addReview, addFunds, filterVehiclesByAdvance } from '../store';
import { useNavigate } from 'react-router-dom';
import { 
  User, Wallet, History, Heart, Bell, MessageSquare, Settings, ShieldAlert, CheckCircle, Percent, QrCode, Trash2, Edit3, PlusCircle, ArrowUpRight, ArrowDownLeft, Star
} from 'lucide-react';
import { Review } from '../types';

export default function CustomerDashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentUser } = useAppSelector(state => state.auth);
  const { bookingsList } = useAppSelector(state => state.booking);
  const { balance, transactions } = useAppSelector(state => state.wallet);
  const { notifications } = useAppSelector(state => state.notifications);
  const { wishlist, vehicles } = useAppSelector(state => state.booking);
  const { reviews } = useAppSelector(state => state.reviews);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'wallet' | 'bookings' | 'wishlist' | 'notifications' | 'reviews' | 'settings'>('bookings');

  // Form profile edits
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profileAvatar, setProfileAvatar] = useState(currentUser?.avatar || '');

  // Add review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewCategory, setReviewCategory] = useState<'flight' | 'train' | 'bus' | 'movie' | 'event'>('flight');
  const [reviewItem, setReviewItem] = useState('');

  // Topup
  const [topupVal, setTopupVal] = useState('1500');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile({ name: profileName, email: profileEmail, avatar: profileAvatar }));
    alert('Profile successfully updated in store!');
  };

  const handleCancelTicket = (id: string) => {
    if (confirm('Are you sure you want to cancel this booking? This will credit refunds back to your Omni Wallet instantly.')) {
      const bookedObj = bookingsList.find(b => b.id === id);
      if (bookedObj) {
        dispatch(cancelBooking(id));
        dispatch(addFunds(bookedObj.totalAmount)); // Refund balance!
        alert(`Booking ${id} cancelled successfully. Refund of ₹${bookedObj.totalAmount} credited back to Omni Wallet.`);
      }
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment || !reviewItem) return;
    const newRev: Review = {
      id: 'rev-' + Date.now(),
      userName: currentUser?.name || 'Guest User',
      userAvatar: currentUser?.avatar || '',
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0],
      category: reviewCategory,
      itemName: reviewItem
    };
    dispatch(addReview(newRev));
    setReviewComment('');
    setReviewItem('');
    alert('Review submitted successfully!');
  };

  const handleTopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(topupVal);
    if (!isNaN(val) && val > 0) {
      dispatch(addFunds(val));
      alert(`Successfully topped up ₹${val} to your wallet!`);
    }
  };

  // Filter listings
  const activeBookings = bookingsList.filter(b => b.status === 'active');
  const cancelledBookings = bookingsList.filter(b => b.status === 'cancelled');
  const wishlistItems = vehicles.filter(v => wishlist.includes(v.id));

  const tabItems = [
    { id: 'bookings', label: 'My Bookings', icon: History },
    { id: 'wallet', label: 'Wallet & Cash', icon: Wallet },
    { id: 'profile', label: 'Edit Profile', icon: User },
    { id: 'wishlist', label: 'Saved Wishlist', icon: Heart },
    { id: 'notifications', label: 'Alerts', icon: Bell },
    { id: 'reviews', label: 'My Reviews', icon: MessageSquare },
    { id: 'settings', label: 'Dashboard Config', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans" id="customer-hub-page">
      
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
        
        {/* Abstract overlays */}
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/5 blur-2xl"></div>

        <div className="flex items-center space-x-4 relative z-10">
          <img 
            src={currentUser?.avatar} 
            alt={currentUser?.name} 
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-white/20 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">{currentUser?.name}</h2>
            <p className="text-xs text-emerald-100">{currentUser?.email} • Customer Profile</p>
            <p className="text-[10px] font-mono tracking-widest bg-white/10 px-2 py-0.5 rounded-md mt-1.5 inline-block uppercase">Verified Account</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center space-x-3.5 self-stretch sm:self-auto relative z-10">
          <Wallet className="h-6 w-6 text-emerald-300 animate-pulse" />
          <div>
            <p className="text-[10px] text-emerald-100 uppercase font-semibold">Wallet Cash Balance</p>
            <p className="text-xl font-mono font-bold">₹{balance}</p>
          </div>
        </div>
      </div>

      {/* Grid: Left tabs rail vs Right Tab Screen content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side Navigation Rail */}
        <div className="lg:col-span-1 space-y-2.5">
          {tabItems.map(tab => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition justify-start cursor-pointer ${
                  isSel 
                    ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-l-4 border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold bg-slate-50 dark:bg-slate-900/50' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-700'
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right content view area */}
        <div className="lg:col-span-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 border border-slate-150 dark:border-slate-800/60 rounded-3xl shadow-md min-h-96">
          
          {/* 1. BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-950 dark:text-white text-base">Active Boarding Passes</h3>
                <p className="text-xs text-slate-500 font-medium">Verify or cancel active tickets here.</p>
              </div>

              {activeBookings.length === 0 ? (
                <div className="text-center py-10 text-slate-400 bg-slate-50 dark:bg-slate-800/10 rounded-2xl border border-dashed border-slate-200">
                  No active boarding passes found. Explore our flights/trains categories to search tickets.
                </div>
              ) : (
                <div className="space-y-4">
                  {activeBookings.map((b) => (
                    <div 
                      key={b.id} 
                      className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center shadow-sm"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          {b.category === 'flight' ? '✈️' : b.category === 'train' ? '🚂' : '🚌'}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-950 dark:text-white">{b.vehicleName}</h4>
                          <p className="text-xs text-slate-400">{b.provider} • Date: {b.date}</p>
                          <p className="font-mono text-[10px] text-slate-500 mt-1">{b.source} → {b.destination}</p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Seats: {b.seats.join(', ')}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3.5 self-stretch sm:self-auto justify-end border-t border-slate-50 dark:border-slate-800/80 pt-3 sm:pt-0 sm:border-none">
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Paid</p>
                          <p className="font-mono font-bold text-sm text-slate-900 dark:text-white">₹{b.totalAmount}</p>
                        </div>
                        <button
                          onClick={() => handleCancelTicket(b.id)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold flex items-center space-x-1"
                          title="Cancel ticket for full refund"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Cancel</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}

              {/* Cancelled history */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-950 dark:text-white text-sm mb-3">Cancelled Vouchers ({cancelledBookings.length})</h4>
                {cancelledBookings.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium italic">No cancelled bookings.</p>
                ) : (
                  <div className="space-y-2">
                    {cancelledBookings.map((b) => (
                      <div key={b.id} className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <p className="font-semibold text-rose-700 dark:text-rose-400">{b.vehicleName} • {b.source} to {b.destination}</p>
                          <p className="text-[10px] text-slate-400">Date: {b.date} • Reference ID: {b.id}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-600 font-bold font-mono">CANCELLED - REFUNDED</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 2. WALLET TAB */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-950 dark:text-white text-base">Wallet & Financial History</h3>
                  <p className="text-xs text-slate-500 font-medium">Add funds, inspect transactions record, check cashback values.</p>
                </div>
              </div>

              {/* Top up block */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-150 dark:border-slate-800/40 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <Wallet className="h-4.5 w-4.5 text-emerald-500" />
                    <span>Quick Top-up balance</span>
                  </h4>
                  <p className="text-xs text-slate-400">Funds are immediately added to Omni Wallet for checkout uses.</p>
                </div>
                <form onSubmit={handleTopupSubmit} className="flex space-x-2">
                  <input
                    type="number"
                    value={topupVal}
                    onChange={(e) => setTopupVal(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold font-mono outline-none border-none focus:ring-2 focus:ring-emerald-500/50"
                    placeholder="Amount"
                    required
                  />
                  <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1 shrink-0">
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Funds</span>
                  </button>
                </form>
              </div>

              {/* Transaction list table */}
              <div>
                <h4 className="font-bold text-slate-950 dark:text-white text-sm mb-3">Transaction Audits Ledger</h4>
                <div className="space-y-2.5">
                  {transactions.map((t) => (
                    <div 
                      key={t.id}
                      className="p-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-xl flex justify-between items-center text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${t.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {t.type === 'credit' ? <ArrowDownLeft className="h-4.5 w-4.5" /> : <ArrowUpRight className="h-4.5 w-4.5" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{t.description}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Date: {t.date} • Reference: {t.id}</p>
                        </div>
                      </div>

                      <span className={`font-mono font-extrabold ${t.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === 'credit' ? `+₹${t.amount}` : `-₹${t.amount}`}
                      </span>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 3. EDIT PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-950 dark:text-white text-base">Account Settings Credentials</h3>
                <p className="text-xs text-slate-500 font-medium">Update username, primary email address, or profile avatars.</p>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5 ml-1">Username Display</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full text-xs px-3.5 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
                    placeholder="User Name"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5 ml-1">Account email address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
                    placeholder="email@domain.com"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5 ml-1">Avatar Image Url</label>
                  <input
                    type="text"
                    value={profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
                    className="w-full text-xs px-3.5 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
                    placeholder="Image URL link"
                    required
                  />
                </div>

                <button type="submit" className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow">
                  Save Changes Profile
                </button>
              </form>

            </div>
          )}

          {/* 4. WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-950 dark:text-white text-base">Bookmarked Paths</h3>
                <p className="text-xs text-slate-500 font-medium">Keep track of your favorite vehicles and check schedule availability.</p>
              </div>

              {wishlistItems.length === 0 ? (
                <p className="text-center py-12 text-slate-400 font-medium">No bookmarked pathways. Press heart icons during ticket search!</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistItems.map((vehicle) => (
                    <div 
                      key={vehicle.id} 
                      className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-150 rounded-2xl flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-slate-950 dark:text-white">{vehicle.name}</h4>
                        <p className="text-xs text-slate-400">{vehicle.provider} • Price: ₹{vehicle.price}</p>
                      </div>
                      <button
                        onClick={() => {
                          dispatch(filterVehiclesByAdvance({ priceRange: [0, 15000], ratings: 0, timings: 'all', searchQueryText: vehicle.name }));
                          navigate(`/search?cat=${vehicle.category}`);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. ALERTS / NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-950 dark:text-white text-base">Inbox Alerts Notification</h3>
                <p className="text-xs text-slate-500 font-medium">Track refunds, updates on flight delays, or holiday promotional discounts.</p>
              </div>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    onClick={() => dispatch(markAsRead(n.id))}
                    className={`p-4 rounded-2xl border flex items-start space-x-3 transition cursor-pointer ${
                      !n.read 
                        ? 'bg-slate-100/50 dark:bg-slate-850 border-emerald-500/20' 
                        : 'bg-white dark:bg-slate-900 border-slate-150 text-slate-500 dark:border-slate-800'
                    }`}
                  >
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      <Bell className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <h5 className="font-bold text-xs text-slate-900 dark:text-white">{n.title}</h5>
                        <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-normal">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-950 dark:text-white text-base">Write & Inspect Reviews</h3>
                <p className="text-xs text-slate-500 font-medium">Share your travel experiences or movie feedback to help others.</p>
              </div>

              {/* Review submit form */}
              <form onSubmit={handleReviewSubmit} className="bg-slate-50 dark:bg-slate-800/40 border border-slate-150 p-4 rounded-2xl space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">Write New Travel Feedback</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1">Carrier / Show name</label>
                    <input
                      type="text"
                      value={reviewItem}
                      onChange={(e) => setReviewItem(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl outline-none"
                      placeholder="e.g. Air India AI-421"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1">Category</label>
                    <select
                      value={reviewCategory}
                      onChange={(e) => setReviewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl cursor-pointer"
                    >
                      <option value="flight">Flight</option>
                      <option value="train">Train</option>
                      <option value="bus">Bus</option>
                      <option value="movie">Movie</option>
                      <option value="event">Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1">Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl cursor-pointer font-bold"
                    >
                      <option value="5">★★★★★ (5 Stars)</option>
                      <option value="4">★★★★☆ (4 Stars)</option>
                      <option value="3">★★★☆☆ (3 Stars)</option>
                      <option value="2">★★☆☆☆ (2 Stars)</option>
                      <option value="1">★☆☆☆☆ (1 Star)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1">Write your experience details</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl h-20 outline-none resize-none"
                    placeholder="Tell us what you loved or how we can improve..."
                    required
                  />
                </div>

                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow">
                  Submit Experience Review
                </button>
              </form>

              {/* Feedbacks list */}
              <div className="space-y-3.5">
                <h4 className="font-bold text-slate-950 dark:text-white text-xs uppercase tracking-wide">Historical reviews ledger</h4>
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-150 rounded-2xl shadow-sm text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{rev.itemName} ({rev.category})</span>
                      <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-amber-500 font-bold mb-2">
                      {[...Array(rev.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />)}
                    </div>
                    <p className="text-slate-500 italic leading-normal">"{rev.comment}"</p>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 7. SETTINGS CONFIG TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6 text-xs text-slate-500 dark:text-slate-400">
              <div>
                <h3 className="font-bold text-slate-950 dark:text-white text-base">Dashboard Config & Telemetries</h3>
                <p className="text-xs text-slate-500 font-medium">Toggle telemetry parameters and check cloud storage states.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white mb-0.5">Primary Email notifications</h5>
                    <p className="text-[10px]">Send travel schedules PDF receipts directly to registered email.</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 font-bold rounded-lg uppercase tracking-wider">Enabled</span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white mb-0.5">Real-time GPS Tracking Feed</h5>
                    <p className="text-[10px]">Provide telemetry tracking values inside boarding tickets.</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 font-bold rounded-lg uppercase tracking-wider">Enabled</span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white mb-0.5">Google Maps Geolocation integration</h5>
                    <p className="text-[10px]">Request permission frame inside browsers mapping widget.</p>
                  </div>
                  <span className="px-2.5 py-1 bg-rose-500/10 text-rose-600 font-bold rounded-lg uppercase tracking-wider">Disabled</span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
