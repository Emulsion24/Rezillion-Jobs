"use client";

import React, { useState, useEffect } from 'react';
import { Award, Briefcase, Plus, Trash2, Upload, FileText, Save, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

// --- Interfaces ---

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

interface CertEntry {
  name: string;
  fileName: string;
  fileUrl: string;
  link?: string;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
}

interface ExpEntry {
  title: string;
  company: string;
  duration: string;
  docType: 'exp_letter' | 'offer_resign';
  
  expLetterName: string;
  expLetterUrl: string;
  expLetterStatus: 'idle' | 'uploading' | 'success' | 'error';

  offerLetterName: string;
  offerLetterUrl: string;
  offerLetterStatus: 'idle' | 'uploading' | 'success' | 'error';

  resignationLetterName: string;
  resignationLetterUrl: string;
  resignationLetterStatus: 'idle' | 'uploading' | 'success' | 'error';
}

// --- Helper Component ---
const StatusIcon = ({ status }: { status?: string }) => {
  if (status === 'uploading') return <Loader2 size={14} className="animate-spin text-blue-600" />;
  if (status === 'success') return <CheckCircle2 size={14} className="text-emerald-600" />;
  if (status === 'error') return <XCircle size={14} className="text-red-600" />;
  return <Upload size={14} strokeWidth={3} />;
};

export const CertificateExperience = () => {
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [certs, setCerts] = useState<CertEntry[]>([]);
  const [exps, setExps] = useState<ExpEntry[]>([]);

  // --- 1. Fetch Data ---
  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/dashboard/profile?userId=${user.id}`);
        const data = await res.json();
        if (res.ok) {
          if (data.certificates?.length) setCerts(data.certificates);
          if (data.experience_details?.length) setExps(data.experience_details);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  // --- 2. Backend Upload Helper ---
  const uploadFileToBackend = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { 
        method: 'POST', 
        body: formData 
      });
      
      // Strictly typed response
      const data = (await res.json()) as UploadResponse;
      
      if (data.success && data.url) return data.url;
      throw new Error(data.error || "Upload failed");
    } catch (error) {
      console.error("Backend Upload Error:", error);
      return null;
    }
  };

  // --- 3. Cert Handlers ---
  const handleCertUpload = async (index: number, file: File) => {
    if (!file) return;
    
    // Optimistic Update
    setCerts(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], fileName: file.name, uploadStatus: 'uploading' };
      return copy;
    });

    // Upload
    const url = await uploadFileToBackend(file);

    // Final Update
    setCerts(prev => {
      const copy = [...prev];
      if (url) {
        copy[index] = { ...copy[index], fileUrl: url, uploadStatus: 'success' };
      } else {
        copy[index] = { ...copy[index], uploadStatus: 'error' };
      }
      return copy;
    });
  };

  const addCertRow = () => setCerts([...certs, { name: '', fileName: '', fileUrl: '', link: '', uploadStatus: 'idle' }]);
  
  // STRICTLY TYPED UPDATE FUNCTION (No 'any')
  const updateCert = <K extends keyof CertEntry>(index: number, field: K, value: CertEntry[K]) => {
    setCerts(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // --- 4. Experience Handlers ---
  const handleExpUpload = async (index: number, fieldPrefix: 'expLetter' | 'offerLetter' | 'resignationLetter', file: File) => {
    if (!file) return;

    // Optimistic Update
    setExps(prev => {
      const copy = [...prev];
      copy[index] = { 
        ...copy[index], 
        [`${fieldPrefix}Name`]: file.name,
        [`${fieldPrefix}Status`]: 'uploading' 
      };
      return copy;
    });

    // Upload
    const url = await uploadFileToBackend(file);

    // Final Update
    setExps(prev => {
      const copy = [...prev];
      if (url) {
        copy[index] = { 
          ...copy[index], 
          [`${fieldPrefix}Url`]: url,
          [`${fieldPrefix}Status`]: 'success' 
        };
      } else {
        copy[index] = { 
          ...copy[index], 
          [`${fieldPrefix}Status`]: 'error' 
        };
      }
      return copy;
    });
  };

  const addExpRow = () => setExps([...exps, { 
    title: '', company: '', duration: '', docType: 'exp_letter', 
    expLetterName: '', expLetterUrl: '', expLetterStatus: 'idle',
    offerLetterName: '', offerLetterUrl: '', offerLetterStatus: 'idle',
    resignationLetterName: '', resignationLetterUrl: '', resignationLetterStatus: 'idle'
  }]);

  // STRICTLY TYPED UPDATE FUNCTION (No 'any')
  const updateExp = <K extends keyof ExpEntry>(index: number, field: K, value: ExpEntry[K]) => {
    setExps(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // --- 5. Save Handler ---
  const handleSave = async () => {
    if (!user?.id) return alert("Please log in.");
    
    // Check pending uploads
    const pendingCert = certs.some(c => c.uploadStatus === 'uploading');
    const pendingExp = exps.some(e => e.expLetterStatus === 'uploading' || e.offerLetterStatus === 'uploading');
    if (pendingCert || pendingExp) return alert("Please wait for file uploads to finish.");

    setSaving(true);
    try {
      const res = await fetch('/api/dashboard/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          certificates: certs,
          experienceDetails: exps
        })
      });

      if (res.ok) alert("Documents Saved Successfully!");
      else alert("Failed to save.");
    } catch (error) {
      console.error(error);
      alert("Server error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading...</div>;

  return (
    <div className="space-y-10 mb-8">
      
      {/* CERTIFICATES SECTION */}
      <section className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-100 border-b border-slate-300 flex items-center gap-2 text-slate-900">
          <Award size={20} className="text-pink-600" />
          <h3 className="font-bold italic underline underline-offset-4 decoration-pink-500">3. Upload Certificates</h3>
        </div>
        <div className="p-0">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-200 text-slate-800 uppercase text-[10px] font-black tracking-wider border-b border-slate-300">
              <tr>
                <th className="p-3 border-r border-slate-300 text-center w-14">ID</th>
                <th className="p-3 border-r border-slate-300">Certificate Name</th>
                <th className="p-3 border-r border-slate-300 w-60">Attachment (PDF)</th>
                <th className="p-3 border-r border-slate-300">Link</th>
                <th className="p-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {certs.map((cert, idx) => (
                <tr key={idx} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="p-3 border-r border-slate-300 text-center font-bold text-pink-700 bg-pink-50/30">C{idx+1}</td>
                  <td className="p-3 border-r border-slate-300">
                    <input className="w-full outline-none bg-transparent font-bold text-slate-900 placeholder:text-slate-500" placeholder="e.g. AutoCAD" value={cert.name} onChange={(e) => updateCert(idx, 'name', e.target.value)} />
                  </td>
                  <td className="p-3 border-r border-slate-300 bg-slate-50/50">
                    <label className={`flex items-center gap-2 cursor-pointer font-black p-1 border border-dashed rounded bg-white transition-colors ${cert.uploadStatus === 'error' ? 'border-red-300 text-red-600' : 'border-blue-200 text-blue-800 hover:text-blue-900'}`}>
                      <StatusIcon status={cert.uploadStatus} />
                      <span className="text-[10px] truncate w-40">{cert.fileName || "SELECT PDF"}</span>
                      <input type="file" className="hidden" accept=".pdf" onChange={(e) => e.target.files?.[0] && handleCertUpload(idx, e.target.files[0])} />
                    </label>
                  </td>
                  <td className="p-3 border-r border-slate-300">
                    <input className="w-full outline-none bg-transparent font-bold text-slate-900 placeholder:text-slate-500" placeholder="URL" value={cert.link} onChange={(e) => updateCert(idx, 'link', e.target.value)} />
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => setCerts(certs.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addCertRow} className="w-full p-4 bg-slate-100 text-slate-900 font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-200 border-t-2 border-slate-300 uppercase tracking-widest"><Plus size={18} /> ADD ROW</button>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-100 border-b border-slate-300 flex items-center gap-2 text-slate-900">
          <Briefcase size={20} className="text-emerald-600" />
          <h3 className="font-bold italic underline underline-offset-4 decoration-emerald-500">4. Experience</h3>
        </div>
        <div className="p-0">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-200 text-slate-800 uppercase text-[10px] font-black tracking-wider border-b border-slate-300">
              <tr>
                <th className="p-3 border-r border-slate-300 text-center w-14">ID</th>
                <th className="p-3 border-r border-slate-300">Role / Org</th>
                <th className="p-3 border-r border-slate-300 w-32">Duration</th>
                <th className="p-3 border-r border-slate-300 w-72">Documents</th>
                <th className="p-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {exps.map((exp, idx) => (
                <tr key={idx} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="p-3 border-r border-slate-300 text-center font-bold text-emerald-700 bg-emerald-50/30 align-top pt-4">E{idx+1}</td>
                  <td className="p-3 border-r border-slate-300 align-top pt-4">
                    <input className="w-full outline-none bg-transparent font-bold text-slate-900 placeholder:text-slate-500 mb-2" placeholder="Role Title" value={exp.title} onChange={(e) => updateExp(idx, 'title', e.target.value)} />
                    <input className="w-full outline-none bg-transparent font-semibold text-slate-600 placeholder:text-slate-400 text-xs" placeholder="Company Name" value={exp.company} onChange={(e) => updateExp(idx, 'company', e.target.value)} />
                  </td>
                  <td className="p-3 border-r border-slate-300 align-top pt-4">
                    <input className="w-full outline-none bg-transparent font-bold text-slate-900 placeholder:text-slate-500" placeholder="Duration" value={exp.duration} onChange={(e) => updateExp(idx, 'duration', e.target.value)} />
                  </td>
                  <td className="p-3 border-r border-slate-300 bg-slate-50/30 align-top">
                    <div className="flex flex-col gap-2">
                      <select 
                        className="w-full bg-slate-200 border-none text-[10px] font-bold text-slate-700 rounded p-1 mb-1" 
                        value={exp.docType} 
                        // Cast the value to the specific Union Type to satisfy strict TS
                        onChange={(e) => updateExp(idx, 'docType', e.target.value as ExpEntry['docType'])}
                      >
                        <option value="exp_letter">Experience Letter</option>
                        <option value="offer_resign">Offer Letter + Resignation</option>
                      </select>

                      {exp.docType === 'exp_letter' && (
                        <label className="flex items-center gap-2 cursor-pointer text-blue-800 hover:text-blue-900 font-black p-1 border border-dashed border-blue-200 rounded bg-white">
                          <StatusIcon status={exp.expLetterStatus} />
                          <span className="text-[10px] truncate w-40">{exp.expLetterName || "Upload Exp Letter"}</span>
                          <input type="file" className="hidden" accept=".pdf" onChange={(e) => e.target.files?.[0] && handleExpUpload(idx, 'expLetter', e.target.files[0])} />
                        </label>
                      )}

                      {exp.docType === 'offer_resign' && (
                        <>
                          <label className="flex items-center gap-2 cursor-pointer text-blue-800 hover:text-blue-900 font-black p-1 border border-dashed border-blue-200 rounded bg-white">
                            <StatusIcon status={exp.offerLetterStatus} />
                            <span className="text-[10px] truncate w-40">{exp.offerLetterName || "Upload Offer Letter"}</span>
                            <input type="file" className="hidden" accept=".pdf" onChange={(e) => e.target.files?.[0] && handleExpUpload(idx, 'offerLetter', e.target.files[0])} />
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-blue-800 hover:text-blue-900 font-black p-1 border border-dashed border-blue-200 rounded bg-white">
                            <StatusIcon status={exp.resignationLetterStatus} />
                            <span className="text-[10px] truncate w-40">{exp.resignationLetterName || "Upload Resignation"}</span>
                            <input type="file" className="hidden" accept=".pdf" onChange={(e) => e.target.files?.[0] && handleExpUpload(idx, 'resignationLetter', e.target.files[0])} />
                          </label>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-center align-top pt-4">
                    <button onClick={() => setExps(exps.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addExpRow} className="w-full p-4 bg-slate-100 text-slate-900 font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-200 border-t-2 border-slate-300 uppercase tracking-widest"><Plus size={18} /> ADD ROW</button>
        </div>
      </section>

      {/* SAVE BUTTON */}
      <div className="sticky bottom-6 flex justify-end">
        <button onClick={handleSave} disabled={saving} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-xl disabled:opacity-50">
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save Documents
        </button>
      </div>

    </div>
  );
};