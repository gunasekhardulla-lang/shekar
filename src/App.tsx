import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './store';
import Navbar from './components/Navbar';
import AIQuickChat from './components/AIQuickChat';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import SearchTickets from './pages/SearchTickets';
import BookingPage from './pages/BookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import CustomerDashboard from './pages/CustomerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const { currentUser } = useAppSelector(state => state.auth);

  // Sync and ensure Light mode styles only (remove 'dark' class)
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-stone-50/50 text-slate-900 transition-colors duration-200 selection:bg-emerald-500/20 selection:text-emerald-700">
        
        {/* Absolute Glowing Ambient Light points (Nature and Peace feel) */}
        <div className="fixed top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none z-0"></div>
        <div className="fixed bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-teal-500/5 blur-[150px] pointer-events-none z-0"></div>

        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Universal Header */}
          <Navbar />

          {/* Core pages Router layout */}
          <main className="flex-1">
            <Routes>
              {/* Home Landing */}
              <Route path="/" element={<LandingPage />} />

              {/* Authentication manager */}
              <Route path="/auth" element={<AuthPage />} />

              {/* Tickets Search results */}
              <Route path="/search" element={<SearchTickets />} />

              {/* Custom seating reserve details */}
              <Route path="/booking" element={<BookingPage />} />

              {/* Transaction confirm success boarding card */}
              <Route path="/success" element={<BookingSuccessPage />} />

              {/* Role panels redirects */}
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="/vendor" element={<VendorDashboard />} />
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Floating Gemini AI Quick Assistant */}
          <AIQuickChat />

        </div>
      </div>
    </Router>
  );
}
