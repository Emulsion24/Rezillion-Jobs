"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore'; 
import { 
  LayoutDashboard, Briefcase, UserCheck, Building2, Upload, 
  FileText, CheckCircle, Clock, Trash2, ExternalLink, 
  LogOut, LucideIcon, Video, Check, PlayCircle, AlertCircle, 
  Link as LinkIcon, Image as ImageIcon, FileQuestion, GraduationCap, Loader2
} from 'lucide-react';

// --- 1. STRICT INTERFACES ---

// Frontend Data Models
interface ContentItem {
  id: number | string;
  title: string;
  description: string;
  targetAudience: 'candidate' | 'employer';
  thumbnail: string;
  notes: string;
  questions: string;
  videoLink: string;
  date: string;
}

interface JobItem {
  id: number;
  jobTitle: string;
  organization: string;
  type: string;
  deadline: string;
  link: string;
  status: string;
}

interface CourseRequestItem {
  id: number;
  title: string;
  creatorName: string;
  description: string;
  thumbnailUrl: string;
  notesUrl: string;
  questionsUrl: string;
  sourceLink: string;
  submittedDate: string;
  status: 'pending' | 'approved';
}

// Upload Form Data Structure
interface UploadData {
  title: string;
  description: string;
  videoLink: string;
  targetAudience: 'candidate' | 'employer';
  thumbnail: string;
  notes: string;
  questions: string;
}

// Raw API Response Types (To replace 'any' in fetch maps)
interface RawContentItem {
  id: number;
  title: string;
  description: string;
  target_audience: 'candidate' | 'employer';
  thumbnail_url: string;
  video_url: string;
  notes_url: string;
  questions_url: string;
  created_at: string;
}

interface RawJobItem {
  id: number;
  title: string;
  organization: string;
  job_type: string;
  deadline: string;
  official_link: string;
  status: string;
}

interface RawCourseRequest {
  id: number;
  title: string;
  creator_name: string;
  description: string;
  thumbnail_url: string;
  notes_url: string;
  questions_url: string;
  source_video_link: string;
  created_at: string;
  status: 'pending' | 'approved';
}

// --- HELPER COMPONENTS ---

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
    'pending': 'bg-yellow-100 text-yellow-700',
    'candidate': 'bg-indigo-100 text-indigo-700', 
    'employer': 'bg-purple-100 text-purple-700'
  };
  return <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles[type] || 'bg-gray-100 text-gray-600'}`}>{type}</span>;
};

const SidebarItem = ({ id, icon: Icon, label, activeTab, onClick }: { id: string; icon: LucideIcon; label: string; activeTab: string; onClick: () => void; }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-600 hover:bg-gray-50'}`}>
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

// --- VIEW COMPONENTS ---

const DashboardHome = ({ 
  learningData, 
  jobData, 
  courseRequests, 
  setActiveTab 
}: { 
  learningData: { employee: ContentItem[], employer: ContentItem[] }; 
  jobData: JobItem[]; 
  courseRequests: CourseRequestItem[]; 
  setActiveTab: (tab: string) => void; 
}) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="border-l-4 border-l-blue-500">
        <div className="flex items-center justify-between">
          <div><p className="text-sm text-gray-500">Employee Content</p><h3 className="text-2xl font-bold text-gray-800">{learningData.employee.length}</h3></div>
          <UserCheck className="w-8 h-8 text-blue-500 opacity-20" />
        </div>
      </Card>
      <Card className="border-l-4 border-l-purple-500">
        <div className="flex items-center justify-between">
          <div><p className="text-sm text-gray-500">Employer Content</p><h3 className="text-2xl font-bold text-gray-800">{learningData.employer.length}</h3></div>
          <Briefcase className="w-8 h-8 text-purple-500 opacity-20" />
        </div>
      </Card>
      <Card className="border-l-4 border-l-emerald-500">
        <div className="flex items-center justify-between">
          <div><p className="text-sm text-gray-500">Active Jobs</p><h3 className="text-2xl font-bold text-gray-800">{jobData.length}</h3></div>
          <Building2 className="w-8 h-8 text-emerald-500 opacity-20" />
        </div>
      </Card>
      <Card className="border-l-4 border-l-orange-500">
        <div className="flex items-center justify-between">
          <div><p className="text-sm text-gray-500">Pending Approvals</p><h3 className="text-2xl font-bold text-gray-800">{courseRequests.length}</h3></div>
          <Video className="w-8 h-8 text-orange-500 opacity-20" />
        </div>
      </Card>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold text-gray-800">Pending Requests</h3>
               <button onClick={() => setActiveTab('approvals')} className="text-sm text-blue-600 hover:underline">View All</button>
            </div>
            <div className="space-y-3">
            {courseRequests.slice(0, 3).map(req => (
                <div key={req.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 overflow-hidden flex items-center justify-center border border-orange-200">
                        {req.thumbnailUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={req.thumbnailUrl} alt="Thumb" className="w-full h-full object-cover" />
                        ) : (
                            <PlayCircle size={20} className="text-orange-600"/>
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-gray-800 text-sm line-clamp-1">{req.title}</p>
                        <p className="text-xs text-gray-500">{req.creatorName}</p>
                    </div>
                </div>
                <Badge type="pending" />
                </div>
            ))}
            {courseRequests.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">No pending requests.</p>}
            </div>
        </Card>

        <Card>
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold text-gray-800">Recent Jobs</h3>
               <button onClick={() => setActiveTab('jobs')} className="text-sm text-blue-600 hover:underline">View All</button>
            </div>
            <div className="space-y-3">
            {jobData.slice(0, 3).map(job => (
                <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                    <p className="font-medium text-gray-800 text-sm">{job.jobTitle}</p>
                    <p className="text-xs text-gray-500">{job.organization}</p>
                </div>
                <Badge type={job.type} />
                </div>
            ))}
            {jobData.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">No jobs posted.</p>}
            </div>
        </Card>
    </div>
  </div>
);

const MasterUploadView = ({ handleUpload, isLoading }: { handleUpload: (data: UploadData) => void; isLoading: boolean; }) => {
  const [audience, setAudience] = useState<'candidate' | 'employer'>('candidate');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: UploadData = {
        title: form.get('title') as string,
        description: form.get('description') as string,
        videoLink: form.get('videoLink') as string,
        targetAudience: audience,
        thumbnail: "https://via.placeholder.com/300", 
        notes: "", 
        questions: ""
    };
    handleUpload(data);
    e.currentTarget.reset();
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold text-gray-800">Upload Content</h2><p className="text-gray-500">Create new courses or resource materials manually.</p></div>
      </div>
      <Card>
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Target Audience</label>
            <div className="flex gap-4">
                <button type="button" onClick={() => setAudience('candidate')} className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${audience === 'candidate' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-100 hover:border-gray-200 text-gray-500'}`}><UserCheck size={24} /><div className="text-left"><div className="font-bold text-sm">Candidate / Employee</div><div className="text-[10px] opacity-70">Training & Skills</div></div></button>
                <button type="button" onClick={() => setAudience('employer')} className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${audience === 'employer' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-100 hover:border-gray-200 text-gray-500'}`}><Briefcase size={24} /><div className="text-left"><div className="font-bold text-sm">Employer</div><div className="text-[10px] opacity-70">Compliance & Guides</div></div></button>
            </div>
            </div>
            <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Content Title</label><input required name="title" className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Fire Safety Manual 2025" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" rows={3} className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="What is this content about?" /></div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex items-center gap-2 mb-2"><LinkIcon size={16} className="text-blue-600"/><label className="text-sm font-bold text-blue-800">Source Video Link</label></div>
            <input required name="videoLink" type="url" className="w-full px-3 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none text-sm bg-white" placeholder="https://drive.google.com/file/d/..." />
            </div>
            <div className="pt-4 border-t border-gray-100">
            <button disabled={isLoading} className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="animate-spin" /> : <><Upload size={18} /> Publish Content</>}
            </button>
            </div>
        </form>
      </Card>
    </div>
  );
};

const ContentLibraryView = ({ content, deleteItem }: { content: ContentItem[]; deleteItem: (id: number | string) => void }) => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-gray-800">Content Library</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
                    <div className="h-40 bg-gray-100 relative group-hover:scale-105 transition-transform duration-500">
                        {item.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-300"><ImageIcon size={40}/></div>
                        )}
                        <div className="absolute top-2 right-2"><Badge type={item.targetAudience} /></div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <a href={item.videoLink} target="_blank" rel="noreferrer" className="p-2 bg-white rounded-full text-blue-600 hover:scale-110 transition"><ExternalLink size={18}/></a>
                            <button onClick={() => deleteItem(item.id)} className="p-2 bg-white rounded-full text-red-500 hover:scale-110 transition"><Trash2 size={18}/></button>
                        </div>
                    </div>
                    <div className="p-5">
                        <h4 className="font-bold text-gray-800 mb-1 line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                            {item.notes && <a href={item.notes} target="_blank" className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded flex items-center gap-1 text-gray-600 transition"><FileText size={10}/> Notes</a>}
                            {item.questions && <a href={item.questions} target="_blank" className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded flex items-center gap-1 text-gray-600 transition"><FileQuestion size={10}/> Questions</a>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const CourseApprovalView = ({ requests, handleApprove, handleReject, isLoading }: { requests: CourseRequestItem[]; handleApprove: (id: number, finalLink: string) => void; handleReject: (id: number) => void; isLoading: boolean; }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [finalLink, setFinalLink] = useState('');
  const selectedRequest = requests.find(r => r.id === selectedId);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center"><div><h2 className="text-2xl font-bold text-gray-800">Course Approvals</h2><p className="text-gray-500">Review content submitted by creators.</p></div></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-1 space-y-3 h-[600px] overflow-y-auto pr-2">
          {requests.map(req => (
            <div key={req.id} onClick={() => { setSelectedId(req.id); setFinalLink(''); }} className={`p-4 bg-white rounded-xl shadow-sm cursor-pointer border-l-4 transition-all ${selectedId === req.id ? 'border-orange-500 ring-2 ring-orange-50 bg-orange-50/10' : 'border-transparent hover:border-gray-200'}`}>
              <div className="flex gap-3 mb-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      {req.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={req.thumbnailUrl} alt="" className="w-full h-full object-cover"/>
                      ) : <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={16}/></div>}
                  </div>
                  <div>
                      <div className="font-bold text-gray-800 text-sm line-clamp-1">{req.title}</div>
                      <div className="text-xs text-gray-500">{req.creatorName}</div>
                  </div>
              </div>
              <div className="text-[10px] text-gray-400 font-medium text-right">{req.submittedDate}</div>
            </div>
          ))}
          {requests.length === 0 && <div className="text-center py-10 bg-white rounded-xl border border-dashed text-gray-400">No pending requests</div>}
        </div>

        <div className="lg:col-span-2">
          {selectedRequest ? (
            <Card className="h-full">
              <div className="border-b border-gray-100 pb-4 mb-6">
                  <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4 bg-gray-100">
                      {selectedRequest.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={selectedRequest.thumbnailUrl} className="w-full h-full object-cover" alt="Course Thumbnail"/>
                      ) : <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon size={48}/></div>}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedRequest.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{selectedRequest.description}</p>
              </div>

              <div className="space-y-6">
                
                {/* Review Assets Section */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Review Assets</span>
                    <div className="flex flex-wrap gap-3">
                        <a href={selectedRequest.sourceLink} target="_blank" className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-blue-600 rounded-lg text-sm font-bold hover:shadow-sm transition"><Video size={16}/> Source Video</a>
                        {selectedRequest.notesUrl && <a href={selectedRequest.notesUrl} target="_blank" className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:shadow-sm transition"><FileText size={16}/> Notes PDF</a>}
                        {selectedRequest.questionsUrl && <a href={selectedRequest.questionsUrl} target="_blank" className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:shadow-sm transition"><FileQuestion size={16}/> Questions PDF</a>}
                    </div>
                </div>

                <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2 block">Step 2: Final Approval</span>
                    <p className="text-xs text-orange-800/70 mb-4">Paste the final hosted video link (e.g. YouTube/Vimeo/S3) to publish.</p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Final Hosted Video URL</label>
                            <input type="url" value={finalLink} onChange={(e) => setFinalLink(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white" placeholder="https://your-storage.com/video.mp4"/>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={() => handleReject(selectedRequest.id)} className="px-4 py-2 text-sm font-bold text-red-600 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 rounded-lg transition-colors shadow-sm">Reject Request</button>
                            <button onClick={() => handleApprove(selectedRequest.id, finalLink)} disabled={isLoading || !finalLink} className="px-6 py-2 bg-orange-600 text-white text-sm font-bold rounded-lg hover:bg-orange-700 transition-colors shadow-md flex items-center gap-2 disabled:opacity-50">
                                {isLoading ? <Loader2 className="animate-spin" size={16}/> : <><Check size={16}/> Approve & Publish</>}
                            </button>
                        </div>
                    </div>
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                <div className="bg-white p-4 rounded-full shadow-sm mb-3"><AlertCircle size={32} className="text-gray-300"/></div>
                <p className="font-medium">Select a request to review details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GovtJobView = ({ jobData, handleJobUpload, isLoading, deleteItem }: { jobData: JobItem[]; handleJobUpload: (e: React.FormEvent<HTMLFormElement>) => void; isLoading: boolean; deleteItem: (id: number) => void; }) => (
  <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
    <div className="flex justify-between items-center"><div><h2 className="text-2xl font-bold text-gray-800">Govt & PSU Job News</h2></div></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1"><Card><h3 className="text-lg font-semibold mb-4 flex items-center"><Building2 className="w-5 h-5 mr-2 text-emerald-600" />Post New Job</h3><form onSubmit={handleJobUpload} className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label><input required name="jobTitle" type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Organization</label><input required name="organization" type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" /></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select name="jobType" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"><option value="Central Govt">Central Govt</option><option value="State Govt">State Govt</option><option value="PSU">PSU</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label><input required name="deadline" type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" /></div></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Link</label><input required name="link" type="url" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" /></div><button disabled={isLoading} className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center">{isLoading ? 'Posting...' : 'Post Job News'}</button></form></Card></div>
        <div className="lg:col-span-2"><div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-gray-50 border-b border-gray-100"><tr><th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Job Title / Org</th><th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th><th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Deadline</th><th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{jobData.map(job => (<tr key={job.id} className="hover:bg-gray-50 group"><td className="px-6 py-4"><div className="flex flex-col"><span className="font-medium text-gray-800">{job.jobTitle}</span><span className="text-xs text-gray-500">{job.organization}</span></div></td><td className="px-6 py-4"><Badge type={job.type} /></td><td className="px-6 py-4"><div className="flex items-center text-sm text-gray-600"><Clock size={14} className="mr-2" />{job.deadline}</div></td><td className="px-6 py-4 text-right"><div className="flex items-center justify-end space-x-2"><a href={job.link} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><ExternalLink size={16} /></a><button onClick={() => deleteItem(job.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button></div></td></tr>))}</tbody></table>{jobData.length === 0 && <div className="text-center py-12 text-gray-500">No jobs posted yet.</div>}</div></div></div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null);
  
  // Data States
  const [contentData, setContentData] = useState<ContentItem[]>([]);
  const [jobData, setJobData] = useState<JobItem[]>([]);
  const [courseRequests, setCourseRequests] = useState<CourseRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize
  useEffect(() => {
    // Basic auth check
    if (!user) { router.push('/login'); return; }

    const fetchData = async () => {
        try {
             // Parallel Fetch
             const [contentRes, jobsRes, requestsRes] = await Promise.all([
                fetch('/api/admin/content').then(r => r.json()),
                fetch('/api/admin/jobs').then(r => r.json()),
                fetch('/api/admin/approvals').then(r => r.json())
            ]);
            
            // Map Content (Using strict interface types)
            const mappedContent: ContentItem[] = (contentRes || []).map((c: RawContentItem) => ({
                id: c.id,
                title: c.title,
                description: c.description,
                targetAudience: c.target_audience,
                thumbnail: c.thumbnail_url || '',
                videoLink: c.video_url || '',
                notes: c.notes_url || '',
                questions: c.questions_url || '',
                date: c.created_at ? new Date(c.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            }));

            // Map Jobs
            const mappedJobs: JobItem[] = (jobsRes || []).map((j: RawJobItem) => ({
                id: j.id,
                jobTitle: j.title, 
                organization: j.organization,
                type: j.job_type || 'Central Govt',
                deadline: j.deadline ? new Date(j.deadline).toISOString().split('T')[0] : '',
                link: j.official_link || '',
                status: j.status
            }));

            // Map Requests
            const rawRequests = requestsRes.requests || (Array.isArray(requestsRes) ? requestsRes : []);
            const mappedRequests: CourseRequestItem[] = rawRequests.map((r: RawCourseRequest) => ({
                id: r.id,
                title: r.title,
                creatorName: r.creator_name || 'Unknown',
                description: r.description,
                thumbnailUrl: r.thumbnail_url || '',
                notesUrl: r.notes_url || '',
                questionsUrl: r.questions_url || '',
                sourceLink: r.source_video_link || '',
                submittedDate: r.created_at ? new Date(r.created_at).toLocaleDateString() : '',
                status: r.status
            }));

            setContentData(mappedContent);
            setJobData(mappedJobs);
            setCourseRequests(mappedRequests);

        } catch (e) { 
          console.error("Failed to load data", e); 
        }
    };
    fetchData();
  }, [user, router]);

  const showNotification = (message: string, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handlers
  const handleContentUpload = async (data: UploadData) => {
    setIsLoading(true);
    try {
        const res = await fetch('/api/admin/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            showNotification("Content Published Successfully!");
            window.location.reload(); 
        }
    } catch (e) { showNotification("Upload failed", "error"); }
    finally { setIsLoading(false); }
  };

  const handleJobUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
        jobTitle: formData.get('jobTitle'),
        organization: formData.get('organization'),
        type: formData.get('jobType'),
        deadline: formData.get('deadline'),
        link: formData.get('link')
    };

    try {
        const res = await fetch('/api/admin/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            showNotification('Job posted!');
            window.location.reload();
        }
    } catch (e) { showNotification("Post failed", "error"); }
    finally { setIsLoading(false); }
  };

  const deleteItem = async (id: number | string, type: 'job' | 'content') => {
      if(!confirm("Are you sure you want to delete this?")) return;
      const endpoint = type === 'job' ? `/api/admin/jobs?id=${id}` : `/api/admin/content?id=${id}`;
      await fetch(endpoint, { method: 'DELETE' });
      
      if (type === 'content') setContentData(prev => prev.filter(i => i.id !== id));
      else if (type === 'job') setJobData(prev => prev.filter(i => i.id !== id));
      showNotification("Deleted", "error");
  };

  const handleCourseApprove = async (id: number, finalLink: string) => {
    setIsLoading(true);
    try {
        await fetch('/api/admin/approvals', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, action: 'approve', finalVideoUrl: finalLink })
        });
        setCourseRequests(prev => prev.filter(req => req.id !== id));
        showNotification(`Course Approved!`);
    } catch (e) { showNotification("Approval failed", "error"); }
    finally { setIsLoading(false); }
  };

  const handleCourseReject = async (id: number) => {
    if(confirm("Reject this request?")) {
        await fetch('/api/admin/approvals', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, action: 'reject' })
        });
        setCourseRequests(prev => prev.filter(req => req.id !== id));
        showNotification("Request Rejected", "error");
    }
  };

  const handleLogout = async () => { 
      await fetch('/api/logout', { method: 'POST' });
      if(logout) logout();
      router.push('/login'); 
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex text-gray-900">
      {notification && ( 
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 text-white animate-in slide-in-from-top-2 ${notification.type === 'error' ? 'bg-red-500' : 'bg-gray-800'}`}>
            <CheckCircle size={20} /><span>{notification.message}</span>
        </div> 
      )}

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 fixed h-full z-10">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="text-xl font-bold tracking-tight">Admin<span className="text-blue-600">Panel</span></span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" activeTab={activeTab} onClick={() => setActiveTab('dashboard')} />
          <div className="pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider pl-4">Content Mgmt</div>
          <SidebarItem id="upload" icon={Upload} label="Upload Content" activeTab={activeTab} onClick={() => setActiveTab('upload')} />
          <SidebarItem id="library" icon={GraduationCap} label="Content Library" activeTab={activeTab} onClick={() => setActiveTab('library')} />
          <SidebarItem id="approvals" icon={CheckCircle} label="Creator Approvals" activeTab={activeTab} onClick={() => setActiveTab('approvals')} />
          <div className="pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider pl-4">Recruitment</div>
          <SidebarItem id="jobs" icon={Building2} label="Govt & PSU Jobs" activeTab={activeTab} onClick={() => setActiveTab('jobs')} />
        </nav>
        <div className="p-4 border-t border-gray-100">
            <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-sm">
                <LogOut size={18} /><span>Log Out</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 transition-all duration-300">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
           <div className="font-bold text-gray-700">Admin Dashboard</div>
           <div className="flex items-center gap-4">
             <span className="text-sm font-bold text-gray-600">{user?.name || 'Admin'}</span>
             <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">A</div>
           </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardHome 
                learningData={{
                    employee: contentData.filter(c => c.targetAudience === 'candidate'), 
                    employer: contentData.filter(c => c.targetAudience === 'employer')
                }} 
                jobData={jobData} 
                courseRequests={courseRequests} 
                setActiveTab={setActiveTab} 
            />
          )}
          {activeTab === 'upload' && <MasterUploadView handleUpload={handleContentUpload} isLoading={isLoading} />}
          {activeTab === 'library' && <ContentLibraryView content={contentData} deleteItem={(id) => deleteItem(id, 'content')} />}
          {activeTab === 'approvals' && <CourseApprovalView requests={courseRequests} handleApprove={handleCourseApprove} handleReject={handleCourseReject} isLoading={isLoading} />}
          {activeTab === 'jobs' && <GovtJobView jobData={jobData} handleJobUpload={handleJobUpload} isLoading={isLoading} deleteItem={(id) => deleteItem(id, 'job')} />}
        </div>
      </main>
    </div>
  );
}