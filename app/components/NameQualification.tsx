"use client";

import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, Languages } from 'lucide-react';

interface Qualification {
  name: string;
  institute: string;
  university: string;
  year: string;
  percentage: string;
}

// Updated interface to support multiple boolean selections
interface LanguageEntry {
  language: string;
  read: boolean;
  write: boolean;
  speak: boolean;
  native: boolean;
}

export const NameQualification = () => {
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  
  // Updated initial state structure for checkboxes
  const [languages, setLanguages] = useState<LanguageEntry[]>([
    { language: '', read: false, write: false, speak: false, native: false }
  ]);

  // --- Handlers for Qualifications ---
  const addQualRow = () => {
    setQualifications([...qualifications, { name: '', institute: '', university: '', year: '', percentage: '' }]);
  };

  const updateQual = (index: number, field: keyof Qualification, value: string) => {
    const updatedQuals = [...qualifications];
    updatedQuals[index][field] = value;
    setQualifications(updatedQuals);
  };

  const removeQual = (index: number) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  // --- Handlers for Languages ---
  // Updated to add object with boolean flags
  const addLanguageRow = () => setLanguages([...languages, { language: '', read: false, write: false, speak: false, native: false }]);
  
  // Updated handler to accept boolean or string values
const updateLanguage = <K extends keyof LanguageEntry>(
  index: number, 
  field: K, 
  value: LanguageEntry[K]
) => {
  setLanguages(prev => prev.map((lang, i) => 
    // Return a new object for the row we are updating
    i === index ? { ...lang, [field]: value } : lang
  ));
};
  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 mb-8">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
        
        {/* 1. Name Input Section */}
        <div className="p-6 bg-slate-100 border-b border-slate-300">
          <div className="flex items-center gap-3 text-slate-900 mb-6">
            <GraduationCap size={24} className="text-blue-700" />
            <h2 className="text-xl font-bold italic underline underline-offset-4 decoration-blue-500">
              1. Personal Details & Qualifications
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div>
              <label className="text-[11px] font-black uppercase text-slate-700 mb-1.5 block tracking-wider">Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Ahan Kumar Ghosh" 
                className="w-full p-3 border-2 border-slate-400 rounded-xl focus:border-blue-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-500 bg-white"
              />
            </div>
     
          </div>
        </div>

        {/* 2. Qualifications Table */}
        <div className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-200 text-slate-800 uppercase text-[10px] font-black tracking-wider border-b border-slate-300">
                <tr>
                  <th className="p-4 border-r border-slate-300 text-center w-12">#</th>
                  <th className="p-4 border-r border-slate-300">Qualification</th>
                  <th className="p-4 border-r border-slate-300">Institution</th>
                  <th className="p-4 border-r border-slate-300">University</th>
                  <th className="p-4 border-r border-slate-300 w-24 text-center">Year</th>
                  <th className="p-4 border-r border-slate-300 w-24 text-center">Result</th>
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {qualifications.map((q, i) => (
                  <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="p-4 border-r border-slate-300 text-center font-bold text-slate-900 bg-slate-50">{i + 1}</td>
                    <td className="p-4 border-r border-slate-300">
                      <input className="w-full bg-transparent outline-none font-semibold text-slate-900 placeholder:text-slate-400" placeholder="e.g. B.Tech" value={q.name} onChange={(e) => updateQual(i, 'name', e.target.value)} />
                    </td>
                    <td className="p-4 border-r border-slate-300">
                      <input className="w-full bg-transparent outline-none font-semibold text-slate-900 placeholder:text-slate-400" placeholder="College Name" value={q.institute} onChange={(e) => updateQual(i, 'institute', e.target.value)} />
                    </td>
                    <td className="p-4 border-r border-slate-300">
                      <input className="w-full bg-transparent outline-none font-semibold text-slate-900 placeholder:text-slate-400" placeholder="University" value={q.university} onChange={(e) => updateQual(i, 'university', e.target.value)} />
                    </td>
                    <td className="p-4 border-r border-slate-300 text-center">
                      <input className="w-full bg-transparent outline-none text-center font-bold text-slate-900 placeholder:text-slate-400" placeholder="YYYY" value={q.year} onChange={(e) => updateQual(i, 'year', e.target.value)} />
                    </td>
                    <td className="p-4 border-r border-slate-300 text-center">
                      <input className="w-full bg-transparent outline-none text-center font-black text-blue-800 placeholder:text-slate-400" placeholder="%" value={q.percentage} onChange={(e) => updateQual(i, 'percentage', e.target.value)} />
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => removeQual(i)} className="text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={addQualRow} className="w-full p-3 bg-slate-100 text-slate-900 font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-200 border-t border-slate-300 transition-all uppercase tracking-widest">
            <Plus size={16} strokeWidth={3} /> Add Qualification Row
          </button>
        </div>
      </div>

      {/* 3. Languages Section */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="p-4 bg-blue-50 border-b border-slate-300 flex items-center gap-2 text-slate-900">
          <Languages size={20} className="text-blue-700" />
          <h3 className="font-bold italic text-sm uppercase tracking-tight">Languages Known</h3>
        </div>
        <div className="p-0">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 text-slate-700 text-[10px] font-black uppercase border-b border-slate-300">
              <tr>
                <th className="p-3 border-r border-slate-300 text-left w-1/4">Language</th>
                <th className="p-3 border-r border-slate-300 text-left">Proficiency (Check all that apply)</th>
                <th className="p-3 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {languages.map((lang, idx) => (
                <tr key={idx} className="bg-white">
                  <td className="p-3 border-r border-slate-300">
                    <input 
                      type="text" 
                      placeholder="e.g. English"
                      className="w-full outline-none font-bold text-slate-900 placeholder:text-slate-500"
                      value={lang.language}
                      onChange={(e) => updateLanguage(idx, 'language', e.target.value)}
                    />
                  </td>
                  <td className="p-3 border-r border-slate-300 bg-blue-50/20">
                    {/* Checkbox Group */}
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                        <input 
                          type="checkbox" 
                          checked={lang.read} 
                          onChange={(e) => updateLanguage(idx, 'read', e.target.checked)}
                          className="w-4 h-4 accent-blue-700 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-700">Read</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                        <input 
                          type="checkbox" 
                          checked={lang.write} 
                          onChange={(e) => updateLanguage(idx, 'write', e.target.checked)}
                          className="w-4 h-4 accent-blue-700 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-700">Write</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                        <input 
                          type="checkbox" 
                          checked={lang.speak} 
                          onChange={(e) => updateLanguage(idx, 'speak', e.target.checked)}
                          className="w-4 h-4 accent-blue-700 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-700">Speak</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 border-l border-slate-300 pl-4">
                        <input 
                          type="checkbox" 
                          checked={lang.native} 
                          onChange={(e) => updateLanguage(idx, 'native', e.target.checked)}
                          className="w-4 h-4 accent-blue-700 cursor-pointer"
                        />
                        <span className="text-xs font-black italic text-blue-800">Native</span>
                      </label>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => removeLanguage(idx)} className="text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addLanguageRow} className="w-full p-3 bg-slate-50 text-blue-700 font-black text-[10px] flex items-center justify-center gap-2 hover:bg-blue-50 border-t border-slate-300 transition-all uppercase tracking-widest">
            <Plus size={14} strokeWidth={3} /> Add Language Row
          </button>
        </div>
      </div>
    </div>
  );
};