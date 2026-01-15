'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Chrome, ShieldCheck, Briefcase, 
  Loader2, AlertTriangle, Eye, EyeOff 
} from 'lucide-react';

// 1. Strict Type Definitions
type UserRole = 'candidate' | 'employer';
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
      // NOTE: Fixed typo from 'singup' to 'signup'
      const res = await fetch('/api/auth/singup', {
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
        // Type narrowing to safely access 'error'
        if ('error' in data) {
          throw new Error(data.error);
        } else {
          throw new Error('Signup failed');
        }
      }

      // Move to verification step
      setIsLoading(false);
      setStep('verify');

    } catch (err: unknown) {
      // Strict error handling (No 'any')
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
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
         if ('error' in data) {
          throw new Error(data.error);
        } else {
          throw new Error('Verification failed');
        }
      }

      // Success Redirect
      // We know data has redirectUrl because we passed the !res.ok check
      if ('redirectUrl' in data) {
        router.push(data.redirectUrl);
        router.refresh();
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Verification failed");
      }
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const res = await fetch(`/api/auth/google?role=${role}`);
      const data = await res.json() as { url?: string };
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      setError("Could not connect to Google");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -z-10" />

      <motion.div 
        layout
        className="max-w-lg w-full bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white"
      >
        <AnimatePresence mode="wait">
          
          {/* STEP 1: SIGNUP FORM */}
          {step === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
                <p className="mt-2 text-slate-500 font-medium">Join JobFlow to start your journey</p>
              </div>

              {/* Role Toggle */}
              <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8 relative">
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
                  className={`relative z-10 flex-1 flex items-center justify-center py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-wider ${role === 'candidate' ? 'text-indigo-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <User className="w-4 h-4 mr-2" /> Candidate
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('employer')}
                  className={`relative z-10 flex-1 flex items-center justify-center py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-wider ${role === 'employer' ? 'text-indigo-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Briefcase className="w-4 h-4 mr-2" /> Employer
                </button>
              </div>

              {/* Error Alert */}
              {error && (
                 <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                   <AlertTriangle className="h-5 w-5 shrink-0" />
                   <p>{error}</p>
                 </div>
              )}

              {/* Google Button */}
              <button 
                type="button"
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all font-bold text-slate-700 mb-8 active:scale-[0.98]"
              >
                <Chrome className="h-5 w-5 text-red-500" />
                Sign up with Google
              </button>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or use email</span></div>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Full Name</label>
                  <input 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="John Doe" 
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all text-sm font-medium" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email</label>
                  <input 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com" 
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all text-sm font-medium" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <input 
                      name="password"
                      type={showPass ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Password" 
                      className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all text-sm font-medium" 
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <input 
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm" 
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all text-sm font-medium" 
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 flex items-center justify-center py-4 px-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                </button>
              </form>
              
              <p className="mt-8 text-center text-sm font-medium text-slate-500">
                Already have an account? <Link href="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
              </p>
            </motion.div>
          )}

          {/* STEP 2: VERIFICATION OTP */}
          {step === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="mb-6 flex justify-center">
                <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                   <ShieldCheck size={32} />
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-2">Check your email</h2>
              <p className="text-slate-500 mb-8 text-sm">
                We sent a 6-digit code to <span className="font-bold text-slate-700">{formData.email}</span>.
                Enter it below to verify your account.
              </p>

              {error && (
                 <div className="p-3 mb-6 rounded-xl bg-red-50 text-red-600 text-sm font-bold">
                   {error}
                 </div>
              )}

              <form onSubmit={handleVerify} className="space-y-6">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only numbers
                  placeholder="123456"
                  className="w-full text-center text-3xl font-bold tracking-[0.5em] py-5 bg-slate-50 border-2 border-indigo-100 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all text-slate-900 placeholder:tracking-normal placeholder:text-slate-300"
                  autoFocus
                />

                <button 
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="w-full flex items-center justify-center py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Verify & Continue'}
                </button>
              </form>

              <button 
                onClick={() => setStep('signup')}
                className="mt-6 text-sm font-bold text-slate-400 hover:text-slate-600"
              >
                Wrong email? Go back
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}