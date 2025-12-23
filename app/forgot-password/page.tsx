'use client';
import { useState } from 'react';
import Link from 'next/link';
import { KeyRound, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'verify'>('email');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        
        {step === 'email' ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <KeyRound className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Forgot password?</h2>
            <p className="mt-2 text-sm text-gray-600">No worries, we ll send you reset instructions.</p>
            
            <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); setStep('verify'); }}>
              <input type="email" required className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="Enter your email" />
              <button className="w-full py-3 px-4 text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all">
                Reset Password
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <ShieldCheck className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
            <p className="mt-2 text-sm text-gray-600">We sent a 6-digit code to your inbox.</p>
            
            <form className="mt-8 space-y-6">
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <input key={i} type="text" maxLength={1} className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                ))}
              </div>
              <button className="w-full py-3 px-4 text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all">
                Verify Code
              </button>
              <p className="text-sm text-gray-500">
                Didnt receive the email? <button className="text-blue-600 font-bold hover:underline">Click to resend</button>
              </p>
            </form>
          </div>
        )}

        <div className="pt-6 text-center">
          <Link href="/login" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-700 transition">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to log in
          </Link>
        </div>
      </div>
    </div>
  );
}