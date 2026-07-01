export type UserRole = 'customer' | 'vendor' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  walletBalance: number;
}

export type TicketCategory = 'bus' | 'train' | 'flight' | 'movie' | 'event';

export interface SearchQuery {
  source: string;
  destination: string;
  date: string;
  returnDate?: string;
  category: TicketCategory;
  passengers: number;
}

export interface Vehicle {
  id: string;
  name: string;
  provider: string;
  category: TicketCategory;
  rating: number;
  departureTime: string;
  arrivalTime: string;
  price: number;
  duration: string;
  stops?: string;
  availableSeats: number;
  totalSeats: number;
  logoUrl?: string;
}

export type SeatClass = 'window' | 'vip' | 'premium' | 'ladies' | 'standard';
export type SeatStatus = 'available' | 'booked' | 'selected';

export interface Seat {
  id: string;
  number: string;
  row: string;
  type: SeatClass;
  status: SeatStatus;
  priceMultiplier: number;
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  idCard?: string;
}

export interface Booking {
  id: string;
  userId: string;
  vehicleId: string;
  vehicleName: string;
  provider: string;
  category: TicketCategory;
  source: string;
  destination: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  seats: string[];
  totalAmount: number;
  status: 'active' | 'cancelled';
  passengerDetails: Passenger[];
  qrCode: string;
  paymentMethod: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discount: number; // percentage or fixed
  type: 'percent' | 'fixed';
  description: string;
  minAmount: number;
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  category: TicketCategory;
  itemName: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  ip: string;
  timestamp: string;
}
