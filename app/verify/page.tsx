'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, RefreshCcw } from 'lucide-react';

export default function VerifyCodePage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle OTP Input logic
  const handleChange = (text: string, index: number) => {
    // Only allow numbers
    if (/[^0-9]/.test(text)) return;

    const newCode = [...code];
    // Take only the last character (handles mobile keyboard suggestions)
    newCode[index] = text.slice(-1);
    setCode(newCode);

    // Move to next input if text is entered
    if (newCode[index] !== '' && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      inputs.current[index - 1]?.focus();
    }
  };

  // Support pasting the entire 6-digit code
  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(data)) return;

    const newCode = [...code];
    data.split('').forEach((char, i) => {
      newCode[i] = char;
    });
    setCode(newCode);
    
    // Focus the last filled input or the first empty one
    const focusIndex = data.length < 6 ? data.length : 5;
    inputs.current[focusIndex]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          {/* Icon Header */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900">Verify your email</h2>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            Weve sent a 6-digit verification code to <br />
            <span className="font-semibold text-gray-900">user@example.com</span>
          </p>
        </div>

        <form className="mt-8 space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* OTP Input Fields */}
          <div className="flex justify-between gap-2 sm:gap-4">
            {code.map((digit, index) => (
              <input
                key={index}
                // FIXED: Wrapped assignment in curly braces to return void
                ref={(el) => { inputs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onPaste={handlePaste}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-900"
              />
            ))}
          </div>

          <button className="w-full flex justify-center py-4 px-4 text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
            Verify Account
          </button>
        </form>

        <div className="space-y-6 text-center">
          <p className="text-sm text-gray-500">
            Didnt receive the code?{' '}
            <button className="inline-flex items-center font-bold text-blue-600 hover:text-blue-500 transition">
              <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
              Resend code
            </button>
          </p>

          <div className="pt-4">
            <Link 
              href="/login" 
              className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-800 transition"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}