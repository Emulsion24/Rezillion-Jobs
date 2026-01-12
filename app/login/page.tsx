'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, Loader2, Briefcase, User, Eye, EyeOff, 
  AlertTriangle, Chrome 
} from 'lucide-react';

// 1. Strict Type Definitions
type UserRole = 'candidate' | 'employer' | 'admin';

// Define what the API returns
interface LoginSuccessResponse {
  redirectUrl: string;
}

interface ApiErrorResponse {
  error: string;
}

interface GoogleAuthResponse {
  url?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<UserRole>('candidate'); // Default to Talent
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({ email: '', password: '' });

  // 1. Handle Normal Email/Pass Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: role // 'candidate' or 'employer'
        }),
      });

      // Securely cast the response
      const data = (await res.json()) as LoginSuccessResponse | ApiErrorResponse;

      if (!res.ok) {
        // Type narrowing: check if 'error' exists in data
        if ('error' in data) {
          throw new Error(data.error);
        } else {
          throw new Error('Invalid credentials');
        }
      }

      // Success: Redirect
      if ('redirectUrl' in data) {
        router.push(data.redirectUrl);
        router.refresh();
      }

    } catch (err: unknown) {
      // Strict error handling
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
      setIsLoading(false);
    }
  };

  // 2. Handle Google Login
  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const res = await fetch(`/api/auth/google?role=${role}`);
      const data = (await res.json()) as GoogleAuthResponse;
      
      if (data.url) {
        window.location.href = data.url; // Redirect user to Google
      } else {
        setError("Failed to initialize Google Login");
      }
    } catch (err: unknown) {
      setError("Could not connect to authentication server");
    }
  };

  // Helper for dynamic colors
  const getThemeColor = () => {
    if (role === 'employer') return 'text-slate-900 bg-slate-900 shadow-slate-200 hover:bg-slate-800';
    return 'text-indigo-600 bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700';
  };

  const getFocusColor = () => {
    if (role === 'employer') return 'focus:border-slate-900 focus:shadow-slate-50';
    return 'focus:border-indigo-600 focus:shadow-indigo-50';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 font-sans text-slate-900">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-slate-50"></div>
         {role === 'employer' && <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-100/30 blur-[120px] transition-all duration-700" />}
         {role === 'candidate' && <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-indigo-100/30 blur-[120px] transition-all duration-700" />}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-[440px] w-full bg-white p-8 md:p-10 rounded-3xl shadow-[0_20px_70px_-10px_rgba(0,0,0,0.06)] border border-white/50"
      >
        {/* Role Switcher (2 Tabs: Candidate & Employer) */}
        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl mb-8 relative">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm border border-slate-200/50 ${
              role === 'employer' ? 'left-[calc(50%+3px)]' : 'left-1.5'
            }`}
          />
          
          <button
            type="button"
            onClick={() => setRole('candidate')}
            className={`relative flex-1 z-10 flex items-center justify-center gap-2 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${role === 'candidate' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <User size={14} strokeWidth={2.5} /> Talent
          </button>
          <button
            type="button"
            onClick={() => setRole('employer')}
            className={`relative flex-1 z-10 flex items-center justify-center gap-2 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${role === 'employer' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Briefcase size={14} strokeWidth={2.5} /> Employer
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Sign in to your {role === 'employer' ? 'employer' : 'talent'} account.
          </p>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-5"
            >
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3">
                <AlertTriangle size={18} />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google Login Button */}
        <button 
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border-2 border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all font-bold text-slate-700 mb-6 active:scale-[0.98]"
        >
          <Chrome className="h-5 w-5 text-red-500" />
          <span>Sign in with Google</span>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200/80"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or email</span></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="name@example.com"
                className={`w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white outline-none transition-all font-medium text-slate-900 ${getFocusColor()}`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••" 
                className={`w-full pl-12 pr-12 py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white outline-none transition-all font-medium text-slate-900 ${getFocusColor()}`}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Link href="/forgot-password" className={`text-xs font-bold hover:underline ${role === 'employer' ? 'text-slate-600' : 'text-indigo-600'}`}>
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-4 px-4 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 ${getThemeColor()}`}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Dont have an account?{' '}
          <Link href="/signup" className={`font-bold hover:underline ${role === 'employer' ? 'text-slate-900' : 'text-indigo-600'}`}>
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}