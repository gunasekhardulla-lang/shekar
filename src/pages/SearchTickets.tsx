import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector, setSearchQuery, filterVehiclesByAdvance, setSelectedVehicle, toggleWishlist } from '../store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Sliders, Search, Star, Clock, Filter, Sparkles, Heart, Navigation, Plane, Train, Bus, Film, Music, ShieldAlert, Mic
} from 'lucide-react';
import { Vehicle, TicketCategory } from '../types';
import VoiceSearch from '../components/VoiceSearch';

export default function SearchTickets() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('cat') as TicketCategory || 'flight';

  const { searchQuery, filteredVehicles, wishlist } = useAppSelector(state => state.booking);

  // States for advanced filters
  const [priceMax, setPriceMax] = useState(10000);
  const [minRating, setMinRating] = useState(0);
  const [timing, setTiming] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [voiceOpen, setVoiceOpen] = useState(false);

  // Local state for From & To search inputs
  const [localSource, setLocalSource] = useState(searchQuery.source);
  const [localDestination, setLocalDestination] = useState(searchQuery.destination);
  const [localDate, setLocalDate] = useState(searchQuery.date);
  const [localPassengers, setLocalPassengers] = useState(searchQuery.passengers);

  // Sync when redux state is initialized/changed
  useEffect(() => {
    setLocalSource(searchQuery.source);
    setLocalDestination(searchQuery.destination);
    setLocalDate(searchQuery.date);
    setLocalPassengers(searchQuery.passengers);
  }, [searchQuery]);

  const handleUpdateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery({
      source: localSource,
      destination: localDestination,
      date: localDate,
      category: searchQuery.category,
      passengers: localPassengers
    }));
  };

  // Synchronize category in redux when url param changes
  useEffect(() => {
    if (catParam && catParam !== searchQuery.category) {
      dispatch(setSearchQuery({
        ...searchQuery,
        category: catParam
      }));
    }
  }, [catParam]);

  // Trigger filtration when states change
  useEffect(() => {
    dispatch(filterVehiclesByAdvance({
      priceRange: [0, priceMax],
      ratings: minRating,
      timings: timing,
      searchQueryText: searchText
    }));
  }, [priceMax, minRating, timing, searchText, searchQuery.category]);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    dispatch(setSelectedVehicle(vehicle));
    navigate('/booking');
  };

  const categories: { id: TicketCategory; label: string; icon: any }[] = [
    { id: 'flight', label: 'Flights', icon: Plane },
    { id: 'train', label: 'Trains', icon: Train },
    { id: 'bus', label: 'Buses', icon: Bus },
    { id: 'movie', label: 'Movies', icon: Film },
    { id: 'event', label: 'Events', icon: Music }
  ];

  const handleVoiceTranscript = (text: string) => {
    setVoiceOpen(false);
    // Parse simulated speech results to auto fill filters
    if (text.toLowerCase().includes('flight') || text.toLowerCase().includes('fly')) {
      dispatch(setSearchQuery({ ...searchQuery, category: 'flight' }));
      navigate('/search?cat=flight');
    } else if (text.toLowerCase().includes('bus')) {
      dispatch(setSearchQuery({ ...searchQuery, category: 'bus' }));
      navigate('/search?cat=bus');
    } else if (text.toLowerCase().includes('train')) {
      dispatch(setSearchQuery({ ...searchQuery, category: 'train' }));
      navigate('/search?cat=train');
    }
    setSearchText(text);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans" id="search-tickets-page">
      
      {/* Top Search bar details overview */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-teal-500/10 border border-slate-200/50 dark:border-slate-800/50 p-5 rounded-3xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8 shadow-sm">
        <div className="flex-1 w-full">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono uppercase tracking-widest mb-3">
            <Sparkles className="h-4 w-4 animate-pulse text-emerald-500" />
            <span>Search Results for {searchQuery.category}s: {searchQuery.source} → {searchQuery.destination}</span>
          </div>
          
          <form onSubmit={handleUpdateSearch} className="flex flex-wrap gap-3 items-end w-full">
            <div className="flex flex-col min-w-[140px] flex-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">From / Source</label>
              <input
                type="text"
                value={localSource}
                onChange={(e) => setLocalSource(e.target.value)}
                className="px-3.5 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500/50 outline-none border border-slate-200 dark:border-slate-700 shadow-sm"
                placeholder="From"
                required
              />
            </div>

            <div className="flex flex-col min-w-[140px] flex-1">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">To / Destination</label>
              <input
                type="text"
                value={localDestination}
                onChange={(e) => setLocalDestination(e.target.value)}
                className="px-3.5 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500/50 outline-none border border-slate-200 dark:border-slate-700 shadow-sm"
                placeholder="To"
                required
              />
            </div>

            <div className="flex flex-col min-w-[120px]">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Date</label>
              <input
                type="date"
                value={localDate}
                onChange={(e) => setLocalDate(e.target.value)}
                className="px-3.5 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-semibold font-mono focus:ring-2 focus:ring-emerald-500/50 outline-none border border-slate-200 dark:border-slate-700 shadow-sm"
                required
              />
            </div>

            <div className="flex flex-col w-16">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Seats</label>
              <input
                type="number"
                min="1"
                max="10"
                value={localPassengers}
                onChange={(e) => setLocalPassengers(parseInt(e.target.value) || 1)}
                className="px-3.5 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-bold font-mono focus:ring-2 focus:ring-emerald-500/50 outline-none border border-slate-200 dark:border-slate-700 shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer h-[34px] flex items-center justify-center shrink-0"
            >
              Update Search
            </button>
          </form>
        </div>

        {/* Categories toggler in search page */}
        <div className="flex space-x-1 sm:space-x-2 bg-slate-100/50 dark:bg-slate-800/40 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto">
          {categories.map(c => {
            const Icon = c.icon;
            const isSel = searchQuery.category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => navigate(`/search?cat=${c.id}`)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  isSel 
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-md border border-slate-100 dark:border-slate-800' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Results List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 border border-slate-150 dark:border-slate-800/60 rounded-3xl shadow-md h-fit space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-950 dark:text-white flex items-center space-x-2">
              <Filter className="h-4 w-4 text-emerald-500" />
              <span>Advanced Filters</span>
            </h3>
            <Sliders className="h-4 w-4 text-slate-400" />
          </div>

          {/* Voice Search CTA */}
          <button
            onClick={() => setVoiceOpen(true)}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-2xl text-xs flex items-center justify-center space-x-2 border border-emerald-500/15"
          >
            <Mic className="h-4 w-4" />
            <span>Search with Voice</span>
          </button>

          {/* Search within Results Text Box */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Search Carrier Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl outline-none border-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="e.g. IndiGo, Rajdhani..."
              />
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Max Price Filter</span>
              <span className="font-mono text-slate-900 dark:text-white">₹{priceMax}</span>
            </div>
            <input
              type="range"
              min="200"
              max="15000"
              step="100"
              value={priceMax}
              onChange={(e) => setPriceMax(parseInt(e.target.value))}
              className="w-full accent-emerald-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Ratings checkboxes */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">Minimum rating</label>
            <div className="space-y-2">
              {[4.5, 4.0, 3.5, 0].map(stars => (
                <button
                  key={stars}
                  onClick={() => setMinRating(stars)}
                  className={`w-full flex justify-between items-center text-xs p-2 rounded-xl border font-semibold transition ${
                    minRating === stars
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    {stars === 0 ? 'All Ratings' : (
                      <>
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span>{stars}+ Stars</span>
                      </>
                    )}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 opacity-0" style={{ opacity: minRating === stars ? 1 : 0 }}></span>
                </button>
              ))}
            </div>
          </div>

          {/* Timings filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">Departure Timings</label>
            <div className="space-y-2">
              {[
                { id: 'all', label: 'All Departures' },
                { id: 'morning', label: 'Morning (5AM - 12PM)' },
                { id: 'afternoon', label: 'Afternoon (12PM - 5PM)' },
                { id: 'evening', label: 'Evening (5PM - 5AM)' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTiming(t.id)}
                  className={`w-full flex justify-between items-center text-xs p-2 rounded-xl border font-semibold transition ${
                    timing === t.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <span>{t.label}</span>
                  <Clock className="h-3.5 w-3.5 text-slate-300" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Filtering {filteredVehicles.length} of {filteredVehicles.length} results</span>
            <button 
              onClick={() => { setPriceMax(10000); setMinRating(0); setTiming('all'); setSearchText(''); }} 
              className="font-bold text-emerald-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="lg:col-span-3 space-y-4">
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-20 bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800/50 shadow p-6">
              <ShieldAlert className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-950 dark:text-white text-base">No Matching Tickets Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-normal">We couldn't locate any carrier matching your advanced filters. Try relaxing your maximum price constraints or ratings.</p>
            </div>
          ) : (
            filteredVehicles.map((vehicle) => {
              const inWish = wishlist.includes(vehicle.id);
              return (
                <div 
                  key={vehicle.id}
                  className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-5 rounded-3xl shadow-sm hover:shadow-md hover:border-emerald-500/20 transition flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
                >
                  
                  {/* Left Column: Icon + Carrier Info */}
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-tr from-slate-100 to-slate-200/50 dark:from-slate-800 dark:to-slate-700/50 rounded-2xl text-2xl flex items-center justify-center">
                      {vehicle.logoUrl || '✈️'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-slate-950 dark:text-white text-base font-sans">{vehicle.name}</h4>
                        <div className="flex items-center space-x-0.5 px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md text-[10px] font-bold">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          <span>{vehicle.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{vehicle.provider}</p>
                      
                      {/* Seat indicator */}
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wide mt-2">
                        🔥 {vehicle.availableSeats} Seats left in this tier
                      </p>
                    </div>
                  </div>

                  {/* Middle Column: Route departure arrival times */}
                  <div className="flex items-center space-x-6 text-slate-800 dark:text-slate-200 self-stretch md:self-auto justify-around border-t border-b border-slate-50 dark:border-slate-850 md:border-none py-3 md:py-0">
                    <div className="text-center">
                      <p className="text-base font-mono font-bold">{vehicle.departureTime}</p>
                      <p className="text-[10px] text-slate-400 font-medium font-sans uppercase">Departure</p>
                    </div>
                    <div className="text-center flex flex-col items-center">
                      <p className="text-[10px] text-slate-400 font-mono font-bold">{vehicle.duration}</p>
                      <div className="w-16 h-0.5 bg-slate-200 dark:bg-slate-700 relative my-1">
                        <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-emerald-500"></span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase">{vehicle.stops || 'Non-stop'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-base font-mono font-bold">{vehicle.arrivalTime}</p>
                      <p className="text-[10px] text-slate-400 font-medium font-sans uppercase">Arrival</p>
                    </div>
                  </div>

                  {/* Right Column: Pricing & Action */}
                  <div className="flex items-center space-x-3.5 self-end md:self-auto">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Fare</p>
                      <p className="font-mono font-bold text-lg text-slate-950 dark:text-white">₹{vehicle.price}</p>
                      <p className="text-[9px] text-slate-400">Excl. Convenience fee</p>
                    </div>

                    {/* Bookmark */}
                    <button 
                      onClick={() => dispatch(toggleWishlist(vehicle.id))}
                      className={`p-2.5 rounded-2xl border transition ${
                        inWish 
                          ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 text-rose-600' 
                          : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Heart className={`h-4.5 w-4.5 ${inWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleVehicleSelect(vehicle)}
                      className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer flex items-center space-x-1"
                    >
                      <span>Select Seats</span>
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Voice Search Drawer Modal */}
      {voiceOpen && (
        <VoiceSearch 
          onTranscript={handleVoiceTranscript} 
          onClose={() => setVoiceOpen(false)} 
        />
      )}

    </div>
  );
}
