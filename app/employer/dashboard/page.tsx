"use client";

import React, { useState, useMemo } from 'react';
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
  ArrowLeft,
  Clock,
  Send,
  FileText,
  Download,
  Lightbulb,
  GraduationCap,
  ChevronRight,
  PlayCircle
} from 'lucide-react';

// --- 1. DATA & TYPES ---

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

const MOCK_CANDIDATES: Candidate[] = [
  { id: 1, name: "Rahul Sharma", roleId: "design", roleLabel: "Solar Design Engineer", location: "Pune", experience: "4 Years", skills: ["PVsyst", "AutoCAD", "SketchUp", "Yield Assessment"], availability: "Immediate", rate: "₹50k/mo", bio: "Passionate Solar Design Engineer with a track record of designing 50MW+ utility-scale projects.", education: "B.Tech Electrical Engineering, COEP", email: "rahul.s@example.com", appliedDate: "2 days ago", status: "Reviewing" },
  { id: 2, name: "Amit Verma", roleId: "electrical", roleLabel: "Electrical Technician", location: "Mumbai", experience: "6 Years", skills: ["DC Wiring", "Earthing Pit Installation", "Multimeter Usage"], availability: "15 Days", rate: "₹25k/mo", bio: "Certified electrician specializing in high-voltage DC termination and inverter commissioning.", education: "ITI Electrical, Mumbai", email: "amit.v@example.com", appliedDate: "1 week ago", status: "Shortlisted" },
  { id: 3, name: "Sneha Gupta", roleId: "project", roleLabel: "Project Manager", location: "Bangalore", experience: "8 Years", skills: ["MS Project", "Vendor Management", "Site Safety (HSE)"], availability: "1 Month", rate: "₹90k/mo", bio: "PMP certified manager having handled 3 state-level solar parks. Expert in supply chain logistics.", education: "MBA Operations, IIM-B", email: "sneha.g@example.com", appliedDate: "3 days ago", status: "New" },
  { id: 4, name: "Vikram Singh", roleId: "design", roleLabel: "Solar Design Engineer", location: "Pune", experience: "2 Years", skills: ["AutoCAD", "Helioscope"], availability: "Immediate", rate: "₹35k/mo", bio: "Junior designer focused on commercial rooftop layouts and shadow analysis.", education: "B.E. Mechanical", email: "vikram.s@example.com", appliedDate: "Just now", status: "New" },
  { id: 5, name: "John Doe", roleId: "om", roleLabel: "O&M Engineer", location: "Delhi", experience: "5 Years", skills: ["SCADA Monitoring", "Inverter Troubleshooting", "Thermal Imaging"], availability: "Immediate", rate: "₹45k/mo", bio: "O&M specialist with experience in preventative maintenance of central inverters.", education: "Diploma in Electronics", email: "john.d@example.com", appliedDate: "5 days ago", status: "Rejected" }
];

const LEARNING_ARTICLES = [
  { id: 1, title: "Effective Interviewing Techniques for Solar", category: "Hiring Strategy", icon: Users, readTime: "5 min", content: "When interviewing for solar roles, it is crucial to test for both theoretical knowledge (like PVsyst parameters) and practical site awareness. Ask candidates to describe a specific challenge they faced during a grid outage..." },
  { id: 2, title: "Writing Job Descriptions that Convert", category: "Employer Branding", icon: FileText, readTime: "8 min", content: "A good job description sells the role. Mention specific project capacities (e.g., 500kW rooftop vs 50MW ground mount), the software stack used, and the site locations..." },
  { id: 3, title: "Understanding Solar Industry Labor Laws", category: "Legal & Compliance", icon: ScaleIcon, readTime: "12 min", content: "Compliance with Minimum Wages Act and safety regulations (HSE) is non-negotiable. Ensure your contractors have valid electrical licenses and insurance..." },
  { id: 4, title: "Retaining Field Technicians", category: "Team Management", icon: Users, readTime: "6 min", content: "Field technicians often face harsh conditions. Providing high-quality safety gear, timely allowances, and a clear career path to 'Site Engineer' can reduce churn significantly..." },
  { id: 5, title: "Latest Trends in PV Modules (2025)", category: "Industry Tech", icon: Cpu, readTime: "10 min", content: "Understanding TOPCon vs HJT modules helps you hire the right design engineers who know how to simulate these new technologies in PVsyst..." },
];

// Helper icon for legal (not imported above to keep clean, just using a placeholder or existing)
function ScaleIcon(props: React.ComponentProps<typeof Briefcase>) { return <Briefcase {...props} />; }

interface JobPost {
  id: number;
  title: string;
  roleCategory?: string; // Added to link with candidate filter
  applicants: number;
  status: 'Active' | 'Closed';
  location: string;
  postedDate: string;
  type: string;
}

// --- 2. MAIN COMPONENT ---

export default function EmployerDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobs, setJobs] = useState<JobPost[]>([
    { id: 101, title: "Senior Solar Engineer", roleCategory: "design", applicants: 12, status: 'Active', location: "Pune", postedDate: "2 days ago", type: "Permanent" },
    { id: 102, title: "Site Supervisor", roleCategory: "om", applicants: 5, status: 'Active', location: "Mumbai", postedDate: "1 week ago", type: "Contractual" },
  ]);
  
  // --- MODAL STATE ---
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  
  const [modalType, setModalType] = useState<'none' | 'profile' | 'message' | 'applicants'>('none');
  const [messageText, setMessageText] = useState("");

  // Toast Notification System
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'info'} | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSendMessage = () => {
    if(!messageText) return;
    showToast(`Message sent to ${selectedCandidate?.name}`, "success");
    setModalType('none');
    setMessageText("");
  };

  // --- SUB-COMPONENTS ---

  // 1. DASHBOARD HOME
  const DashboardHome = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-slate-900 text-sm font-bold uppercase tracking-wider">Total Active Jobs</h3>
          <p className="text-4xl font-black text-slate-900 mt-2">{jobs.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-slate-900 text-sm font-bold uppercase tracking-wider">New Applicants</h3>
          <p className="text-4xl font-black text-blue-700 mt-2">48</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-slate-900 text-sm font-bold uppercase tracking-wider">Interviews</h3>
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

  // 2. DETAILED POST JOB VIEW (UPDATED - CLEAN & COMPREHENSIVE)
  const PostJobView = () => {
    const [formData, setFormData] = useState({ 
      roleCategory: '', // NEW FIELD
      title: '', 
      department: '',
      location: '', 
      type: 'Permanent', 
      workMode: 'On-Site',
      experience: 'Entry Level', 
      currency: 'INR',
      salaryMin: '', 
      salaryMax: '', 
      skills: '',
      deadline: '', 
      description: '', 
      benefits: '', 
      requirements: ''
    });

    const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedRoleKey = e.target.value;
      const roleData = ROLES_DB[selectedRoleKey];

      setFormData(prev => ({
        ...prev,
        roleCategory: selectedRoleKey,
        title: roleData ? roleData.label : prev.title, // Auto-fill title
        skills: roleData ? roleData.skills.join(", ") : prev.skills // Auto-fill skills
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.title || !formData.location || !formData.roleCategory) {
        showToast("Please fill in required fields (including Role Category)", "info");
        return;
      }
      const newJob: JobPost = {
        id: Date.now(),
        title: formData.title,
        roleCategory: formData.roleCategory,
        location: formData.location,
        type: formData.type,
        applicants: 0,
        status: 'Active',
        postedDate: 'Just Now'
      };
      setJobs([newJob, ...jobs]);
      showToast("Job Posted Successfully!");
      setActiveTab('applications');
    };

    return (
      <div className="max-w-5xl mx-auto bg-white rounded-xl border border-slate-300 shadow-md p-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="border-b border-slate-200 pb-6 mb-8">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
             Create New Job Listing
          </h2>
          <p className="text-slate-600 mt-2 font-medium">Fill in the comprehensive details below to find the perfect match.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: JOB ESSENTIALS */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">1. Job Details</h3>
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-blue-800 uppercase tracking-wide flex items-center gap-2">
                   <Briefcase size={14}/> Standardized Role Category <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-blue-600 mb-2">Select a standard role to auto-populate skills and match with candidate filters.</p>
                <select 
                  required
                  value={formData.roleCategory} 
                  onChange={handleRoleSelect} 
                  className="w-full p-3 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-800 text-sm cursor-pointer"
                >
                  <option value="">-- Select Standard Role --</option>
                  {Object.entries(ROLES_DB).map(([key, data]) => (
                    <option key={key} value={key}>{data.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Job Title <span className="text-red-500">*</span></label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" placeholder="e.g. Senior PV Design Engineer" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-800 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Department</label>
                <input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} type="text" placeholder="e.g. Engineering & Design" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-800 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Job Location <span className="text-red-500">*</span></label>
                <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} type="text" placeholder="e.g. Pune, Maharashtra" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-800 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Work Mode</label>
                <select value={formData.workMode} onChange={e => setFormData({...formData, workMode: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-800 text-sm cursor-pointer">
                  <option>On-Site</option><option>Remote</option><option>Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: CONTRACT & EXPERIENCE */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">2. Type & Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Employment Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-800 text-sm cursor-pointer">
                  <option>Permanent (Full-Time)</option><option>Contractual</option><option>Temporary</option><option>Internship</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Experience Level</label>
                <select value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-800 text-sm cursor-pointer">
                  <option>Entry Level (0-2 Yrs)</option><option>Mid Level (3-5 Yrs)</option><option>Senior Level (5-8 Yrs)</option><option>Executive (8+ Yrs)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Application Deadline</label>
                <input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-800 text-sm" />
              </div>
            </div>
          </div>

          {/* SECTION 3: SALARY */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">3. Compensation (Annual CTC)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Currency</label>
                <select value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-800 text-sm cursor-pointer">
                  <option>INR (₹)</option><option>USD ($)</option><option>EUR (€)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Minimum</label>
                <input type="number" placeholder="e.g. 400000" value={formData.salaryMin} onChange={e => setFormData({...formData, salaryMin: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-800 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Maximum</label>
                <input type="number" placeholder="e.g. 800000" value={formData.salaryMax} onChange={e => setFormData({...formData, salaryMax: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-800 text-sm" />
              </div>
            </div>
          </div>

          {/* SECTION 4: DESCRIPTION & REQUIREMENTS */}
          <div>
             <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">4. Job Description & Requirements</h3>
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Skills Required (Comma Separated)</label>
                  <input type="text" placeholder="e.g. AutoCAD, PVsyst, Project Management, SketchUp" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-bold text-slate-800 text-sm" />
                  <p className="text-[10px] text-slate-500 font-bold">*Skills auto-populated based on Role Category selection</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Detailed Job Description</label>
                  <textarea rows={6} placeholder="Describe the role responsibilities, daily tasks, and team structure..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-800 text-sm"></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Requirements & Qualifications</label>
                  <textarea rows={4} placeholder="e.g. B.Tech in Electrical Engineering, Expert in AutoCAD..." value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-800 text-sm"></textarea>
                </div>
                 <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Benefits & Perks</label>
                  <textarea rows={3} placeholder="e.g. Health Insurance, Travel Allowance..." value={formData.benefits} onChange={e => setFormData({...formData, benefits: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-800 text-sm"></textarea>
                </div>
             </div>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-lg py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Publish Job Listing
            </button>
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
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-400 transition-colors">
            <div>
              <h3 className="text-lg font-black text-slate-800">{job.title}</h3>
              <div className="flex items-center gap-4 text-sm text-slate-600 font-semibold mt-1">
                <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                <span>•</span>
                <span className="text-blue-700 font-bold">{job.status}</span>
                <span>•</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs uppercase tracking-wide text-slate-500">{job.type}</span>
                {job.roleCategory && <span className="text-xs text-slate-400 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">{ROLES_DB[job.roleCategory]?.label || job.roleCategory}</span>}
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
        ))}
      </div>
    </div>
  );

  // 4. CANDIDATE SEARCH
  const CandidateSearchView = () => {
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedRoleKey, setSelectedRoleKey] = useState<RoleKey | "">("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedRoleKey(e.target.value as RoleKey);
      setSelectedSkills([]); 
    };

    const toggleSkill = (skill: string) => {
      if (selectedSkills.includes(skill)) setSelectedSkills(selectedSkills.filter(s => s !== skill));
      else setSelectedSkills([...selectedSkills, skill]);
    };

    const filteredCandidates = useMemo(() => {
      return MOCK_CANDIDATES.filter(candidate => {
        if (searchQuery && !candidate.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (selectedCity && candidate.location !== selectedCity) return false;
        if (selectedRoleKey && candidate.roleId !== selectedRoleKey) return false;
        if (selectedSkills.length > 0) {
          const hasSkill = selectedSkills.some(skill => candidate.skills.includes(skill));
          if (!hasSkill) return false;
        }
        return true;
      });
    }, [searchQuery, selectedCity, selectedRoleKey, selectedSkills]);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900 mb-3 flex items-center gap-2"><MapPin size={16} /> Location</h3>
            <div className="relative">
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-700 outline-none cursor-pointer">
                <option value="">All Locations</option>
                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-900 mb-3 flex items-center gap-2"><Briefcase size={16} /> Job Role</h3>
            <div className="relative">
              <select value={selectedRoleKey} onChange={handleRoleChange} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-700 outline-none cursor-pointer">
                <option value="">Select a Role...</option>
                <option value="design">Solar Design Engineer</option>
                <option value="om">O&M Engineer</option>
                <option value="project">Project Manager</option>
                <option value="electrical">Electrical Technician</option>
                <option value="mechanical">Mechanical Technician</option>
              </select>
            </div>
          </div>
          {selectedRoleKey && (
            <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm animate-in slide-in-from-top-4">
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-900 mb-3 flex items-center gap-2"><Cpu size={16} /> Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {ROLES_DB[selectedRoleKey].skills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button key={skill} onClick={() => toggleSkill(skill)} className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'}`}>
                      {skill} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {(selectedCity || selectedRoleKey || searchQuery) && (
            <button onClick={() => {setSelectedCity(""); setSelectedRoleKey(""); setSelectedSkills([]); setSearchQuery("");}} className="w-full py-2 flex items-center justify-center gap-2 text-red-600 font-bold text-sm bg-red-50 hover:bg-red-100 rounded-lg">
              <X size={16} /> Clear Filters
            </button>
          )}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-slate-400" size={20} />
            <input type="text" placeholder="Search candidate by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 p-4 bg-white border border-slate-300 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 hover:shadow-md transition-shadow group relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${candidate.roleId === 'design' ? 'bg-blue-500' : candidate.roleId === 'electrical' ? 'bg-yellow-500' : candidate.roleId === 'mechanical' ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
                <div className="flex justify-between items-start mb-4 pl-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{candidate.name}</h3>
                    <p className="text-sm font-bold text-blue-700 flex items-center gap-1 mt-0.5">{candidate.roleLabel}</p>
                  </div>
                  <div className="text-right">
                     <span className="block text-xs font-black text-slate-400 uppercase tracking-wider">Exp</span>
                     <span className="block text-sm font-bold text-slate-800">{candidate.experience}</span>
                  </div>
                </div>
                <div className="space-y-3 mb-6 pl-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-semibold"><MapPin size={16} className="text-slate-400" /> {candidate.location}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-semibold"><CheckCircle2 size={16} className="text-emerald-500" /> Availability: {candidate.availability}</div>
                </div>
                <div className="pl-3 mb-6">
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pl-3">
                  <button 
                    onClick={() => { setSelectedCandidate(candidate); setModalType('profile'); }}
                    className="flex-1 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    View Profile
                  </button>
                  <button 
                    onClick={() => { setSelectedCandidate(candidate); setModalType('message'); }}
                    className="flex-1 py-2.5 border-2 border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:border-slate-900 hover:text-slate-900 transition-colors"
                  >
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const LearningView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Hero Header for Learning Hub */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-blue-400/50 mb-3">
               <Lightbulb size={14} className="text-yellow-300" /> HR Resource Center
            </div>
            <h2 className="text-3xl font-black mb-3">Mastering Solar Recruitment</h2>
            <p className="text-blue-100 font-medium leading-relaxed">
              Curated guides, templates, and industry insights to help you hire top-tier solar talent. Learn about technical vetting, compliance, and retention strategies.
            </p>
         </div>
         <div className="hidden md:block relative z-10">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <GraduationCap size={48} className="text-blue-200" />
            </div>
         </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h3 className="text-xl font-black text-slate-900">Recommended Articles</h3>
        <button className="text-sm font-bold text-blue-700 hover:underline">View All Resources</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LEARNING_ARTICLES.map((article, idx) => {
          const Icon = article.icon;
          return (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all group flex flex-col h-full cursor-pointer">
              <div className="p-6 flex-1">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                       <Icon size={24} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                       <Clock size={12} /> {article.readTime}
                    </span>
                 </div>
                 <div className="mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md mb-2 inline-block">
                       {article.category}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-blue-800 transition-colors">
                       {article.title}
                    </h3>
                 </div>
                 <p className="text-sm text-slate-500 line-clamp-3 font-medium">
                    {article.content}
                 </p>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex items-center justify-between group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                 <span className="text-xs font-bold text-slate-600 group-hover:text-white">Read Article</span>
                 <div className="bg-white p-1 rounded-full text-slate-900 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={14} />
                 </div>
              </div>
            </div>
          )
        })}
        
        {/* Call to Action Card */}
        <div className="bg-slate-900 rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center h-full border border-slate-900">
           <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <PlayCircle size={24} className="text-white" />
           </div>
           <h3 className="text-white font-black text-lg mb-2">Video Tutorials</h3>
           <p className="text-slate-400 text-sm mb-6">Watch our experts break down technical interviewing.</p>
           <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-500 transition-colors">Browse Videos</button>
        </div>
      </div>
    </div>
  );

  const NavItem = ({ id, label, icon: Icon }: { id: string, label: string, icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }> }) => (
    <button onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}>
      <Icon size={20} strokeWidth={2.5} />{label}
    </button>
  );

  // --- MODAL RENDERING ---

  const renderModal = () => {
    if (modalType === 'none') return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
        
        {/* 1. APPLICANTS MODAL */}
        {modalType === 'applicants' && selectedJob && (
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
               <div>
                  <h3 className="text-xl font-black text-slate-900">Applicants for {selectedJob.title}</h3>
                  <p className="text-sm text-slate-500 font-bold">{selectedJob.applicants} Total Candidates</p>
               </div>
               <button onClick={() => setModalType('none')}><X size={20} className="text-slate-400 hover:text-slate-900"/></button>
            </div>
            
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-xs font-black text-slate-500 uppercase tracking-wide">
                  <tr>
                    <th className="p-4 border-b border-slate-200">Candidate</th>
                    <th className="p-4 border-b border-slate-200">Applied</th>
                    <th className="p-4 border-b border-slate-200">Experience</th>
                    <th className="p-4 border-b border-slate-200">Status</th>
                    <th className="p-4 border-b border-slate-200 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Using Mock Candidates as fake applicants for the demo */}
                  {MOCK_CANDIDATES.map((candidate) => (
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
                      <td className="p-4 text-sm font-medium text-slate-600">{candidate.appliedDate}</td>
                      <td className="p-4 text-sm font-medium text-slate-600">{candidate.experience}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                          candidate.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-700' :
                          candidate.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          candidate.status === 'Reviewing' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                         <button 
                            onClick={() => {
                               setSelectedCandidate(candidate);
                               // We keep applicants modal open, or we can close it. 
                               // For better UX, let's close applicant list and open profile
                               setModalType('profile');
                            }}
                            className="text-xs font-bold text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-900 hover:text-white transition-colors"
                         >
                            View Profile
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. PROFILE MODAL */}
        {modalType === 'profile' && selectedCandidate && (
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-900 p-6 flex justify-between items-start sticky top-0 z-10">
              <div className="flex gap-4">
                 <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-black border-4 border-white">
                    {selectedCandidate.name.charAt(0)}
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-white">{selectedCandidate.name}</h2>
                    <p className="text-blue-200 font-medium flex items-center gap-2">
                       <Briefcase size={14} /> {selectedCandidate.roleLabel}
                       <span className="text-slate-500">|</span>
                       <MapPin size={14} /> {selectedCandidate.location}
                    </p>
                 </div>
              </div>
              <button onClick={() => setModalType('none')} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"><X size={24} /></button>
            </div>
            
            {/* Body */}
            <div className="p-8 space-y-8">
               {/* About */}
               <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-2"><FileText size={16}/> About Candidate</h3>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {selectedCandidate.bio || "No bio available."}
                  </p>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                     <p className="text-xs text-blue-600 font-bold uppercase">Experience</p>
                     <p className="text-lg font-black text-slate-900">{selectedCandidate.experience}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                     <p className="text-xs text-emerald-600 font-bold uppercase">Availability</p>
                     <p className="text-lg font-black text-slate-900">{selectedCandidate.availability}</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                     <p className="text-xs text-indigo-600 font-bold uppercase">Exp. Rate</p>
                     <p className="text-lg font-black text-slate-900">{selectedCandidate.rate}</p>
                  </div>
                   <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                     <p className="text-xs text-orange-600 font-bold uppercase">Education</p>
                     <p className="text-sm font-black text-slate-900 leading-tight mt-1">{selectedCandidate.education}</p>
                  </div>
               </div>

               {/* Skills */}
               <div>
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-2"><Cpu size={16}/> Technical Skills</h3>
                 <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-bold rounded-full border border-slate-200">{skill}</span>
                    ))}
                 </div>
               </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-4 rounded-b-2xl">
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100">
                  <Download size={18} /> Download Resume
               </button>
               <button 
                 onClick={() => setModalType('message')}
                 className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
               >
                  <Send size={18} /> Message Candidate
               </button>
            </div>
          </div>
        )}

        {/* 3. MESSAGE MODAL */}
        {modalType === 'message' && selectedCandidate && (
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
               <h3 className="text-xl font-black text-slate-900">Message {selectedCandidate.name}</h3>
               <button onClick={() => setModalType('none')}><X size={20} className="text-slate-400 hover:text-slate-900"/></button>
            </div>
            <div className="p-6">
               <label className="block text-sm font-bold text-slate-700 mb-2">Your Message</label>
               <textarea 
                 rows={5} 
                 className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none resize-none font-medium text-slate-700"
                 placeholder={`Hi ${selectedCandidate.name}, we are impressed by your profile...`}
                 value={messageText}
                 onChange={(e) => setMessageText(e.target.value)}
                 autoFocus
               ></textarea>
            </div>
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
               <button onClick={() => setModalType('none')} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg">Cancel</button>
               <button onClick={handleSendMessage} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2">
                 <Send size={16} /> Send Message
               </button>
            </div>
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
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 capitalize tracking-tight">{activeTab.replace('-', ' ')}</h2>
            <p className="text-slate-500 text-sm font-bold">Welcome back, Recruiter.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-blue-700 relative transition-colors">
              <Bell size={20} /><span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-black shadow-lg">HR</div>
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