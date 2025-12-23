import React from 'react';
import Link from 'next/link';

export default function JobPortalHome() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600 tracking-tight">
                Rezillion<span className="text-gray-900">Jobs</span>
              </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex space-x-8">
              <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium transition">Find Jobs</Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium transition">Companies</Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium transition">Salaries</Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-blue-600 font-semibold px-4 py-2 transition"
              >
                Log in
              </Link>
              <Link 
                href="/signup" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition shadow-md hover:shadow-lg"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <header className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Find your <span className="text-blue-600">dream job</span> today.
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Browse through thousands of job listings from top companies around the world. Your next big career move starts here.
            </p>

            {/* Search Bar Placeholder */}
            <div className="max-w-4xl mx-auto bg-white p-2 rounded-xl shadow-xl border flex flex-col md:flex-row gap-2">
              <input 
                type="text" 
                placeholder="Job title, keywords, or company" 
                className="flex-grow px-4 py-3 rounded-lg outline-none text-gray-700"
              />
              <input 
                type="text" 
                placeholder="Location" 
                className="flex-grow px-4 py-3 border-l-0 md:border-l rounded-lg outline-none text-gray-700"
              />
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                Search
              </button>
            </div>
          </div>
        </header>

        {/* Categories Section */}
        <section className="py-16 max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Solar Design', 'Solar Commissioning', 'Project Planning', 'PV System Engineering'].map((cat) => (
              <div key={cat} className="p-6 bg-white rounded-xl border hover:border-blue-500 hover:shadow-md transition cursor-pointer">
                <h3 className="font-bold text-lg text-gray-800">{cat}</h3>
                <p className="text-blue-600 mt-2">1,200+ Openings &rarr;</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2025 Rezillion Jobs Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}