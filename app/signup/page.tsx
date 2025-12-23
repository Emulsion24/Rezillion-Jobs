'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Chrome, ArrowRight, ShieldCheck, Briefcase } from 'lucide-react';

export default function SignupPage() {
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-12 font-sans relative overflow-hidden">
      {/* Soft Background Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
          <p className="mt-2 text-slate-500 font-medium">Join JobFlow to start your journey</p>
        </div>

        {/* Role Toggle */}
        <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8">
          <button 
            onClick={() => setRole('candidate')}
            className={`flex-1 flex items-center justify-center py-3 rounded-xl font-bold transition-all ${role === 'candidate' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <User className="w-4 h-4 mr-2" /> Candidate
          </button>
          <button 
            onClick={() => setRole('employer')}
            className={`flex-1 flex items-center justify-center py-3 rounded-xl font-bold transition-all ${role === 'employer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Briefcase className="w-4 h-4 mr-2" /> Employer
          </button>
        </div>

        {/* Google Signup */}
        <button className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all font-bold text-slate-700 mb-8">
          <Chrome className="h-5 w-5 text-red-500" />
          Sign up with Google
        </button>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or use email</span></div>
        </div>

        {/* Form Fields */}
        <form className="space-y-5">
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input type="text" placeholder="John Doe" className="w-full pl-12 pr-4 py-4 bg-slate-50 text-slate-400  border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all text-sm font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input type="email" placeholder="john@example.com" className="w-full pl-12  text-slate-400 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all text-sm font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input type="password" placeholder="••••••••" className="w-full text-slate-400  pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all text-sm font-medium" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Confirm Password</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-4 bg-slate-50 text-slate-400 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all text-sm font-medium" />
                </div>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 flex items-center justify-center py-4 px-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]">
            Create Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Already have an account? <Link href="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}