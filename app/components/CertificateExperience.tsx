"use client";

import React, { useState } from 'react';
import { Award, Briefcase, Plus, Trash2, Upload, FileText } from 'lucide-react';

interface CertEntry {
  name: string;
  fileName: string;
  link?: string; // Added optional link to match your UI usage
}

interface ExpEntry {
  title: string;
  company: string;
  duration: string;
  // New fields for documents
  docType: 'exp_letter' | 'offer_resign';
  expLetterName: string;
  offerLetterName: string;
  resignationLetterName: string;
}

export const CertificateExperience = () => {
  const [certs, setCerts] = useState<CertEntry[]>([]);
  const [exps, setExps] = useState<ExpEntry[]>([]);

  const addCertRow = () => setCerts([...certs, { name: '', fileName: '', link: '' }]);
  const updateCert = (index: number, field: keyof CertEntry, value: string) => {
    const newCerts = [...certs];
    newCerts[index][field] = value as never;
    setCerts(newCerts);
  };

  // Initialize new row with default docType 'exp_letter'
  const addExpRow = () => setExps([...exps, { 
    title: '', 
    company: '', 
    duration: '', 
    docType: 'exp_letter',
    expLetterName: '',
    offerLetterName: '',
    resignationLetterName: ''
  }]);

  const updateExp = (index: number, field: keyof ExpEntry, value: string) => {
    const newExps = [...exps];
    newExps[index][field] = value as never;
    setExps(newExps);
  };

  return (
    <div className="space-y-10 mb-8">
      
      {/* 3. CERTIFICATES SECTION */}
      <section className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-100 border-b border-slate-300 flex items-center gap-2 text-slate-900">
          <Award size={20} className="text-pink-600" />
          <h3 className="font-bold italic underline underline-offset-4 decoration-pink-500">
            3. Upload Certificates
          </h3>
        </div>
        <div className="p-0">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-200 text-slate-800 uppercase text-[10px] font-black tracking-wider border-b border-slate-300">
              <tr>
                <th className="p-3 border-r border-slate-300 text-center w-14">ID</th>
                <th className="p-3 border-r border-slate-300 text-left">Certificate Name</th>
                <th className="p-3 border-r border-slate-300 text-left w-60">Attachment (PDF)</th>
                <th className="p-3 border-r border-slate-300 text-left">Verify Link</th>
                <th className="p-3 text-center w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {certs.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-600 font-medium italic">No certificates added.</td></tr>
              ) : (
                certs.map((cert, idx) => (
                  <tr key={idx} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="p-3 border-r border-slate-300 text-center font-bold text-pink-700 bg-pink-50/30">C{idx + 1}</td>
                    <td className="p-3 border-r border-slate-300">
                      <input 
                        type="text" 
                        placeholder="e.g. AutoCAD Training"
                        className="w-full outline-none bg-transparent font-bold text-slate-900 placeholder:text-slate-500"
                        value={cert.name}
                        onChange={(e) => updateCert(idx, 'name', e.target.value)}
                      />
                    </td>
                    <td className="p-3 border-r border-slate-300 bg-slate-50/50">
                      <label className="flex items-center gap-2 cursor-pointer text-blue-800 hover:text-blue-900 font-black">
                        <Upload size={16} strokeWidth={3} />
                        <span className="text-[11px] truncate w-48 block">
                          {cert.fileName || "SELECT PDF FILE"}
                        </span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".pdf"
                          onChange={(e) => updateCert(idx, 'fileName', e.target.files?.[0]?.name || '')}
                        />
                      </label>
                    </td>
                    <td className="p-3 border-r border-slate-300">
                      <input 
                        type="text" 
                        placeholder="https://verification.link"
                        className="w-full outline-none bg-transparent font-bold text-slate-900 placeholder:text-slate-500"
                        value={cert.link}
                        onChange={(e) => updateCert(idx, 'link', e.target.value)}
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button onClick={() => setCerts(certs.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <button onClick={addCertRow} className="w-full p-4 bg-slate-100 text-slate-900 font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-200 border-t-2 border-slate-300 transition-all uppercase tracking-widest">
            <Plus size={18} strokeWidth={3} /> Add Certificate Row
          </button>
        </div>
      </section>

      {/* 4. EXPERIENCE SECTION */}
      <section className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-100 border-b border-slate-300 flex items-center gap-2 text-slate-900">
          <Briefcase size={20} className="text-emerald-600" />
          <h3 className="font-bold italic underline underline-offset-4 decoration-emerald-500">
            4. Experience 
          </h3>
        </div>
        <div className="p-0">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-200 text-slate-800 uppercase text-[10px] font-black tracking-wider border-b border-slate-300">
              <tr>
                <th className="p-3 border-r border-slate-300 text-center w-14">ID</th>
                <th className="p-3 border-r border-slate-300 text-left">Role / Title</th>
                <th className="p-3 border-r border-slate-300 text-left">Organization</th>
                <th className="p-3 border-r border-slate-300 text-left w-32">Duration</th>
                {/* NEW COLUMN FOR DOCUMENTS */}
                <th className="p-3 border-r border-slate-300 text-left w-72">Proof Documents</th>
                <th className="p-3 text-center w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {exps.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-600 font-medium italic">No experience rows added.</td></tr>
              ) : (
                exps.map((exp, idx) => (
                  <tr key={idx} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="p-3 border-r border-slate-300 text-center font-bold text-emerald-700 bg-emerald-50/30 align-top pt-4">E{idx + 1}</td>
                    <td className="p-3 border-r border-slate-300 align-top pt-4">
                      <input 
                        type="text" 
                        placeholder="e.g. Solar Intern"
                        className="w-full outline-none bg-transparent font-bold text-slate-900 placeholder:text-slate-500"
                        value={exp.title}
                        onChange={(e) => updateExp(idx, 'title', e.target.value)}
                      />
                    </td>
                    <td className="p-3 border-r border-slate-300 align-top pt-4">
                      <input 
                        type="text" 
                        placeholder="e.g. Dipak Solar"
                        className="w-full outline-none bg-transparent font-bold text-slate-900 placeholder:text-slate-500"
                        value={exp.company}
                        onChange={(e) => updateExp(idx, 'company', e.target.value)}
                      />
                    </td>
                    <td className="p-3 border-r border-slate-300 align-top pt-4">
                      <input 
                        type="text" 
                        placeholder="e.g. 6 Months"
                        className="w-full outline-none bg-transparent font-bold text-slate-900 placeholder:text-slate-500"
                        value={exp.duration}
                        onChange={(e) => updateExp(idx, 'duration', e.target.value)}
                      />
                    </td>
                    
                    {/* NEW DOCUMENT UPLOAD CELL */}
                    <td className="p-3 border-r border-slate-300 bg-slate-50/30 align-top">
                      <div className="flex flex-col gap-2">
                        {/* Dropdown to select type */}
                        <select 
                          className="w-full bg-slate-200 border-none text-[10px] font-bold text-slate-700 rounded p-1 mb-1 cursor-pointer focus:ring-0"
                          value={exp.docType}
                          onChange={(e) => updateExp(idx, 'docType', e.target.value)}
                        >
                          <option value="exp_letter">Experience Letter</option>
                          <option value="offer_resign">Offer Letter + Resignation</option>
                        </select>

                        {/* Condition 1: Experience Letter */}
                        {exp.docType === 'exp_letter' && (
                          <label className="flex items-center gap-2 cursor-pointer text-blue-800 hover:text-blue-900 font-black p-1 border border-dashed border-blue-200 rounded bg-white">
                            <Upload size={14} strokeWidth={3} />
                            <span className="text-[10px] truncate w-40">
                              {exp.expLetterName || "Upload Experience Letter"}
                            </span>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept=".pdf"
                              onChange={(e) => updateExp(idx, 'expLetterName', e.target.files?.[0]?.name || '')}
                            />
                          </label>
                        )}

                        {/* Condition 2: Offer + Resignation */}
                        {exp.docType === 'offer_resign' && (
                          <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer text-blue-800 hover:text-blue-900 font-black p-1 border border-dashed border-blue-200 rounded bg-white">
                              <FileText size={14} strokeWidth={3} />
                              <span className="text-[10px] truncate w-40">
                                {exp.offerLetterName || "Upload Offer Letter"}
                              </span>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept=".pdf"
                                onChange={(e) => updateExp(idx, 'offerLetterName', e.target.files?.[0]?.name || '')}
                              />
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-blue-800 hover:text-blue-900 font-black p-1 border border-dashed border-blue-200 rounded bg-white">
                              <FileText size={14} strokeWidth={3} />
                              <span className="text-[10px] truncate w-40">
                                {exp.resignationLetterName || "Upload Resignation"}
                              </span>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept=".pdf"
                                onChange={(e) => updateExp(idx, 'resignationLetterName', e.target.files?.[0]?.name || '')}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-3 text-center align-top pt-4">
                      <button onClick={() => setExps(exps.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <button onClick={addExpRow} className="w-full p-4 bg-slate-100 text-slate-900 font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-200 border-t-2 border-slate-300 transition-all uppercase tracking-widest">
            <Plus size={18} strokeWidth={3} /> Add Experience Row
          </button>
        </div>
      </section>

    </div>
  );
};