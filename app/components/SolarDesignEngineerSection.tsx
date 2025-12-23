"use client";

import React, { useState } from 'react';
import { Settings, Trash2, Cpu, CheckCircle2 } from 'lucide-react';

interface ToolEntry {
  name: string;
  proficiency: string;
  experience: string;
  certificate: string;
}

interface CapabilityEntry {
  name: string;
  proficiency: string;
  experience: string;
  certificate: string;
}

const ROLE_DATA = {
  design: {
    label: "Solar Design & Analysis Engineer",
    software: ["PVsyst", "AutoCAD", "SketchUp", "MS Excel"],
    caps: ["PV Semiconductor physics", "System simulation", "Loss breakdown", "Shading & spacing", "Technical reports", "Drawing interpretation"]
  },
  om: {
    label: "Solar Commissioning / O&M Engineer",
    software: ["Data loggers", "SCADA platforms", "PVsyst", "MS Excel (Analysis)", "Python"],
    caps: ["Commissioning testing", "Troubleshooting", "Performance monitoring", "Preventive maintenance", "Vendor coordination"]
  },
  project: {
    label: "Project Planning / QA / Compliance",
    software: ["MS Project", "Primavera", "AutoCAD (Reading)", "IV curve testing", "Thermal imaging (Testing)", "GIS / ArcGIS"],
    caps: ["Project tracking", "Risk management", "QA/QC processes", "Compliance (IEC/MNRE)", "Site execution planning", "Safety discipline"]
  }
};

export const SolarDesignSection = () => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [software, setSoftware] = useState<ToolEntry[]>([]);
  const [capabilities, setCapabilities] = useState<CapabilityEntry[]>([]);

  // Helper to sync software/caps based on active roles
  const syncDataFromRoles = (currentRoles: string[]) => {
    const newSoftware: ToolEntry[] = [];
    const newCaps: CapabilityEntry[] = [];

    currentRoles.forEach(role => {
      const data = ROLE_DATA[role as keyof typeof ROLE_DATA];
      
      data.software.forEach(name => {
        if (!newSoftware.find(s => s.name === name)) {
          newSoftware.push({ name, proficiency: "Beginner", experience: "N/A", certificate: "N/A" });
        }
      });
      
      data.caps.forEach(name => {
        if (!newCaps.find(c => c.name === name)) {
          newCaps.push({ name, proficiency: "Beginner", experience: "N/A", certificate: "N/A" });
        }
      });
    });

    setSoftware(newSoftware);
    setCapabilities(newCaps);
  };

  const handleRoleToggle = (roleKey: string) => {
    const nextRoles = selectedRoles.includes(roleKey) 
      ? selectedRoles.filter(r => r !== roleKey) 
      : [...selectedRoles, roleKey];
    
    setSelectedRoles(nextRoles);
    syncDataFromRoles(nextRoles); // Sync state immediately in the event handler
  };

  const selectAllRoles = () => {
    const allKeys = Object.keys(ROLE_DATA);
    const nextRoles = selectedRoles.length === allKeys.length ? [] : allKeys;
    
    setSelectedRoles(nextRoles);
    syncDataFromRoles(nextRoles);
  };

  const updateSoftware = (index: number, field: keyof ToolEntry, value: string) => {
    const newList = [...software];
    newList[index] = { ...newList[index], [field]: value };
    setSoftware(newList);
  };

  const updateCap = (index: number, field: keyof CapabilityEntry, value: string) => {
    const newList = [...capabilities];
    newList[index] = { ...newList[index], [field]: value };
    setCapabilities(newList);
  };

  return (
    <section className="bg-white text-slate-900 rounded-2xl p-8 shadow-sm border border-slate-300 mb-12">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h2 className="text-2xl font-black italic mb-6 border-l-4 border-blue-600 pl-4 tracking-tight uppercase">
          PV System Engineering - Preferences
        </h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-[11px] font-black text-blue-700 uppercase tracking-widest">
              Select Preferred Job Roles (Multiple)
            </label>
            <button 
              onClick={selectAllRoles}
              className="text-[10px] font-bold text-blue-600 hover:underline uppercase"
            >
              {selectedRoles.length === 3 ? "Deselect All" : "Select All Roles"}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(ROLE_DATA).map(([key, role]) => (
              <div 
                key={key}
                onClick={() => handleRoleToggle(key)}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  selectedRoles.includes(key) 
                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedRoles.includes(key) ? "bg-blue-600 border-blue-600" : "bg-white border-slate-400"}`}>
                  {selectedRoles.includes(key) && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <span className={`text-xs font-bold ${selectedRoles.includes(key) ? "text-blue-900" : "text-slate-600"}`}>
                  {role.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedRoles.length > 0 && (
        <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
          {/* Software Section */}
          <div className="space-y-4">
            <h4 className="text-blue-700 font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <Settings size={16} /> Software / Tools Proficiency
            </h4>
            <div className="bg-white rounded-2xl border border-slate-300 overflow-x-auto shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-[10px] font-black uppercase text-slate-600 border-b border-slate-300">
                  <tr>
                    <th className="p-3 text-left">Tool Name</th>
                    <th className="p-3 text-center w-32">Proficiency</th>
                    <th className="p-3 text-center w-32">Experience</th>
                    <th className="p-3 text-center w-32">Certificate</th>
                    <th className="p-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {software.map((item, i) => (
                    <tr key={i} className="hover:bg-blue-50/50">
                      <td className="p-2">
                        <input 
                          value={item.name} 
                          onChange={(e) => updateSoftware(i, 'name', e.target.value)} 
                          className="bg-transparent w-full font-bold px-2 outline-none" 
                        />
                      </td>
                      <td className="p-2">
                        <select 
                          value={item.proficiency} 
                          onChange={(e) => updateSoftware(i, 'proficiency', e.target.value)} 
                          className="w-full text-[11px] font-bold p-1 border rounded"
                        >
                          <option>Beginner</option><option>Moderate</option><option>Proficient</option><option>Expert</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select 
                          value={item.experience} 
                          onChange={(e) => updateSoftware(i, 'experience', e.target.value)} 
                          className="w-full text-[11px] font-bold p-1 border rounded"
                        >
                          <option>N/A</option><option>E1</option><option>E2</option><option>E3</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select 
                          value={item.certificate} 
                          onChange={(e) => updateSoftware(i, 'certificate', e.target.value)} 
                          className="w-full text-[11px] font-bold p-1 border rounded"
                        >
                          <option>N/A</option><option>C1</option><option>C2</option><option>C3</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <button 
                          onClick={() => setSoftware(software.filter((_, idx) => idx !== i))} 
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button 
                onClick={() => setSoftware([...software, { name: "", proficiency: "Beginner", experience: "N/A", certificate: "N/A" }])} 
                className="w-full p-3 bg-slate-50 text-[11px] font-black text-blue-700 uppercase"
              >
                + Add Tool
              </button>
            </div>
          </div>

          {/* Capability Section */}
          <div className="space-y-4">
            <h4 className="text-indigo-700 font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <Cpu size={16} /> Core Capabilities
            </h4>
            <div className="bg-white rounded-2xl border border-slate-300 overflow-x-auto shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-[10px] font-black uppercase text-slate-600 border-b border-slate-300">
                  <tr>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-center w-32">Proficiency</th>
                    <th className="p-3 text-center w-32">Experience</th>
                    <th className="p-3 text-center w-32">Certificate</th>
                    <th className="p-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {capabilities.map((cap, i) => (
                    <tr key={i} className="hover:bg-indigo-50/30">
                      <td className="p-3">
                        <textarea 
                          value={cap.name} 
                          onChange={(e) => updateCap(i, 'name', e.target.value)} 
                          className="bg-transparent w-full font-bold px-2 resize-none outline-none" 
                          rows={1} 
                        />
                      </td>
                      <td className="p-3">
                        <select 
                          value={cap.proficiency} 
                          onChange={(e) => updateCap(i, 'proficiency', e.target.value)} 
                          className="w-full text-[11px] font-bold p-1 border rounded"
                        >
                          <option>Beginner</option><option>Moderate</option><option>Proficient</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <select 
                          value={cap.experience} 
                          onChange={(e) => updateCap(i, 'experience', e.target.value)} 
                          className="w-full text-[11px] font-bold p-1 border rounded"
                        >
                          <option>N/A</option><option>E1</option><option>E2</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <select 
                          value={cap.certificate} 
                          onChange={(e) => updateCap(i, 'certificate', e.target.value)} 
                          className="w-full text-[11px] font-bold p-1 border rounded"
                        >
                          <option>N/A</option><option>C1</option><option>C2</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <button 
                          onClick={() => setCapabilities(capabilities.filter((_, idx) => idx !== i))} 
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button 
                onClick={() => setCapabilities([...capabilities, { name: "", proficiency: "Beginner", experience: "N/A", certificate: "N/A" }])} 
                className="w-full p-3 bg-slate-50 text-xs font-black text-indigo-700 uppercase"
              >
                + Add Capability
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};