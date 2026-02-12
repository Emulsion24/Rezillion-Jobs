'use client';
interface Job {
  id: number;
  title: string;
  company_name: string;
  location: string;
  salary_min: number;
  salary_max: number;
  currency: string;
  job_type: string;
  experience_required: string;
  description: string;
  skills: string[];
  created_at: string;
  has_applied: boolean;
}

interface SidebarItemProps {
  id: string;
  icon: React.ElementType;
  label: string;
  activeTab: string;
  setActiveTab: (id: string) => void;
}

interface DetailCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, FileText, MapPin, Bell, User, 
  LogOut, ChevronRight, Zap, X, Landmark, 
  BookOpen, Loader2, Search, Briefcase, DollarSign, 
  Layers, Clock, CheckCircle, Info, Target, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';

// IMPORT MODULAR COMPONENTS
import { GovtJobsView } from '@/app/components/GovtJobsView';
import { LearningHubView } from '@/app/components/LearningHubView';
import { ApplicationsView } from '@/app/components/ApplicationsView';
import { NameQualification } from '../components/NameQualification';
import { CertificateExperience } from '../components/CertificateExperience';
import { AdditionalDetails } from '../components/AdditionalDetails';
import { SolarDesignSection } from '../components/SolarDesignEngineerSection';

// --- PROFILE COMPLETION BANNER ---
const ProfileCompletionBanner = ({ onAction }: { onAction: () => void }) => {
  const { user } = useUserStore();
  
  // Logic to calculate percentage (Assuming these fields exist in your user object)
  const completionPercentage = useMemo(() => {
    if (!user) return 0;
    let score = 0;
    if (user.name) score += 25;
    if (user.email) score += 25;
    // You can add more logic here if your store has skills/experience arrays
    // For now, let's simulate 65% if they are logged in
    return Math.min(score + 15, 100); 
  }, [user]);

  if (completionPercentage >= 100) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 bg-gradient-to-r from-slate-900 to-emerald-900 rounded-[32px] p-6 text-white shadow-xl shadow-emerald-900/10 flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
          <Target className="text-emerald-400" size={32} />
        </div>
        <div>
          <h3 className="text-lg font-black tracking-tight">Complete your Greenzee Profile</h3>
          <p className="text-slate-300 text-sm font-medium">Getting to 100% increases your visibility to recruiters by 3x.</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6 w-full md:w-auto">
        <div className="flex-1 md:w-48">
          <div className="flex justify-between mb-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
            <span>Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>
        </div>
        <button 
          onClick={onAction}
          className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-colors shrink-0"
        >
          Finish Setup
        </button>
      </div>
    </motion.div>
  );
};

const FindJobsView = ({ onCompleteProfile }: { onCompleteProfile: () => void }) => {
  const { user } = useUserStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (user?.id) params.append('userId', user.id.toString());
        if (search) params.append('search', search);
        const res = await fetch(`/api/dashboard/jobs?${params.toString()}`);
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (error) { 
        console.error("Fetch error:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    const timer = setTimeout(fetchJobs, 500);
    return () => clearTimeout(timer);
  }, [search, user?.id]);

  const handleApply = async (jobId: number) => {
    try {
      const res = await fetch('/api/dashboard/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, jobId })
      });
      if (res.ok) {
        setSelectedJob(null);
        setJobs(prev => prev.map(j => j.id === jobId ? {...j, has_applied: true} : j));
      }
    } catch (e) { 
      console.error("Apply error:", e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <ProfileCompletionBanner onAction={onCompleteProfile} />

      {/* Premium Search Bar */}
      <div className="bg-white p-4 rounded-[32px] shadow-2xl shadow-emerald-100/30 border border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center px-4">
            <Search className="h-5 w-5 text-emerald-500 mr-3" />
            <input 
              type="text" 
              placeholder="Search Green Careers (e.g. Solar Engineer)..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full outline-none font-bold text-slate-700 placeholder:text-slate-300" 
            />
          </div>
          <button className="bg-emerald-600 text-white px-10 py-4 rounded-[20px] font-black uppercase text-xs tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
            Find Opportunities
          </button>
      </div>

      <div className="space-y-4">
          {loading ? (
            <div className="p-20 text-center flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-emerald-600" size={40} />
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Scanning Global Green Jobs...</p>
            </div>
          ) : (
           jobs.map((job: Job) => (
                <motion.div 
                    key={job.id} 
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedJob(job)} 
                    className="bg-white p-8 rounded-[32px] border border-slate-100 hover:border-emerald-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-xl cursor-pointer group"
                >
                    <div className="flex gap-6 items-start">
                        <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center font-black text-2xl text-emerald-600 uppercase">
                          {job.company_name?.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{job.title}</h3>
                            <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                <Briefcase size={14}/> {job.company_name}
                            </p>
                            <div className="flex flex-wrap gap-3 mt-4">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded-lg border border-slate-100">
                                    <MapPin size={12} className="text-emerald-500"/> {job.location}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded-lg border border-slate-100">
                                    <Clock size={12} className="text-emerald-500"/> {job.job_type}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {job.has_applied && (
                            <span className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase bg-emerald-50 px-3 py-2 rounded-xl">
                                <CheckCircle size={14}/> Applied
                            </span>
                        )}
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                            <ChevronRight size={20} />
                        </div>
                    </div>
                </motion.div>
           )))}
      </div>

      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                onClick={() => setSelectedJob(null)} 
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60]" 
            />
            <motion.div 
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} 
                transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
                className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white z-[70] shadow-2xl flex flex-col overflow-hidden rounded-l-[40px]"
            >
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Job Specification</h2>
                    </div>
                    <button onClick={() => setSelectedJob(null)} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
                        <X size={20}/>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-10">
                    <div className="flex items-center gap-8">
                        <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-emerald-200">
                            {selectedJob.company_name?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 leading-tight">{selectedJob.title}</h1>
                            <p className="text-xl text-emerald-600 font-bold mt-1">{selectedJob.company_name}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <DetailCard icon={MapPin} label="Location" value={selectedJob.location} color="text-blue-500" />
                        <DetailCard icon={Briefcase} label="Type" value={selectedJob.job_type} color="text-purple-500" />
                        <DetailCard icon={Layers} label="Experience" value={selectedJob.experience_required} color="text-orange-500" />
                        <DetailCard icon={DollarSign} label="Salary" value={`${selectedJob.currency} ${selectedJob.salary_min} - ${selectedJob.salary_max}`} color="text-emerald-500" />
                        <DetailCard icon={Clock} label="Posted On" value={new Date(selectedJob.created_at).toLocaleDateString()} color="text-slate-400" />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Zap size={16} className="text-emerald-500"/> Technical Stack
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedJob.skills.map((skill: string, index: number) => (
                                <span key={index} className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-100">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Info size={16} className="text-emerald-500"/> Role Overview
                        </h3>
                        <div className="text-slate-500 font-medium leading-loose whitespace-pre-line bg-slate-50 p-8 rounded-[32px] border border-slate-100 italic">
                            {selectedJob.description}
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t bg-white">
                    <button 
                      onClick={() => !selectedJob.has_applied && handleApply(selectedJob.id)}
                      className={`w-full py-6 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl ${selectedJob.has_applied ? 'bg-emerald-100 text-emerald-600 cursor-default' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 hover:-translate-y-1 active:scale-95'}`}
                    >
                        {selectedJob.has_applied ? 'Applied Successfully' : 'Apply for this Role'}
                    </button>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const DetailCard = ({ icon: Icon, label, value, color }: DetailCardProps) => (
    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:border-emerald-200 transition-all">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-wider">{label}</p>
        <p className="font-black text-slate-800 flex items-center gap-2 text-sm leading-tight">
            <Icon size={16} className={color}/> {value}
        </p>
    </div>
);

const DashboardComponent = () => {
  const [activeTab, setActiveTab] = useState<string>('find-jobs');
  const router = useRouter();
  const { user, logout, hasHydrated } = useUserStore();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      logout();
      router.push('/login');
      router.refresh(); 
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  useEffect(() => { 
    if (hasHydrated && !user) router.push('/login'); 
  }, [user, hasHydrated, router]);

  if (!hasHydrated || !user) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-emerald-600 mb-4" size={48} />
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.4em]">Greenzee Security Gateway</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] font-sans text-slate-900 flex">
      <aside className="w-72 bg-white border-r border-slate-100 fixed h-full hidden md:flex flex-col z-20">
        <div className="p-10 border-b border-slate-50">
          <h1 className="text-2xl font-black text-emerald-700 tracking-tighter uppercase flex items-center gap-2 italic">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-base not-italic shadow-lg shadow-emerald-200">G</div>
            GREENZEE<span className="text-slate-900 font-light">JOBS</span>
          </h1>
        </div>
        <nav className="flex-1 px-6 py-8 space-y-2">
          <SidebarItem id="find-jobs" icon={LayoutDashboard} label="Explore Jobs" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem id="govt-jobs" icon={Landmark} label="Govt Portal" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem id="learning" icon={BookOpen} label="Learning Hub" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem id="applications" icon={FileText} label="My History" activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="pt-10 border-t border-slate-50 mt-10 space-y-2">
            <SidebarItem id="profile" icon={User} label="My Profile" activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </nav>
        <div className="p-8 border-t border-slate-50">
           <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all active:scale-95">
              <LogOut size={18} /> Sign Out
           </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-72 p-6 md:p-12">
        <header className="flex justify-between items-center mb-12">
           <div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h2>
              <p className="text-emerald-600 font-black text-[10px] mt-1 uppercase tracking-[0.3em]">Verified Greenzee Member</p>
           </div>
           <div className="w-14 h-14 bg-white border border-slate-200 rounded-[22px] flex items-center justify-center text-slate-400 shadow-sm relative cursor-pointer hover:border-emerald-300 hover:text-emerald-600 transition-all">
              <Bell size={24} /><span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
           </div>
        </header>

        <div className="min-h-[600px] pb-20">
           {activeTab === 'find-jobs' && <FindJobsView onCompleteProfile={() => setActiveTab('profile')} />}
           {activeTab === 'govt-jobs' && <GovtJobsView />}
           {activeTab === 'learning' && <LearningHubView />}
           {activeTab === 'applications' && <ApplicationsView />}
           {activeTab === 'profile' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
                <div className="space-y-4"><NameQualification /><CertificateExperience /><AdditionalDetails /></div>
                <SolarDesignSection />
             </div>
           )}
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ id, icon: Icon, label, activeTab, setActiveTab }: SidebarItemProps) => (
  <button 
    onClick={() => setActiveTab(id)} 
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] transition-all ${
        activeTab === id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200' : 'text-slate-400 hover:bg-slate-50 hover:text-emerald-600'
    }`}
  >
    <Icon size={16} strokeWidth={3} /> {label}
  </button>
);

export default dynamic(() => Promise.resolve(DashboardComponent), { ssr: false });