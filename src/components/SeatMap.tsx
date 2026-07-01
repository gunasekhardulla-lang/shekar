import React from 'react';
import { useAppSelector, useAppDispatch, toggleSeatSelection } from '../store';
import { ShieldAlert, Zap, Heart, Check, Users } from 'lucide-react';
import { Seat } from '../types';

export default function SeatMap() {
  const dispatch = useAppDispatch();
  const { seats, selectedSeats, selectedVehicle } = useAppSelector(state => state.booking);

  if (!selectedVehicle) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        Please select a vehicle or show first to load seats.
      </div>
    );
  }

  // Group seats by rows
  const groupedSeats: { [key: string]: Seat[] } = {};
  seats.forEach(seat => {
    if (!groupedSeats[seat.row]) {
      groupedSeats[seat.row] = [];
    }
    groupedSeats[seat.row].push(seat);
  });

  const getSeatColor = (seat: Seat, isSelected: boolean) => {
    if (seat.status === 'booked') {
      return 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed';
    }
    if (isSelected) {
      return 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400';
    }
    switch (seat.type) {
      case 'vip':
        return 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800/50 hover:bg-amber-200';
      case 'premium':
        return 'bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-300 dark:border-teal-800/50 hover:bg-teal-200';
      case 'ladies':
        return 'bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-400 border border-pink-300 dark:border-pink-800/50 hover:bg-pink-200';
      case 'window':
        return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 hover:bg-emerald-100';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700';
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;
    dispatch(toggleSeatSelection(seat));
  };

  // Pricing summaries
  const basePrice = selectedVehicle.price;
  const calculatedTotal = selectedSeats.reduce((acc, seat) => {
    return acc + Math.round(basePrice * seat.priceMultiplier);
  }, 0);

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 border border-slate-150 dark:border-slate-800/60 shadow-lg font-sans" id="seat-map-component">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-lg text-slate-950 dark:text-white">Interactive Seat Map</h3>
          <p className="text-xs text-slate-500 font-medium">Select your preferred seat. Click to select.</p>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-semibold">
          <Zap className="h-3.5 w-3.5" />
          <span>Real-time availability</span>
        </div>
      </div>

      {/* Seat Category Legends */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl mb-8 text-xs font-medium">
        <div className="flex items-center space-x-2">
          <span className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-800 block border border-transparent"></span>
          <span className="text-slate-600 dark:text-slate-300">Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-5 h-5 rounded bg-amber-100 dark:bg-amber-950/40 border border-amber-300 block"></span>
          <span className="text-slate-600 dark:text-slate-300">VIP (1.5x)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-5 h-5 rounded bg-teal-100 dark:bg-teal-950/40 border border-teal-300 block"></span>
          <span className="text-slate-600 dark:text-slate-300">Premium (1.25x)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-5 h-5 rounded bg-pink-100 dark:bg-pink-950/40 border border-pink-300 block"></span>
          <span className="text-slate-600 dark:text-slate-300">Ladies Only</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-5 h-5 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 block"></span>
          <span className="text-slate-600 dark:text-slate-300">Window Seat</span>
        </div>
      </div>

      {/* Vehicle Cockpit / Screen Indicator */}
      <div className="relative max-w-sm mx-auto mb-10 text-center">
        <div className="w-full h-2.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/20 to-emerald-500/10 rounded-full"></div>
        <p className="text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-1.5">
          {selectedVehicle.category === 'movie' ? '🎬 SCREEN THIS WAY' : '✈️ FRONT OF VEHICLE'}
        </p>
      </div>

      {/* Seats Matrix Grid */}
      <div className="max-w-md mx-auto overflow-x-auto pb-4">
        <div className="flex flex-col space-y-3 min-w-[280px]">
          {Object.keys(groupedSeats).sort().map(rowName => {
            const rowSeats = groupedSeats[rowName];
            return (
              <div key={rowName} className="flex justify-between items-center space-x-2 px-1">
                {/* Row label */}
                <span className="w-5 font-mono font-bold text-slate-400 text-xs text-center">{rowName}</span>
                
                {/* Left side seats (Cols 1, 2, 3) */}
                <div className="flex space-x-2.5 flex-1 justify-center">
                  {rowSeats.slice(0, 3).map(seat => {
                    const isSelected = selectedSeats.some(s => s.id === seat.id);
                    return (
                      <button
                        key={seat.id}
                        disabled={seat.status === 'booked'}
                        onClick={() => handleSeatClick(seat)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all relative ${getSeatColor(seat, isSelected)}`}
                      >
                        {seat.number}
                        {seat.type === 'ladies' && seat.status !== 'booked' && !isSelected && (
                          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-pink-500"></span>
                        )}
                        {seat.type === 'vip' && seat.status !== 'booked' && !isSelected && (
                          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500"></span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Aisle */}
                <div className="w-6 border-l border-r border-slate-100 dark:border-slate-800/80 h-9 flex items-center justify-center text-[9px] font-semibold text-slate-400 font-mono">
                  AISLE
                </div>

                {/* Right side seats (Cols 4, 5, 6) */}
                <div className="flex space-x-2.5 flex-1 justify-center">
                  {rowSeats.slice(3, 6).map(seat => {
                    const isSelected = selectedSeats.some(s => s.id === seat.id);
                    return (
                      <button
                        key={seat.id}
                        disabled={seat.status === 'booked'}
                        onClick={() => handleSeatClick(seat)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all relative ${getSeatColor(seat, isSelected)}`}
                      >
                        {seat.number}
                        {seat.type === 'ladies' && seat.status !== 'booked' && !isSelected && (
                          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-pink-500"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Details Panel */}
      {selectedSeats.length > 0 ? (
        <div className="mt-8 pt-6 border-t border-slate-150 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Selected ({selectedSeats.length})</span>
              <div className="flex space-x-1">
                {selectedSeats.map(s => (
                  <span key={s.id} className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-xs font-bold">
                    {s.number}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1.5 flex items-center space-x-1">
              <span>Estimated Fare:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base">₹{calculatedTotal}</span>
              <span className="text-slate-400 font-normal text-xs">(Excl. taxes)</span>
            </p>
          </div>
          <div className="text-xs text-slate-400 max-w-xs leading-normal flex items-start space-x-1">
            <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Ladies seats (pink dots) are strictly reserved. Window seats (standard multipliers) are subject to choice.</span>
          </div>
        </div>
      ) : (
        <div className="mt-8 pt-6 border-t border-slate-150 dark:border-slate-800/80 text-center py-4 text-sm text-slate-400 font-medium">
          Select at least one seat to calculate fare and continue booking.
        </div>
      )}
    </div>
  );
}
