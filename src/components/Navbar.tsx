import React, { useState } from 'react';
import { useAppSelector, useAppDispatch, setCurrentUserByRole, markAllAsRead, markAsRead, addFunds, logout } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Ticket, Bell, Wallet, User as UserIcon, LogOut, ShieldAlert, Sliders, Check, PlusCircle, Moon, Sun, Menu, X
} from 'lucide-react';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAppSelector(state => state.auth);
  const { notifications } = useAppSelector(state => state.notifications);
  const { balance } = useAppSelector(state => state.wallet);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [fundsAmount, setFundsAmount] = useState('1000');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRoleChange = (role: 'customer' | 'vendor' | 'staff' | 'admin') => {
    dispatch(setCurrentUserByRole(role));
    setRoleMenuOpen(false);
    setMobileMenuOpen(false);
    // Redirect to respective dashboard
    if (role === 'admin') navigate('/admin');
    else if (role === 'vendor') navigate('/vendor');
    else if (role === 'staff') navigate('/staff');
    else navigate('/dashboard');
  };

  const handleAddFundsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(fundsAmount);
    if (!isNaN(val) && val > 0) {
      dispatch(addFunds(val));
      setAddFundsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/75 dark:bg-slate-900/75 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-primary" id="navbar-logo">
            <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-md">
              <Ticket className="h-6 w-6" />
            </div>
            <span className="font-sans font-bold text-xl bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              OmniBook
            </span>
          </Link>

          {/* Center Links (Destinations, Booking Category, FAQ shortcuts) */}
          <div className="hidden md:flex space-x-6 items-center font-sans font-medium text-slate-600 dark:text-slate-300 text-sm">
            <Link to="/search?cat=flight" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Flights</Link>
            <Link to="/search?cat=train" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Trains</Link>
            <Link to="/search?cat=bus" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Buses</Link>
            <Link to="/search?cat=movie" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Movies</Link>
            <Link to="/search?cat=event" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Events</Link>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Role Switcher Panel */}
            <div className="relative">
              <button 
                id="role-switch-btn"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <Sliders className="h-3 w-3" />
                <span className="capitalize">{currentUser?.role || 'Guest'}</span>
              </button>
              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 overflow-hidden text-sm">
                  <div className="px-3 py-1 text-xs text-slate-400 font-mono border-b border-slate-100 dark:border-slate-700">DEVELOPER ROLE SWITCH</div>
                  <button onClick={() => handleRoleChange('customer')} className="flex items-center justify-between w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200">
                    <span>Customer</span>
                    {currentUser?.role === 'customer' && <Check className="h-4 w-4 text-emerald-500" />}
                  </button>
                  <button onClick={() => handleRoleChange('vendor')} className="flex items-center justify-between w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200">
                    <span>Vendor</span>
                    {currentUser?.role === 'vendor' && <Check className="h-4 w-4 text-emerald-500" />}
                  </button>
                  <button onClick={() => handleRoleChange('staff')} className="flex items-center justify-between w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200">
                    <span>Staff</span>
                    {currentUser?.role === 'staff' && <Check className="h-4 w-4 text-emerald-500" />}
                  </button>
                  <button onClick={() => handleRoleChange('admin')} className="flex items-center justify-between w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200">
                    <span>Admin</span>
                    {currentUser?.role === 'admin' && <Check className="h-4 w-4 text-emerald-500" />}
                  </button>
                </div>
              )}
            </div>

            {/* Wallet Button */}
            {currentUser && (
              <div className="relative">
                <button 
                  id="wallet-btn"
                  onClick={() => setAddFundsOpen(!addFundsOpen)}
                  className="flex items-center space-x-1 text-sm bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 text-emerald-600 dark:text-emerald-400 font-semibold px-3 py-1.5 rounded-xl border border-emerald-500/20 dark:border-emerald-500/10 transition"
                >
                  <Wallet className="h-4 w-4" />
                  <span className="font-mono">₹{balance}</span>
                </button>
                {addFundsOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Omni Wallet Top-Up</h4>
                    <form onSubmit={handleAddFundsSubmit}>
                      <div className="flex space-x-2 mb-3">
                        <input 
                          type="number" 
                          value={fundsAmount}
                          onChange={(e) => setFundsAmount(e.target.value)}
                          className="w-full font-mono text-sm px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500 outline-none"
                          placeholder="Amount"
                          required
                        />
                        <button type="submit" className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm flex items-center justify-center">
                          <PlusCircle className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex space-x-1.5">
                        {['500', '1000', '2000', '5000'].map(amt => (
                          <button 
                            type="button" 
                            key={amt}
                            onClick={() => setFundsAmount(amt)}
                            className="text-[10px] font-mono flex-1 text-center py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg"
                          >
                            ₹{amt}
                          </button>
                        ))}
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}



            {/* Notifications Popover */}
            <div className="relative">
              <button 
                id="notifications-btn"
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 text-[9px] font-mono font-bold bg-rose-500 text-white flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-3 z-50 text-sm max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center px-4 pb-2 border-b border-slate-100 dark:border-slate-700 mb-2">
                    <span className="font-semibold text-slate-900 dark:text-white">Notifications</span>
                    <button 
                      onClick={() => { dispatch(markAllAsRead()); setNotifOpen(false); }}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      Mark all as read
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-slate-400">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => { dispatch(markAsRead(n.id)); }}
                        className={`px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer border-l-2 border-transparent transition ${!n.read ? 'bg-slate-50/50 dark:bg-slate-800/50 border-emerald-600' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-0.5">
                          <span className={`text-xs font-semibold ${!n.read ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Profile Menu / Avatar */}
            {currentUser ? (
              <div className="relative">
                <button 
                  id="profile-dropdown-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-1.5 focus:outline-none"
                >
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="h-8 w-8 rounded-xl object-cover ring-2 ring-emerald-500/20"
                    referrerPolicy="no-referrer"
                  />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 text-sm overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                      <p className="font-semibold text-slate-900 dark:text-white">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    
                    {/* Role Specific Navigation */}
                    {currentUser.role === 'customer' && (
                      <>
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200">
                          <UserIcon className="h-4 w-4 text-slate-400" />
                          <span>Customer Hub</span>
                        </Link>
                      </>
                    )}
                    {currentUser.role === 'vendor' && (
                      <Link to="/vendor" onClick={() => setProfileOpen(false)} className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200">
                        <Sliders className="h-4 w-4 text-slate-400" />
                        <span>Vendor Dashboard</span>
                      </Link>
                    )}
                    {currentUser.role === 'staff' && (
                      <Link to="/staff" onClick={() => setProfileOpen(false)} className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200">
                        <ShieldAlert className="h-4 w-4 text-slate-400" />
                        <span>Staff Board</span>
                      </Link>
                    )}
                    {currentUser.role === 'admin' && (
                      <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200">
                        <ShieldAlert className="h-4 w-4 text-slate-400" />
                        <span>Admin Panel</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                      <button 
                        onClick={() => { dispatch(logout()); setProfileOpen(false); navigate('/auth'); }}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-emerald-500/10 transition"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Hamburger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-center text-sm font-sans font-semibold text-slate-700 dark:text-slate-200">
            <Link to="/search?cat=flight" onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:text-emerald-600">Flights</Link>
            <Link to="/search?cat=train" onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:text-emerald-600">Trains</Link>
            <Link to="/search?cat=bus" onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:text-emerald-600">Buses</Link>
            <Link to="/search?cat=movie" onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:text-emerald-600">Movies</Link>
            <Link to="/search?cat=event" onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:text-emerald-600 col-span-2">Events</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
