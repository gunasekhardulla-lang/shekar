import React, { useState } from 'react';
import { useAppDispatch, useAppSelector, applyCoupon, removeCoupon, createBooking, deductFunds, addNotification } from '../store';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, ShieldCheck, Ticket, Percent, Sparkles, User, HelpCircle, AlertCircle, QrCode, ArrowLeft, ArrowRight, Wallet
} from 'lucide-react';
import SeatMap from '../components/SeatMap';
import { Passenger, Booking } from '../types';

export default function BookingPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { selectedVehicle, selectedSeats, activeCoupon, coupons, searchQuery } = useAppSelector(state => state.booking);
  const { balance } = useAppSelector(state => state.wallet);
  const { currentUser } = useAppSelector(state => state.auth);

  // Form states
  const [passengers, setPassengers] = useState<Passenger[]>(
    selectedSeats.map(() => ({ name: '', age: 0, gender: 'male' }))
  );
  const [couponInput, setCouponInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'wallet' | 'qr'>('upi');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!selectedVehicle) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Session Expired</h3>
        <p className="text-sm text-slate-400 mt-2">Please go back to the search dashboard and pick a flight, train, or bus to initiate a seat reservation.</p>
        <button onClick={() => navigate('/')} className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm">
          Return Home
        </button>
      </div>
    );
  }

  // Handle passenger input changes
  const handlePassengerChange = (idx: number, field: keyof Passenger, val: any) => {
    const list = [...passengers];
    if (!list[idx]) {
      list[idx] = { name: '', age: 0, gender: 'male' };
    }
    list[idx] = { ...list[idx], [field]: val };
    setPassengers(list);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    dispatch(applyCoupon(couponInput));
    setCouponInput('');
  };

  // Pricing calculations
  const basePrice = selectedVehicle.price;
  const fareSum = selectedSeats.reduce((acc, seat) => acc + Math.round(basePrice * seat.priceMultiplier), 0);
  const convenienceFee = selectedSeats.length > 0 ? 150 : 0;
  const gstAmount = Math.round(fareSum * 0.18);
  
  let discountAmount = 0;
  if (activeCoupon && fareSum >= activeCoupon.minAmount) {
    if (activeCoupon.type === 'percent') {
      discountAmount = Math.min(Math.round(fareSum * (activeCoupon.discount / 100)), 500);
    } else {
      discountAmount = activeCoupon.discount;
    }
  }

  const grandTotal = fareSum + convenienceFee + gstAmount - discountAmount;

  // Handle Book Trigger
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      setErrorMessage('Please select at least one seat from the Interactive Seat Map.');
      return;
    }

    // Validate passenger fields
    const invalid = passengers.some(p => !p.name || p.age <= 0);
    if (invalid) {
      setErrorMessage('Please provide valid Names and Ages for all ticket holders.');
      return;
    }

    setErrorMessage(null);

    // If payment method is wallet, check balance
    if (paymentMethod === 'wallet' && balance < grandTotal) {
      setErrorMessage('Insufficient wallet balance. Please add funds using the quick top-up in the navigation bar!');
      return;
    }

    // Deduct funds if wallet selected
    if (paymentMethod === 'wallet') {
      dispatch(deductFunds({ 
        amount: grandTotal, 
        description: `Paid for ticket ${selectedVehicle.name} seats: ${selectedSeats.map(s => s.number).join(', ')}` 
      }));
    }

    const txnId = 'TXN-' + Math.floor(1000000 + Math.random() * 9000000);
    const newBooking: Booking = {
      id: txnId,
      userId: currentUser?.id || 'usr-guest',
      vehicleId: selectedVehicle.id,
      vehicleName: selectedVehicle.name,
      provider: selectedVehicle.provider,
      category: selectedVehicle.category,
      source: searchQuery.source,
      destination: searchQuery.destination,
      date: searchQuery.date,
      departureTime: selectedVehicle.departureTime,
      arrivalTime: selectedVehicle.arrivalTime,
      seats: selectedSeats.map(s => s.number),
      totalAmount: grandTotal,
      status: 'active',
      passengerDetails: passengers,
      qrCode: `OMNIBOOK-${txnId}-${searchQuery.source.substring(0, 3).toUpperCase()}`,
      paymentMethod: paymentMethod.toUpperCase(),
      createdAt: new Date().toISOString()
    };

    // Store in state
    dispatch(createBooking(newBooking));

    // Send Notification
    dispatch(addNotification({
      id: 'not-' + Date.now(),
      title: 'Booking Confirmed 🎉',
      message: `Successfully booked ticket for ${selectedVehicle.name} (${searchQuery.source} to ${searchQuery.destination}). Seats: ${selectedSeats.map(s => s.number).join(', ')}. Transaction: ${txnId}`,
      time: 'Just now',
      read: false,
      type: 'success'
    }));

    // Redirect to success
    navigate(`/success?txn=${txnId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans" id="booking-details-page">
      
      {/* Return search button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Modify Search Selection</span>
      </button>

      {/* Main Grid: Left (Seat Map & Forms) vs Right (Billing checkout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column (Seat Map & Passenger Input) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Seat Map component */}
          <SeatMap />

          {/* Passenger Input section */}
          {selectedSeats.length > 0 && (
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 border border-slate-150 dark:border-slate-800/60 shadow-lg">
              <h3 className="font-bold text-lg text-slate-950 dark:text-white mb-4">Passenger Credentials</h3>
              
              <div className="space-y-4">
                {selectedSeats.map((seat, index) => (
                  <div 
                    key={seat.id} 
                    className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/40"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <User className="h-4 w-4 text-emerald-500" />
                        <span>Passenger for Seat {seat.number} ({seat.type})</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      
                      {/* Name */}
                      <div>
                        <label className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Full Name</label>
                        <input
                          type="text"
                          value={passengers[index]?.name || ''}
                          onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
                          placeholder="e.g. Gunasekhar Dulla"
                          required
                        />
                      </div>

                      {/* Age */}
                      <div>
                        <label className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Age</label>
                        <input
                          type="number"
                          min="1"
                          max="110"
                          value={passengers[index]?.age || ''}
                          onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value) || 0)}
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/50 font-bold font-mono"
                          placeholder="Age"
                          required
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Gender</label>
                        <select
                          value={passengers[index]?.gender || 'male'}
                          onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/50 font-medium cursor-pointer"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right column: Billing breakdown & checkout gateways */}
        <div className="space-y-6">
          
          {/* Billing breakdown panel */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 border border-slate-150 dark:border-slate-800/60 rounded-3xl shadow-lg space-y-5">
            <h3 className="font-bold text-slate-950 dark:text-white text-base">Booking Summary</h3>

            {/* Selected Vehicle Card Preview */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/40 flex items-center space-x-3 text-xs">
              <div className="text-xl p-2.5 bg-white dark:bg-slate-900 rounded-xl">
                {selectedVehicle.logoUrl || '✈️'}
              </div>
              <div>
                <h4 className="font-bold text-slate-950 dark:text-white">{selectedVehicle.name}</h4>
                <p className="text-slate-400">{selectedVehicle.provider} • {selectedVehicle.category}</p>
                <p className="font-mono text-slate-500 mt-1">{searchQuery.source} → {searchQuery.destination}</p>
              </div>
            </div>

            {/* Error alerts */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-start space-x-2 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span className="leading-normal">{errorMessage}</span>
              </div>
            )}

            {/* Coupons/Voucher panel inside Summary */}
            <div>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-2">Apply Voucher Code</p>
              <form onSubmit={handleCouponSubmit} className="flex space-x-1.5">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/50 uppercase font-bold font-mono outline-none"
                  placeholder="e.g. OMNI50"
                />
                <button 
                  type="submit" 
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Apply
                </button>
              </form>

              {activeCoupon && (
                <div className="mt-2.5 p-2 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Percent className="h-3.5 w-3.5" />
                    <span>Coupon {activeCoupon.code} Active</span>
                  </div>
                  <button 
                    onClick={() => dispatch(removeCoupon())} 
                    className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold uppercase tracking-wider"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Suggestions dropdown preview */}
              <div className="mt-3 flex flex-wrap gap-1">
                {coupons.map(c => (
                  <button
                    key={c.code}
                    onClick={() => dispatch(applyCoupon(c.code))}
                    className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculations layout */}
            <div className="space-y-2 text-xs font-medium border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Base Seats Fare ({selectedSeats.length})</span>
                <span className="font-mono text-slate-900 dark:text-white">₹{fareSum}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 flex items-center space-x-1">
                  <span>Convenience Fee</span>
                  <HelpCircle className="h-3 w-3 text-slate-350" title="Fixed platform convenience fee" />
                </span>
                <span className="font-mono text-slate-900 dark:text-white">₹{convenienceFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GST Registration (18%)</span>
                <span className="font-mono text-slate-900 dark:text-white">₹{gstAmount}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Coupon Deduction</span>
                  <span className="font-mono">-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold border-t border-slate-100 dark:border-slate-800 pt-3.5 text-slate-950 dark:text-white">
                <span>Grand Checkout Fare</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 text-base">₹{grandTotal}</span>
              </div>
            </div>

          </div>

          {/* Payment gateway selection */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 border border-slate-150 dark:border-slate-800/60 rounded-3xl shadow-lg space-y-4">
            <h4 className="font-bold text-slate-950 dark:text-white text-sm">Payment Method Gateway</h4>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 rounded-2xl border font-bold flex flex-col items-center space-y-1.5 transition ${
                  paymentMethod === 'upi'
                    ? 'bg-emerald-500/5 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="h-4.5 w-4.5" />
                <span>UPI Checkout</span>
              </button>

              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border font-bold flex flex-col items-center space-y-1.5 transition ${
                  paymentMethod === 'card'
                    ? 'bg-emerald-500/5 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="h-4.5 w-4.5" />
                <span>Card Terminal</span>
              </button>

              <button
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3.5 rounded-2xl border font-bold flex flex-col items-center space-y-1.5 transition ${
                  paymentMethod === 'wallet'
                    ? 'bg-emerald-500/5 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Wallet className="h-4.5 w-4.5" />
                <span className="font-mono">Omni Wallet (₹{balance})</span>
              </button>

              <button
                onClick={() => setPaymentMethod('qr')}
                className={`p-3.5 rounded-2xl border font-bold flex flex-col items-center space-y-1.5 transition ${
                  paymentMethod === 'qr'
                    ? 'bg-emerald-500/5 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <QrCode className="h-4.5 w-4.5" />
                <span>QR QuickScan</span>
              </button>

            </div>

            {/* QR Scan simulator if selected */}
            {paymentMethod === 'qr' && (
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/60 text-center flex flex-col items-center">
                <div className="p-2.5 bg-white rounded-xl mb-2 border border-slate-200 shadow-sm">
                  <QrCode className="h-28 w-28 text-slate-800" />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold font-mono uppercase">SCAN OR CODE TO PAY DISPATCH</p>
              </div>
            )}

            {/* Payment submission button */}
            <button
              onClick={handleCheckout}
              disabled={selectedSeats.length === 0}
              className={`w-full py-3.5 rounded-2xl text-xs font-bold text-white shadow-lg flex items-center justify-center space-x-1.5 ${
                selectedSeats.length === 0 
                  ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 shadow-emerald-500/15 cursor-pointer'
              }`}
            >
              <span>Verify & Complete Payment</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400 font-semibold text-center">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>PCI-DSS SSL ENCRYPTED GATEWAY</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
