import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { 
  User, Booking, Coupon, Vehicle, Review, Notification, WalletTransaction, SearchQuery, Seat, AuditLog
} from '../types';

// ==========================================
// 1. AUTH SLICE
// ==========================================
interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  usersList: User[];
}

const initialUsers: User[] = [
  { id: 'usr-1', name: 'Gunasekhar Dulla', email: 'gunasekhardulla@gmail.com', role: 'customer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', walletBalance: 4500 },
  { id: 'usr-2', name: 'Alex Vendor', email: 'alex@vendor.com', role: 'vendor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', walletBalance: 12400 },
  { id: 'usr-3', name: 'Sarah Staff', email: 'sarah@staff.com', role: 'staff', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', walletBalance: 1500 },
  { id: 'usr-4', name: 'Admin Boss', email: 'admin@omnibook.com', role: 'admin', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', walletBalance: 98000 }
];

const initialAuthState: AuthState = {
  currentUser: initialUsers[0], // Default logged-in as Customer
  isAuthenticated: true,
  usersList: initialUsers
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setCurrentUserByRole: (state, action: PayloadAction<User['role']>) => {
      const found = state.usersList.find(u => u.role === action.payload);
      if (found) {
        state.currentUser = found;
        state.isAuthenticated = true;
      }
    },
    updateProfile: (state, action: PayloadAction<{ name: string; email: string; avatar?: string }>) => {
      if (state.currentUser) {
        state.currentUser.name = action.payload.name;
        state.currentUser.email = action.payload.email;
        if (action.payload.avatar) {
          state.currentUser.avatar = action.payload.avatar;
        }
        // Sync in list
        const index = state.usersList.findIndex(u => u.id === state.currentUser?.id);
        if (index !== -1) {
          state.usersList[index] = { ...state.usersList[index], ...action.payload };
        }
      }
    },
    login: (state, action: PayloadAction<{ email: string; role: User['role'] }>) => {
      const email = action.payload.email;
      const role = action.payload.role;
      // Find or create
      let user = state.usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        user = {
          id: 'usr-' + Date.now(),
          name: email.split('@')[0].toUpperCase(),
          email,
          role,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
          walletBalance: 2000
        };
        state.usersList.push(user);
      } else {
        // override role for login simulation
        user.role = role;
      }
      state.currentUser = user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.usersList.push(action.payload);
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.usersList = state.usersList.filter(u => u.id !== action.payload);
    }
  }
});

// ==========================================
// 2. BOOKING / VEHICLES SLICE
// ==========================================
interface BookingState {
  searchQuery: SearchQuery;
  vehicles: Vehicle[];
  filteredVehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  seats: Seat[];
  selectedSeats: Seat[];
  bookingsList: Booking[];
  coupons: Coupon[];
  activeCoupon: Coupon | null;
  wishlist: string[]; // vehicle IDs
}

const initialVehicles: Vehicle[] = [
  // Flights
  { id: 'v-fl-1', name: 'IndiGo 6E-214', provider: 'IndiGo Airlines', category: 'flight', rating: 4.5, departureTime: '06:00', arrivalTime: '08:15', price: 4200, duration: '2h 15m', stops: 'Non-stop', availableSeats: 18, totalSeats: 180, logoUrl: '✈️' },
  { id: 'v-fl-2', name: 'Air India AI-421', provider: 'Air India', category: 'flight', rating: 4.2, departureTime: '14:30', arrivalTime: '17:45', price: 5800, duration: '3h 15m', stops: '1 Stop via BOM', availableSeats: 24, totalSeats: 150, logoUrl: '✈️' },
  { id: 'v-fl-3', name: 'Vistara UK-945', provider: 'Vistara', category: 'flight', rating: 4.8, departureTime: '18:15', arrivalTime: '20:30', price: 7100, duration: '2h 15m', stops: 'Non-stop', availableSeats: 30, totalSeats: 120, logoUrl: '✈️' },
  
  // Trains
  { id: 'v-tr-1', name: 'Rajdhani Express (12951)', provider: 'Indian Railways', category: 'train', rating: 4.6, departureTime: '16:55', arrivalTime: '08:35', price: 2150, duration: '15h 40m', stops: '4 Stops', availableSeats: 12, totalSeats: 400, logoUrl: '🚂' },
  { id: 'v-tr-2', name: 'Shatabdi Express (12002)', provider: 'Indian Railways', category: 'train', rating: 4.4, departureTime: '06:00', arrivalTime: '14:40', price: 1250, duration: '8h 40m', stops: '6 Stops', availableSeats: 45, totalSeats: 350, logoUrl: '🚂' },
  { id: 'v-tr-3', name: 'Vande Bharat (22436)', provider: 'Indian Railways', category: 'train', rating: 4.9, departureTime: '15:00', arrivalTime: '23:00', price: 1890, duration: '8h 00m', stops: '2 Stops', availableSeats: 60, totalSeats: 500, logoUrl: '🚂' },

  // Buses
  { id: 'v-bs-1', name: 'Zingbus Premium AC', provider: 'Zingbus', category: 'bus', rating: 4.3, departureTime: '21:00', arrivalTime: '06:30', price: 850, duration: '9h 30m', stops: '1 Dinner stop', availableSeats: 14, totalSeats: 40, logoUrl: '🚌' },
  { id: 'v-bs-2', name: 'IntrCity SmartBus Multi-Axle', provider: 'IntrCity SmartBus', category: 'bus', rating: 4.5, departureTime: '22:30', arrivalTime: '08:00', price: 1100, duration: '9h 30m', stops: 'Non-stop', availableSeats: 8, totalSeats: 36, logoUrl: '🚌' },
  { id: 'v-bs-3', name: 'VRL Travels Sleeper', provider: 'VRL Travels', category: 'bus', rating: 4.0, departureTime: '19:45', arrivalTime: '05:15', price: 950, duration: '9h 30m', stops: '2 Stops', availableSeats: 15, totalSeats: 40, logoUrl: '🚌' },

  // Movies
  { id: 'v-mv-1', name: 'Spider-Man: No Way Home', provider: 'PVR Director\'s Cut', category: 'movie', rating: 4.7, departureTime: '13:00', arrivalTime: '15:30', price: 350, duration: '2h 30m', availableSeats: 85, totalSeats: 150, logoUrl: '🎬' },
  { id: 'v-mv-2', name: 'Oppenheimer (IMAX 2D)', provider: 'IMAX - PVR ECX', category: 'movie', rating: 4.9, departureTime: '19:00', arrivalTime: '22:00', price: 650, duration: '3h 00m', availableSeats: 32, totalSeats: 180, logoUrl: '🎬' },
  { id: 'v-mv-3', name: 'Dune: Part Two', provider: 'Cinepolis Luxe', category: 'movie', rating: 4.8, departureTime: '21:30', arrivalTime: '00:15', price: 450, duration: '2h 45m', availableSeats: 55, totalSeats: 120, logoUrl: '🎬' },

  // Events
  { id: 'v-ev-1', name: 'Coldplay Music of the Spheres', provider: 'DY Patil Stadium', category: 'event', rating: 4.9, departureTime: '18:00', arrivalTime: '22:00', price: 9500, duration: '4h 00m', availableSeats: 120, totalSeats: 45000, logoUrl: '🎸' },
  { id: 'v-ev-2', name: 'Sunburn Music Festival Goa', provider: 'Vagator Beach Goa', category: 'event', rating: 4.7, departureTime: '15:00', arrivalTime: '23:30', price: 5500, duration: '8h 30m', availableSeats: 450, totalSeats: 25000, logoUrl: '🎸' },
  { id: 'v-ev-3', name: 'Stand-up Special: Zakir Khan', provider: 'NCPA Mumbai', category: 'event', rating: 4.8, departureTime: '20:00', arrivalTime: '22:00', price: 1500, duration: '2h 00m', availableSeats: 42, totalSeats: 1200, logoUrl: '🎤' }
];

const initialCoupons: Coupon[] = [
  { code: 'OMNI50', discount: 50, type: 'percent', description: '50% Off up to ₹200 on first booking', minAmount: 300 },
  { code: 'FLIGHT1000', discount: 1000, type: 'fixed', description: 'Flat ₹1000 Off on flights above ₹5000', minAmount: 5000 },
  { code: 'SUPERBUS', discount: 150, type: 'fixed', description: '₹150 Off on Bus journeys above ₹800', minAmount: 800 },
  { code: 'FESTIVE20', discount: 20, type: 'percent', description: '20% off up to ₹500 on all events and movies', minAmount: 500 }
];

const initialBookings: Booking[] = [
  {
    id: 'TXN-9023412',
    userId: 'usr-1',
    vehicleId: 'v-fl-1',
    vehicleName: 'IndiGo 6E-214',
    provider: 'IndiGo Airlines',
    category: 'flight',
    source: 'Delhi (DEL)',
    destination: 'Mumbai (BOM)',
    date: '2026-07-10',
    departureTime: '06:00',
    arrivalTime: '08:15',
    seats: ['12A', '12B'],
    totalAmount: 8400,
    status: 'active',
    passengerDetails: [
      { name: 'Gunasekhar Dulla', age: 28, gender: 'male' },
      { name: 'Prasad Dulla', age: 54, gender: 'male' }
    ],
    qrCode: 'OMNIBOOK-TXN-9023412-DEL-BOM',
    paymentMethod: 'UPI (GPay)',
    createdAt: '2026-06-25T11:45:00-07:00'
  },
  {
    id: 'TXN-1102934',
    userId: 'usr-1',
    vehicleId: 'v-bs-1',
    vehicleName: 'Zingbus Premium AC',
    provider: 'Zingbus',
    category: 'bus',
    source: 'Mumbai',
    destination: 'Pune',
    date: '2026-06-20',
    departureTime: '21:00',
    arrivalTime: '06:30',
    seats: ['L10'],
    totalAmount: 850,
    status: 'cancelled',
    passengerDetails: [
      { name: 'Gunasekhar Dulla', age: 28, gender: 'male' }
    ],
    qrCode: 'OMNIBOOK-TXN-1102934-MUM-PUN',
    paymentMethod: 'Wallet',
    createdAt: '2026-06-18T14:20:00-07:00'
  },
  {
    id: 'TXN-5524102',
    userId: 'usr-1',
    vehicleId: 'v-mv-2',
    vehicleName: 'Oppenheimer (IMAX 2D)',
    provider: 'IMAX - PVR ECX',
    category: 'movie',
    source: 'Bengaluru',
    destination: 'PVR IMAX Screen 1',
    date: '2026-06-26',
    departureTime: '19:00',
    arrivalTime: '22:00',
    seats: ['K14', 'K15'],
    totalAmount: 1300,
    status: 'active',
    passengerDetails: [
      { name: 'Gunasekhar Dulla', age: 28, gender: 'male' },
      { name: 'Ankita Sen', age: 26, gender: 'female' }
    ],
    qrCode: 'OMNIBOOK-TXN-5524102-IMAX',
    paymentMethod: 'Credit Card',
    createdAt: '2026-06-26T10:05:00-07:00'
  }
];

const initialBookingState: BookingState = {
  searchQuery: {
    source: 'Delhi',
    destination: 'Mumbai',
    date: '2026-07-10',
    category: 'flight',
    passengers: 1
  },
  vehicles: initialVehicles,
  filteredVehicles: initialVehicles.filter(v => v.category === 'flight'),
  selectedVehicle: null,
  seats: [],
  selectedSeats: [],
  bookingsList: initialBookings,
  coupons: initialCoupons,
  activeCoupon: null,
  wishlist: ['v-fl-3', 'v-ev-1']
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState: initialBookingState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<SearchQuery>) => {
      state.searchQuery = action.payload;
      // Trigger simple local filter
      state.filteredVehicles = state.vehicles.filter(v => 
        v.category === action.payload.category
      );
    },
    filterVehiclesByAdvance: (state, action: PayloadAction<{
      priceRange: [number, number];
      ratings: number;
      timings: string;
      searchQueryText: string;
    }>) => {
      const { priceRange, ratings, timings, searchQueryText } = action.payload;
      state.filteredVehicles = state.vehicles.filter(v => {
        if (v.category !== state.searchQuery.category) return false;
        if (v.price < priceRange[0] || v.price > priceRange[1]) return false;
        if (v.rating < ratings) return false;
        if (searchQueryText) {
          const matchName = v.name.toLowerCase().includes(searchQueryText.toLowerCase());
          const matchProv = v.provider.toLowerCase().includes(searchQueryText.toLowerCase());
          if (!matchName && !matchProv) return false;
        }
        if (timings !== 'all') {
          const hour = parseInt(v.departureTime.split(':')[0], 10);
          if (timings === 'morning' && (hour < 5 || hour >= 12)) return false;
          if (timings === 'afternoon' && (hour < 12 || hour >= 17)) return false;
          if (timings === 'evening' && (hour < 17 && hour >= 5)) return false; // simple check
        }
        return true;
      });
    },
    setSelectedVehicle: (state, action: PayloadAction<Vehicle | null>) => {
      state.selectedVehicle = action.payload;
      if (action.payload) {
        // Generate interactive seats for this vehicle
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const list: Seat[] = [];
        rows.forEach((row, rIdx) => {
          for (let i = 1; i <= 6; i++) {
            const seatNum = `${row}${i}`;
            let type: Seat['type'] = 'standard';
            let status: Seat['status'] = 'available';
            let multiplier = 1.0;

            // Seed seat characteristics
            if (i === 1 || i === 6) {
              type = 'window';
              multiplier = 1.1;
            }
            if (row === 'A' || row === 'B') {
              type = 'vip';
              multiplier = 1.5;
            } else if (row === 'C' || row === 'D') {
              type = 'premium';
              multiplier = 1.25;
            }
            
            // Random ladies seats
            if (i === 3 && (row === 'E' || row === 'F')) {
              type = 'ladies';
            }

            // Random mock booked status
            if (Math.random() < 0.35) {
              status = 'booked';
            }

            list.push({
              id: `${action.payload?.id}-${seatNum}`,
              number: seatNum,
              row,
              type,
              status,
              priceMultiplier: multiplier
            });
          }
        });
        state.seats = list;
        state.selectedSeats = [];
      } else {
        state.seats = [];
        state.selectedSeats = [];
      }
    },
    toggleSeatSelection: (state, action: PayloadAction<Seat>) => {
      const seat = action.payload;
      const exists = state.selectedSeats.find(s => s.id === seat.id);
      if (exists) {
        state.selectedSeats = state.selectedSeats.filter(s => s.id !== seat.id);
      } else {
        state.selectedSeats.push(seat);
      }
    },
    applyCoupon: (state, action: PayloadAction<string>) => {
      const code = action.payload.toUpperCase();
      const found = state.coupons.find(c => c.code === code);
      if (found) {
        state.activeCoupon = found;
      } else {
        state.activeCoupon = null;
      }
    },
    removeCoupon: (state) => {
      state.activeCoupon = null;
    },
    createBooking: (state, action: PayloadAction<Booking>) => {
      state.bookingsList.unshift(action.payload);
      state.selectedSeats = [];
      state.activeCoupon = null;
    },
    cancelBooking: (state, action: PayloadAction<string>) => {
      const booking = state.bookingsList.find(b => b.id === action.payload);
      if (booking) {
        booking.status = 'cancelled';
      }
    },
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.wishlist.includes(id)) {
        state.wishlist = state.wishlist.filter(wId => wId !== id);
      } else {
        state.wishlist.push(id);
      }
    },
    addVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.vehicles.push(action.payload);
      // Sync list
      state.filteredVehicles = state.vehicles.filter(v => v.category === state.searchQuery.category);
    },
    updateVehicle: (state, action: PayloadAction<Vehicle>) => {
      const index = state.vehicles.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.vehicles[index] = action.payload;
        state.filteredVehicles = state.vehicles.filter(v => v.category === state.searchQuery.category);
      }
    },
    createCoupon: (state, action: PayloadAction<Coupon>) => {
      state.coupons.push(action.payload);
    }
  }
});

// ==========================================
// 3. REVIEWS SLICE
// ==========================================
interface ReviewsState {
  reviews: Review[];
}

const initialReviews: Review[] = [
  { id: 'rev-1', userName: 'Aarav Sharma', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', rating: 5, comment: 'Excellent flight. Super on-time departure and very comfortable seats. Ground support was highly responsive!', date: '2026-06-25', category: 'flight', itemName: 'IndiGo 6E-214' },
  { id: 'rev-2', userName: 'Kavya Nair', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', rating: 4, comment: 'Shatabdi express remains the classic way to travel. Fast and delicious breakfast served on-board. Recommended.', date: '2026-06-24', category: 'train', itemName: 'Shatabdi Express (12002)' },
  { id: 'rev-3', userName: 'John Doe', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', rating: 5, comment: 'Dune: Part Two in IMAX 2D is a sensory masterpiece! Dynamic audio was incredible, screen clarity was out of this world.', date: '2026-06-27', category: 'movie', itemName: 'Oppenheimer (IMAX 2D)' }
];

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: { reviews: initialReviews } as ReviewsState,
  reducers: {
    addReview: (state, action: PayloadAction<Review>) => {
      state.reviews.unshift(action.payload);
    }
  }
});

// ==========================================
// 4. NOTIFICATIONS SLICE
// ==========================================
interface NotificationsState {
  notifications: Notification[];
}

const initialNotifications: Notification[] = [
  { id: 'not-1', title: 'Upcoming Flight Reminder', message: 'Your flight IndiGo 6E-214 from DEL to BOM departs in 12 hours. Web check-in is complete.', time: '2 hours ago', read: false, type: 'info' },
  { id: 'not-2', title: 'Refund Processed', message: 'Refund of ₹850 for Cancelled Ticket Zingbus has been credited back to your Omni Wallet.', time: '1 day ago', read: true, type: 'success' },
  { id: 'not-3', title: 'Festival Discount Active', message: 'Use Coupon FESTIVE20 to get flat 20% discount on major Coldplay stand-up show and movie blockbusters!', time: '2 days ago', read: false, type: 'alert' }
];

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { notifications: initialNotifications } as NotificationsState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const n = state.notifications.find(not => not.id === action.payload);
      if (n) n.read = true;
    }
  }
});

// ==========================================
// 5. WALLET TRANSACTION SLICE
// ==========================================
interface WalletState {
  balance: number;
  transactions: WalletTransaction[];
}

const initialTransactions: WalletTransaction[] = [
  { id: 'w-txn-1', type: 'credit', amount: 850, description: 'Refund for Zingbus Cancelled Ticket', date: '2026-06-21' },
  { id: 'w-txn-2', type: 'debit', amount: 350, description: 'Booked PVR Screen Tickets', date: '2026-06-19' },
  { id: 'w-txn-3', type: 'credit', amount: 4000, description: 'Added money via UPI (GPAY)', date: '2026-06-15' }
];

const walletSlice = createSlice({
  name: 'wallet',
  initialState: { balance: 4500, transactions: initialTransactions } as WalletState,
  reducers: {
    addFunds: (state, action: PayloadAction<number>) => {
      state.balance += action.payload;
      state.transactions.unshift({
        id: 'w-txn-' + Date.now(),
        type: 'credit',
        amount: action.payload,
        description: 'Added funds via UPI/Card',
        date: new Date().toISOString().split('T')[0]
      });
    },
    deductFunds: (state, action: PayloadAction<{ amount: number; description: string }>) => {
      state.balance -= action.payload.amount;
      state.transactions.unshift({
        id: 'w-txn-' + Date.now(),
        type: 'debit',
        amount: action.payload.amount,
        description: action.payload.description,
        date: new Date().toISOString().split('T')[0]
      });
    }
  }
});

// ==========================================
// 6. ADMIN AUDIT & UTILS SLICE
// ==========================================
interface AdminState {
  auditLogs: AuditLog[];
}

const initialAuditLogs: AuditLog[] = [
  { id: 'log-1', user: 'admin@omnibook.com', action: 'Created new discount coupon OMNI50', ip: '192.168.1.10', timestamp: '2026-06-27T14:30:00Z' },
  { id: 'log-2', user: 'alex@vendor.com', action: 'Added route Delhi -> Mumbai Flight 6E-214', ip: '103.45.210.42', timestamp: '2026-06-26T18:15:00Z' },
  { id: 'log-3', user: 'admin@omnibook.com', action: 'Suspended user account usr-22 (fraud report)', ip: '192.168.1.10', timestamp: '2026-06-25T09:12:00Z' },
  { id: 'log-4', user: 'sarah@staff.com', action: 'Verified QR Ticket OMNIBOOK-TXN-5524102', ip: '172.16.8.99', timestamp: '2026-06-26T21:40:00Z' }
];

const adminSlice = createSlice({
  name: 'admin',
  initialState: { auditLogs: initialAuditLogs } as AdminState,
  reducers: {
    addAuditLog: (state, action: PayloadAction<AuditLog>) => {
      state.auditLogs.unshift(action.payload);
    }
  }
});

// ==========================================
// STORE CONFIGURATION
// ==========================================
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    booking: bookingSlice.reducer,
    reviews: reviewsSlice.reducer,
    notifications: notificationsSlice.reducer,
    wallet: walletSlice.reducer,
    admin: adminSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks for dispatch and selectors
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Export actions
export const { 
  setCurrentUserByRole, updateProfile, login, logout, addUser, deleteUser 
} = authSlice.actions;

export const { 
  setSearchQuery, filterVehiclesByAdvance, setSelectedVehicle, toggleSeatSelection, 
  applyCoupon, removeCoupon, createBooking, cancelBooking, toggleWishlist, addVehicle, updateVehicle, createCoupon 
} = bookingSlice.actions;

export const { addReview } = reviewsSlice.actions;
export const { addNotification, markAllAsRead, markAsRead } = notificationsSlice.actions;
export const { addFunds, deductFunds } = walletSlice.actions;
export const { addAuditLog } = adminSlice.actions;
