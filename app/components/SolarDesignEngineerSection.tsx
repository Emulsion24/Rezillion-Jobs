"use client";

import React, { useState } from 'react';
import { 
  Settings, 
  Trash2, 
  Cpu, 
  CheckCircle2, 
  Circle, 
  Briefcase, 
  BookOpen,
  FileText,
  Award
} from 'lucide-react';

// --- Types ---
type RoleKey = "design" | "om" | "project";

interface RowItem {
  id: string; // Unique ID for React Keys
  name: string;
  proficiency: string;
  experienceRef: string;
  certificateRef: string;
}

interface SectionData {
  title: string;
  tools: RowItem[];
  domain: RowItem[];
}

interface RoleStructure {
  id: RoleKey;
  label: string;
  description: string;
  sections: SectionData[];
}

// --- MOCK DATA ---
const UPLOADED_DOCS = {
  experiences: [
    { id: "E1", label: "E1 - Junior Solar Eng (2020-2021)" },
    { id: "E2", label: "E2 - Senior Analyst (2022-Present)" },
    { id: "E3", label: "E3 - Internship (2019)" }
  ],
  certificates: [
    { id: "C1", label: "C1 - PVsyst Certified Professional" },
    { id: "C2", label: "C2 - AutoCAD Associate" },
    { id: "C3", label: "C3 - PMP Certification" }
  ]
};

// --- Helper: Create Row with Unique ID ---
const createRow = (name: string = ""): RowItem => ({
  id: Math.random().toString(36).substr(2, 9), // Simple unique ID
  name,
  proficiency: "Beginner",
  experienceRef: "",
  certificateRef: ""
});

// --- CONSTANT DATA STRUCTURE ---
const ROLES_DB: Record<RoleKey, RoleStructure> = {
  design: {
    id: "design",
    label: "Solar Design Engineer",
    description: "Yield Assessment, Layout, Electrical Design & Economics",
    sections: [
      {
        title: "1. Yield Assessment",
        tools: [
          createRow("PVsyst"),
          createRow("SAM (System Advisor Model)"),
          createRow("Solarfarmer by DNV"),
          createRow("PlantPredict"),
          createRow("PVlib")
        ],
        domain: [
          createRow("Estimate annual energy generation"),
          createRow("Calculate CUF / PR / losses / clipping"),
          createRow("Compare scenarios, optimize yield vs cost")
        ]
      },
      {
        title: "2. Solar Resource Data Handling",
        tools: [
          createRow("Solargis"),
          createRow("Solcast"),
          createRow("NSRDB"),
          createRow("NREL Tools"),
          createRow("PVGIS"),
          createRow("CAMS")
        ],
        domain: [
          createRow("Validate data quality and representativity"),
          createRow("Ground measured data handling / cleaning"),
          createRow("Understanding of GHI, DNI, DHI, transposition")
        ]
      },
      {
        title: "3. Layout and Power Plant Design",
        tools: [createRow("AutoCAD"), createRow("SketchUp"), createRow("PVcase")],
        domain: [
          createRow("DC design: module config, tilt, orientation, spacing"),
          createRow("AC design: inverter sizing, grid, transformer, cabling"),
          createRow("Layout, SLD, stringing, BOS design"),
          createRow("Structural + wind load considerations")
        ]
      },
      {
        title: "4. Standards, Safety & Compliance",
        tools: [],
        domain: [
          createRow("Follow IEC / IS / IEEE / NEC / utility norms"),
          createRow("Earthing, lightning, protection coordination"),
          createRow("Net-metering / grid approval documentation")
        ]
      },
      {
        title: "5. Techno-Economic Evaluation",
        tools: [],
        domain: [
          createRow("Prepare BoM (Bill of Materials)"),
          createRow("Evaluate Capex vs performance"),
          createRow("Support LCOE / payback / financial assessment")
        ]
      },
      {
        title: "6. Execution Support & Documentation",
        tools: [],
        domain: [
          createRow("Issue-for-construction drawings"),
          createRow("Coordination with EPC/site team"),
          createRow("As-built updates, revisions, clarifications")
        ]
      },
      {
        title: "7. Performance & O&M",
        tools: [],
        domain: [
          createRow("Commissioning support"),
          createRow("Performance monitoring & troubleshooting")
        ]
      }
    ]
  },
  om: {
    id: "om",
    label: "Solar Commissioning & O&M Engineer",
    description: "Testing, SCADA, Maintenance & Safety",
    sections: [
      {
        title: "1. Commissioning & Testing",
        tools: [
          createRow("I-V Curve Tester"),
          createRow("IR Camera"),
          createRow("Multimeter / Megger / Clamp Meter")
        ],
        domain: [
          createRow("String & insulation testing"),
          createRow("Inverter / transformer commissioning"),
          createRow("Grid synchronization & PR verification")
        ]
      },
      {
        title: "2. Monitoring & SCADA",
        tools: [
          createRow("Plant SCADA"),
          createRow("OEM / 3rd party monitoring portals")
        ],
        domain: [
          createRow("Alarm handling & fault analysis"),
          createRow("Data validation & performance tracking")
        ]
      },
      {
        title: "3. Preventive & Corrective Maintenance",
        tools: [createRow("PVsyst Report Understanding")],
        domain: [
          createRow("Scheduled maintenance planning"),
          createRow("Fault detection & rectification (DC & AC)"),
          createRow("Component replacement & verification testing")
        ]
      },
      {
        title: "4. Safety & Compliance",
        tools: [],
        domain: [
          createRow("Standards compliance IEC / IS / NEC"),
          createRow("Earthing, lightning & electrical safety")
        ]
      },
      {
        title: "5. Documentation & Reporting",
        tools: [],
        domain: [
          createRow("Commissioning reports"),
          createRow("Maintenance logs"),
          createRow("Performance improvement recommendations")
        ]
      }
    ]
  },
  project: {
    id: "project",
    label: "Solar Project Planning / QA Engineer",
    description: "Scheduling, Procurement, Quality & Compliance",
    sections: [
      {
        title: "1. Project Planning & Scheduling",
        tools: [createRow("MS Project / Primavera"), createRow("Excel planning templates")],
        domain: [
          createRow("Project execution plan & timelines"),
          createRow("WBS, milestones & progress tracking")
        ]
      },
      {
        title: "2. Material & Resource Planning",
        tools: [],
        domain: [
          createRow("Procurement planning & delivery tracking"),
          createRow("Inventory & logistics coordination")
        ]
      },
      {
        title: "3. QA / QC Implementation",
        tools: [],
        domain: [
          createRow("QA/QC plan execution"),
          createRow("Material & workmanship inspections")
        ]
      },
      {
        title: "4. Standards & Compliance",
        tools: [],
        domain: [
          createRow("IEC / IS / NEC / utility norms"),
          createRow("HSE integration with quality")
        ]
      },
      {
        title: "5. Documentation & Coordination",
        tools: [],
        domain: [
          createRow("Progress & QA reporting"),
          createRow("Audit support"),
          createRow("Cross-team coordination")
        ]
      }
    ]
  }
};

// ----------------------------------------------------------------------
// SUB-COMPONENT: Handles the form logic.
// This component isolates the state so it can be reset via the 'key' prop.
// ----------------------------------------------------------------------
const RoleSpecificForm = ({ initialSections, roleLabel }: { initialSections: SectionData[], roleLabel: string }) => {
  // Initialize state directly from props (Deep Copy)
  const [activeSections, setActiveSections] = useState<SectionData[]>(() => 
    JSON.parse(JSON.stringify(initialSections))
  );

  // --- Handlers (Immutable Updates) ---
  const updateRow = (
    sectionIndex: number, 
    type: 'tools' | 'domain', 
    rowIndex: number, 
    field: keyof RowItem, 
    value: string
  ) => {
    setActiveSections(prev => prev.map((section, sIdx) => {
      if (sIdx !== sectionIndex) return section;
      return {
        ...section,
        [type]: section[type].map((row, rIdx) => 
          rIdx === rowIndex ? { ...row, [field]: value } : row
        )
      };
    }));
  };

  const addRow = (sectionIndex: number, type: 'tools' | 'domain') => {
    setActiveSections(prev => prev.map((section, sIdx) => {
      if (sIdx !== sectionIndex) return section;
      return {
        ...section,
        [type]: [...section[type], createRow("")]
      };
    }));
  };

  const removeRow = (sectionIndex: number, type: 'tools' | 'domain', rowIndex: number) => {
    setActiveSections(prev => prev.map((section, sIdx) => {
      if (sIdx !== sectionIndex) return section;
      return {
        ...section,
        [type]: section[type].filter((_, rIdx) => rIdx !== rowIndex)
      };
    }));
  };

  // --- Render Table Helper ---
  const RenderTable = ({ 
    sectionIndex, 
    type, 
    data, 
    title, 
    icon: Icon 
  }: { 
    sectionIndex: number, 
    type: 'tools' | 'domain', 
    data: RowItem[], 
    title: string, 
    icon: React.ElementType 
  }) => (
    <div className="mt-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className={type === 'tools' ? "text-blue-600" : "text-emerald-600"} />
        <h5 className={`text-xs font-black uppercase tracking-widest ${type === 'tools' ? "text-blue-700" : "text-emerald-700"}`}>
          {title}
        </h5>
      </div>
      
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-2 pl-4 w-1/3">Item Name</th>
                <th className="p-2 w-28 text-center">Proficiency</th>
                <th className="p-2 w-36 text-left">Experience Ref</th>
                <th className="p-2 w-36 text-left">Certificate Ref</th>
                <th className="p-2 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row, i) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-2 pl-4">
                    <input 
                      value={row.name}
                      onChange={(e) => updateRow(sectionIndex, type, i, 'name', e.target.value)}
                      className="w-full bg-transparent font-bold text-slate-700 text-xs outline-none"
                      placeholder="Enter name..."
                    />
                  </td>
                  <td className="p-2">
                    <select 
                      value={row.proficiency}
                      onChange={(e) => updateRow(sectionIndex, type, i, 'proficiency', e.target.value)}
                      className="w-full text-[10px] font-medium p-1 bg-white border border-slate-200 rounded text-slate-600 outline-none"
                    >
                      <option>Beginner</option><option>Intermediate</option><option>Proficient</option><option>Expert</option>
                    </select>
                  </td>
                  
                  <td className="p-2">
                    <div className="relative">
                        <FileText size={12} className="absolute left-2 top-2 text-slate-400" />
                        <select 
                          value={row.experienceRef}
                          onChange={(e) => updateRow(sectionIndex, type, i, 'experienceRef', e.target.value)}
                          className="w-full text-[10px] font-bold p-1 pl-6 bg-white border border-slate-200 rounded text-blue-700 outline-none cursor-pointer hover:border-blue-300"
                        >
                        <option value="">Select Exp Ref</option>
                        <option value="N/A">N/A</option>
                        {UPLOADED_DOCS.experiences.map((exp) => (
                            <option key={exp.id} value={exp.id}>{exp.id}</option>
                        ))}
                        </select>
                    </div>
                  </td>

                  <td className="p-2">
                    <div className="relative">
                        <Award size={12} className="absolute left-2 top-2 text-slate-400" />
                        <select 
                          value={row.certificateRef}
                          onChange={(e) => updateRow(sectionIndex, type, i, 'certificateRef', e.target.value)}
                          className="w-full text-[10px] font-bold p-1 pl-6 bg-white border border-slate-200 rounded text-emerald-700 outline-none cursor-pointer hover:border-emerald-300"
                        >
                        <option value="">Select Cert Ref</option>
                        <option value="No">No / N/A</option>
                        {UPLOADED_DOCS.certificates.map((cert) => (
                            <option key={cert.id} value={cert.id}>{cert.id}</option>
                        ))}
                        </select>
                    </div>
                  </td>

                  <td className="p-2 text-center">
                    <button onClick={() => removeRow(sectionIndex, type, i)} className="text-slate-300 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-xs text-slate-400 italic">No items listed.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button 
          onClick={() => addRow(sectionIndex, type)}
          className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-t border-slate-200"
        >
          + Add Row
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
          <div className="flex justify-between items-start">
              <div>
                <h3 className="text-blue-900 font-bold text-lg flex items-center gap-2">
                    <Briefcase size={20} />
                    {roleLabel}
                </h3>
                <p className="text-xs text-blue-700 mt-1">
                    Map your uploaded proofs (E1, E2... / C1, C2...) to the relevant skills below.
                </p>
              </div>
              <div className="text-[10px] bg-white p-2 rounded border border-blue-200 shadow-sm text-slate-500 hidden lg:block">
                  <p className="font-bold text-blue-800 mb-1">Available Uploads:</p>
                  <div className="flex gap-4">
                    <div>
                          <span className="font-bold">Experiences:</span> {UPLOADED_DOCS.experiences.map(e => e.id).join(', ')}
                    </div>
                    <div>
                          <span className="font-bold">Certificates:</span> {UPLOADED_DOCS.certificates.map(c => c.id).join(', ')}
                    </div>
                  </div>
              </div>
          </div>
      </div>

      {activeSections.map((section, idx) => (
        <div key={idx} className="border border-slate-300 rounded-xl p-5 bg-slate-50/50 shadow-sm">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
            <BookOpen size={16} className="text-slate-400" />
            {section.title}
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
            <RenderTable 
                sectionIndex={idx}
                type="tools"
                data={section.tools}
                title="Software & Tools"
                icon={Settings}
            />
            
            <RenderTable 
                sectionIndex={idx}
                type="domain"
                data={section.domain}
                title="Domain Expertise & Activities"
                icon={Cpu}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------
export const SolarDesignSection = () => {
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null);

  return (
    <section className="bg-white text-slate-900 rounded-2xl p-8 shadow-sm border border-slate-300 mb-12">
      
      {/* 1. Role Selection Header */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h2 className="text-2xl font-black italic mb-6 border-l-4 border-blue-600 pl-4 tracking-tight uppercase">
          2. PV System Engineering Role
        </h2>
        
        <label className="text-[11px] font-black text-blue-700 uppercase tracking-widest block mb-3">
          Select Your Target Role (Choose One)
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(ROLES_DB).map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <div 
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`cursor-pointer p-5 rounded-xl border-2 transition-all flex flex-col gap-2 relative group
                  ${isSelected 
                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-200 shadow-md" 
                    : "border-slate-200 hover:border-blue-300 bg-white"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-bold leading-tight ${isSelected ? "text-blue-900" : "text-slate-800"}`}>
                    {role.label}
                  </span>
                  {isSelected ? <CheckCircle2 size={18} className="text-blue-600" /> : <Circle size={18} className="text-slate-300" />}
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  {role.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Detailed Sections (Key-based Resetting) */}
      {selectedRole && (
        <RoleSpecificForm 
          key={selectedRole} // This triggers a fresh mount when role changes
          initialSections={ROLES_DB[selectedRole].sections} 
          roleLabel={ROLES_DB[selectedRole].label}
        />
      )}
    </section>
  );
};