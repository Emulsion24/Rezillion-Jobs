"use client";

import React, { useState } from 'react';
import { 
  Settings, 
  Trash2, 
  Cpu, 
  CheckCircle2, 
  Briefcase, 
  BookOpen,
  FileText,
  Award,
  ArrowLeft,
  ChevronRight,
  Plus,
  X
} from 'lucide-react';

// --- Types ---
type RoleKey = "design" | "om" | "project" | "electrical" | "mechanical";
type ViewState = "root" | "pv_subroles" | "form";

interface RowItem {
  id: string; // Unique ID for React Keys
  name: string;
  proficiency: string;
  experienceRef: string[];
  certificateRef: string[];
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
  id: Math.random().toString(36).substr(2, 9),
  name,
  proficiency: "Beginner",
  experienceRef: [],
  certificateRef: []
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
  },
  electrical: {
    id: "electrical",
    label: "Electrical Technician / Engineer",
    description: "ITI / Diploma / Exp. - Wiring, Inverters, Testing & Safety",
    sections: [
      {
        title: "1. DC/AC Wiring and Connections",
        tools: [],
        domain: [
          createRow("Series/parallel wiring of solar panels"),
          createRow("Cable routing and proper termination"),
          createRow("Avoiding losses and hazards")
        ]
      },
      {
        title: "2. Inverter Installation & Sync",
        tools: [],
        domain: [
          createRow("Mounting and connecting inverters"),
          createRow("Configuring string/hybrid inverters"),
          createRow("Grid synchronization / Off-grid setup")
        ]
      },
      {
        title: "3. System Testing and Diagnosis",
        tools: [
          createRow("Multimeters"),
          createRow("Clamp Meters"),
          createRow("Insulation Testers")
        ],
        domain: [
          createRow("Check voltage, current, grounding"),
          createRow("Isolate faults and diagnosis")
        ]
      },
      {
        title: "4. Earthing & Protection",
        tools: [],
        domain: [
          createRow("Installing grounding rods"),
          createRow("Lightning arresters installation"),
          createRow("Surge Protection Device (SPD) installation")
        ]
      }
    ]
  },
  mechanical: {
    id: "mechanical",
    label: "Mechanical / Civil Technician",
    description: "ITI / Diploma / Exp. - Structures, Alignment, Civil Works",
    sections: [
      {
        title: "1. Structure Assembly & Erection",
        tools: [],
        domain: [
          createRow("Fabricating/fixing rails and brackets"),
          createRow("Structure assembly for rooftop/ground-mount"),
          createRow("Welding steel beams, columns, brackets")
        ]
      },
      {
        title: "2. Panel Fixing and Alignment",
        tools: [],
        domain: [
          createRow("Clamping modules securely"),
          createRow("Ensuring optimal tilt and azimuth"),
          createRow("Checking panel orientation")
        ]
      },
      {
        title: "3. Foundation and Civil Works",
        tools: [
          createRow("Laser Levels"),
          createRow("GPS Devices"),
          createRow("Theodolites")
        ],
        domain: [
          createRow("Concrete piling / Ballast placement"),
          createRow("Screw anchoring for stability"),
          createRow("Pile alignment and leveling"),
          createRow("Ensuring verticality and spacing")
        ]
      },
      {
        title: "4. Cable Routing & Safety",
        tools: [
          createRow("Harnesses"),
          createRow("Fall Arrest Systems"),
          createRow("Ladders / Rigging Gear")
        ],
        domain: [
          createRow("Cable tray and conduit installation"),
          createRow("Mechanical routing of trays"),
          createRow("Height safety and rigging"),
          createRow("Working on elevated structures")
        ]
      }
    ]
  }
};

// ----------------------------------------------------------------------
// HELPER COMPONENT: MULTI-SELECT BADGES
// ----------------------------------------------------------------------
const MultiSelectCell = ({ 
  options, 
  selected, 
  onChange, 
  placeholder,
  colorClass 
}: { 
  options: {id: string, label: string}[], 
  selected: string[], 
  onChange: (val: string[]) => void, 
  placeholder: string,
  colorClass: string 
}) => {
  
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val && !selected.includes(val)) {
      onChange([...selected, val]);
    }
    // Reset select to default immediately
    e.target.value = "";
  };

  const removeId = (idToRemove: string) => {
    onChange(selected.filter(id => id !== idToRemove));
  };

  return (
    <div className="flex flex-col gap-1.5">
      {/* 1. Selected Badges Area */}
      <div className="flex flex-wrap gap-1 min-h-[24px]">
        {selected.length > 0 ? (
          selected.map(id => (
            <span 
              key={id} 
              onClick={() => removeId(id)}
              className={`
                inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border cursor-pointer hover:opacity-75 transition-opacity
                ${colorClass}
              `}
            >
              {id}
              <X size={8} />
            </span>
          ))
        ) : (
          <span className="text-[10px] text-slate-300 italic p-1">None</span>
        )}
      </div>

      {/* 2. Add Button / Hidden Select */}
      <div className="relative group w-full">
        <select
          onChange={handleSelect}
          className="appearance-none w-full text-[10px] font-bold p-1 bg-slate-50 border border-slate-200 rounded text-slate-600 outline-none cursor-pointer hover:border-blue-300 pr-4"
          defaultValue=""
        >
          <option value="" disabled>+ Add {placeholder}</option>
          {options.map(opt => (
            <option 
              key={opt.id} 
              value={opt.id} 
              disabled={selected.includes(opt.id)} // Disable if already selected
            >
              {opt.id}
            </option>
          ))}
        </select>
        <Plus size={10} className="absolute right-2 top-2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// SUB-COMPONENT: The Form
// ----------------------------------------------------------------------
const RoleSpecificForm = ({ initialSections, roleLabel }: { initialSections: SectionData[], roleLabel: string }) => {
  const [activeSections, setActiveSections] = useState<SectionData[]>(() => 
    JSON.parse(JSON.stringify(initialSections))
  );

  const updateRow = (
    sectionIndex: number, 
    type: 'tools' | 'domain', 
    rowIndex: number, 
    field: keyof RowItem, 
    value: string | string[] 
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
                <th className="p-2 w-36 text-left">Experience Ref(s)</th>
                <th className="p-2 w-36 text-left">Certificate Ref(s)</th>
                <th className="p-2 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row, i) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-2 pl-4 align-top">
                    <input 
                      value={row.name}
                      onChange={(e) => updateRow(sectionIndex, type, i, 'name', e.target.value)}
                      className="w-full bg-transparent font-bold text-slate-700 text-xs outline-none py-1.5"
                      placeholder="Enter name..."
                    />
                  </td>
                  <td className="p-2 align-top">
                    <select 
                      value={row.proficiency}
                      onChange={(e) => updateRow(sectionIndex, type, i, 'proficiency', e.target.value)}
                      className="w-full text-[10px] font-medium p-1 bg-white border border-slate-200 rounded text-slate-600 outline-none"
                    >
                      <option>Beginner</option><option>Intermediate</option><option>Proficient</option><option>Expert</option>
                    </select>
                  </td>
                  <td className="p-2 align-top">
                    <MultiSelectCell 
                      options={UPLOADED_DOCS.experiences}
                      selected={row.experienceRef}
                      placeholder="Exp"
                      colorClass="bg-blue-50 text-blue-700 border-blue-200"
                      onChange={(newVal) => updateRow(sectionIndex, type, i, 'experienceRef', newVal)}
                    />
                  </td>
                  <td className="p-2 align-top">
                    <MultiSelectCell 
                      options={UPLOADED_DOCS.certificates}
                      selected={row.certificateRef}
                      placeholder="Cert"
                      colorClass="bg-emerald-50 text-emerald-700 border-emerald-200"
                      onChange={(newVal) => updateRow(sectionIndex, type, i, 'certificateRef', newVal)}
                    />
                  </td>
                  <td className="p-2 text-center align-top pt-3">
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
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-blue-900 font-bold text-lg flex items-center gap-2">
                <Briefcase size={20} />
                {roleLabel}
            </h3>
            <p className="text-xs text-blue-700 mt-1">
                Map your uploaded proofs to the relevant skills below. You can select multiple proofs per item.
            </p>
          </div>
          <div className="hidden md:flex gap-3 text-[10px] text-slate-500">
             <span className="bg-white px-2 py-1 rounded border shadow-sm">Exp: {UPLOADED_DOCS.experiences.length} Docs</span>
             <span className="bg-white px-2 py-1 rounded border shadow-sm">Cert: {UPLOADED_DOCS.certificates.length} Docs</span>
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
                type="domain"
                data={section.domain}
                title="1. Domain Expertise & Activities"
                icon={Cpu}
            />
            <RenderTable 
                sectionIndex={idx}
                type="tools"
                data={section.tools}
                title="2. Software & Tools"
                icon={Settings}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ----------------------------------------------------------------------
// COMPONENT: Selection Card (Moved OUTSIDE to fix render error)
// ----------------------------------------------------------------------
const SelectionCard = ({ 
  onClick, 
  icon: Icon, 
  title, 
  description, 
  active = false,
  colorClass = "blue"
}: { 
  onClick: () => void, 
  icon: React.ElementType, // Fixed: Using React.ElementType instead of any
  title: string, 
  description: string,
  active?: boolean,
  colorClass?: string
}) => (
  <div 
    onClick={onClick}
    className={`
      group cursor-pointer p-6 rounded-xl border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all bg-white flex flex-col justify-between h-48
      ${active ? `ring-2 ring-${colorClass}-500 bg-${colorClass}-50` : `hover:border-${colorClass}-400`}
    `}
  >
    <div>
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 bg-${colorClass}-50 rounded-lg text-${colorClass}-600 group-hover:bg-${colorClass}-600 group-hover:text-white transition-colors`}>
          <Icon size={24} />
        </div>
        <ChevronRight className={`text-slate-300 group-hover:text-${colorClass}-500 transition-colors`} />
      </div>
      <h3 className={`text-lg font-bold text-slate-800 group-hover:text-${colorClass}-700 mb-2`}>
        {title}
      </h3>
      <p className="text-xs text-slate-500 font-medium leading-relaxed">
        {description}
      </p>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-100">
       <span className={`text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-${colorClass}-600`}>Select &rarr;</span>
    </div>
  </div>
);

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------
export const SolarDesignSection = () => {
  const [view, setView] = useState<ViewState>('root');
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null);

  const handleBack = () => {
    if (view === 'form') {
      if (selectedRole && ['design', 'om', 'project'].includes(selectedRole)) {
        setView('pv_subroles');
      } else {
        setView('root');
      }
      setSelectedRole(null);
    } else if (view === 'pv_subroles') {
      setView('root');
    }
  };

  const handleRoleSelect = (roleKey: RoleKey) => {
    setSelectedRole(roleKey);
    setView('form');
  };

  const handlePVGroupSelect = () => {
    setView('pv_subroles');
  };

  return (
    <section className="bg-white text-slate-900 rounded-2xl p-8 shadow-sm border border-slate-300 mb-12 min-h-[600px]">
      
      {/* --- VIEW 1: ROOT SELECTION --- */}
      {view === 'root' && (
        <div className="animate-in fade-in slide-in-from-left-8 duration-300">
          <div className="mb-8 border-b border-slate-200 pb-6">
            <h2 className="text-2xl font-black italic mb-2 border-l-4 border-blue-600 pl-4 tracking-tight uppercase">
              2. Technical Role Selection
            </h2>
            <p className="text-slate-500 text-sm pl-5">
               Please select your primary domain of expertise.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. PV Engineer Category */}
            <SelectionCard 
              onClick={handlePVGroupSelect}
              icon={Briefcase}
              title="PV System Engineering"
              description="Design, O&M, and Project Management tracks."
              colorClass="blue"
            />
            
            {/* 2. Electrical */}
            <SelectionCard 
              onClick={() => handleRoleSelect('electrical')}
              icon={Cpu}
              title={ROLES_DB.electrical.label}
              description={ROLES_DB.electrical.description}
              colorClass="emerald"
            />

            {/* 3. Mechanical */}
            <SelectionCard 
              onClick={() => handleRoleSelect('mechanical')}
              icon={Settings}
              title={ROLES_DB.mechanical.label}
              description={ROLES_DB.mechanical.description}
              colorClass="orange"
            />
          </div>
        </div>
      )}

      {/* --- VIEW 2: PV SUB-ROLES SELECTION --- */}
      {view === 'pv_subroles' && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
          <div className="flex items-center gap-4 mb-6 border-b border-slate-200 pb-4">
             <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
              >
                <ArrowLeft size={18} />
                Back to Domains
              </button>
              <div className="h-6 w-px bg-slate-300"></div>
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">
                 PV System Engineering Tracks
              </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SelectionCard 
              onClick={() => handleRoleSelect('design')}
              icon={Briefcase}
              title={ROLES_DB.design.label}
              description={ROLES_DB.design.description}
            />
             <SelectionCard 
              onClick={() => handleRoleSelect('om')}
              icon={CheckCircle2}
              title={ROLES_DB.om.label}
              description={ROLES_DB.om.description}
            />
             <SelectionCard 
              onClick={() => handleRoleSelect('project')}
              icon={BookOpen}
              title={ROLES_DB.project.label}
              description={ROLES_DB.project.description}
            />
          </div>
        </div>
      )}

      {/* --- VIEW 3: FORM VIEW --- */}
      {view === 'form' && selectedRole && (
        <div>
          {/* Navigation Header */}
          <div className="flex items-center gap-4 mb-6 border-b border-slate-200 pb-4">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} />
              {['design', 'om', 'project'].includes(selectedRole) ? 'Back to PV Tracks' : 'Back to Domains'}
            </button>
            <div className="h-6 w-px bg-slate-300"></div>
            <span className="text-sm font-medium text-slate-400">
               Editing: <span className="text-slate-800 font-bold">{ROLES_DB[selectedRole].label}</span>
            </span>
          </div>

          {/* Form Component - Key ensures it resets when ID changes */}
          <RoleSpecificForm 
            key={selectedRole} 
            initialSections={ROLES_DB[selectedRole].sections} 
            roleLabel={ROLES_DB[selectedRole].label}
          />
        </div>
      )}
    </section>
  );
};