"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore'; 
import { 
  LayoutDashboard, 
  Briefcase, 
  UserCheck, 
  Building2, 
  Upload, 
  FileText, 
  Bell, 
  Search, 
  Menu, 
  X, 
  CheckCircle,
  Clock,
  Trash2,
  ExternalLink,
  LogOut
} from 'lucide-react';

/**
 * MOCK DATA & API SIMULATION
 */
const INITIAL_DATA = {
  employee: [
    { id: 1, title: 'Fire Safety Guidelines 2025', description: 'Mandatory safety protocols.', file: 'safety_v1.pdf', date: '2025-01-10' },
    { id: 2, title: 'HR Policy Handbook', description: 'Updated leave and benefits policy.', file: 'hr_manual.pdf', date: '2024-12-05' },
  ],
  employer: [
    { id: 1, title: 'Q1 Financial Compliance', description: 'Taxation updates for directors.', file: 'tax_q1.pdf', date: '2025-01-02' },
    { id: 2, title: 'Management Audit Checklist', description: 'For internal audit preparation.', file: 'audit_check.docx', date: '2025-01-15' },
  ],
  jobs: [
    { 
      id: 1, 
      jobTitle: 'Junior Engineer (Civil)', 
      organization: 'Indian Railways', 
      type: 'Central Govt', 
      deadline: '2025-03-15', 
      link: 'https://rrb.gov.in', 
      status: 'Active' 
    },
    { 
      id: 2, 
      jobTitle: 'Executive Trainee', 
      organization: 'ONGC', 
      type: 'PSU', 
      deadline: '2025-02-28', 
      link: 'https://ongcindia.com', 
      status: 'Active' 
    }
  ]
};

// --- reusable UI components ---
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {children}
  </div>
);

const Badge = ({ type }: { type: string }) => {
  const styles: Record<string, string> = {
    'Central Govt': 'bg-blue-100 text-blue-700',
    'State Govt': 'bg-green-100 text-green-700',
    'PSU': 'bg-orange-100 text-orange-700',
    'Active': 'bg-emerald-100 text-emerald-700',
    'Closed': 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles[type] || 'bg-gray-100 text-gray-600'}`}>
      {type}
    </span>
  );
};

// --- Main Application Component ---
export default function AdminDashboard() {
  const router = useRouter();
  
  // 1. Get User from Store (User might be null initially)
  const { user, logout } = useUserStore();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // "Database" State
  const [learningData, setLearningData] = useState(INITIAL_DATA);
  const [jobData, setJobData] = useState(INITIAL_DATA.jobs);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null);

  // --- Auth Check (Optional: Redirect if no user) ---
  useEffect(() => {

   if (!user) router.push('/login');
  }, [user, router]);

  const showNotification = (message: string, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' }); 
      if (logout) logout(); 
      showNotification("Logging out...", "success");
      
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (error) {
      console.error('Logout failed', error);
      showNotification("Logout failed", "error");
    }
  };

  const handleLearningUpload = async (e: React.FormEvent<HTMLFormElement>, category: 'employee' | 'employer') => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    await new Promise(resolve => setTimeout(resolve, 800));

    const file = formData.get('file') as File;
    const newItem = {
      id: Date.now(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      file: file?.name || 'document.pdf',
      date: new Date().toISOString().split('T')[0]
    };

    setLearningData(prev => ({
      ...prev,
      [category]: [newItem, ...prev[category]]
    }));
    
    setIsLoading(false);
    showNotification(`${category === 'employee' ? 'Employee' : 'Employer'} material uploaded successfully!`);
    e.currentTarget.reset();
  };

  const handleJobUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    await new Promise(resolve => setTimeout(resolve, 800));

    const newJob = {
      id: Date.now(),
      jobTitle: formData.get('jobTitle') as string,
      organization: formData.get('organization') as string,
      type: formData.get('jobType') as string,
      deadline: formData.get('deadline') as string,
      link: formData.get('link') as string,
      status: 'Active'
    };

    setJobData(prev => [newJob, ...prev]);
    setIsLoading(false);
    showNotification('Government job notification posted successfully!');
    e.currentTarget.reset();
  };

  const deleteItem = (id: number, type: 'job' | 'learning', category?: 'employee' | 'employer') => {
    if (type === 'job') {
      setJobData(prev => prev.filter(item => item.id !== id));
    } else if (category) {
      setLearningData(prev => ({
        ...prev,
        [category]: prev[category].filter(item => item.id !== id)
      }));
    }
    showNotification('Item deleted', 'error');
  };

  // --- Views ---

  const DashboardHome = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Employee Docs</p>
              <h3 className="text-2xl font-bold text-gray-800">{learningData.employee.length}</h3>
            </div>
            <UserCheck className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Employer Docs</p>
              <h3 className="text-2xl font-bold text-gray-800">{learningData.employer.length}</h3>
            </div>
            <Briefcase className="w-8 h-8 text-purple-500 opacity-20" />
          </div>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Job Postings</p>
              <h3 className="text-2xl font-bold text-gray-800">{jobData.length}</h3>
            </div>
            <Building2 className="w-8 h-8 text-emerald-500 opacity-20" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Job Postings</h3>
            <button onClick={() => setActiveTab('jobs')} className="text-sm text-blue-600 hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {jobData.slice(0, 3).map(job => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-800">{job.jobTitle}</p>
                  <p className="text-xs text-gray-500">{job.organization}</p>
                </div>
                <Badge type={job.type} />
              </div>
            ))}
            {jobData.length === 0 && <p className="text-center text-gray-400 py-4">No jobs posted yet.</p>}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Learning Materials</h3>
          </div>
          <div className="space-y-3">
            {[...learningData.employee, ...learningData.employer].sort((a,b) => b.id - a.id).slice(0, 3).map(item => (
              <div key={item.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium text-gray-800 truncate">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const LearningUploadView = ({ category }: { category: 'employee' | 'employer' }) => {
    const isEmployee = category === 'employee';
    const data = learningData[category];
    const colorClass = isEmployee ? 'blue' : 'purple';
    
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isEmployee ? 'Employee' : 'Employer'} Learning
            </h2>
            <p className="text-gray-500">Upload training materials and guides for {isEmployee ? 'staff' : 'management'}.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Upload className={`w-5 h-5 mr-2 text-${colorClass}-600`} />
                Upload New Material
              </h3>
              <form onSubmit={(e) => handleLearningUpload(e, category)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input required name="title" type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Safety Manual 2024" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Brief description of content..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF/Video)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                    <input required name="file" type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                  </div>
                </div>
                <button 
                  disabled={isLoading}
                  className={`w-full py-2 px-4 bg-${colorClass}-600 hover:bg-${colorClass}-700 text-white rounded-lg transition-colors flex items-center justify-center`}
                >
                  {isLoading ? 'Uploading...' : 'Upload Material'}
                </button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {data.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-${colorClass}-50 text-${colorClass}-600`}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.file}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => deleteItem(item.id, 'learning', category)}
                  className="text-gray-400 hover:text-red-500 p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {data.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                <p className="text-gray-500">No materials uploaded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const GovtJobView = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Govt & PSU Job News</h2>
          <p className="text-gray-500">Post new job openings and notifications.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-emerald-600" />
              Post New Job
            </h3>
            <form onSubmit={handleJobUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input required name="jobTitle" type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Assistant Manager" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization / PSU</label>
                <input required name="organization" type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. SAIL, BHEL" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select name="jobType" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                    <option value="Central Govt">Central Govt</option>
                    <option value="State Govt">State Govt</option>
                    <option value="PSU">PSU</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input required name="deadline" type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Official Link</label>
                <input required name="link" type="url" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://..." />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notification PDF</label>
                  <input name="file" type="file" accept=".pdf" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"/>
              </div>
              <button 
                disabled={isLoading}
                className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? 'Posting...' : 'Post Job News'}
              </button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Job Title / Org</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Deadline</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jobData.map(job => (
                    <tr key={job.id} className="hover:bg-gray-50 group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">{job.jobTitle}</span>
                          <span className="text-xs text-gray-500">{job.organization}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge type={job.type} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock size={14} className="mr-2" />
                          {job.deadline}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <a href={job.link} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <ExternalLink size={16} />
                          </a>
                          <button 
                            onClick={() => deleteItem(job.id, 'job')}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {jobData.length === 0 && (
                <div className="text-center py-12 text-gray-500">No jobs posted yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SidebarItem = ({ id, icon: Icon, label }: { id: string; icon: any; label: string }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex text-gray-900">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 text-white animate-in slide-in-from-top-2 ${notification.type === 'error' ? 'bg-red-500' : 'bg-gray-800'}`}>
          <CheckCircle size={20} />
          <span>{notification.message}</span>
        </div>
      )}

      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 fixed h-full z-10">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
          <span className="text-xl font-bold tracking-tight">Admin<span className="text-blue-600">Panel</span></span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <div className="pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider pl-4">Learning</div>
          <SidebarItem id="employee" icon={UserCheck} label="Employee Learning" />
          <SidebarItem id="employer" icon={Briefcase} label="Employer Learning" />
          <div className="pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider pl-4">Recruitment</div>
          <SidebarItem id="jobs" icon={Building2} label="Govt & PSU Jobs" />
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
            {/* SAFE ACCESS: Handle case where user is null */}
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                {user?.name?.charAt(0) || 'U'} 
            </div>
            <div>
              <p className="text-sm font-semibold">{user?.name || 'Guest User'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Viewer'}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <span className="text-xl font-bold">AdminPanel</span>
          <button onClick={() => setIsMobileMenuOpen(false)}><X /></button>
        </div>
        <nav className="p-4 space-y-2">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="employee" icon={UserCheck} label="Employee Learning" />
          <SidebarItem id="employer" icon={Briefcase} label="Employer Learning" />
          <SidebarItem id="jobs" icon={Building2} label="Govt & PSU Jobs" />
        </nav>
        <div className="p-4 border-t border-gray-100">
           <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 transition-all duration-300">
        
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-gray-600 hover:text-gray-900">
              <Menu />
            </button>
            <div className="hidden md:flex items-center text-gray-400 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-64">
              <Search size={18} className="mr-2" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <div className="text-right hidden sm:block">
               {/* SAFE ACCESS */}
               <p className="text-sm font-bold text-gray-700">Welcome, {user?.name?.split(' ')[0] || 'Guest'}</p>
             </div>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <DashboardHome />}
          {activeTab === 'employee' && <LearningUploadView category="employee" />}
          {activeTab === 'employer' && <LearningUploadView category="employer" />}
          {activeTab === 'jobs' && <GovtJobView />}
        </div>
      </main>
    </div>
  );
}