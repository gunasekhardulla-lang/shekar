import React, { useState } from 'react';
import { useAppSelector } from '../store';
import { 
  Camera, ShieldCheck, Search, Users, AlertTriangle, CheckCircle, Navigation, Play, MapPin, Loader, Clock, HelpCircle, Compass
} from 'lucide-react';
import LiveTracking from '../components/LiveTracking';

export default function StaffDashboard() {
  const { bookingsList } = useAppSelector(state => state.booking);

  // Search input
  const [searchVal, setSearchVal] = useState('');
  const [selectedDemoTxn, setSelectedDemoTxn] = useState('');

  // Scanning animation states
  const [isScanning, setIsScanning] = useState(false);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [verifiedBooking, setVerifiedBooking] = useState<any | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Live journey tracking tab state
  const [activeTrackingBooking, setActiveTrackingBooking] = useState<any>(null);

  // Filter booking lists
  const matchBookings = bookingsList.filter(b => 
    b.id.toLowerCase().includes(searchVal.toLowerCase()) || 
    b.passengerDetails.some(p => p.name.toLowerCase().includes(searchVal.toLowerCase()))
  );

  const handleSimulateScan = (txnId: string) => {
    if (!txnId) return;
    setIsScanning(true);
    setScanningProgress(0);
    setVerifiedBooking(null);
    setVerificationError(null);

    // Simulate scanning beam loader
    const interval = setInterval(() => {
      setScanningProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          const found = bookingsList.find(b => b.id === txnId);
          if (found) {
            setVerifiedBooking(found);
          } else {
            setVerificationError('No ticket registered matching this boarding hash. Security warning triggered!');
          }
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans" id="staff-hub-page">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">Boarding Verification Hub</h2>
          <p className="text-xs text-slate-400 font-medium font-sans">Verification staff terminal for checking QR passes, boarding logs, and track live schedules.</p>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
          <span>Staff ID: Sarah Concierge</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: QR Pass Scanner Simulator & Lookup */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Lookup Input */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-lg space-y-4">
            <h3 className="font-bold text-slate-950 dark:text-white text-base">QR Boarding Pass scanner</h3>
            <p className="text-xs text-slate-400">Search reservation credentials or simulate camera scan of customer QR.</p>

            {/* Quick Demo Pick dropdown to select which ticket to scan */}
            <div>
              <label className="block text-[10px] text-slate-600 uppercase tracking-wider mb-1.5 font-bold">Pick Demo Ticket to Scan</label>
              <select
                value={selectedDemoTxn}
                onChange={(e) => setSelectedDemoTxn(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white rounded-xl outline-none font-bold"
              >
                <option value="">-- Choose passenger ticket --</option>
                {bookingsList.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.passengerDetails[0]?.name || 'Passenger'} ({b.id})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleSimulateScan(selectedDemoTxn)}
              disabled={!selectedDemoTxn || isScanning}
              className={`w-full py-3 rounded-2xl text-xs font-bold text-white flex items-center justify-center space-x-2 transition ${
                !selectedDemoTxn || isScanning
                  ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 shadow-md cursor-pointer'
              }`}
            >
              <Camera className="h-4.5 w-4.5" />
              <span>Simulate QR Camera Scan</span>
            </button>

            {/* Scanning progress bar */}
            {isScanning && (
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-emerald-500/10 text-center flex flex-col items-center">
                <Loader className="h-6 w-6 text-emerald-500 animate-spin mb-2" />
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">ALIGNING PASSENGER HASH CODE ({scanningProgress}%)</p>
                <div className="w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${scanningProgress}%` }}></div>
                </div>
              </div>
            )}

            {/* Scanning Output Match success */}
            {verifiedBooking && (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl space-y-3.5 text-xs">
                <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle className="h-5 w-5" />
                  <span>Ticket Verified Successfully!</span>
                </div>
                <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800/80 pt-2 font-medium">
                  <p className="text-slate-900 dark:text-white font-bold">{verifiedBooking.vehicleName}</p>
                  <p className="text-slate-600">Route: {verifiedBooking.source} → {verifiedBooking.destination}</p>
                  <p className="text-slate-600">Pessenger: <strong className="text-slate-800 dark:text-slate-200">{verifiedBooking.passengerDetails[0]?.name}</strong></p>
                  <p className="text-slate-600">Seats: <strong className="text-slate-800 dark:text-slate-200 font-mono">{verifiedBooking.seats.join(', ')}</strong></p>
                </div>
                <button
                  onClick={() => setActiveTrackingBooking(verifiedBooking)}
                  className="w-full py-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-lg flex items-center justify-center space-x-1 border border-emerald-500/10"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Track Vehicle Location</span>
                </button>
              </div>
            )}

            {/* Scanning Output Error */}
            {verificationError && (
              <div className="p-4 bg-rose-500/5 border border-rose-500/15 rounded-2xl flex items-start space-x-2 text-xs text-rose-600 font-semibold">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span className="leading-normal">{verificationError}</span>
              </div>
            )}

          </div>

          {/* Quick Lookup Text search box */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-lg space-y-4">
            <h4 className="font-bold text-slate-950 dark:text-white text-sm">Credentials Lookup</h4>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white rounded-xl outline-none"
                placeholder="Search ticket number, or traveler..."
              />
            </div>
          </div>

        </div>

        {/* Right column: Boarding Manifest (pending/checked-in) or Live Tracking */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Map tracking section (Live tracking component integration) */}
          {activeTrackingBooking ? (
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-lg space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <h3 className="font-bold text-slate-950 dark:text-white text-base">GPS Location telemetry tracking</h3>
                  <p className="text-xs text-slate-400">Tracking verified vehicle: {activeTrackingBooking.vehicleName}</p>
                </div>
                <button
                  onClick={() => setActiveTrackingBooking(null)}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Close Tracking Panel
                </button>
              </div>

              {/* Render our real live tracking widget */}
              <LiveTracking 
                vehicleName={activeTrackingBooking.vehicleName}
                provider={activeTrackingBooking.provider}
                source={activeTrackingBooking.source}
                destination={activeTrackingBooking.destination}
              />
            </div>
          ) : (
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-lg space-y-5">
              <div>
                <h3 className="font-bold text-slate-950 dark:text-white text-base">Boarding Manifest Ledger</h3>
                <p className="text-xs text-slate-400 font-medium">Verify bookings match currently running schedules.</p>
              </div>

              <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
                {matchBookings.map((b) => (
                  <div 
                    key={b.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/40 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-950 dark:text-white">{b.passengerDetails[0]?.name}</span>
                        <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-mono text-slate-400">{b.id}</span>
                      </div>
                      <p className="text-slate-600 font-medium mt-0.5">{b.vehicleName} • {b.source} → {b.destination}</p>
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">Seats: {b.seats.join(', ')}</p>
                    </div>

                    <div className="flex items-center space-x-3.5 self-end sm:self-auto">
                      <button
                        onClick={() => handleSimulateScan(b.id)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-xl flex items-center space-x-1"
                      >
                        <Camera className="h-3.5 w-3.5" />
                        <span>Quick scan verify</span>
                      </button>
                      <button
                        onClick={() => setActiveTrackingBooking(b)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl"
                        title="View Live GPS Route"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
