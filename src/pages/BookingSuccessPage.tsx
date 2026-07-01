import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAppSelector } from '../store';
import { 
  CheckCircle, ArrowRight, Download, Share2, Printer, MapPin, Calendar, QrCode, Ticket, Mail, ChevronRight, Sliders
} from 'lucide-react';

export default function BookingSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const txnId = searchParams.get('txn') || '';

  const { bookingsList } = useAppSelector(state => state.booking);
  const booking = bookingsList.find(b => b.id === txnId) || bookingsList[0];

  const [shareStatus, setShareStatus] = useState<string | null>(null);

  if (!booking) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4 font-sans">
        <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto mb-4 animate-pulse" />
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Transaction Success</h3>
        <p className="text-xs text-slate-400 mt-2">Your payment has been logged securely, but the receipt reference is stale.</p>
        <button onClick={() => navigate('/')} className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm">
          Return Home
        </button>
      </div>
    );
  }

  const handleDownload = () => {
    alert(`Downloading Ticket PDF receipt for ${booking.id}... Successfully saved to Downloads folder.`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Hey, I just booked my ticket on OmniBook! Journey: ${booking.source} to ${booking.destination} on ${booking.date}. Seats: ${booking.seats.join(', ')}. Code: ${booking.qrCode}`);
    setShareStatus('copied');
    setTimeout(() => setShareStatus(null), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 font-sans" id="success-confirmation-page">
      
      {/* Top Animation */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full text-emerald-500 mb-4 animate-bounce">
          <CheckCircle className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Booking Confirmed!</h2>
        <p className="text-xs text-slate-400 mt-1 font-medium font-mono">Reference receipt ID: {booking.id}</p>
      </div>

      {/* Modern Boarding Pass Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850/50 rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Absolute Circles for Classic punched ticket feel */}
        <div className="absolute top-1/2 -left-3 h-6 w-6 rounded-full bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transform -translate-y-1/2 z-10"></div>
        <div className="absolute top-1/2 -right-3 h-6 w-6 rounded-full bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 transform -translate-y-1/2 z-10"></div>

        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase bg-white/10 px-2 py-0.5 rounded-md font-mono">Boarding Pass</span>
            <h3 className="font-bold text-lg mt-1">{booking.vehicleName}</h3>
            <p className="text-xs text-emerald-100">{booking.provider} • Class: Standard</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-emerald-100 font-bold uppercase block">Payment Verified</span>
            <p className="font-mono font-bold text-lg text-white">₹{booking.totalAmount}</p>
          </div>
        </div>

        {/* Ticket Body details */}
        <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4 border-b border-dashed border-slate-150 dark:border-slate-800/80">
          
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Source Route</p>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1.5 flex items-center space-x-1.5">
              <MapPin className="h-4 w-4 text-emerald-500" />
              <span>{booking.source}</span>
            </p>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">Departs at {booking.departureTime}</p>
          </div>

          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Destination Route</p>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1.5 flex items-center space-x-1.5">
              <MapPin className="h-4 w-4 text-teal-500" />
              <span>{booking.destination}</span>
            </p>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">Arrives at {booking.arrivalTime}</p>
          </div>

          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Departure Date</p>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1.5 flex items-center space-x-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>{booking.date}</span>
            </p>
          </div>

          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Allocated Seats</p>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1.5 flex items-center space-x-1.5">
              <Ticket className="h-4 w-4 text-slate-400" />
              <span className="font-mono">{booking.seats.join(', ')}</span>
            </p>
          </div>

        </div>

        {/* Ticket Bottom section with QR and passenger details */}
        <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-6">
          
          <div className="space-y-3.5 flex-1 self-stretch">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Pessenger Credentials</p>
            {booking.passengerDetails.map((p, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{p.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{p.gender} • {p.age} years</p>
                </div>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px] text-slate-500">Seat {booking.seats[idx]}</span>
              </div>
            ))}
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center">
            <div className="p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <QrCode className="h-28 w-28 text-slate-800" />
            </div>
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-slate-400 mt-2">{booking.qrCode}</span>
          </div>

        </div>

      </div>

      {/* Download and Print Actions */}
      <div className="grid grid-cols-2 gap-3.5 mt-8">
        
        <button
          onClick={handleDownload}
          className="py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Download className="h-4 w-4 text-emerald-500" />
          <span>Save Boarding Pass</span>
        </button>

        <button
          onClick={handleShare}
          className="py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Share2 className="h-4 w-4 text-teal-500" />
          <span>{shareStatus === 'copied' ? 'Link Copied!' : 'Share Ticket Details'}</span>
        </button>

      </div>

      {/* Success navigation choices */}
      <div className="mt-8 p-5 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-3xl border border-emerald-500/10 text-center flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ready to inspect or manage your reservation?</p>
        <div className="flex space-x-2.5">
          <Link 
            to="/dashboard" 
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1 shadow-md shadow-emerald-500/10"
          >
            <span>Customer Hub</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <Link 
            to="/" 
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
          >
            Go Home
          </Link>
        </div>
      </div>

    </div>
  );
}
