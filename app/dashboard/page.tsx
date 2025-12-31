'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Bell, User, 
  LogOut, Settings, ChevronRight, Sparkles,
  LayoutDashboard, FileText, CheckCircle2,
  Clock, Zap, Menu, X,
  Lock, BookOpen, Landmark, ExternalLink,
  BellRing, GraduationCap, PlayCircle, Star // Added icons for courses
} from 'lucide-react';
import { NameQualification } from '../components/NameQualification';
import { CertificateExperience } from '../components/CertificateExperience';
import { AdditionalDetails } from '../components/AdditionalDetails';
import { SolarDesignSection } from '../components/SolarDesignEngineerSection';

// --- 1. MOCK DATA & CONSTANTS ---

const JOB_DATA = [
  { 
    id: 1, 
    title: 'Solar Design Engineer', 
    company: 'Tata Power Solar', 
    logo: 'T',
    location: 'Bangalore / Remote', 
    type: 'Full-time', 
    posted: '2 days ago',
    tags: ['PVsyst', 'AutoCAD', 'Helioscope'],
    salary: '₹6L - ₹9L PA',
    color: 'bg-indigo-600'
  },
  { 
    id: 2, 
    title: 'Site Project Manager', 
    company: 'Adani Green Energy', 
    logo: 'A',
    location: 'Bhuj, Gujarat', 
    type: 'On-site', 
    posted: '5 days ago',
    tags: ['Site Execution', 'Civil Works', 'Team Lead'],
    salary: '₹12L - ₹15L PA',
    color: 'bg-orange-500'
  },
  { 
    id: 3, 
    title: 'O&M Engineer', 
    company: 'Sterling & Wilson', 
    logo: 'S',
    location: 'Rajasthan', 
    type: 'Full-time', 
    posted: 'Just now',
    tags: ['SCADA', 'HT/LT Maintenance'],
    salary: '₹4L - ₹6L PA',
    color: 'bg-blue-600'
  },
];

const APPLICATIONS_DATA = [
  { id: 101, role: 'Senior PV Engineer', company: 'Renew Power', status: 'Interview', date: '12 Oct', statusColor: 'text-orange-600 bg-orange-50' },
  { id: 102, role: 'Project Manager', company: 'Azure Power', status: 'Applied', date: '15 Oct', statusColor: 'text-blue-600 bg-blue-50' },
  { id: 103, role: 'Graduate Trainee', company: 'Vikram Solar', status: 'Rejected', date: '01 Oct', statusColor: 'text-red-600 bg-red-50' },
];

const GOVT_JOBS_DATA = [
  {
    id: 'g1',
    role: 'Executive Trainee (Electrical)',
    org: 'NTPC Limited',
    type: 'PSU (Navratna)',
    location: 'Pan India',
    deadline: '25 Nov 2024',
    eligibility: 'B.Tech Electrical + GATE 2024',
    link: '#'
  },
  {
    id: 'g2',
    role: 'Project Officer (Solar)',
    org: 'SECI (Solar Energy Corp of India)',
    type: 'Central Govt',
    location: 'New Delhi',
    deadline: '10 Dec 2024',
    eligibility: 'B.E./B.Tech + 2 Years Exp',
    link: '#'
  },
  {
    id: 'g3',
    role: 'Assistant Engineer (Renewable)',
    org: 'MSEDCL (Mahavitaran)',
    type: 'State Govt',
    location: 'Mumbai / Pune',
    deadline: '15 Dec 2024',
    eligibility: 'Degree in Electrical Engineering',
    link: '#'
  }
];

// NEW: Mock Data for Courses
const COURSE_DATA = [
    {
      id: 'c1',
      title: 'Solar PV System Design: From Scratch to Master',
      provider: 'SolarEnergy Academy',
      duration: '12h 30m',
      lessons: 24,
      rating: 4.8,
      level: 'Intermediate',
      thumbnailColor: 'bg-yellow-500'
    },
    {
      id: 'c2',
      title: 'AutoCAD for Electrical Engineers',
      provider: 'DesignPro',
      duration: '8h 15m',
      lessons: 18,
      rating: 4.5,
      level: 'Beginner',
      thumbnailColor: 'bg-blue-500'
    },
    {
      id: 'c3',
      title: 'Safety Standards in High Voltage Projects',
      provider: 'SafetyFirst',
      duration: '4h 45m',
      lessons: 10,
      rating: 4.9,
      level: 'Advanced',
      thumbnailColor: 'bg-red-500'
    }
];

// --- COMPONENT B: BASIC DETAILS SUB-SECTIONS ---

// Wrapper for Basic Details
const BasicDetailsForm = () => {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 md:p-8 h-full space-y-6 divide-y divide-slate-100 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <User size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900">Basic Details</h3>
                    <p className="text-sm text-slate-500 font-medium">Personal & Professional Info</p>
                </div>
            </div>
            
            <div className="flex-1 space-y-4">
                <NameQualification />
                <CertificateExperience />
                <AdditionalDetails />
            </div>
            
            <div className="pt-6 mt-auto">
                <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg">Save Basic Details</button>
            </div>
        </div>
    );
};

// --- 3. MAIN DASHBOARD COMPONENTS ---

type SidebarItemProps = { 
  id: string; 
  icon: React.ElementType; 
  label: string; 
  activeTab: string; 
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  onMobileClick?: () => void;
};

export const SidebarItem = ({ id, icon: Icon, label, activeTab, setActiveTab, onMobileClick }: SidebarItemProps) => (
  <button
    onClick={() => {
      setActiveTab(id);
      if (onMobileClick) onMobileClick();
    }}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
      activeTab === id
        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <Icon size={20} strokeWidth={activeTab === id ? 2.5 : 2} />
    <span>{label}</span>
  </button>
);


const FindJobsView = ({ setActiveTab }: { setActiveTab: React.Dispatch<React.SetStateAction<string>> }) => (
  <div className="flex flex-col xl:flex-row gap-8 animate-in fade-in duration-500">
    
    {/* Left Column: Stats & Job Feed */}
    <div className="flex-1 min-w-0 space-y-6">
      {/* Search Bar - Responsive Flex */}
      <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 border-slate-100">
            <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
            <input type="text" placeholder="Search by Role..." className="w-full outline-none text-sm font-bold text-slate-700 placeholder:font-medium placeholder:text-slate-400"/>
          </div>
          <div className="h-[1px] md:h-8 w-full md:w-[1px] bg-slate-200 self-center hidden md:block"></div>
          <div className="flex-1 flex items-center px-4 py-2">
            <MapPin className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
            <input type="text" placeholder="City or State" className="w-full outline-none text-sm font-bold text-slate-700 placeholder:font-medium placeholder:text-slate-400" />
          </div>
          <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition flex items-center gap-2 justify-center shrink-0">
            Find Jobs
          </button>
      </div>

      {/* Job Grid */}
      <div className="grid grid-cols-1 gap-4">
          <h3 className="text-lg font-black text-slate-900 px-1">Recommended for You</h3>
          {JOB_DATA.map((job) => (
          <motion.div 
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.005 }}
              className="group bg-white p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
          >
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${job.color}`}></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pl-2">
                <div className="flex gap-5 items-start">
                    <div className={`w-14 h-14 ${job.color} rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0`}>{job.logo}</div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 font-semibold mt-1">
                            <span>{job.company}</span>
                            <span className="hidden sm:inline w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                            <span className="hidden sm:inline w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="flex items-center gap-1"><Clock size={12}/> {job.posted}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {job.tags.map(tag => (
                                <span key={tag} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-bold rounded-md">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 mt-2 md:mt-0">
                    <div className="text-left md:text-right">
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Salary</p>
                        <p className="text-lg font-black text-slate-900">{job.salary}</p>
                    </div>
                    <button className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-indigo-600 shadow-md hover:shadow-lg transition flex items-center justify-center gap-2">
                        <Zap size={16} className="fill-current" /> <span className="hidden sm:inline">Apply Now</span><span className="sm:hidden">Apply</span>
                    </button>
                </div>
              </div>
          </motion.div>
          ))}
      </div>
    </div>

    {/* Right Column: Profile Widgets */}
    <div className="w-full xl:w-80 space-y-6">
      
      {/* PROFILE STRENGTH WIDGET */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={100} /></div>
          
          <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">Profile Strength</h3>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold">65%</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full mb-6 overflow-hidden"><div className="bg-indigo-400 h-full w-[65%] rounded-full"></div></div>

              <div className="space-y-3">
                  <button onClick={() => setActiveTab('edit-basic')} className="w-full flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition cursor-pointer group text-left">
                      <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-400 text-slate-900 flex items-center justify-center"><CheckCircle2 size={14} /></div>
                          <span className="text-sm font-bold text-slate-200 group-hover:text-white">Basic Details</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-400" />
                  </button>
                  
                  <button onClick={() => setActiveTab('edit-skills')} className="w-full flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition cursor-pointer group border border-dashed border-white/30 text-left">
                      <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full border-2 border-indigo-400 flex items-center justify-center text-indigo-300"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div></div>
                          <span className="text-sm font-bold text-slate-200 group-hover:text-white">Add Skills</span>
                      </div>
                      <ChevronRight size={16} className="text-indigo-300" />
                  </button>
              </div>
          </div>
      </div>

      {/* Resume Drop Zone */}
      <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white text-slate-400 group-hover:text-indigo-600 transition-colors">
              <FileText size={24} />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Update Resume</h4>
          <p className="text-xs text-slate-500 mt-1">Drag & drop or click to upload PDF</p>
      </div>
    </div>
  </div>
);

// --- NEW VIEW: GOVERNMENT & PSU JOBS ---
const GovtJobsView = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-white/30 mb-3">
                    <Landmark size={14} className="text-yellow-300" /> Government Sector
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-2">Government & PSU Opportunities</h2>
                <p className="text-orange-100 font-medium text-sm md:text-base">Stay updated with the latest notifications from NTPC, SECI, and State DISCOMs.</p>
            </div>
            <Landmark size={64} className="text-white/20 hidden md:block" />
        </div>

        <div>
            <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2"><Landmark size={24} className="text-slate-700"/> Latest Notifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {GOVT_JOBS_DATA.map((job) => (
                    <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all border-l-4 border-l-orange-500 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-black text-slate-900 text-lg leading-tight">{job.org}</h4>
                                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded mt-1 inline-block">{job.type}</span>
                                </div>
                                <img src={`https://ui-avatars.com/api/?name=${job.org}&background=f97316&color=fff&size=48`} className="w-10 h-10 rounded-lg" alt="Logo"/>
                            </div>
                            <h5 className="font-bold text-slate-700 mb-4">{job.role}</h5>
                            <div className="space-y-2 text-sm text-slate-600 font-medium">
                                <p className="flex items-center gap-2"><MapPin size={14} /> {job.location}</p>
                                <p className="flex items-center gap-2"><Clock size={14} /> Deadline: <span className="text-red-500 font-bold">{job.deadline}</span></p>
                                <p className="flex items-center gap-2 text-xs bg-slate-50 p-2 rounded border border-slate-100 mt-2">{job.eligibility}</p>
                            </div>
                        </div>
                        <button className="mt-6 w-full py-2.5 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-900 hover:text-white transition flex items-center justify-center gap-2">View Notification <ExternalLink size={16}/></button>
                    </div>
                ))}
            </div>
        </div>
    </motion.div>
);

// --- NEW VIEW: LEARNING HUB (COURSES) ---
const LearningHubView = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-white/30 mb-3">
                  <GraduationCap size={14} className="text-yellow-300" /> Upskill Yourself
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-2">Learning Hub</h2>
              <p className="text-blue-100 font-medium text-sm md:text-base">Master Solar PV Design, AutoCAD, and Project Management with industry-standard courses.</p>
          </div>
          <BookOpen size={64} className="text-white/20 hidden md:block" />
      </div>

      <div>
          <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2"><PlayCircle size={24} className="text-slate-700"/> Recommended Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COURSE_DATA.map((course) => (
                  <div key={course.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full group">
                      <div className={`h-32 ${course.thumbnailColor} relative flex items-center justify-center`}>
                         <PlayCircle className="text-white/50 w-12 h-12 group-hover:scale-110 transition-transform"/>
                         <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-slate-800">{course.level}</span>
                      </div>
                      <div className="p-6 flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{course.provider}</span>
                                <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold"><Star size={12} fill="currentColor"/> {course.rating}</div>
                            </div>
                            <h4 className="font-bold text-slate-900 text-lg leading-tight mb-3 line-clamp-2">{course.title}</h4>
                            <div className="flex items-center gap-4 text-xs text-slate-500 font-bold mb-4">
                                <span className="flex items-center gap-1"><Clock size={12}/> {course.duration}</span>
                                <span className="flex items-center gap-1"><BookOpen size={12}/> {course.lessons} Lessons</span>
                            </div>
                          </div>
                          <button className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition">Start Learning</button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  </motion.div>
);

const SettingsView = () => (
    <div className="max-w-2xl bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-2xl font-black text-slate-900 mb-6">Settings</h2>
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3"><BellRing className="text-slate-500"/><span className="font-bold text-slate-700 text-sm md:text-base">Email Notifications</span></div>
                <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer"><div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1"></div></div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3"><Lock className="text-slate-500"/><span className="font-bold text-slate-700 text-sm md:text-base">Change Password</span></div>
                <ChevronRight className="text-slate-400"/>
            </div>
        </div>
    </div>
);

const ApplicationsView = () => (
  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden animate-in fade-in duration-500">
    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
      <h3 className="text-lg md:text-xl font-black text-slate-900">Application History</h3>
      <button className="text-sm font-bold text-indigo-600 flex items-center gap-1">View Archived <ChevronRight size={14}/></button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[600px]">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
          <tr>
              <th className="p-4 md:p-5">Role</th>
              <th className="p-4 md:p-5">Company</th>
              <th className="p-4 md:p-5">Status</th>
              <th className="p-4 md:p-5">Date</th>
          </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
          {APPLICATIONS_DATA.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-4 md:p-5 font-bold text-slate-900">{app.role}</td>
              <td className="p-4 md:p-5 font-medium text-slate-600">{app.company}</td>
              <td className="p-4 md:p-5"><span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${app.statusColor}`}>{app.status}</span></td>
              <td className="p-4 md:p-5 text-sm text-slate-500">{app.date}</td>
              </tr>
          ))}
          </tbody>
      </table>
    </div>
  </div>
);

export default function RezillionCandidateDashboard() {
  const [activeTab, setActiveTab] = useState('find-jobs');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu helper
  const handleMobileNav = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 flex">
      
      {/* MOBILE HEADER */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-4 md:hidden">
          <div className="flex items-center gap-3">
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                  <Menu size={24} />
              </button>
              <span className="text-xl font-black text-indigo-700 tracking-tighter uppercase flex items-center gap-1">
                  <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-sm">R</div>
                  Rezillion
              </span>
          </div>
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-black text-xs">AV</div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={handleMobileNav}
                    className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed top-0 left-0 bottom-0 w-3/4 max-w-xs bg-white z-50 md:hidden overflow-y-auto shadow-2xl"
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <span className="text-xl font-black text-slate-900">Menu</span>
                        <button onClick={handleMobileNav} className="p-2 bg-slate-100 rounded-full text-slate-500"><X size={20}/></button>
                    </div>
                    <nav className="p-4 space-y-2">
                        <SidebarItem id="find-jobs" icon={LayoutDashboard} label="Find Jobs" activeTab={activeTab} setActiveTab={setActiveTab} onMobileClick={handleMobileNav} />
                        <SidebarItem id="applications" icon={FileText} label="My Applications" activeTab={activeTab} setActiveTab={setActiveTab} onMobileClick={handleMobileNav} />
                        <SidebarItem id="govt-jobs" icon={Landmark} label="Govt & PSU Jobs" activeTab={activeTab} setActiveTab={setActiveTab} onMobileClick={handleMobileNav} />
                        <SidebarItem id="learning" icon={BookOpen} label="Learning Hub" activeTab={activeTab} setActiveTab={setActiveTab} onMobileClick={handleMobileNav} />
                        <div className="h-px bg-slate-100 my-4 mx-4"></div>
                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Profile & Settings</p>
                        <SidebarItem id="profile" icon={User} label="My Profile" activeTab={activeTab} setActiveTab={setActiveTab} onMobileClick={handleMobileNav} />
                        <SidebarItem id="settings" icon={Settings} label="Settings" activeTab={activeTab} setActiveTab={setActiveTab} onMobileClick={handleMobileNav} />
                    </nav>
                    <div className="p-6 mt-auto">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <img src="https://ui-avatars.com/api/?name=Aditya+Verma&background=0f172a&color=fff" alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">Aditya Verma</p>
                                <p className="text-xs text-slate-500 truncate">Sign Out</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full hidden md:flex flex-col z-20">
        <div className="p-8">
           <span className="text-2xl font-black text-indigo-700 tracking-tighter uppercase flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">R</div>
            Rezillion<span className="text-slate-900">Jobs</span>
          </span>
        </div>
        <nav className="flex-1 px-6 space-y-2">
          <SidebarItem id="find-jobs" icon={LayoutDashboard} label="Find Jobs" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem id="applications" icon={FileText} label="My Applications" activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="my-2 border-t border-slate-100 pt-2">
            <SidebarItem id="govt-jobs" icon={Landmark} label="Govt & PSU Jobs" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarItem id="learning" icon={BookOpen} label="Learning Hub" activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
          <div className="pt-6">
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Profile & Settings</p>
            <SidebarItem id="profile" icon={User} label="My Profile" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarItem id="settings" icon={Settings} label="Settings" activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </nav>
        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
             <img src="https://ui-avatars.com/api/?name=Aditya+Verma&background=0f172a&color=fff" alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
             <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">Aditya Verma</p>
                <p className="text-xs text-slate-500 truncate">View Profile</p>
             </div>
             <button className="text-slate-400 hover:text-red-500"><LogOut size={18} /></button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 p-4 md:p-10 mt-16 md:mt-0">
        {/* DESKTOP HEADER */}
        <header className="hidden md:flex justify-between items-center mb-8">
           <div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">
               {activeTab === 'find-jobs' && "Dashboard"}
               {activeTab === 'govt-jobs' && "Government & PSU Jobs"}
               {activeTab === 'learning' && "Learning Hub"}
               {activeTab === 'applications' && "My Applications"}
               {activeTab === 'profile' && "My Complete Profile"}
               {activeTab === 'edit-basic' && "Edit Basic Details"}
               {activeTab === 'edit-skills' && "Edit Technical Skills"}
               {activeTab === 'settings' && "Account Settings"}
             </h1>
             <p className="text-slate-500 font-medium mt-1">
                {activeTab === 'find-jobs' ? "Welcome back, Aditya! You have new job matches." : 
                 activeTab === 'learning' ? "Upskill with courses tailored for the renewable sector." :
                 activeTab === 'govt-jobs' ? "Latest government notifications and schemes." :
                 "Manage your career profile and preferences."}
             </p>
           </div>
           <div className="flex items-center gap-4">
              <button className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition relative">
                <Bell size={20} /><span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
              </button>
           </div>
        </header>

        {/* MOBILE HEADER TITLE (Below Nav) */}
        <div className="md:hidden mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
               {activeTab === 'find-jobs' && "Dashboard"}
               {activeTab === 'govt-jobs' && "Govt & PSU"}
               {activeTab === 'learning' && "Learning Hub"}
               {activeTab === 'applications' && "Applications"}
               {activeTab === 'profile' && "My Profile"}
               {activeTab === 'edit-basic' && "Edit Info"}
               {activeTab === 'edit-skills' && "Edit Skills"}
               {activeTab === 'settings' && "Settings"}
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1 truncate">
               {activeTab === 'find-jobs' ? "Welcome back, Aditya!" : "Manage your career."}
            </p>
        </div>

        {/* DYNAMIC CONTENT */}
        <div className="min-h-[500px] pb-10">
           {activeTab === 'find-jobs' && <FindJobsView setActiveTab={setActiveTab} />}
           {activeTab === 'govt-jobs' && <GovtJobsView />}
           {activeTab === 'learning' && <LearningHubView />}
           {activeTab === 'applications' && <ApplicationsView />}
           {activeTab === 'settings' && <SettingsView />}

           {/* VIEW: COMBINED PROFILE */}
           {activeTab === 'profile' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <BasicDetailsForm />
                <SolarDesignSection />
             </motion.div>
           )}

           {/* VIEW: BASIC DETAILS ONLY */}
           {activeTab === 'edit-basic' && (
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl mx-auto">
                <button onClick={() => setActiveTab('find-jobs')} className="mb-4 text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1"><ChevronRight className="rotate-180" size={16}/> Back to Dashboard</button>
                <BasicDetailsForm />
             </motion.div>
           )}

           {/* VIEW: SKILLS ONLY */}
           {activeTab === 'edit-skills' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl mx-auto">
                <button onClick={() => setActiveTab('find-jobs')} className="mb-4 text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1"><ChevronRight className="rotate-180" size={16}/> Back to Dashboard</button>
                <SolarDesignSection />
             </motion.div>
           )}
        </div>
      </main>
    </div>
  );
}