'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Briefcase, Bell, User, 
  LogOut, Settings, ChevronRight, AlertCircle, Sparkles
} from 'lucide-react';
import Link from 'next/link';

const FEATURED_JOBS = [
  { 
    id: 1, 
    title: 'Solar Design & Analysis Engineer', 
    company: 'Rezillion Energy', 
    location: 'Remote / Metro Cities', 
    type: 'Full-time', 
    tags: ['PVsyst', 'AutoCAD', 'Helioscope'],
    salary: 'Competitive'
  },
  { 
    id: 2, 
    title: 'Solar Project / Site Engineer', 
    company: 'SunPower Systems', 
    location: 'On-site (Pan India)', 
    type: 'Full-time', 
    tags: ['WMS', 'Site Execution', 'QA/QC'],
    salary: 'As per Industry'
  },
  { 
    id: 3, 
    title: 'Solar O&M Engineer', 
    company: 'CleanGrid Solutions', 
    location: 'Hybrid', 
    type: 'Full-time', 
    tags: ['IV Curve', 'Thermal Imaging', 'EL Testing'],
    salary: 'Best in Class'
  },
];

export default function RezillionDashboard() {
  return (
    <div className="min-h-screen bg-[#fcfcfd] font-sans text-slate-900">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black text-indigo-700 tracking-tighter uppercase">
            Rezillion<span className="text-slate-900">Jobs</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="w-10 h-10 rounded-full border-2 border-indigo-100 p-0.5 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff" alt="Profile" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Completion Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-3xl"
        >
          <div className="bg-white rounded-[1.4rem] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Complete your profile to stand out</h2>
                <p className="text-sm text-slate-500">Employers in the Solar sector prefer candidates with detailed technical skills.</p>
              </div>
            </div>
            <Link 
              href="/candidate-profile" 
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 whitespace-nowrap"
            >
              Complete Basic Details
            </Link>
          </div>
        </motion.div>
         <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-3xl"
        >
          <div className="bg-white rounded-[1.4rem] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Complete your profile to stand out</h2>
                <p className="text-sm text-slate-500">Employers in the Solar sector prefer candidates with detailed technical skills.</p>
              </div>
            </div>
            <Link 
              href="/skill-profile" 
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 whitespace-nowrap"
            >
              Complete Skill
            </Link>
          </div>
        </motion.div>


        <header className="mb-8">
          <h1 className="text-3xl font-black tracking-tight">Solar Energy Opportunities</h1>
          <p className="text-slate-500 font-medium">Matching your PV System Engineering background.</p>
        </header>

        {/* Search Bar */}
        <div className="bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-2 mb-10">
          <div className="flex-1 flex items-center px-4 py-2 border-r border-slate-100">
            <Search className="h-5 w-5 text-slate-400 mr-3" />
            <input type="text" placeholder="Design, O&M, Site Engineer..." className="w-full outline-none text-sm font-medium" />
          </div>
          <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition">
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {FEATURED_JOBS.map((job) => (
            <motion.div 
              key={job.id}
              whileHover={{ x: 5 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex gap-5 items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold border border-slate-100 text-2xl">
                  {job.title.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                  <p className="text-slate-500 font-semibold mb-2">{job.company}</p>
                  <div className="flex gap-2">
                    {job.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-md tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:items-end gap-3">
                <div className="flex items-center text-sm text-slate-500 font-medium gap-2">
                  <MapPin className="h-4 w-4" /> {job.location}
                </div>
                <button className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-indigo-600 transition">
                  Apply Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}