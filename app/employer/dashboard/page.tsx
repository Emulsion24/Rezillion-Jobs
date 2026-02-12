"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// 1. IMPORT ZUSTAND STORE
import { useUserStore } from '@/store/userStore'; 

import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  Search, 
  BookOpen, 
  MapPin, 
  Briefcase, 
  Bell, 
  Cpu,
  CheckCircle2,
  X,
  Clock,
  Send,
  FileText,
  Download,
  Lightbulb,
  GraduationCap,
  LogOut,
  Loader2,
  Star,
  ArrowRight,
  ChevronLeft,
  FileQuestion,
  PlayCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- 1. STRICT TYPE DEFINITIONS ---

type RoleKey = "design" | "om" | "project" | "electrical" | "mechanical";

const CITIES = ["Pune", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Ahmedabad", "Jaipur"];

const ROLES_DB: Record<string, { label: string, skills: string[] }> = {
  design: {
    label: "Solar Design Engineer",
    skills: ["PVsyst", "SAM", "AutoCAD", "SketchUp", "PVcase", "Solargis", "Yield Assessment", "Electrical Design", "Shadow Analysis", "Helioscope"]
  },
  om: {
    label: "O&M Engineer",
    skills: ["I-V Curve Tracing", "Thermal Imaging", "SCADA Monitoring", "Inverter Troubleshooting", "Preventive Maintenance", "Grid Synchronization", "Testing & Commissioning"]
  },
  project: {
    label: "Project Manager",
    skills: ["MS Project", "Primavera", "Resource Planning", "Vendor Management", "Site Safety (HSE)", "Quality Control", "Budgeting"]
  },
  electrical: {
    label: "Electrical Technician",
    skills: ["DC Wiring", "AC Termination", "Earthing Pit Installation", "Lightning Arresters", "Cable Tray Routing", "Multimeter Usage", "Clamp Meter"]
  },
  mechanical: {
    label: "Mechanical Technician",
    skills: ["Structure Assembly", "Module Mounting", "Pile Foundation", "Civil Works", "Alignment & Levelling", "Torque Tightening", "Surveying"]
  }
};

// Interface for Candidate Data
interface Candidate {
  id: number;
  name: string;
  roleId: string;
  roleLabel: string;
  location: string;
  experience: string;
  skills: string[];
  availability: string;
  rate: string;
  bio?: string;
  education?: string;
  email?: string;
  appliedDate?: string; 
  status?: string; 
}

// Interface for Job Posts
interface JobPost {
  id: number;
  title: string;
  roleCategory?: string;
  applicants: number;
  status: 'Active' | 'Closed';
  location: string;
  postedDate: string;
  type: string;
}

// Interface for API Response to avoid 'any'
interface JobApiResponse {
  id: number;
  title: string;
  role_category: string;
  applicants_count: string;
  status: 'Active' | 'Closed';
  location: string;
  created_at: string;
  job_type: string;
}

// Interface for Course Data
interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  notes_url?: string;
  questions_url?: string;
  target_audience: string;
  created_at: string;
}

// --- 2. MAIN COMPONENT ---

export default function EmployerDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- ZUSTAND HOOK ---
  const { user, logout } = useUserStore();
  
  // Real Data States
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // --- MODAL STATE ---
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  
  const [modalType, setModalType] = useState<'none' | 'profile' | 'message' | 'applicants'>('none');
  const [messageText, setMessageText] = useState("");

  // --- APPLICANTS STATE ---
  const [applicants, setApplicants] = useState<Candidate[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // Toast Notification System
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'info'} | null>(null);
  
  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 1. Fetch Jobs (Strict Typing Added)
  useEffect(() => {
    const fetchJobs = async () => {
        if (!user?.id) return; 

        setLoadingJobs(true);
        try {
        const res = await fetch(`/api/employer/jobs?employerId=${user.id}`);
        
        if (res.ok) {
            const data: JobApiResponse[] = await res.json(); // Explicit type cast
            
            const mappedJobs = data.map((j) => ({
                id: j.id,
                title: j.title,
                roleCategory: j.role_category,
                applicants: parseInt(j.applicants_count) || 0,
                status: j.status,
                location: j.location,
                postedDate: new Date(j.created_at).toLocaleDateString(),
                type: j.job_type
            }));
            setJobs(mappedJobs);
        }
        } catch (error) {
        console.error("Failed to load jobs", error);
        } finally {
        setLoadingJobs(false);
        }
    };

    fetchJobs();
  }, [user?.id]);

  // 2. Fetch Applicants
  useEffect(() => {
    const fetchApplicants = async () => {
      if (modalType === 'applicants' && selectedJob?.id) {
        setLoadingApplicants(true);
        try {
          const res = await fetch(`/api/employer/jobs/${selectedJob.id}/applicants`);
          if (res.ok) {
            const data: Candidate[] = await res.json();
            setApplicants(data);
          } else {
            showToast("Failed to load applicants", "info");
          }
        } catch (error) {
          console.error(error);
          showToast("Error fetching applicants", "info");
        } finally {
          setLoadingApplicants(false);
        }
      }
    };

    fetchApplicants();
  }, [modalType, selectedJob]); 

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
      showToast("Logout failed", "info");
    }
  };

  const handleSendMessage = () => {
    if(!messageText) return;
    showToast(`Message sent to ${selectedCandidate?.name}`, "success");
    setModalType('none');
    setMessageText("");
  };

  // --- SUB-COMPONENTS ---

  // 1. DASHBOARD HOME
  const DashboardHome = () => {
    const totalApplicants = jobs.reduce((sum, job) => sum + job.applicants, 0);

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-slate-900 text-sm font-bold uppercase tracking-wider">Total Active Jobs</h3>
            <p className="text-4xl font-black text-slate-900 mt-2">{jobs.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-slate-900 text-sm font-bold uppercase tracking-wider">Total Applicants</h3>
            <p className="text-4xl font-black text-blue-700 mt-2">{totalApplicants}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-slate-900 text-sm font-bold uppercase tracking-wider">Interviews Scheduled</h3>
            <p className="text-4xl font-black text-emerald-700 mt-2">5</p>
          </div>
        </div>
        
        <div className="bg-blue-900 rounded-xl shadow-lg p-6 text-white flex flex-col justify-center items-start">
          <h2 className="text-2xl font-black mb-2">Hire Better Talent, Faster.</h2>
          <p className="text-blue-100 mb-6 font-medium">Post a job today and get access to our verified pool of 500+ solar professionals.</p>
          <button 
            onClick={() => setActiveTab('post-job')}
            className="bg-white text-blue-900 px-6 py-3 rounded-lg font-black hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <PlusCircle size={20} /> Post a Job Now
          </button>
        </div>
      </div>
    );
  };

  // 2. POST JOB VIEW
  const PostJobView = () => {
    const [formData, setFormData] = useState({ 
      roleCategory: '', title: '', department: '', location: '', type: 'Permanent', 
      workMode: 'On-Site', experience: 'Entry Level', currency: 'INR', salaryMin: '', 
      salaryMax: '', skills: '', deadline: '', description: '', benefits: '', requirements: '',
    });

    const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedRoleKey = e.target.value;
      const roleData = ROLES_DB[selectedRoleKey];

      setFormData(prev => ({
        ...prev,
        roleCategory: selectedRoleKey,
        title: roleData ? roleData.label : prev.title, 
        skills: roleData ? roleData.skills.join(", ") : prev.skills 
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.title || !formData.location || !formData.roleCategory) {
        showToast("Please fill in required fields", "info");
        return;
      }

      if (!user?.id) {
        showToast("You must be logged in to post a job", "info");
        return;
      }

      try {
        const payload = { ...formData, employer_id: user.id };
        const res = await fetch('/api/employer/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const { job } = await res.json();
          const newJob: JobPost = {
            id: job.id,
            title: job.title,
            roleCategory: job.role_category,
            location: job.location,
            type: job.job_type,
            applicants: 0,
            status: 'Active',
            postedDate: 'Just Now'
          };
          setJobs([newJob, ...jobs]);
          showToast("Job Posted Successfully!");
          setActiveTab('applications');
        } else {
          showToast("Failed to post job", "info");
        }
      } catch (error) {
        console.error(error);
        showToast("Server error", "info");
      }
    };

    return (
      <div className="max-w-5xl mx-auto bg-white rounded-xl border border-slate-300 shadow-md p-8 animate-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-200 pb-6">Create New Job Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Job Details</h3>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">
              <label className="text-xs font-bold text-blue-800 uppercase tracking-wide flex items-center gap-2">
                 <Briefcase size={14}/> Standardized Role Category <span className="text-red-500">*</span>
              </label>
              <select required value={formData.roleCategory} onChange={handleRoleSelect} className="w-full p-3 mt-2 bg-white border border-blue-200 rounded-lg outline-none font-bold text-slate-800 text-sm">
                <option value="">-- Select Standard Role --</option>
                {Object.entries(ROLES_DB).map(([key, data]) => (
                  <option key={key} value={key}>{data.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input required placeholder="Job Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold text-sm" />
              <input required placeholder="Job Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold text-sm"><option>Permanent</option><option>Contractual</option></select>
             <select value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold text-sm"><option>Entry Level</option><option>Mid Level</option><option>Senior Level</option></select>
             <input type="number" placeholder="Min Salary" value={formData.salaryMin} onChange={e => setFormData({...formData, salaryMin: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold text-sm" />
          </div>
          <div className="space-y-6">
             <input type="text" placeholder="Skills (Comma Separated)" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold text-slate-800 text-sm" />
             <textarea rows={4} placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none font-medium text-sm"></textarea>
          </div>
          <div className="pt-6 border-t border-slate-200">
            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-lg py-4 rounded-xl transition-all shadow-lg">Publish Job Listing</button>
          </div>
        </form>
      </div>
    );
  };

  // 3. APPLICATIONS VIEW
  const ApplicationsView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-900">Job Applications</h2>
        <button onClick={() => setActiveTab('post-job')} className="text-sm font-bold text-blue-700 hover:underline">+ Post New Job</button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {loadingJobs ? (
          <div className="p-8 text-center text-slate-500 font-bold">Loading active jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-300 rounded-xl">No active jobs found. Post one to get started!</div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-400 transition-colors">
              <div>
                <h3 className="text-lg font-black text-slate-800">{job.title}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-600 font-semibold mt-1">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                  <span>•</span>
                  <span className="text-blue-700 font-bold">{job.status}</span>
                  <span>•</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-xs uppercase tracking-wide text-slate-500">{job.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-black text-blue-700">{job.applicants}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Applicants</p>
                </div>
                <button 
                  onClick={() => {
                     setSelectedJob(job);
                     setModalType('applicants');
                  }} 
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-sm font-bold text-slate-800 transition-colors"
                >
                  View Applicants
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // 4. CANDIDATE SEARCH
  const CandidateSearchView = () => {
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedRoleKey, setSelectedRoleKey] = useState<RoleKey | "">("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Candidate[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const fetchCandidates = async () => {
            setIsSearching(true);
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (selectedRoleKey) params.append('roleId', selectedRoleKey);
            if (selectedCity) params.append('location', selectedCity);

            try {
                const res = await fetch(`/api/employer/candidates?${params.toString()}`);
                if (res.ok) {
                    const data: Candidate[] = await res.json();
                    setSearchResults(data);
                }
            } catch (error) {
                console.error("Search error", error);
            } finally {
                setIsSearching(false);
            }
        };

        const timer = setTimeout(() => fetchCandidates(), 500);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedRoleKey, selectedCity]);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900 mb-3 flex items-center gap-2"><MapPin size={16} /> Location</h3>
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-700 outline-none cursor-pointer">
                <option value="">All Locations</option>
                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900 mb-3 flex items-center gap-2"><Briefcase size={16} /> Job Role</h3>
            <select value={selectedRoleKey} onChange={(e) => setSelectedRoleKey(e.target.value as RoleKey)} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-700 outline-none cursor-pointer">
                <option value="">Select a Role...</option>
                {Object.entries(ROLES_DB).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-slate-400" size={20} />
            <input type="text" placeholder="Search candidate by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 p-4 bg-white border border-slate-300 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isSearching ? <div className="col-span-2 text-center p-10 text-slate-500">Searching...</div> : 
             searchResults.length === 0 ? <div className="col-span-2 text-center p-10 text-slate-500">No candidates found matching your criteria.</div> :
             searchResults.map((candidate) => (
              <div key={candidate.id} className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 hover:shadow-md transition-shadow group relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{candidate.name}</h3>
                    <p className="text-sm font-bold text-blue-700 flex items-center gap-1 mt-0.5">{candidate.roleLabel}</p>
                  </div>
                  <div className="text-right">
                     <span className="block text-xs font-black text-slate-400 uppercase tracking-wider">Exp</span>
                     <span className="block text-sm font-bold text-slate-800">{candidate.experience}</span>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-semibold"><MapPin size={16} className="text-slate-400" /> {candidate.location}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-semibold"><CheckCircle2 size={16} className="text-emerald-500" /> Availability: {candidate.availability}</div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setSelectedCandidate(candidate); setModalType('profile'); }} className="flex-1 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors">View Profile</button>
                  <button onClick={() => { setSelectedCandidate(candidate); setModalType('message'); }} className="flex-1 py-2.5 border-2 border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:border-slate-900 transition-colors">Message</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
// --- 1. Define Strict Interface ---
  interface Course {
    id: number;
    title: string;
    description: string;
    thumbnail_url: string;
    video_url: string;
    notes_url?: string;
    questions_url?: string;
  }

  // 5. LEARNING HUB (UPDATED)
  const LearningView = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    useEffect(() => {
      const fetchEmployerCourses = async () => {
        try {
          const res = await fetch('/api/content-library?audience=employer');
          if (res.ok) {
            const data: Course[] = await res.json();
            setCourses(data);
          }
        } catch (error) {
          console.error("Failed to load employer courses", error);
        } finally {
          setLoading(false);
        }
      };
      fetchEmployerCourses();
    }, []);

    // Immersive Detail View
    if (selectedCourse) return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-white flex flex-col lg:flex-row overflow-hidden">
            <div className="flex-1 bg-slate-950 flex flex-col relative">
                <button onClick={() => setSelectedCourse(null)} className="absolute top-6 left-6 z-10 bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-2xl transition-all flex items-center gap-2 font-bold text-sm">
                    <ChevronLeft size={20}/> Back to Library
                </button>
                <div className="flex-1 flex items-center justify-center p-4 md:p-12">
                   <div className="w-full max-w-5xl aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl border border-white/10 relative">
                        {/* FIX: Transform Google Drive Link to Preview Mode */}
                        <iframe 
                            src={selectedCourse.video_url?.replace(/\/view.*/, '/preview')} 
                            className="w-full h-full border-0" 
                            allow="autoplay; fullscreen" 
                            title="Course Video"
                        />
                   </div>
                </div>
            </div>
            <div className="w-full lg:w-[450px] h-full bg-slate-50 border-l border-slate-200 flex flex-col overflow-y-auto">
                <div className="p-8 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 w-fit px-3 py-1 rounded-lg">
                           <CheckCircle2 size={12}/> Verified Employer Resource
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 leading-tight">{selectedCourse.title}</h1>
                        <p className="text-slate-500 font-medium leading-relaxed">{selectedCourse.description}</p>
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t border-slate-200">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Materials</h3>
                        
                        {/* PDF Notes */}
                        {selectedCourse.notes_url && (
                            <a href={selectedCourse.notes_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-[24px] hover:border-red-500 transition-all group shadow-sm hover:shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                                        <FileText size={24}/>
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-800 text-sm">Lecture Notes</p>
                                        <p className="text-xs text-slate-400 font-bold uppercase">PDF Guide</p>
                                    </div>
                                </div>
                                <Download size={20} className="text-slate-300 group-hover:text-red-600"/>
                            </a>
                        )}

                        {/* Word Document Questions */}
                        {selectedCourse.questions_url && (
                            <a href={selectedCourse.questions_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-[24px] hover:border-blue-600 transition-all group shadow-sm hover:shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <FileQuestion size={24}/>
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-800 text-sm">Assessment Paper</p>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Word Document</p>
                                    </div>
                                </div>
                                <Download size={20} className="text-slate-300 group-hover:text-blue-600"/>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-blue-500/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-blue-400/50 mb-3">
                 <Lightbulb size={14} className="text-yellow-300" /> HR Resource Center
              </div>
              <h2 className="text-3xl font-black mb-3">Mastering Solar Recruitment</h2>
              <p className="text-blue-100 font-medium leading-relaxed">
                Curated guides, templates, and industry insights to help you hire top-tier solar talent.
              </p>
           </div>
           <div className="hidden md:block relative z-10">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <GraduationCap size={48} className="text-blue-200" />
              </div>
           </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white border-2 border-dashed rounded-[32px] text-slate-400 font-bold">
                No employer training modules available yet.
              </div>
            ) : (
              courses.map((course) => (
                <div 
                  key={course.id} 
                  onClick={() => setSelectedCourse(course)}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all group flex flex-col h-full cursor-pointer overflow-hidden"
                >
                  <div className="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                    {course.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={course.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={course.title} />
                    ) : (
                      <PlayCircle className="text-slate-300" size={40} />
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white p-3 rounded-full text-blue-600 shadow-xl">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1">
                     <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                           Greenzee Academy
                        </span>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                           <Star size={12} className="text-amber-400 fill-amber-400" /> 5.0
                        </span>
                     </div>
                     <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-blue-800 transition-colors mb-2">
                        {course.title}
                     </h3>
                     <p className="text-sm text-slate-500 line-clamp-3 font-medium">
                        {course.description}
                     </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };
  const NavItem = ({ id, label, icon: Icon }: { id: string, label: string, icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }) => (
    <button onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}>
      <Icon size={20} strokeWidth={2.5} />{label}
    </button>
  );

  // --- MODAL RENDERING ---
  const renderModal = () => {
    if (modalType === 'none') return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
        
        {modalType === 'applicants' && selectedJob && (
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
               <div>
                  <h3 className="text-xl font-black text-slate-900">Applicants for {selectedJob.title}</h3>
                  <p className="text-sm text-slate-500 font-bold">
                    {loadingApplicants ? 'Loading...' : `${applicants.length} Candidates Found`}
                  </p>
               </div>
               <button onClick={() => setModalType('none')}><X size={20} className="text-slate-400 hover:text-slate-900"/></button>
            </div>
            
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-xs font-black text-slate-500 uppercase tracking-wide">
                  <tr>
                    <th className="p-4 border-b border-slate-200">Candidate</th>
                    <th className="p-4 border-b border-slate-200">Experience</th>
                    <th className="p-4 border-b border-slate-200">Status</th>
                    <th className="p-4 border-b border-slate-200 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingApplicants ? (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-bold">Loading applicants...</td></tr>
                  ) : applicants.length === 0 ? (
                     <tr><td colSpan={4} className="p-8 text-center text-slate-500">No applications received yet.</td></tr>
                  ) : (
                    applicants.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">
                             {candidate.name.charAt(0)}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-900">{candidate.name}</p>
                              <p className="text-xs text-slate-500">{candidate.location}</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-600">{candidate.experience}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                          candidate.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-700' :
                          candidate.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                         <button 
                            onClick={() => {
                               setSelectedCandidate(candidate);
                               setModalType('profile');
                            }}
                            className="text-xs font-bold text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-900 hover:text-white transition-colors"
                         >
                            View Profile
                         </button>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Profile and Message Modals follow similar structure... */}
        {modalType === 'profile' && selectedCandidate && (
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
             <button onClick={() => setModalType('none')} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900"><X size={24}/></button>
             <div className="p-8"><h2 className="text-2xl font-black mb-4">{selectedCandidate.name}</h2><p className="text-slate-500">{selectedCandidate.bio || "No bio available."}</p></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[60] px-6 py-4 rounded-lg shadow-2xl font-bold text-white animate-in slide-in-from-right duration-300 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* MODAL LAYER */}
      {renderModal()}

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full hidden md:block z-10">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">REZ<span className="text-blue-700">HIRE</span></h1>
          <p className="text-xs text-slate-400 font-bold tracking-widest mt-1">EMPLOYER DASHBOARD</p>
        </div>
        <nav className="p-4 space-y-2">
          <NavItem id="dashboard" label="Overview" icon={LayoutDashboard} />
          <NavItem id="post-job" label="Post a Job" icon={PlusCircle} />
          <NavItem id="applications" label="Applications" icon={Users} />
          <NavItem id="candidates" label="Find Candidates" icon={Search} />
          <div className="pt-4 mt-4 border-t border-slate-100">
            <NavItem id="learning" label="Learning Hub" icon={BookOpen} />
          </div>
          <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} strokeWidth={2.5} />
            Log Out
          </button>
        </div>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 capitalize tracking-tight">{activeTab.replace('-', ' ')}</h2>
            <p className="text-slate-500 text-sm font-bold">
              Welcome back, {user ? user.name : 'Recruiter'}.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-blue-700 relative transition-colors">
              <Bell size={20} /><span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-black shadow-lg">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'HR'}
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        <div className="min-h-[600px]">
          {activeTab === 'dashboard' && <DashboardHome />}
          {activeTab === 'post-job' && <PostJobView />}
          {activeTab === 'applications' && <ApplicationsView />}
          {activeTab === 'candidates' && <CandidateSearchView />}
          {activeTab === 'learning' && <LearningView />}
        </div>
      </main>
    </div>
  );
}