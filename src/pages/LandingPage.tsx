import React, { useState } from 'react';
import { useAppDispatch, useAppSelector, setSearchQuery } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plane, Train, Bus, Film, Music, ArrowRight, MapPin, Calendar, Users, Percent, Compass, ShieldCheck, Heart, ChevronDown, Sparkles, Copy, Check
} from 'lucide-react';
import { TicketCategory } from '../types';

export default function LandingPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { coupons } = useAppSelector(state => state.booking);

  const [activeTab, setActiveTab] = useState<TicketCategory>('flight');
  const [source, setSource] = useState('Delhi');
  const [destination, setDestination] = useState('Mumbai');
  const [date, setDate] = useState('2026-07-10');
  const [passengers, setPassengers] = useState(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Expandable FAQs
  const [faqOpen, setFaqOpen] = useState<{ [key: number]: boolean }>({
    0: true,
    1: false,
    2: false,
    3: false
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery({
      source,
      destination,
      date,
      category: activeTab,
      passengers
    }));
    navigate(`/search?cat=${activeTab}`);
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const categories: { id: TicketCategory; label: string; icon: any; color: string }[] = [
    { id: 'flight', label: 'Flights', icon: Plane, color: 'from-emerald-600 to-teal-600' },
    { id: 'train', label: 'Trains', icon: Train, color: 'from-teal-600 to-emerald-500' },
    { id: 'bus', label: 'Buses', icon: Bus, color: 'from-emerald-500 to-green-600' },
    { id: 'movie', label: 'Movies', icon: Film, color: 'from-green-600 to-teal-500' },
    { id: 'event', label: 'Events', icon: Music, color: 'from-teal-500 to-emerald-600' }
  ];

  const popularDestinations = [
    { name: 'Goa Beaches', type: 'Flight/Bus', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=350', price: '₹3,400' },
    { name: 'Paris Cityscape', type: 'Flight', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=350', price: '₹45,000' },
    { name: 'Tokyo Neon Trails', type: 'Flight', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=350', price: '₹38,500' },
    { name: 'Kashmir Meadows', type: 'Flight/Train', image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&q=80&w=350', price: '₹5,500' }
  ];

  const trendingRoutes = [
    { from: 'Delhi (DEL)', to: 'Mumbai (BOM)', type: 'Flight', price: '₹4,200', dur: '2h 15m' },
    { from: 'Mumbai (BOM)', to: 'Goa (GOI)', type: 'Flight/Bus', price: '₹1,100', dur: '1h 05m' },
    { from: 'Bengaluru', to: 'Chennai', type: 'Train/Bus', price: '₹450', dur: '5h 30m' },
    { from: 'Paris', to: 'London', type: 'Train/Flight', price: '₹6,400', dur: '2h 20m' }
  ];

  const testimonials = [
    { name: 'Arjun Mehta', role: 'Business Traveler', quote: 'OmniBook is literally the smoothest booking platform. Seat maps show everything, and my vouchers sync on the fly!', rating: 5, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
    { name: 'Diya Sen', role: 'Concert Enthusiast', quote: 'Booked Coldplay Goa tickets in 10 seconds! Wallet cashback is real and the UI feels so premium.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' }
  ];

  const faqs = [
    { q: 'How does Omni Wallet cashback work?', a: 'Cashback is credited instantly as Omni Cash upon ticket confirmation or cancellation refund. You can redeem it 100% on any future booking of trains, flights, or events with zero convenience fee!' },
    { q: 'Can I select a custom seat type like VIP or Window?', a: 'Yes! Our custom-styled Interactive Seat Maps categorize seats into standard, window-side, ladies-only, premium, and VIP tiers. Multipliers apply depending on the tier selected.' },
    { q: 'How do I scan or verify my QR Ticket?', a: 'Once booked successfully, you get a dynamic boarding pass with a QR Code. Any on-board ticketing staff can utilize our integrated Staff Dashboard Scanner to verify your travel status instantly.' },
    { q: 'What is the cancellation and refund policy?', a: 'Cancellations made 24 hours prior to departure receive a full refund directly to your Omni Wallet. Simply trigger a cancellation from your Booking History in the Customer Hub.' }
  ];

  const toggleFaq = (idx: number) => {
    setFaqOpen(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200" id="landing-page">
      
      {/* Hero Banner with Search Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-900/10 via-stone-50 to-stone-50 dark:from-emerald-950/20 dark:via-stone-950 dark:to-stone-950 pb-20 pt-16 px-4">
        
        {/* Absolute Decorative Circles */}
        <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>

        <div className="max-w-7xl mx-auto text-center mb-12 relative z-10">
          <div className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 dark:border-emerald-500/10 px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 font-sans">Premium Ticket Booking Ecosystem</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Seamless Bookings for <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Buses, Trains, Flights & Shows
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Join 5+ million travelers exploring real-time schedules, customized seat mapping, zero-fee wallet checkouts, and AI support.
          </p>
        </div>

        {/* Floating Search Container */}
        <div className="max-w-4xl mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-2xl relative z-10">
          
          {/* Booking Category Switch Tabs */}
          <div className="flex space-x-1 sm:space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 overflow-x-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveTab(cat.id);
                    // Autofill specific fields for movies and events
                    if (cat.id === 'movie') {
                      setSource('Bengaluru');
                      setDestination('IMAX - PVR ECX');
                    } else if (cat.id === 'event') {
                      setSource('Mumbai');
                      setDestination('DY Patil Stadium');
                    } else {
                      setSource('Delhi');
                      setDestination('Mumbai');
                    }
                  }}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition duration-200 shrink-0 cursor-pointer ${
                    isSelected 
                      ? 'bg-gradient-to-r ' + cat.color + ' text-white shadow-lg' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Inputs Form */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            
            {/* Source */}
            <div className="text-left">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5 ml-1">
                {activeTab === 'movie' || activeTab === 'event' ? 'City' : 'From / Source'}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full text-sm pl-9 pr-3 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/50 outline-none font-medium"
                  placeholder="e.g. Delhi"
                  required
                />
              </div>
            </div>

            {/* Destination */}
            <div className="text-left">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5 ml-1">
                {activeTab === 'movie' || activeTab === 'event' ? 'Venue / Show' : 'To / Destination'}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-sm pl-9 pr-3 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/50 outline-none font-medium"
                  placeholder="e.g. Mumbai"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div className="text-left">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5 ml-1">Departure Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm pl-9 pr-3 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/50 outline-none font-medium font-mono"
                  required
                />
              </div>
            </div>

            {/* Passengers or Search Action */}
            <div className="flex space-x-2">
              <div className="text-left w-1/3">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5 ml-1">Seats</label>
                <div className="relative">
                  <Users className="absolute left-2.5 top-3.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                    className="w-full text-sm pl-7 pr-2 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/50 outline-none font-bold font-mono"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <span>Find Tickets</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* Promos & Vouchers Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono">Exclusive Offers</span>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 dark:text-white mt-1.5">Coupons & Cashbacks</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coupons.map((coupon) => (
            <div 
              key={coupon.code}
              className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-5 rounded-2xl relative overflow-hidden shadow-sm flex flex-col justify-between"
            >
              {/* Circular cutouts for classic coupon feel */}
              <div className="absolute top-1/2 -left-3 h-6 w-6 rounded-full bg-slate-50 dark:bg-slate-950 border-r border-slate-150 dark:border-slate-850 transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 -right-3 h-6 w-6 rounded-full bg-slate-50 dark:bg-slate-950 border-l border-slate-150 dark:border-slate-850 transform -translate-y-1/2"></div>

              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider font-mono uppercase bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    {coupon.type === 'percent' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                  </span>
                  <Percent className="h-4 w-4 text-slate-300" />
                </div>
                <h4 className="font-bold text-slate-950 dark:text-white text-base font-sans">{coupon.code}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">{coupon.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
                <span className="text-[10px] text-slate-400 font-semibold font-mono">Min booking ₹{coupon.minAmount}</span>
                <button
                  onClick={() => handleCopyCoupon(coupon.code)}
                  className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Destinations Bento Grid */}
      <div className="bg-slate-100/50 dark:bg-slate-900/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono">Bespoke Journeys</span>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 dark:text-white mt-1.5">Popular Destinations</h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto mt-2 font-medium">Handpicked travel getaways and global cities offering maximum routes, premium support, and high customer ratings.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((dest, idx) => (
              <div 
                key={idx}
                className="group relative h-72 rounded-3xl overflow-hidden shadow-md cursor-pointer border border-slate-150 dark:border-slate-800"
                onClick={() => {
                  setDestination(dest.name.split(' ')[0]);
                  navigate(`/search?cat=flight`);
                }}
              >
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent"></div>
                
                <div className="absolute bottom-5 left-5 right-5 text-white flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-teal-300 font-mono tracking-widest uppercase">{dest.type}</span>
                  <h4 className="font-bold text-lg mt-0.5">{dest.name}</h4>
                  <div className="flex justify-between items-center mt-3 border-t border-white/10 pt-2 text-xs">
                    <span className="text-white/70">Flights from</span>
                    <span className="font-bold text-teal-300 font-mono">{dest.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Routes & Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          <div className="lg:col-span-1">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono">Efficient Schedules</span>
            <h2 className="text-3xl font-sans font-bold text-slate-900 dark:text-white mt-2 leading-tight">Trending Commutes This Week</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-relaxed font-medium">
              We list the most chosen pathways by local executives and leisure seekers. Experience express lines, high ratings, and full cancellation flexibility.
            </p>
            <div className="mt-6 flex space-x-4 items-center">
              <div>
                <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white">4.8★</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Average Rating</p>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-800 h-8"></div>
              <div>
                <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white">100%</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Refund Safety</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {trendingRoutes.map((route, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl shadow-sm hover:border-emerald-500/30 transition flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 cursor-pointer"
                onClick={() => {
                  setSource(route.from.split(' ')[0]);
                  setDestination(route.to.split(' ')[0]);
                  navigate(`/search?cat=flight`);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
                    0{idx+1}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-950 dark:text-white flex items-center space-x-1.5">
                      <span>{route.from}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      <span>{route.to}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{route.type} • Avg {route.dur}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-center">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">One-way from</p>
                    <p className="font-bold text-base text-emerald-600 dark:text-emerald-400 font-mono">{route.price}</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl transition">
                    <ArrowRight className="h-4.5 w-4.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-slate-100/50 dark:bg-slate-900/20 py-16 border-t border-slate-150 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono">User Loyalty</span>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 dark:text-white mt-1.5">What Travelers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-6 rounded-3xl shadow-sm">
                <div className="flex space-x-1 mb-3">
                  {[...Array(test.rating)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 italic leading-relaxed">"{test.quote}"</p>
                
                <div className="flex items-center space-x-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <img src={test.avatar} alt={test.name} className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">{test.name}</h5>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono">Common Enquiries</span>
          <h2 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 dark:text-white mt-1.5">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = faqOpen[idx];
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left focus:outline-none"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{faq.q}</span>
                  <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-600 rounded-xl">
                  <Compass className="h-5 w-5 text-white" />
                </div>
                <span className="font-sans font-bold text-xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  OmniBook
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowering world-class travel, concert, and movie logistics under a single unified dashboard interface. Experience fully responsive layouts with zero convenience fee checkouts.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm tracking-wider text-slate-300 mb-4">LOGISTICS</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/search?cat=flight" className="hover:text-white transition">Air Express Flight Routes</Link></li>
                <li><Link to="/search?cat=train" className="hover:text-white transition">Superfast Shatabdi & Rajdhani</Link></li>
                <li><Link to="/search?cat=bus" className="hover:text-white transition">Sleeper AC Interstate Buses</Link></li>
                <li><Link to="/search?cat=movie" className="hover:text-white transition">Cinematic IMAX Blockbusters</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm tracking-wider text-slate-300 mb-4">RELIABILITY</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>100% Secure Gateway Checkout</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Heart className="h-4 w-4 text-pink-400" />
                  <span>Ladies-Only Row Safety Rules</span>
                </li>
                <li><Link to="/dashboard" className="hover:text-white transition">Customer Support Channel</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm tracking-wider text-slate-300 mb-4">OFFICE ADDRESS</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                OmniBook Corporate Headquarters<br />
                Level 12, Tower B, Cyber City Complex<br />
                Gurugram, HR - 122002
              </p>
              <p className="text-xs text-slate-400 font-mono mt-3">support@omnibook-tickets.com</p>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
            <p>© 2026 OmniBook Ticket Booking platform. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <span className="hover:text-slate-300 transition">Terms of Service</span>
              <span className="hover:text-slate-300 transition">Privacy Policy</span>
              <span className="hover:text-slate-300 transition">Sitemap Info</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
