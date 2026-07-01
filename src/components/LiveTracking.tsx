import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Compass, AlertCircle, RefreshCw, Calendar, Clock, User } from 'lucide-react';

interface LiveTrackingProps {
  vehicleName: string;
  provider: string;
  source: string;
  destination: string;
}

export default function LiveTracking({ vehicleName, provider, source, destination }: LiveTrackingProps) {
  const [progress, setProgress] = useState(35); // simulated percent travel
  const [speed, setSpeed] = useState(78); // km/h or knots
  const [eta, setEta] = useState(140); // mins remaining
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsUpdating(true);
      setProgress(p => (p >= 100 ? 35 : p + 1.5));
      setSpeed(s => Math.round(s + (Math.random() * 6 - 3)));
      setEta(e => (e <= 10 ? 140 : e - 2));
      setTimeout(() => setIsUpdating(false), 500);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 border border-slate-150 dark:border-slate-800/60 shadow-lg font-sans" id="live-tracking-panel">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="font-bold text-lg text-slate-950 dark:text-white flex items-center space-x-1.5">
            <Compass className="h-5 w-5 text-emerald-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Live Journey Tracking</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium">{vehicleName} • {provider}</p>
        </div>
        <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-mono bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg">
          <span className={`h-2 w-2 rounded-full bg-emerald-500 ${isUpdating ? 'animate-ping' : ''}`}></span>
          <span>Live GPS Stream</span>
        </div>
      </div>

      {/* Map visual section */}
      <div className="relative h-64 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden flex items-center justify-center mb-6">
        
        {/* Mock Grid Lines */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-teal-500/5"></div>

        {/* Path line */}
        <svg className="absolute w-full h-full px-12" viewBox="0 0 400 200">
          {/* Main Route Path */}
          <path 
            d="M 50 100 Q 200 50 350 100" 
            fill="none" 
            stroke="#10b981" 
            strokeWidth="3" 
            strokeDasharray="4 4"
            className="opacity-40"
          />
          {/* Traveled Route Path */}
          <path 
            d="M 50 100 Q 200 50 350 100" 
            fill="none" 
            stroke="#14b8a6" 
            strokeWidth="4" 
            strokeDasharray="400"
            strokeDashoffset={400 - (400 * progress) / 100}
            className="transition-all duration-1000 ease-in-out"
          />

          {/* Source node */}
          <circle cx="50" cy="100" r="6" fill="#10b981" className="animate-pulse" />
          {/* Destination node */}
          <circle cx="350" cy="100" r="6" fill="#14b8a6" className="animate-pulse" />
        </svg>

        {/* Little Moving Vehicle along curve */}
        <div 
          className="absolute transition-all duration-1000 ease-in-out"
          style={{
            left: `${12 + (progress * 0.72)}%`,
            top: `${40 + Math.sin((progress / 100) * Math.PI) * -15}%`,
          }}
        >
          <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full text-white shadow-xl flex items-center justify-center animate-bounce">
            <Navigation className="h-4.5 w-4.5 transform rotate-45" />
          </div>
          {/* Speed bubble */}
          <div className="absolute -top-7 -left-4 bg-slate-900/90 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap">
            {speed} km/h
          </div>
        </div>

        {/* Landmark tags on Map */}
        <div className="absolute top-1/4 left-10 text-center">
          <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 font-mono flex items-center space-x-1">
            <MapPin className="h-3 w-3 text-emerald-500" />
            <span>{source}</span>
          </p>
        </div>

        <div className="absolute top-1/4 right-10 text-center">
          <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 font-mono flex items-center space-x-1">
            <MapPin className="h-3 w-3 text-teal-500" />
            <span>{destination}</span>
          </p>
        </div>

        {/* Interactive Google Map Simulation Label */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white/85 dark:bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-200/50 dark:border-slate-800 text-[10px] text-slate-500 font-semibold font-mono">
          <span>Mapbox Engine V2 • Mocked Map Integration</span>
        </div>
      </div>

      {/* Live metrics widgets */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/40 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Progress</p>
          <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{Math.round(progress)}%</p>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/40 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Speed</p>
          <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{speed} km/h</p>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/40 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Remaining</p>
          <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{Math.round(eta / 60)}h {eta % 60}m</p>
        </div>
      </div>

      {/* Safety message */}
      <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start space-x-2.5 text-xs text-amber-600 dark:text-amber-400">
        <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
        <p className="leading-normal">Journey delays due to minor weather conditions. Route optimizations are handled by automatic navigation systems.</p>
      </div>

    </div>
  );
}
