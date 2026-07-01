import React, { useState } from 'react';
import { useAppDispatch, useAppSelector, addVehicle } from '../store';
import { 
  Bus, Sliders, Layout, PlusCircle, CheckCircle, PieChart, ShieldAlert, TrendingUp, DollarSign, Calendar, MapPin, Tag, Compass
} from 'lucide-react';
import { Vehicle, TicketCategory } from '../types';

export default function VendorDashboard() {
  const dispatch = useAppDispatch();
  const { vehicles, bookingsList } = useAppSelector(state => state.booking);

  // Stats
  const vendorVehicles = vehicles.filter(v => v.provider.toLowerCase().includes('indigo') || v.provider.toLowerCase().includes('zingbus') || v.provider.toLowerCase().includes('vrl'));
  const totalVehicles = vendorVehicles.length;
  const activeRoutes = totalVehicles * 2;
  const bookingsHandled = bookingsList.length + 12;
  const mockRevenue = 154800;

  // Add vehicle form state
  const [vehName, setVehName] = useState('');
  const [vehProvider, setVehProvider] = useState('Zingbus Premium AC');
  const [vehCategory, setVehCategory] = useState<TicketCategory>('bus');
  const [vehPrice, setVehPrice] = useState('1100');
  const [vehDeparture, setVehDeparture] = useState('21:00');
  const [vehArrival, setVehArrival] = useState('06:30');
  const [vehDuration, setVehDuration] = useState('9h 30m');
  const [vehLogo, setVehLogo] = useState('🚌');
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehName || !vehPrice) return;

    const newVeh: Vehicle = {
      id: 'v-new-' + Date.now(),
      name: vehName,
      provider: vehProvider,
      category: vehCategory,
      rating: 4.5,
      departureTime: vehDeparture,
      arrivalTime: vehArrival,
      price: parseFloat(vehPrice) || 500,
      duration: vehDuration,
      availableSeats: 30,
      totalSeats: 40,
      logoUrl: vehLogo
    };

    dispatch(addVehicle(newVeh));
    setFormMessage(`Successfully dispatched ${vehName} to route! This vehicle is now live for client search.`);
    
    // Clear
    setVehName('');
    setTimeout(() => setFormMessage(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans" id="vendor-dashboard-page">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">Vendor Partner Hub</h2>
          <p className="text-xs text-slate-400 font-medium">Manage fleet schedules, dispatch routes, inspect reservation analytics.</p>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold">
          <Compass className="h-4 w-4" />
          <span>Alex Fleet Services Inc</span>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-xs font-medium">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 uppercase tracking-wider font-semibold">Fleet Count</span>
            <Bus className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-slate-950 dark:text-white">{totalVehicles} Vehicles</p>
          <p className="text-[10px] text-slate-400 mt-1">Bus, Train, Flight options</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 uppercase tracking-wider font-semibold">Dispatched Lines</span>
            <MapPin className="h-4 w-4 text-teal-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-slate-950 dark:text-white">{activeRoutes} Routes</p>
          <p className="text-[10px] text-slate-400 mt-1">Active interstate corridors</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 uppercase tracking-wider font-semibold">Fares Reserved</span>
            <Layout className="h-4 w-4 text-pink-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-slate-950 dark:text-white">{bookingsHandled} Tickets</p>
          <p className="text-[10px] text-slate-400 mt-1">Total seats filled this week</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 uppercase tracking-wider font-semibold">Fleet Earnings</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-slate-950 dark:text-white">₹{mockRevenue}</p>
          <p className="text-[10px] text-slate-400 mt-1">Cashback margins deducted</p>
        </div>
      </div>

      {/* Main layout: Dispatch Fleet Form vs Active Vehicles list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dispatch Route Form */}
        <div className="lg:col-span-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 border border-slate-150 dark:border-slate-800/60 rounded-3xl shadow-lg space-y-5">
          <h3 className="font-bold text-slate-950 dark:text-white text-base">Dispatch New Corridor</h3>
          <p className="text-xs text-slate-500 font-medium">Input carrier specifications to go live instantly.</p>

          {formMessage && (
            <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start space-x-2 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{formMessage}</span>
            </div>
          )}

          <form onSubmit={handleAddVehicleSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1">Carrier Name</label>
              <input
                type="text"
                value={vehName}
                onChange={(e) => setVehName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/50 outline-none"
                placeholder="e.g. Zingbus Multi-Axle Volvo"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1">Category Type</label>
                <select
                  value={vehCategory}
                  onChange={(e) => {
                    const cat = e.target.value as TicketCategory;
                    setVehCategory(cat);
                    if (cat === 'flight') { setVehLogo('✈️'); setVehProvider('IndiGo Airlines'); }
                    else if (cat === 'train') { setVehLogo('🚂'); setVehProvider('Indian Railways'); }
                    else if (cat === 'bus') { setVehLogo('🚌'); setVehProvider('Zingbus Premium AC'); }
                    else if (cat === 'movie') { setVehLogo('🎬'); setVehProvider('PVR IMAX'); }
                    else { setVehLogo('🎸'); setVehProvider('DY Patil Complex'); }
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white rounded-xl outline-none cursor-pointer"
                >
                  <option value="bus">Bus</option>
                  <option value="train">Train</option>
                  <option value="flight">Flight</option>
                  <option value="movie">Movie</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1">Base Price (₹)</label>
                <input
                  type="number"
                  value={vehPrice}
                  onChange={(e) => setVehPrice(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl outline-none"
                  placeholder="₹ Price"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1">Departure time</label>
                <input
                  type="text"
                  value={vehDeparture}
                  onChange={(e) => setVehDeparture(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl outline-none"
                  placeholder="e.g. 21:00"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1">Arrival time</label>
                <input
                  type="text"
                  value={vehArrival}
                  onChange={(e) => setVehArrival(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl outline-none"
                  placeholder="e.g. 06:30"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1">Duration</label>
                <input
                  type="text"
                  value={vehDuration}
                  onChange={(e) => setVehDuration(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl outline-none"
                  placeholder="9h 30m"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1">Graphic Logo Icon</label>
                <input
                  type="text"
                  value={vehLogo}
                  onChange={(e) => setVehLogo(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl outline-none text-center"
                  placeholder="🚌"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow hover:opacity-95 flex items-center justify-center space-x-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Launch Live Schedule</span>
            </button>
          </form>

        </div>

        {/* Active Dispatched list column */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 border border-slate-150 dark:border-slate-800/60 rounded-3xl shadow-lg space-y-5">
          <div>
            <h3 className="font-bold text-slate-950 dark:text-white text-base">Live fleet schedules</h3>
            <p className="text-xs text-slate-500 font-medium">Verify running corridors and check remaining seat capacities.</p>
          </div>

          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
            {vendorVehicles.map((vehicle) => (
              <div 
                key={vehicle.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/40 flex justify-between items-center text-xs"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="text-xl p-2.5 bg-white dark:bg-slate-900 rounded-xl">
                    {vehicle.logoUrl || '🚌'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950 dark:text-white font-sans">{vehicle.name}</h4>
                    <p className="text-slate-400">{vehicle.provider} • {vehicle.category}</p>
                    <p className="font-mono text-[10px] text-slate-500 mt-1">{vehicle.departureTime} → {vehicle.arrivalTime} ({vehicle.duration})</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">₹{vehicle.price}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase mt-1">
                    🟢 {vehicle.availableSeats} Seats Avail
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
