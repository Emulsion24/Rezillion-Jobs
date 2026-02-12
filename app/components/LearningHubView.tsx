'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Loader2, PlayCircle, Star, FileText, 
  X, ChevronLeft, Download, Video, FileQuestion, 
  CheckCircle2, ArrowRight
} from 'lucide-react';

// 1. Strict Interface to replace 'any'
interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string | null;
  video_url: string;
  notes_url?: string | null;
  questions_url?: string | null;
  target_audience?: string;
}

export const LearningHubView = () => {
  // 2. Applied Interface to State
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/content-library?audience=candidate&search=${search}`);
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (error) {
        console.error("Learning Hub fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    // Debounce to prevent too many API calls
    const timer = setTimeout(() => fetchContent(), 400);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="relative min-h-[600px]">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        {/* Search Header */}
        <div className="bg-white p-4 rounded-[24px] border border-slate-200 shadow-xl shadow-emerald-50/50 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 text-emerald-500" size={20} />
              <input 
                type="text" 
                placeholder="Search solar designs, site safety, or O&M..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-slate-800"
              />
            </div>
            <div className="px-6 py-3 bg-emerald-50 rounded-xl text-emerald-700 font-black text-[10px] uppercase tracking-widest border border-emerald-100">
              {courses.length} Certified Modules
            </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-emerald-600" size={40}/>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Scanning Library...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              {courses.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200 text-slate-400 font-bold">
                    No courses found matching &quot;{search}&quot;
                </div>
              ) : (
                courses.map((course) => (
                  <div 
                    key={course.id} 
                    onClick={() => setSelectedCourse(course)}
                    className="bg-white rounded-[32px] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all flex flex-col h-full group cursor-pointer"
                  >
                      <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                         {course.thumbnail_url ? (
                           // eslint-disable-next-line @next/next/no-img-element
                           <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                         ) : (
                           <PlayCircle className="text-white/40 w-16 h-16" />
                         )}
                         <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-full shadow-lg">Verified</div>
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="bg-white p-4 rounded-full text-emerald-600 scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                                <ArrowRight size={24} />
                            </div>
                         </div>
                      </div>
                      <div className="p-8 flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Greenzee Academy</span>
                                <div className="flex items-center gap-1 text-amber-500 text-xs font-black"><Star size={14} fill="currentColor"/> 4.9</div>
                            </div>
                            <h4 className="font-black text-slate-900 text-xl leading-tight mb-2 group-hover:text-emerald-600 transition-colors">{course.title}</h4>
                            <p className="text-sm text-slate-500 line-clamp-2 font-medium mb-6 leading-relaxed">{course.description}</p>
                          </div>
                          <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                             <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                <Video size={14} className="text-emerald-500"/> Video Content
                             </div>
                             {course.notes_url && (
                               <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                  <FileText size={14} className="text-blue-500"/> PDF Notes
                               </div>
                             )}
                          </div>
                      </div>
                  </div>
                ))
              )}
          </div>
        )}
      </motion.div>

      {/* --- IMMERSIVE COURSE PAGE (Modal) --- */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] bg-white flex flex-col lg:flex-row overflow-hidden"
          >
            {/* Left: Video Player Area */}
            <div className="flex-1 bg-slate-950 flex flex-col relative">
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="absolute top-6 left-6 z-10 bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-2xl transition-all flex items-center gap-2 font-bold text-sm"
                >
                    <ChevronLeft size={20}/> Exit Learning View
                </button>

                <div className="flex-1 flex items-center justify-center p-4 md:p-12">
                   <div className="w-full max-w-5xl aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl border border-white/10 relative group">
                        {/* Video Frame */}
                        {/* FIX: Replaces 'view?usp=sharing' with 'preview' for Google Drive embed support */}
                        <iframe 
                          src={selectedCourse.video_url.replace("/view?usp=sharing", "/preview").replace("/view", "/preview")} 
                          className="w-full h-full border-0"
                          allow="autoplay"
                          title="Course Video Player" // Fixed Accessibility Linter Error
                        />
                   </div>
                </div>
            </div>

            {/* Right: Content & Resources Panel */}
            <div className="w-full lg:w-[450px] h-full bg-slate-50 border-l border-slate-200 flex flex-col overflow-y-auto">
                <div className="p-8 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 w-fit px-3 py-1 rounded-lg">
                           <CheckCircle2 size={12}/> Verified Module
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 leading-tight">{selectedCourse.title}</h1>
                        <p className="text-slate-500 font-medium leading-relaxed">{selectedCourse.description}</p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Resources & Downloads</h3>
                        
                        {/* Notes Section */}
                        {selectedCourse.notes_url ? (
                            <a href={selectedCourse.notes_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-[24px] hover:border-emerald-600 hover:shadow-xl transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <FileText size={24}/>
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-800 text-sm">Study Materials</p>
                                        <p className="text-xs text-slate-400 font-bold uppercase">PDF Format</p>
                                    </div>
                                </div>
                                <Download size={20} className="text-slate-300 group-hover:text-emerald-600"/>
                            </a>
                        ) : (
                            <div className="p-5 bg-slate-100 rounded-[24px] opacity-50 flex items-center gap-4">
                                <FileText size={24} className="text-slate-400"/>
                                <p className="text-sm font-bold text-slate-400 italic">No notes available for this module.</p>
                            </div>
                        )}

                        {/* Questions Section */}
                        {selectedCourse.questions_url ? (
                             <a href={selectedCourse.questions_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-[24px] hover:border-emerald-600 hover:shadow-xl transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <FileQuestion size={24}/>
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-800 text-sm">Assessment Paper</p>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Practice Test</p>
                                    </div>
                                </div>
                                <Download size={20} className="text-slate-300 group-hover:text-emerald-600"/>
                            </a>
                        ) : null}
                    </div>

                    <div className="bg-slate-900 p-6 rounded-[32px] text-white space-y-4 shadow-xl shadow-slate-200">
                        <div className="flex items-center gap-3">
                            <Star className="text-amber-400 fill-amber-400" size={20}/>
                            <p className="font-black uppercase tracking-widest text-[10px]">Academy Excellence</p>
                        </div>
                        <p className="text-sm text-slate-400 font-medium italic">&quot;This content has been peer-reviewed by solar design leads and complies with MNRE standards.&quot;</p>
                    </div>
                </div>
                
                <div className="mt-auto p-8 border-t border-slate-200 bg-white sticky bottom-0">
                    <button 
                      onClick={() => window.open(selectedCourse.video_url, '_blank')}
                      className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-1 transition-all"
                    >
                        Launch Content in New Window
                    </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};