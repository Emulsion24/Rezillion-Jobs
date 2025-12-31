'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Chrome, Loader2, Briefcase, User } from 'lucide-react';

type UserRole = 'candidate' | 'employer';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<UserRole>('candidate');

  // Simulate a login delay then redirect based on role
  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'employer') {
        router.push('/employer/dashboard');
      } else {
        router.push('/dashboard');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 font-sans selection:bg-indigo-100">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 max-w-md w-full bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] border border-white/50"
      >
        {/* Role Toggle Switch */}
        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl mb-8 relative">
          <button
            onClick={() => setRole('candidate')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all z-10 ${
              role === 'candidate' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User size={14} strokeWidth={3} /> Candidate
          </button>
          <button
            onClick={() => setRole('employer')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all z-10 ${
              role === 'employer' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Briefcase size={14} strokeWidth={3} /> Employer
          </button>

          {/* Animated Background Pill */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm border border-slate-200/50 ${
              role === 'employer' ? 'left-[calc(50%+3px)]' : 'left-1.5'
            }`}
          />
        </div>

        <div className="text-center mb-10">
          <motion.div 
            key={role} // Animate on change
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-block px-4 py-1.5 mb-4 rounded-full text-xs font-bold uppercase tracking-widest ${
              role === 'employer' 
                ? 'bg-blue-50 text-blue-700' 
                : 'bg-indigo-50 text-indigo-600'
            }`}
          >
            {role === 'employer' ? 'Recruiter Portal' : 'Job Seeker Portal'}
          </motion.div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="mt-3 text-slate-500 font-medium">
            {role === 'employer' 
              ? 'Log in to find your next hire.' 
              : 'Log in to manage your applications.'}
          </p>
        </div>

        {/* Google Login */}
        <button className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all font-bold text-slate-700 mb-8 active:scale-[0.98]">
          <Chrome className="h-5 w-5 text-red-500" />
          Continue with Google
        </button>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or email</span></div>
        </div>

        <form onSubmit={handleMockLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Work Email</label>
            <div className="relative group">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors ${role === 'employer' ? 'group-focus-within:text-blue-600' : 'group-focus-within:text-indigo-600'}`} />
              <input 
                type="email" 
                required
                placeholder={role === 'employer' ? "hr@company.com" : "name@example.com"}
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white outline-none transition-all text-sm font-medium text-slate-900 ${
                  role === 'employer' ? 'focus:border-blue-600' : 'focus:border-indigo-600'
                }`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors ${role === 'employer' ? 'group-focus-within:text-blue-600' : 'group-focus-within:text-indigo-600'}`} />
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white outline-none transition-all text-sm font-medium text-slate-900 ${
                  role === 'employer' ? 'focus:border-blue-600' : 'focus:border-indigo-600'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" size-sm className={`text-sm font-bold transition-colors ${role === 'employer' ? 'text-blue-600 hover:text-blue-700' : 'text-indigo-600 hover:text-indigo-700'}`}>
              Forgot Password?
            </Link>
          </div>

          <button 
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-4 px-4 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${
              role === 'employer' 
                ? 'bg-slate-900 hover:bg-blue-600 shadow-blue-100' 
                : 'bg-slate-900 hover:bg-indigo-600 shadow-indigo-100'
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {role === 'employer' ? 'Employer Login' : 'Sign In'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          {role === 'employer' ? 'Want to post a job? ' : 'New to JobFlow? '}
          <Link 
            href={role === 'employer' ? "/employer/signup" : "/signup"} 
            className={`font-bold transition-colors ${role === 'employer' ? 'text-blue-600 hover:text-blue-700' : 'text-indigo-600 hover:text-indigo-700'}`}
          >
            {role === 'employer' ? 'Register Company' : 'Create account'}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}