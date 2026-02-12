'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Chrome, ShieldCheck, Briefcase, 
  Loader2, AlertTriangle, Eye, EyeOff, PenTool 
} from 'lucide-react';

// 1. Strict Type Definitions
type UserRole = 'candidate' | 'employer' | 'creator';
type Step = 'signup' | 'verify';

interface ApiErrorResponse {
  error: string;
}

interface VerifyResponse {
  success: boolean;
  redirectUrl: string;
}

export default function SignupPage() {
  const router = useRouter();
  
  // State
  const [step, setStep] = useState<Step>('signup');
  const [role, setRole] = useState<UserRole>('candidate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [otp, setOtp] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  // Helper for tab position logic
  const getTabPosition = () => {
    if (role === 'candidate') return 'left-1.5';
    if (role === 'creator') return 'left-[calc(33.33%+1px)]';
    return 'left-[calc(66.66%+0.5px)]';
  };

  // 1. Initial Signup (Send Code)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: role,
        }),
      });

      const data = await res.json() as ApiErrorResponse | { success: boolean, email: string };

      if (!res.ok) {
        if ('error' in data) throw new Error(data.error);
        else throw new Error('Signup failed');
      }

      setIsLoading(false);
      setStep('verify');

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  // 2. Verify Code (Create Profile)
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: otp
        }),
      });

      const data = await res.json() as ApiErrorResponse | VerifyResponse;

      if (!res.ok) {
         if ('error' in data) throw new Error(data.error);
         else throw new Error('Verification failed');
      }

      if ('redirectUrl' in data) {
        router.push(data.redirectUrl);
        router.refresh();
      }

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Verification failed");
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const res = await fetch(`/api/auth/google?role=${role}`);
      const data = await res.json() as { url?: string };
      if (data.url) window.location.href = data.url;
    } catch (err: unknown) {
      setError("Could not connect to Google");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] -z-10" />

      <motion.div 
        layout
        className="max-w-lg w-full bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white"
      >
        <AnimatePresence mode="wait">
          
          {step === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Join GreenzeeJobs</h2>
                <p className="mt-2 text-slate-500 font-medium italic">Your gateway to the green ecosystem</p>
              </div>

              {/* Enhanced Triple Role Toggle */}
              <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8 relative h-14 items-center">
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`absolute top-1.5 bottom-1.5 w-[31%] bg-white rounded-xl shadow-sm border border-slate-200/50 ${getTabPosition()}`}
                />
                <button 
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`relative z-10 flex-1 flex flex-col items-center justify-center transition-all ${role === 'candidate' ? 'text-indigo-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <User className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Talent</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('creator')}
                  className={`relative z-10 flex-1 flex flex-col items-center justify-center transition-all ${role === 'creator' ? 'text-orange-700' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <PenTool className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Creator</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('employer')}
                  className={`relative z-10 flex-1 flex flex-col items-center justify-center transition-all ${role === 'employer' ? 'text-emerald-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Briefcase className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Employer</span>
                </button>
              </div>

              {error && (
                 <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                   <AlertTriangle className="h-5 w-5 shrink-0" />
                   <p>{error}</p>
                 </div>
              )}

              <button 
                type="button"
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-3 py-4 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-700 mb-8"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.9 0 3.63.65 5 1.73l3.75-3.75C18.47 1.15 15.42 0 12 0 7.31 0 3.26 2.69 1.25 6.64L5.27 9.75C6.21 6.98 8.87 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.8-.07-1.56-.19-2.27H12v4.51h6.47c-.28 1.48-1.13 2.74-2.4 3.58l3.74 2.91c2.18-2.02 3.68-4.99 3.68-8.73z" />
                  <path fill="#FBBC05" d="M5.27 14.25c-.24-.71-.38-1.47-.38-2.25s.14-1.54.38-2.25L1.25 6.64C.45 8.24 0 10.07 0 12c0 1.93.45 3.76 1.25 5.36l4.02-3.11z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.97-1.07 7.96-2.91l-3.74-2.91c-1.1.74-2.51 1.17-4.22 1.17-3.23 0-5.98-2.18-6.96-5.11l-4.02 3.11C3.26 21.31 7.31 24 12 24z" />
                </svg>
                Sign up with Google
              </button>

              <form onSubmit={handleSignup} className="space-y-4">
                <input 
                  name="fullName" value={formData.fullName} onChange={handleChange} required
                  placeholder="Full Name" 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-slate-800" 
                />
                <input 
                  name="email" type="email" value={formData.email} onChange={handleChange} required
                  placeholder="Email Address" 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-slate-800" 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <input 
                      name="password" type={showPass ? "text" : "password"} value={formData.password} onChange={handleChange} required
                      placeholder="Password" 
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-slate-800" 
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <input 
                    name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required
                    placeholder="Confirm" 
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-slate-800" 
                  />
                </div>

                <button 
                  type="submit" disabled={isLoading}
                  className="w-full mt-4 py-4 bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl hover:bg-emerald-600 transition-all disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                </button>
              </form>
              
              <p className="mt-8 text-center text-sm font-bold text-slate-400">
                Member already? <Link href="/login" className="text-emerald-600 hover:underline">Log in here</Link>
              </p>
            </motion.div>
          )}

          {step === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-center"
            >
              <div className="mb-6 flex justify-center">
                <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shadow-inner">
                   <ShieldCheck size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Verify Identity</h2>
              <p className="text-slate-500 mb-8 text-sm">Code sent to <span className="font-bold text-slate-700">{formData.email}</span></p>

              <form onSubmit={handleVerify} className="space-y-6">
                <input
                  type="text" maxLength={6} value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full text-center text-4xl font-black tracking-[0.4em] py-6 bg-slate-50 border-2 border-emerald-100 rounded-[2rem] focus:bg-white focus:border-emerald-600 outline-none transition-all text-slate-900"
                  autoFocus
                />
                <button 
                  type="submit" disabled={isLoading || otp.length < 6}
                  className="w-full py-4 bg-emerald-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl hover:bg-emerald-700 transition-all"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Complete Registration'}
                </button>
              </form>
              <button onClick={() => setStep('signup')} className="mt-6 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Change Email</button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}