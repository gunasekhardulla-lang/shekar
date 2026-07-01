import React, { useState } from 'react';
import { useAppDispatch } from '../store';
import { login } from '../store';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, Key, CheckCircle, ArrowRight, AlertCircle, Chrome } from 'lucide-react';

export default function AuthPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [view, setView] = useState<'login' | 'register' | 'forgot' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'vendor' | 'staff' | 'admin'>('customer');
  const [otpInput, setOtpInput] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ text: 'Please fill in all fields.', type: 'error' });
      return;
    }
    // Simple simulation login
    dispatch(login({ email, role }));
    setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
    setTimeout(() => {
      if (role === 'admin') navigate('/admin');
      else if (role === 'vendor') navigate('/vendor');
      else if (role === 'staff') navigate('/staff');
      else navigate('/dashboard');
    }, 1200);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setMessage({ text: 'Please fill in all registration fields.', type: 'error' });
      return;
    }
    // Simulate register and move to OTP
    setView('otp');
    setMessage({ text: 'Account registered! Verification OTP sent to ' + email, type: 'success' });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ text: 'Please enter your email.', type: 'error' });
      return;
    }
    setMessage({ text: 'Password reset instructions have been emailed to ' + email, type: 'success' });
    setTimeout(() => setView('login'), 2000);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '1234') {
      dispatch(login({ email: email || 'user@gamil.com', role: 'customer' }));
      setMessage({ text: 'OTP verified successfully! Welcome onboard.', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1200);
    } else {
      setMessage({ text: 'Invalid OTP code. Please try using code "1234" for the simulation!', type: 'error' });
    }
  };

  const handleGoogleLogin = () => {
    // Simulate standard Google OAuth
    dispatch(login({ email: 'gunasekhardulla@gmail.com', role: 'customer' }));
    setMessage({ text: 'Authenticated with Google successfully!', type: 'success' });
    setTimeout(() => navigate('/dashboard'), 1200);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 font-sans" id="auth-page">
      <div className="max-w-md w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 dark:border-slate-850/50 shadow-2xl relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-10 -left-10 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-teal-500/10 blur-2xl"></div>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white mb-4 shadow-lg shadow-emerald-500/10">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight">
            {view === 'login' && 'Sign in to OmniBook'}
            {view === 'register' && 'Create your account'}
            {view === 'forgot' && 'Reset your password'}
            {view === 'otp' && 'OTP Verification Required'}
          </h2>
          <p className="mt-1.5 text-xs text-slate-400 font-medium leading-relaxed">
            {view === 'login' && 'Unlock instant refunds, detailed history, and custom seating maps.'}
            {view === 'register' && 'Access special rewards, secure booking pathways, and quick-checkouts.'}
            {view === 'forgot' && 'Provide your register email, and we will send password recovery.'}
            {view === 'otp' && 'Enter the 4-digit code dispatched to your registration credentials.'}
          </p>
        </div>

        {/* Feedback message banner */}
        {message && (
          <div className={`p-4 rounded-xl flex items-start space-x-2.5 text-xs mb-6 border ${
            message.type === 'success' 
              ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
              : 'bg-rose-500/5 border-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}>
            {message.type === 'success' ? <CheckCircle className="h-4.5 w-4.5 shrink-0" /> : <AlertCircle className="h-4.5 w-4.5 shrink-0" />}
            <span className="leading-normal font-medium">{message.text}</span>
          </div>
        )}

        {/* LOGIN VIEW */}
        {view === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5 ml-1">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-800/80 text-slate-950 dark:text-white rounded-xl outline-none border-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
                  placeholder="name@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-800/80 text-slate-950 dark:text-white rounded-xl outline-none border-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Simulated Role Selection for Login (Customer, Vendor, Admin, Staff) */}
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5 ml-1">Select Login Role Profile</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full text-sm px-3.5 py-3 bg-slate-50 dark:bg-slate-800/80 text-slate-950 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/50 font-medium outline-none cursor-pointer"
              >
                <option value="customer">Customer (Gunasekhar Dulla)</option>
                <option value="vendor">Vendor Owner (Alex)</option>
                <option value="staff">Verification Staff (Sarah)</option>
                <option value="admin">System Admin (Admin Boss)</option>
              </select>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button 
                type="button" 
                onClick={() => setView('forgot')}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/10 flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Google Login Split */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-x-0 border-t border-slate-100 dark:border-slate-800"></div>
              <span className="relative px-3 bg-white dark:bg-slate-900 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Or Continue with</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition"
            >
              <Chrome className="h-4 w-4 text-rose-500" />
              <span>Simulate Google Login</span>
            </button>
          </form>
        )}

        {/* REGISTER VIEW */}
        {view === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-800/80 text-slate-950 dark:text-white rounded-xl outline-none border-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
                  placeholder="e.g. Gunasekhar Dulla"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5 ml-1">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-800/80 text-slate-950 dark:text-white rounded-xl outline-none border-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
                  placeholder="name@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-800/80 text-slate-950 dark:text-white rounded-xl outline-none border-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/10 flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Register Account</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {view === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5 ml-1">Your registered email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-800/80 text-slate-950 dark:text-white rounded-xl outline-none border-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
                  placeholder="name@email.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/10 flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Request Recovery Link</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* OTP VERIFICATION VIEW */}
        {view === 'otp' && (
          <form onSubmit={handleOtpVerify} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5 ml-1">Enter Verification Code</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-bold py-3 bg-slate-50 dark:bg-slate-800/80 text-slate-950 dark:text-white rounded-xl outline-none border-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
                  placeholder="0000"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium text-center mt-2">Enter code <strong className="text-emerald-500 font-mono">1234</strong> to verify simulation.</p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/10 flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Verify OTP Code</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* View Toggle Footer Links */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex justify-center text-xs relative z-10">
          {view === 'login' && (
            <p className="text-slate-500">Don't have an account?{' '}
              <button onClick={() => setView('register')} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Register now</button>
            </p>
          )}
          {view !== 'login' && (
            <p className="text-slate-500">Already registered?{' '}
              <button onClick={() => setView('login')} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Sign in instead</button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
