'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, Loader2, Briefcase, User as UserIcon, Eye, EyeOff, 
  AlertTriangle, PenTool
} from 'lucide-react';
import { useUserStore, User } from '@/store/userStore';

type UserRole = 'candidate' | 'employer' | 'admin' | 'creator';

interface LoginSuccessResponse {
  redirectUrl: string;
  user: User; 
}

interface ApiErrorResponse {
  error: string;
}

interface GoogleAuthResponse {
  url?: string;
}

function isErrorResponse(data: unknown): data is ApiErrorResponse {
  return (data as ApiErrorResponse).error !== undefined;
}

export default function LoginPage() {
  const router = useRouter();
  const loginToStore = useUserStore((state) => state.login);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [role, setRole] = useState<UserRole>('candidate'); 
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: role
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (isErrorResponse(data)) throw new Error(data.error);
        else throw new Error('Invalid credentials');
      }

      const successData = data as LoginSuccessResponse;

      if (successData.user) {
        // Persist to localStorage to avoid loading loops
        localStorage.setItem("currentUser", JSON.stringify(successData.user));
        loginToStore(successData.user);

        if (successData.user.role === 'admin') router.push('/admin/dashboard');
        else if (successData.user.role === 'creator') router.push('/creator/dashboard');
        else router.push(successData.redirectUrl || '/dashboard');
        
        router.refresh();
      }

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      // Passes the selected role to the backend so the Google callback knows 
      // if it should create a Talent, Creator, or Employer account.
      const res = await fetch(`/api/auth/google?role=${role}`);
      const data = (await res.json()) as GoogleAuthResponse;
      
      if (data.url) {
        window.location.href = data.url; 
      } else {
        setError("Failed to initialize Google Login");
        setIsGoogleLoading(false);
      }
    } catch (err) {
      setError("Could not connect to authentication server");
      setIsGoogleLoading(false);
    }
  };

  // Theme Helpers
  const getThemeColor = () => {
    switch (role) {
      case 'employer': return 'text-white bg-slate-900 shadow-slate-200 hover:bg-slate-800';
      case 'creator': return 'text-white bg-orange-600 shadow-orange-200 hover:bg-orange-700';
      default: return 'text-white bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700';
    }
  };

  const getFocusColor = () => {
    switch (role) {
      case 'employer': return 'focus:border-slate-900';
      case 'creator': return 'focus:border-orange-600';
      default: return 'focus:border-indigo-600';
    }
  };

  const getLinkColor = () => {
    switch (role) {
      case 'employer': return 'text-slate-900';
      case 'creator': return 'text-orange-600';
      default: return 'text-indigo-600';
    }
  };

  const getTabPosition = () => {
    if (role === 'candidate') return 'left-1';
    if (role === 'creator') return 'left-[34%]';
    return 'left-[67%]';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 font-sans text-slate-900">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-slate-50"></div>
         {role === 'employer' && <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-100/30 blur-[120px] transition-all duration-700" />}
         {role === 'candidate' && <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-indigo-100/30 blur-[120px] transition-all duration-700" />}
         {role === 'creator' && <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-orange-100/30 blur-[120px] transition-all duration-700" />}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-[480px] w-full bg-white p-8 md:p-10 rounded-[32px] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.06)] border border-white/50"
      >
        {/* Role Switcher */}
        <div className="flex bg-slate-100/80 p-1 rounded-2xl mb-8 relative h-12 items-center">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`absolute top-1 bottom-1 w-[32%] bg-white rounded-xl shadow-sm border border-slate-200/50 ${getTabPosition()}`}
          />
          
          <button
            type="button"
            onClick={() => setRole('candidate')}
            className={`relative flex-1 z-10 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${role === 'candidate' ? 'text-indigo-700' : 'text-slate-400'}`}
          >
            <UserIcon size={14} strokeWidth={2.5} /> Talent
          </button>
          <button
            type="button"
            onClick={() => setRole('creator')}
            className={`relative flex-1 z-10 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${role === 'creator' ? 'text-orange-700' : 'text-slate-400'}`}
          >
            <PenTool size={14} strokeWidth={2.5} /> Creator
          </button>
          <button
            type="button"
            onClick={() => setRole('employer')}
            className={`relative flex-1 z-10 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${role === 'employer' ? 'text-slate-900' : 'text-slate-400'}`}
          >
            <Briefcase size={14} strokeWidth={2.5} /> Employer
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Welcome to GreenzeeJobs</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Sign in as <span className={`font-bold capitalize ${getLinkColor()}`}>{role === 'candidate' ? 'Talent' : role}</span> to continue.
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-5">
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-3">
                <AlertTriangle size={18} />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
              <input 
                type="email" required value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="name@example.com"
                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-400 ${getFocusColor()}`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-slate-800 transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} required value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••" 
                className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-400 ${getFocusColor()}`}
              />
              <button 
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" disabled={isLoading}
            className={`w-full flex items-center justify-center py-4 px-4 font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 ${getThemeColor()}`}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Enter Workspace'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-white px-4 text-slate-400">Or use social sign-in</span></div>
        </div>

        {/* --- GOOGLE LOGIN BUTTON --- */}
        <button 
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm active:scale-[0.98] disabled:opacity-70"
        >
          {isGoogleLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.9 0 3.63.65 5 1.73l3.75-3.75C18.47 1.15 15.42 0 12 0 7.31 0 3.26 2.69 1.25 6.64L5.27 9.75C6.21 6.98 8.87 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.8-.07-1.56-.19-2.27H12v4.51h6.47c-.28 1.48-1.13 2.74-2.4 3.58l3.74 2.91c2.18-2.02 3.68-4.99 3.68-8.73z" />
                <path fill="#FBBC05" d="M5.27 14.25c-.24-.71-.38-1.47-.38-2.25s.14-1.54.38-2.25L1.25 6.64C.45 8.24 0 10.07 0 12c0 1.93.45 3.76 1.25 5.36l4.02-3.11z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.97-1.07 7.96-2.91l-3.74-2.91c-1.1.74-2.51 1.17-4.22 1.17-3.23 0-5.98-2.18-6.96-5.11l-4.02 3.11C3.26 21.31 7.31 24 12 24z" />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <p className="mt-8 text-center text-sm font-medium text-slate-400">
          New to the portal?{' '}
          <Link href="/signup" className={`font-black hover:underline ${getLinkColor()}`}>
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}