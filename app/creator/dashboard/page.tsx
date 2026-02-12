'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  FileQuestion, 
  LogOut, 
  ChevronRight, 
  Bell, 
  Menu, 
  X, 
  Send,
  Clock,
  Video,
  UserCheck,
  Briefcase,
  Paperclip
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';

// --- 1. STRICT TYPE DEFINITIONS ---

interface RequestItem {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  finalLink?: string; 
  thumbnailUrl?: string;
}

interface SubmissionFormData {
  title: string;
  description: string;
  sourceVideoLink: string;
  targetAudience: 'candidate' | 'employer';
}

interface SidebarItemProps {
  id: string;
  icon: React.ElementType;
  label: string;
  activeTab: string;
  setActiveTab: (id: string) => void;
  onMobileClick?: () => void;
}

interface UploadBoxProps {
  label: string;
  accept: string;
  icon: React.ElementType;
  selectedFile: File | null;
  onFile: (file: File) => void;
  uploading:boolean;
  done:boolean
}

interface ApiResponse {
  requests: RequestItem[];
}

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

// --- SUB-COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rejected: "bg-red-100 text-red-700 border-red-200"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

// 1. OVERVIEW COMPONENT
const OverviewView = ({ userId, setActiveTab }: { userId: number, setActiveTab: (tab: string) => void }) => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; 
    const fetchRequests = async () => {
      try {
        const res = await fetch(`/api/course-request?userId=${userId}`);
        const data = (await res.json()) as ApiResponse;
        if (isMounted) {
          setRequests(data.requests || []);
        }
      } catch (error) {
        console.error("Failed to load requests", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRequests();
    return () => { isMounted = false; };
  }, [userId]);

  const stats = {
    total: requests.length,
    approved: requests.filter(r => r.status === 'approved').length,
    pending: requests.filter(r => r.status === 'pending').length
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Submissions</h3>
          <p className="text-4xl font-black text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Approved Content</h3>
          <p className="text-4xl font-black text-emerald-600">{stats.approved}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Pending Review</h3>
          <p className="text-4xl font-black text-amber-500">{stats.pending}</p>
        </div>
      </div>

      {/* Recent Submissions List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-black text-slate-900">Recent Submissions</h3>
            <button onClick={() => setActiveTab('new-request')} className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
                New Request <ChevronRight size={14}/>
            </button>
        </div>
        
        {loading ? (
            <div className="p-12 text-center text-slate-500 font-bold flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" /> Loading data...
            </div>
        ) : requests.length === 0 ? (
            <div className="p-12 text-center border-dashed">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <FileText size={32}/>
                </div>
                <p className="text-slate-500 font-medium">No content submitted yet.</p>
                <button onClick={() => setActiveTab('new-request')} className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-indigo-600 transition">Create First Request</button>
            </div>
        ) : (
            <div className="divide-y divide-slate-100">
                {requests.map((req) => (
                    <div key={req.id} className="p-6 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 overflow-hidden">
                                {req.thumbnailUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={req.thumbnailUrl} alt="Thumb" className="w-full h-full object-cover rounded-xl"/>
                                ) : (
                                    <Video size={20} />
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg group-hover:text-indigo-700 transition-colors">{req.title}</h4>
                                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500 mt-1">
                                    <span className="flex items-center gap-1"><Clock size={12}/> {new Date(req.submittedDate).toLocaleDateString()}</span>
                                    {req.finalLink && <a href={req.finalLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1"><LinkIcon size={12}/> View Live</a>}
                                </div>
                            </div>
                        </div>
                        <StatusBadge status={req.status} />
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

// 2. SUBMISSION FORM COMPONENT
const SubmissionView = ({ userId, onSuccess }: { userId: number, onSuccess: () => void }) => {
    const [loading, setLoading] = useState(false);
    
    // Text Data State
    const [formData, setFormData] = useState<SubmissionFormData>({ 
        title: '', 
        description: '', 
        sourceVideoLink: '', 
        targetAudience: 'candidate' 
    });

    // File Data State
    const [selectedFiles, setSelectedFiles] = useState<{
        thumbnailUrl: File | null;
        notesUrl: File | null;
        questionsUrl: File | null;
    }>({ thumbnailUrl: null, notesUrl: null, questionsUrl: null });

    const isMounted = useRef(true);
    useEffect(() => {
        return () => { isMounted.current = false; };
    }, []);

    const handleFileSelect = (file: File, key: keyof typeof selectedFiles) => {
        if (!file) return;
        setSelectedFiles(prev => ({ ...prev, [key]: file }));
    };

    const uploadFile = async (file: File, folder: string): Promise<string | null> => {
        const data = new FormData();
        data.append("file", file);
        data.append("folder", folder);

        try {
            const res = await fetch('/api/upload', { method: "POST", body: data });
            const result = (await res.json()) as UploadResponse;
            if (result.success && result.url) return result.url;
            throw new Error(result.error || "Upload failed");
        } catch (e) {
            console.error("File upload error:", e);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.sourceVideoLink) return alert("Title and Video Link are required.");
        
        setLoading(true);

        try {
            // A. Upload Files Sequentially
            let thumbnailUrl = '';
            let notesUrl = '';
            let questionsUrl = '';

            if (selectedFiles.thumbnailUrl) {
                const url = await uploadFile(selectedFiles.thumbnailUrl, 'thumbnails');
                if (url) thumbnailUrl = url;
            }
            if (selectedFiles.notesUrl) {
                const url = await uploadFile(selectedFiles.notesUrl, 'course_docs');
                if (url) notesUrl = url;
            }
            if (selectedFiles.questionsUrl) {
                const url = await uploadFile(selectedFiles.questionsUrl, 'course_docs');
                if (url) questionsUrl = url;
            }

            // B. Submit Final Payload
            const payload = {
                ...formData,
                thumbnailUrl,
                notesUrl,
                questionsUrl,
                userId
            };

            const res = await fetch('/api/course-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const result = await res.json(); 

            if (isMounted.current) {
                // Stop loading immediately
                setLoading(false);

                if (res.ok) {
                    setTimeout(() => onSuccess(), 50);
                } else {
                    alert("Submission failed: " + (result.error || "Unknown error"));
                }
            }
        } catch (e) {
            console.error("Submission error:", e);
            if (isMounted.current) {
                setLoading(false);
                alert("Error submitting form. Please check console.");
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 p-8 text-white">
                <h2 className="text-2xl font-black">Submit New Content</h2>
                <p className="text-slate-400 font-medium mt-1">Upload your materials for admin approval.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                
                {/* Target Audience */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Who is this course for?</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, targetAudience: 'candidate'})}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${formData.targetAudience === 'candidate' ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-50' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                            <div className={`p-3 rounded-xl ${formData.targetAudience === 'candidate' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <UserCheck size={24} />
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${formData.targetAudience === 'candidate' ? 'text-indigo-900' : 'text-slate-600'}`}>Candidate / Employee</p>
                                <p className="text-[10px] font-medium text-slate-400 uppercase">Training & Skills</p>
                            </div>
                        </button>

                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, targetAudience: 'employer'})}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${formData.targetAudience === 'employer' ? 'border-emerald-600 bg-emerald-50 ring-4 ring-emerald-50' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                            <div className={`p-3 rounded-xl ${formData.targetAudience === 'employer' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${formData.targetAudience === 'employer' ? 'text-emerald-900' : 'text-slate-600'}`}>Employer / Recruiter</p>
                                <p className="text-[10px] font-medium text-slate-400 uppercase">Compliance & Guides</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Course Title <span className="text-red-500">*</span></label>
                        <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-slate-800" placeholder="e.g. Solar PV Basics"/>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Google Drive Link <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-4 text-slate-400" size={20}/>
                            <input required value={formData.sourceVideoLink} onChange={e => setFormData({...formData, sourceVideoLink: e.target.value})} className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-slate-800" placeholder="https://drive.google.com/..."/>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Description</label>
                    <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 font-medium text-slate-700 resize-none" placeholder="What will students learn from this content?"/>
                </div>

                {/* Uploads Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <UploadBox 
                        label="Thumbnail Image" 
                        accept="image/*" 
                        icon={ImageIcon} 
                        uploading={false}
                        done={false}
                        selectedFile={selectedFiles.thumbnailUrl} 
                        onFile={(f) => handleFileSelect(f, 'thumbnailUrl')} 
                    />
                    <UploadBox 
                        label="Notes (PDF)" 
                        accept=".pdf" 
                        icon={FileText} 
                        uploading={false}
                        done={false}
                        selectedFile={selectedFiles.notesUrl} 
                        onFile={(f) => handleFileSelect(f, 'notesUrl')} 
                    />
                    <UploadBox 
                        label="Question Paper" 
                        accept=".pdf,.doc,.docx" 
                        icon={FileQuestion} 
                        uploading={false}
                        done={false}
                        selectedFile={selectedFiles.questionsUrl} 
                        onFile={(f) => handleFileSelect(f, 'questionsUrl')} 
                    />
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <button disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed">
                        {loading ? (
                            <><Loader2 className="animate-spin"/> Uploading & Submitting...</>
                        ) : (
                            <><Send size={20}/> Submit Request</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Helper for Upload Box (UPDATED to show Selection State)
const UploadBox = ({ label, accept, icon: Icon, selectedFile, onFile }: UploadBoxProps) => (
    <div className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center h-40 transition-all cursor-pointer group ${
        selectedFile ? 'bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'
    }`}>
        {selectedFile ? (
            <div className="flex flex-col items-center gap-2 animate-in zoom-in">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center"><Paperclip size={20}/></div>
                <span className="text-xs font-bold text-amber-700 max-w-[150px] truncate">{selectedFile.name}</span>
                <span className="text-[10px] text-amber-600/70 font-semibold uppercase">Selected</span>
            </div>
        ) : (
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                <div className="text-slate-400 group-hover:text-indigo-600 mb-3 transition-colors"><Icon size={28}/></div>
                <span className="text-xs font-black uppercase text-slate-500 group-hover:text-indigo-700">{label}</span>
                <input type="file" accept={accept} className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
            </label>
        )}
    </div>
);

const SidebarItem = ({ id, icon: Icon, label, activeTab, setActiveTab, onMobileClick }: SidebarItemProps) => (
  <button
    onClick={() => { setActiveTab(id); if (onMobileClick) onMobileClick(); }}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
      activeTab === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <Icon size={20} strokeWidth={activeTab === id ? 2.5 : 2} />
    <span>{label}</span>
  </button>
);

// --- MAIN COMPONENT ---
const CreatorDashboardComponent = () => {
  const router = useRouter();
  
  // 1. USE hasHydrated from Store (Fixes local state useEffect error)
  const { user, logout, hasHydrated } = useUserStore();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 2. Auth Check Logic (Simplified thanks to hasHydrated)
  useEffect(() => {
    if (hasHydrated && !user) {
        router.push('/login');
    }
  }, [user, hasHydrated, router]);

  const handleLogout = async () => {
    try {
        await fetch('/api/logout', { method: 'POST' });
        logout();
        if (typeof window !== 'undefined') localStorage.clear(); 
        router.push('/login');
    } catch (e) { console.error(e); }
  };

  const handleMobileNav = () => setIsMobileMenuOpen(false);

  // 3. Show Loader until Hydrated
  if (!hasHydrated || !user) {
    return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>;
  }

  const displayName = user.full_name || "Creator";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4f46e5&color=fff`;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 flex">
      {/* MOBILE HEADER */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-4 md:hidden">
          <div className="flex items-center gap-3">
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"><Menu size={24} /></button>
              <span className="text-xl font-black text-indigo-700 tracking-tighter uppercase flex items-center gap-1"><div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-sm">C</div>CreatorHub</span>
          </div>
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200">
             <Image src={avatarUrl} alt="User" fill className="object-cover" unoptimized/>
          </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleMobileNav} className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"/>
                <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed top-0 left-0 bottom-0 w-3/4 max-w-xs bg-white z-50 md:hidden overflow-y-auto shadow-2xl">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center"><span className="text-xl font-black text-slate-900">Menu</span><button onClick={handleMobileNav} className="p-2 bg-slate-100 rounded-full text-slate-500"><X size={20}/></button></div>
                    <nav className="p-4 space-y-2">
                        <SidebarItem id="overview" icon={LayoutDashboard} label="Overview" activeTab={activeTab} setActiveTab={setActiveTab} onMobileClick={handleMobileNav} />
                        <SidebarItem id="new-request" icon={PlusCircle} label="New Submission" activeTab={activeTab} setActiveTab={setActiveTab} onMobileClick={handleMobileNav} />
                    </nav>
                    <div className="p-6 mt-auto">
                        <button onClick={handleLogout} className="mt-4 w-full py-2 bg-slate-100 text-slate-600 font-bold rounded-lg text-sm hover:bg-red-50 hover:text-red-600 flex items-center justify-center gap-2"><LogOut size={16}/> Sign Out</button>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 fixed h-full hidden md:flex flex-col z-20 shadow-sm">
        <div className="p-8">
            <span className="text-2xl font-black text-indigo-700 tracking-tighter uppercase flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">C</div>
                Creator<span className="text-slate-900">Hub</span>
            </span>
        </div>
        <nav className="flex-1 px-6 space-y-2">
          <SidebarItem id="overview" icon={LayoutDashboard} label="My Submissions" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem id="new-request" icon={PlusCircle} label="New Request" activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>
        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
             <div className="relative w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0">
                <Image src={avatarUrl} alt="User" fill className="object-cover" unoptimized />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{displayName}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Verified Creator</p>
             </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-600 font-bold text-sm transition-colors py-2"><LogOut size={18} /> Sign Out</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-72 p-4 md:p-10 mt-16 md:mt-0">
        <header className="hidden md:flex justify-between items-center mb-8">
           <div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">
               {activeTab === 'overview' ? "Dashboard Overview" : "Submit Content"}
             </h1>
             <p className="text-slate-500 font-medium mt-1">
                {activeTab === 'overview' ? `Welcome back, ${displayName.split(' ')[0]}! Track your content status.` : "Share your knowledge with the community."}
             </p>
           </div>
           <div className="flex items-center gap-4">
              <button className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition relative shadow-sm">
                  <Bell size={20} /><span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              </button>
           </div>
        </header>

        {/* Mobile Title */}
        <div className="md:hidden mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
               {activeTab === 'overview' ? "Dashboard" : "New Submission"}
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1 truncate">Welcome back, {displayName.split(' ')[0]}</p>
        </div>

        <div className="min-h-[500px] pb-10">
           {activeTab === 'overview' && <OverviewView userId={user.id} setActiveTab={setActiveTab} />}
           {activeTab === 'new-request' && <SubmissionView userId={user.id} onSuccess={() => { alert("Success!"); setActiveTab('overview'); }} />}
        </div>
      </main>
    </div>
  );
};

export default dynamic(() => Promise.resolve(CreatorDashboardComponent), { ssr: false });