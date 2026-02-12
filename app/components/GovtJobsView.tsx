'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Landmark, MapPin, Clock, Loader2, ArrowRight } from 'lucide-react';

// 1. Strict Interface
interface GovtJob {
  id: number;
  organization: string;
  title: string;
  location: string;
  deadline: string;
  official_link: string;
}

export const GovtJobsView = () => {
  // 2. Type-Safe State
  const [govtJobs, setGovtJobs] = useState<GovtJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGovtJobs = async () => {
      try {
        const res = await fetch('/api/govt-jobs'); 
        if (res.ok) {
          const data: GovtJob[] = await res.json();
          setGovtJobs(data);
        }
      } catch (e) {
        console.error("Failed to fetch Govt Jobs", e);
      } finally {
        setLoading(false);
      }
    };
    fetchGovtJobs();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-orange-200">
            <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30 mb-4">
                  <Landmark size={14} className="text-yellow-300" /> Public Sector Opportunities
                </div>
                <h2 className="text-3xl font-black mb-2 tracking-tight">Government & PSU Jobs</h2>
                <p className="text-orange-50 opacity-90 font-medium leading-relaxed">
                  Access official recruitment notifications from NTPC, SECI, MSEDCL, and other leading public sector units.
                </p>
            </div>
            <Landmark size={80} className="text-white/20 hidden md:block rotate-12" />
        </div>

        {/* Content Grid */}
        {loading ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-orange-500" size={40}/>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Scanning Notifications...</p>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {govtJobs.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white border-2 border-dashed border-slate-200 rounded-[32px] text-slate-400 font-bold">
                   No active government notifications found at the moment.
                </div>
              ) : govtJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="bg-white rounded-[24px] border border-slate-200 p-6 hover:shadow-xl hover:border-orange-200 transition-all group flex flex-col justify-between h-full"
                  >
                      <div>
                          <div className="flex justify-between items-start mb-4">
                              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 font-bold text-xl uppercase border border-orange-100">
                                {job.organization.charAt(0)}
                              </div>
                              <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                PSU
                              </div>
                          </div>
                          
                          <h4 className="font-black text-slate-900 text-lg leading-tight mb-1 group-hover:text-orange-600 transition-colors">
                            {job.organization}
                          </h4>
                          <h5 className="font-bold text-slate-500 text-sm mb-6 line-clamp-2">
                            {job.title}
                          </h5>

                          <div className="space-y-3 pt-4 border-t border-slate-50">
                              <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                <div className="p-1.5 bg-slate-100 rounded-full text-slate-400"><MapPin size={12} /></div>
                                {job.location}
                              </div>
                              <div className="flex items-center gap-3 text-xs font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-100 w-fit">
                                <Clock size={12} /> Deadline: {new Date(job.deadline).toLocaleDateString()}
                              </div>
                          </div>
                      </div>
                      
                      <a 
                        href={job.official_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="mt-6 w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest text-center hover:bg-orange-600 transition-all shadow-lg flex items-center justify-center gap-2 group-hover:gap-3"
                      >
                        View Notification <ArrowRight size={14} />
                      </a>
                  </div>
              ))}
          </div>
        )}
    </motion.div>
  );
};