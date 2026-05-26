import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  RefreshCcw, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  ScrollText, 
  BookOpen, 
  Cpu, 
  ShieldCheck, 
  HeartHandshake
} from 'lucide-react';
import { CaseStudyData } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CISLogo } from './CISLogo';

// INLINE EDITABLE COMPONENT FOR STRINGS
function EditableText({
  value,
  onSave,
  className = "",
  type = "textarea",
  placeholder = "Edit..."
}: {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  type?: 'input' | 'textarea';
  placeholder?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    if (!isEditing) {
      setTempValue(value);
    }
  }, [value, isEditing]);

  const handleSave = () => {
    onSave(tempValue.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div 
        className="w-full inline-block bg-amber-50/70 border border-amber-400 rounded-lg p-1.5 font-sans relative z-30" 
        onClick={(e) => e.stopPropagation()}
      >
        {type === 'input' ? (
          <input
            type="text"
            className="w-full bg-white text-slate-800 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none font-sans"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
        ) : (
          <textarea
            className="w-full bg-white text-slate-800 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none min-h-[50px] font-sans"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Escape') handleCancel();
            }}
          />
        )}
        <div className="flex gap-1 justify-end mt-1 font-sans">
          <button
            type="button"
            onClick={handleCancel}
            className="px-1.5 py-0.5 rounded bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-[9px] font-bold uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-2 py-0.5 rounded bg-[#F25B24] hover:bg-[#d44c1b] text-white text-[9px] font-bold uppercase tracking-wider"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`group relative cursor-pointer hover:bg-amber-100/50 hover:ring-2 hover:ring-amber-200/80 rounded px-1 transition-all duration-150 ${className}`}
      title="Click to edit value"
    >
      {value || <span className="text-slate-400 italic font-normal">{placeholder}</span>}
      <span className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 bg-[#F25B24] text-white text-[7px] font-black uppercase tracking-wider px-1 rounded shadow-xs pointer-events-none transition-all duration-150">
        Edit
      </span>
    </div>
  );
}

// INLINE MINIMAL LIST EDITOR FOR SHEET 3 BULLETS
function EditableMinimalList({
  items,
  onChange,
  newItemTemplate = "New system parameter outline"
}: {
  items: string[];
  onChange: (newItems: string[]) => void;
  newItemTemplate?: string;
}) {
  return (
    <div className="space-y-1 w-full" onClick={(e) => e.stopPropagation()}>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-550 group/minlistItem relative pr-6 py-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F25B24] mt-1.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <EditableText
              value={item}
              onSave={(newVal) => {
                const updated = [...items];
                updated[idx] = newVal;
                onChange(updated);
              }}
              type="input"
              className="w-full text-xs text-slate-650"
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== idx))}
            className="absolute right-0 top-1 opacity-0 group-hover/minlistItem:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity text-xs font-bold font-sans"
            title="Remove item"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, newItemTemplate])}
        className="flex items-center gap-1 px-2 py-0.5 text-[8px] uppercase font-bold text-[#F25B24] rounded border border-dashed border-[#F25B24]/30 hover:bg-slate-50 mt-1 transition-colors font-sans"
      >
        + Add bullet point
      </button>
    </div>
  );
}

// INLINE TAG LIST EDITOR FOR GATES AND SYSTEM MODES
function EditableTagList({
  tags,
  onChange,
  newItemTemplate = "New Channel"
}: {
  tags: string[];
  onChange: (newTags: string[]) => void;
  newItemTemplate?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 items-center" onClick={(e) => e.stopPropagation()}>
      {tags.map((tag, idx) => (
        <div key={idx} className="flex items-center gap-1 bg-white text-slate-700 hover:border-[#023D4A] border border-slate-200 rounded-md shadow-2xs group/tag pr-1">
          <EditableText
            value={tag}
            onSave={(newVal) => {
              const updated = [...tags];
              updated[idx] = newVal;
              onChange(updated);
            }}
            type="input"
            className="px-2 py-0.5 text-[9px] font-extrabold border-none shadow-none bg-transparent hover:ring-0 hover:bg-transparent"
          />
          <button
            type="button"
            onClick={() => onChange(tags.filter((_, i) => i !== idx))}
            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-450 hover:text-rose-600 transition-colors ml-0.5 flex-shrink-0 font-bold"
            title="Remove Tag"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...tags, newItemTemplate])}
        className="px-2 py-1 rounded bg-[#023D4A] hover:bg-[#F25B24] text-white text-[8px] font-bold uppercase tracking-wider flex items-center justify-center h-6 text-center shadow-2xs font-sans"
        title="Add Tag"
      >
        + Add Mode
      </button>
    </div>
  );
}

interface CaseStudyPreviewProps {
  data: CaseStudyData;
  onChangeData: (updated: CaseStudyData) => void;
  onDownload: () => void;
  onReset: () => void;
  isDownloading: boolean;
}

export function CaseStudyPreview({ data, onChangeData, onDownload, onReset, isDownloading }: CaseStudyPreviewProps) {
  // Navigation states: 'slider' or 'scroll'
  const [viewMode, setViewMode] = useState<'slider' | 'scroll'>('slider');
  const [activePage, setActivePage] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const prevPage = () => {
    if (activePage > 1) setActivePage(prev => prev - 1);
  };

  const nextPage = () => {
    if (activePage < 4) setActivePage(prev => prev + 1);
  };

  // State update handlers
  const updateTitle = (val: string) => {
    onChangeData({ ...data, title: val });
  };
  const updateCountry = (val: string) => {
    onChangeData({ ...data, introduction: { ...data.introduction, country: val } });
  };
  const updateBusinessType = (val: string) => {
    onChangeData({ ...data, introduction: { ...data.introduction, businessType: val } });
  };
  const updateIntroText = (val: string) => {
    onChangeData({ ...data, introduction: { ...data.introduction, text: val } });
  };
  const updateBusinessGoal = (val: string) => {
    onChangeData({ ...data, businessGoal: val });
  };

  const updateProblemOverview = (val: string) => {
    onChangeData({ ...data, problem: { ...data.problem, overview: val } });
  };
  const updateProblemPoints = (val: string[]) => {
    onChangeData({ ...data, problem: { ...data.problem, points: val } });
  };

  const updateApproachDiscover = (val: string) => {
    onChangeData({ ...data, approach: { ...data.approach, discover: val } });
  };
  const updateApproachSolve = (val: string) => {
    onChangeData({ ...data, approach: { ...data.approach, solve: val } });
  };
  const updateApproachSimplify = (val: string) => {
    onChangeData({ ...data, approach: { ...data.approach, simplify: val } });
  };
  const updateApproachSustain = (val: string) => {
    onChangeData({ ...data, approach: { ...data.approach, sustain: val } });
  };

  const updateSolutionOverview = (val: string) => {
    onChangeData({ ...data, solution: { ...data.solution, overview: val } });
  };
  const updateSolutionPoints = (val: string[]) => {
    onChangeData({ ...data, solution: { ...data.solution, points: val } });
  };
  const updateSolutionModes = (val: string[]) => {
    onChangeData({ ...data, solution: { ...data.solution, modes: val } });
  };

  const updateTechnologyStack = (val: string[]) => {
    onChangeData({ ...data, technologyStack: val });
  };
  const updateProjectFeatures = (val: string[]) => {
    onChangeData({ ...data, projectFeatures: val });
  };
  const updateBenefits = (val: string[]) => {
    onChangeData({ ...data, benefits: val });
  };
  const updateResultsAchieved = (val: string) => {
    onChangeData({ ...data, resultsAchieved: val });
  };

  // Helper for rendering standard Page Header
  const renderPageHeader = (pageNum: number) => {
    return (
      <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6 text-slate-400 font-sans">
        <div className="flex items-center gap-3">
          <CISLogo className="h-6 w-auto" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-300">|</span>
          <span className="text-[9px] font-bold tracking-widest text-[#023D4A] uppercase">Case Study Documentation</span>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase font-bold">Ref: CS-2026-OMNI</span>
          <span className="text-[8px] font-mono font-bold tracking-widest text-[#F25B24] mt-0.5">PAGE {pageNum} OF 4</span>
        </div>
      </div>
    );
  };

  // Helper for rendering standard Page Footer
  const renderPageFooter = (pageNum: number) => {
    return (
      <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between text-[8px] text-slate-400 font-medium font-sans uppercase tracking-wider">
        <div>© 2026 CIS Systems | Confidential Client Archive</div>
        <div className="flex items-center gap-4">
          <div className="font-bold">Project Identity: {data.title.substring(0, 24)}...</div>
          <div className="bg-[#023D4A] text-white font-mono px-1.5 py-0.5 rounded text-[8px] font-black">
            SHEET {pageNum} / 4
          </div>
        </div>
      </div>
    );
  };

  // individual render functions for the A4 pages
  const renderPage1 = () => (
    <div className="w-full h-full flex flex-col bg-white">
      {renderPageHeader(1)}
      
      {/* Cover Logo Header */}
      <div className="flex flex-col items-center justify-center my-6 text-center bg-slate-50/50 py-8 rounded-2xl border border-dotted border-slate-200">
        <CISLogo className="h-16 w-auto mb-4" />
        <p className="text-[10px] font-black tracking-[0.3em] text-[#F25B24] uppercase">TECHNICAL CAPABILITY BULLETIN</p>
        <span className="w-12 h-1 bg-[#023D4A] mt-3 rounded-full"></span>
      </div>

      {/* Title Segment */}
      <div className="mb-6">
        <div className="text-[9px] font-black text-[#F25B24] uppercase tracking-widest mb-1.5">PROJECT TITLE</div>
        <EditableText
          value={data.title}
          onSave={updateTitle}
          className="text-2xl font-black text-[#023D4A] tracking-tight leading-none uppercase xl:text-3xl border-l-4 border-[#023D4A] pl-4 w-full block"
          type="input"
        />
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#023D4A]">
            <MapPin size={18} />
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-widest text-[#F25B24] font-black">Operations Country</p>
            <EditableText
              value={data.introduction.country}
              onSave={updateCountry}
              className="text-xs font-bold text-slate-800 block"
              type="input"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#023D4A]">
            <Building2 size={18} />
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-widest text-[#F25B24] font-black">Business Vertices</p>
            <EditableText
              value={data.introduction.businessType}
              onSave={updateBusinessType}
              className="text-xs font-bold text-slate-800 block"
              type="input"
            />
          </div>
        </div>
      </div>

      {/* Introduction text */}
      <div className="space-y-4 mb-6">
        <div className="text-[9px] font-black text-[#F25B24] uppercase tracking-widest">EXECUTIVE OVERVIEW</div>
        <div className="text-xs text-slate-550 leading-relaxed font-sans">
          <EditableText
            value={data.introduction.text}
            onSave={updateIntroText}
            type="textarea"
          />
        </div>
      </div>

      {/* Business Goal box */}
      <div className="mt-auto">
        <div className="bg-[#023D4A]/5 border border-[#023D4A]/10 p-5 rounded-xl text-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#023D4A]/5 rounded-full -translate-y-12 translate-x-12"></div>
          <h3 className="text-[10px] font-black text-[#F25B24] uppercase mb-2 tracking-widest flex items-center gap-1.5">
            <Layers size={12} className="text-[#023D4A]" />
            Strategic Business Goal
          </h3>
          <EditableText
            value={data.businessGoal}
            onSave={updateBusinessGoal}
            className="text-xs leading-relaxed font-semibold text-[#023D4A]"
            type="textarea"
          />
        </div>
      </div>

      {renderPageFooter(1)}
    </div>
  );

  const renderPage2 = () => (
    <div className="w-full h-full flex flex-col bg-white">
      {renderPageHeader(2)}

      {/* Section Header */}
      <div className="mb-6">
        <span className="text-[8px] font-bold text-[#F25B24] uppercase tracking-widest block mb-1">SECTION II</span>
        <h2 className="text-lg font-black text-[#023D4A] tracking-tight uppercase">Project Challenge & Analytical Approach</h2>
        <div className="h-[2px] w-12 bg-[#F25B24] mt-2"></div>
      </div>

      {/* Problem Section */}
      <div className="space-y-4 mb-6">
        <div className="bg-[#F25B24]/5 border-l-4 border-[#F25B24] p-4 rounded-r-xl">
          <h4 className="text-[9px] font-black text-[#F25B24] uppercase tracking-widest mb-1.5">THE LEGACY PROBLEM OVERVIEW</h4>
          <EditableText
            value={data.problem.overview}
            onSave={updateProblemOverview}
            className="text-xs text-slate-705 leading-relaxed italic"
            type="textarea"
          />
        </div>

        <div className="space-y-2.5">
          <div className="text-[9px] font-black text-[#023D4A] uppercase tracking-widest mb-1">KEY TECHNICAL BOTTLENECKS IDENTIFIED:</div>
          <div className="space-y-2">
            {data.problem.points.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 relative group/pitem">
                <CheckCircle2 size={14} className="text-[#F25B24] mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0 pr-6">
                  <EditableText
                    value={point}
                    onSave={(newVal) => {
                      const updated = [...data.problem.points];
                      updated[idx] = newVal;
                      updateProblemPoints(updated);
                    }}
                    type="input"
                    className="w-full text-xs text-slate-650 font-medium font-sans"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = data.problem.points.filter((_, i) => i !== idx);
                    updateProblemPoints(updated);
                  }}
                  className="absolute right-2 top-2.5 opacity-0 group-hover/pitem:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity"
                  title="Remove point"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-14V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => updateProblemPoints([...data.problem.points, "New identified bottleneck details"])}
              className="flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase font-bold text-[#023D4A] hover:text-[#F25B24] border border-dashed border-[#023D4A]/25 hover:border-[#F25B24] rounded-lg bg-slate-50 transition-colors font-sans mt-1"
            >
              + Add Bottleneck
            </button>
          </div>
        </div>
      </div>

      {/* CIS Approach Matrix Section */}
      <div className="mt-auto">
        <div className="text-[9px] font-black text-[#F25B24] uppercase tracking-widest mb-3">THE CIS METHODOLOGY MODEL (DISCOVER, SOLVE, SIMPLIFY, SUSTAIN)</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: '1. Discover', title: 'Discover', text: data.approach.discover, bg: 'bg-[#023D4A]/5 text-[#023D4A]', update: updateApproachDiscover },
            { id: '2. Solve', title: 'Solve', text: data.approach.solve, bg: 'bg-[#F25B24]/5 text-[#F25B24]', update: updateApproachSolve },
            { id: '3. Simplify', title: 'Simplify', text: data.approach.simplify, bg: 'bg-[#023D4A]/5 text-[#023D4A]', update: updateApproachSimplify },
            { id: '4. Sustain', title: 'Sustain', text: data.approach.sustain, bg: 'bg-[#F25B24]/5 text-[#F25B24]', update: updateApproachSustain }
          ].map((item) => (
            <div key={item.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-[#F25B24] transition-colors flex flex-col">
              <h5 className={`text-[9px] font-extrabold uppercase mb-1.5 py-1 px-2 rounded-md ${item.bg} tracking-widest inline-block self-start`}>
                {item.id}
              </h5>
              <div className="flex-1">
                <EditableText
                  value={item.text}
                  onSave={item.update}
                  type="textarea"
                  className="text-[10px] text-slate-500 leading-snug font-medium font-sans w-full block"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {renderPageFooter(2)}
    </div>
  );

  const renderPage3 = () => (
    <div className="w-full h-full flex flex-col bg-white">
      {renderPageHeader(3)}

      {/* Section Header */}
      <div className="mb-6">
        <span className="text-[8px] font-bold text-[#F25B24] uppercase tracking-widest block mb-1">SECTION III</span>
        <h2 className="text-lg font-black text-[#023D4A] tracking-tight uppercase">System Implementation Architecture</h2>
        <div className="h-[2px] w-12 bg-[#F25B24] mt-2"></div>
      </div>

      {/* Solution Overview */}
      <div className="mb-4">
        <div className="text-[9px] font-black text-[#F25B24] uppercase tracking-widest mb-2">IMPLEMENTATION DESIGN SUMMARY</div>
        <EditableText
          value={data.solution.overview}
          onSave={updateSolutionOverview}
          className="text-xs text-slate-600 leading-relaxed font-semibold text-[#023D4A] border-l-2 border-[#F25B24] pl-3 mb-4 block"
          type="textarea"
        />
        
        <div className="space-y-1">
          <EditableMinimalList 
            items={data.solution.points} 
            onChange={updateSolutionPoints}
            newItemTemplate="New design parameter specification bullet point"
          />
        </div>
      </div>

      {/* Operational Modes Grid */}
      <div className="mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="text-[8px] font-black uppercase tracking-widest text-[#023D4A] mb-2">INTEGRATION GATEWAYS & CHANNELS</div>
        <EditableTagList 
          tags={data.solution.modes} 
          onChange={updateSolutionModes}
          newItemTemplate="New integration mode channel"
        />
      </div>

      {/* Deployed Infrastructure (Technology Stack) */}
      <div className="mt-auto">
        <div className="text-[9px] font-black text-[#F25B24] uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <Cpu size={12} className="text-[#023D4A]" />
          Infrastructure Stack & Ecosystem
        </div>
        <div className="grid grid-cols-4 gap-2">
          {data.technologyStack.map((tech, i) => (
            <div key={i} className="px-2 py-2.5 bg-white border border-slate-150 rounded-lg text-center shadow-xs relative group/tech flex flex-col justify-center min-h-[50px]">
              <EditableText
                value={tech}
                onSave={(newVal) => {
                  const updated = [...data.technologyStack];
                  updated[i] = newVal;
                  updateTechnologyStack(updated);
                }}
                type="input"
                className="text-[10px] font-mono font-bold text-[#023D4A] uppercase truncate block w-full text-center hover:ring-0"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = data.technologyStack.filter((_, idx) => idx !== i);
                  updateTechnologyStack(updated);
                }}
                className="absolute -top-1.5 -right-1.5 opacity-0 group-hover/tech:opacity-100 bg-rose-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center hover:bg-rose-600 shadow transition-all duration-150 font-bold"
                title="Delete Technology"
              >
                ×
              </button>
            </div>
          ))}
          {/* Elegant plus block for new technology adding */}
          <button
            type="button"
            onClick={() => {
              updateTechnologyStack([...data.technologyStack, "New Tech"]);
            }}
            className="px-2 py-2.5 bg-slate-50 border border-dashed border-slate-250 hover:border-[#F25B24] rounded-lg text-center text-slate-400 hover:text-[#F25B24] text-[9px] font-bold uppercase tracking-wider transition-colors min-h-[50px] flex items-center justify-center"
          >
            + Add Stack
          </button>
        </div>
      </div>

      {renderPageFooter(3)}
    </div>
  );

  const renderPage4 = () => (
    <div className="w-full h-full flex flex-col bg-white">
      {renderPageHeader(4)}

      {/* Section Header */}
      <div className="mb-6">
        <span className="text-[8px] font-bold text-[#F25B24] uppercase tracking-widest block mb-1">SECTION IV</span>
        <h2 className="text-lg font-black text-[#023D4A] tracking-tight uppercase">Strategic Benefits & Business Return</h2>
        <div className="h-[2px] w-12 bg-[#F25B24] mt-2"></div>
      </div>

      {/* Project Key Features list */}
      <div className="mb-4">
        <div className="text-[9px] font-black text-[#F25B24] uppercase tracking-widest mb-2.5">CORE USER UTILITIES INCLUDED</div>
        <div className="flex flex-wrap gap-2">
          {data.projectFeatures && data.projectFeatures.map((feat, i) => (
            <div key={i} className="px-3 py-1 bg-[#023D4A]/5 rounded-full text-[10px] font-bold text-[#023D4A] border border-[#023D4A]/10 flex items-center gap-1.5 group/feat">
              <span className="text-amber-500">⚡</span>
              <EditableText
                value={feat}
                onSave={(newVal) => {
                  const updated = [...data.projectFeatures];
                  updated[i] = newVal;
                  updateProjectFeatures(updated);
                }}
                type="input"
                className="bg-transparent hover:ring-0 hover:bg-transparent px-0.5 py-0"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = data.projectFeatures.filter((_, idx) => idx !== i);
                  updateProjectFeatures(updated);
                }}
                className="opacity-0 group-hover/feat:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity ml-1 text-[11px] font-bold"
                title="Delete feature"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              updateProjectFeatures([...data.projectFeatures, "New Core Utility"]);
            }}
            className="px-3 py-1 bg-slate-50 border border-dashed border-[#023D4A]/30 hover:border-[#F25B24] rounded-full text-[9px] font-bold text-[#023D4A] hover:text-[#F25B24] transition-colors"
          >
            + Add Utility
          </button>
        </div>
      </div>

      {/* Strategic Benefits (Checkmarks) */}
      <div className="mb-4 space-y-2">
        <div className="text-[9px] font-black text-[#023D4A] uppercase tracking-widest mb-1.5">MEASURABLE REVENUE & OPERATIONAL BENEFITS</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {data.benefits.map((b, i) => (
            <div key={i} className="flex items-start gap-2 text-xs py-1.5 px-3 bg-[#a8ebd5]/10 rounded-lg border border-[#a8ebd5]/30 relative group/benefit">
              <CheckCircle2 size={13} className="text-emerald-650 mt-1.5 flex-shrink-0" />
              <div className="flex-1 min-w-0 pr-4">
                <EditableText
                  value={b}
                  onSave={(newVal) => {
                    const updated = [...data.benefits];
                    updated[i] = newVal;
                    updateBenefits(updated);
                  }}
                  type="textarea"
                  className="text-slate-700 leading-snug font-medium font-sans text-[11px] w-full block"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const updated = data.benefits.filter((_, idx) => idx !== i);
                  updateBenefits(updated);
                }}
                className="absolute right-2 top-2.5 opacity-0 group-hover/benefit:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity text-sm font-bold"
                title="Remove Benefit"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              updateBenefits([...data.benefits, "Increase in business metrics or performance indicators"]);
            }}
            className="col-span-1 md:col-span-2 py-1.5 border border-dashed border-emerald-300 text-emerald-700 hover:text-emerald-800 rounded-lg bg-emerald-50/20 text-[9px] font-bold uppercase tracking-wider transition-colors text-center"
          >
            + Add Benefit Metric
          </button>
        </div>
      </div>

      {/* Results Achieved */}
      <div className="mt-auto">
        <div className="bg-[#023D4A] text-white p-4 rounded-2xl relative overflow-hidden shadow-md">
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={16} className="text-[#F25B24]" />
            <span className="text-[9px] font-black text-[#F25B24] uppercase tracking-widest">OUTCOME SYNTHESIS & APPROVALS</span>
          </div>
          <EditableText
            value={data.resultsAchieved}
            onSave={updateResultsAchieved}
            className="text-[11px] leading-relaxed text-slate-150 font-sans"
            type="textarea"
          />
        </div>

        {/* Approval block */}
        <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-sans">
          <div className="flex items-center gap-1.5">
            <HeartHandshake size={14} className="text-[#023D4A]" />
            <span className="font-semibold text-slate-550 uppercase">Verified CIS Deployment Standard</span>
          </div>
          <p className="font-mono text-[9px] uppercase font-bold tracking-wider text-green-650 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            ACTIVE PRODUCTION LEDGER
          </p>
        </div>
      </div>

      {renderPageFooter(4)}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#111827] text-slate-350">
      {/* Top Controller Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#1F2937] border-b border-[#374151] shrink-0 sticky top-0 z-40 select-none">
        <div className="flex items-center gap-3">
          <div className="bg-[#023D4A] text-white p-1.5 rounded-lg border border-[#374151] flex items-center justify-center font-bold">
            <BookOpen size={18} className="text-[#F25B24]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider leading-none">Document Sandbox</h2>
              <span className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#F25B24]/10 border border-[#F25B24]/25 text-[8px] font-black text-[#F25B24] tracking-wider uppercase">
                ● Interactive Sheets Mode
              </span>
            </div>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">Click any text block, list, or tag to edit inline</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Layout view controls */}
          <div className="bg-slate-900/60 p-1 rounded-lg flex items-center border border-[#374151] mr-3">
            <button
              id="slider-view-btn"
              onClick={() => setViewMode('slider')}
              className={`p-1.5 px-3 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${viewMode === 'slider' ? 'bg-[#023D4A] text-white' : 'text-slate-400 hover:text-white'}`}
              title="Page-by-Page Slider"
            >
              <BookOpen size={12} />
              <span>Slider</span>
            </button>
            <button
              id="scroll-view-btn"
              onClick={() => setViewMode('scroll')}
              className={`p-1.5 px-3 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${viewMode === 'scroll' ? 'bg-[#023D4A] text-white' : 'text-slate-400 hover:text-white'}`}
              title="Continuous Stack Scroll"
            >
              <ScrollText size={12} />
              <span>Scroll</span>
            </button>
          </div>

          <button
            onClick={onDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F25B24] text-white text-xs font-black hover:bg-[#d44c1b] transition-all shadow-md active:scale-98 disabled:opacity-50 uppercase tracking-wider"
          >
            <Download size={14} />
            <span>Export Word (.docx)</span>
          </button>
        </div>
      </div>

      {/* Pages Workspace View Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-start">
        {viewMode === 'slider' ? (
          <div className="flex flex-col items-center gap-6 w-full max-w-[760px] my-auto py-2">
            
            {/* Slider Sheet Wrapper - enforces Standard A4 Aspect Ratio */}
            <div className="w-full aspect-[1/1.414] min-h-[700px] md:min-h-[900px] bg-white text-slate-800 shadow-2xl rounded-2xl p-6 md:p-10 relative flex flex-col transition-all overflow-hidden border border-slate-200">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col h-full overflow-hidden"
                >
                  {activePage === 1 && renderPage1()}
                  {activePage === 2 && renderPage2()}
                  {activePage === 3 && renderPage3()}
                  {activePage === 4 && renderPage4()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Navigation Buttons */}
            <div className="flex items-center justify-between w-full select-none bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 max-w-[340px] shadow-lg">
              <button
                onClick={prevPage}
                disabled={activePage === 1}
                className="p-1 px-3 rounded bg-slate-900 border border-slate-750 text-slate-350 hover:bg-slate-700 disabled:opacity-40 transition-colors flex items-center gap-1 text-xs uppercase tracking-wider font-bold"
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </button>
              
              <div className="text-[10px] uppercase font-bold text-slate-300 tracking-widest font-mono">
                PAGE <span className="text-[#F25B24] font-black">{activePage}</span> / 4
              </div>

              <button
                onClick={nextPage}
                disabled={activePage === 4}
                className="p-1 px-3 rounded bg-[#023D4A] text-white hover:bg-[#03596c] disabled:opacity-40 transition-colors flex items-center gap-1 text-xs uppercase tracking-wider font-bold"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          /* Scroll Mode stacked sheets layout */
          <div ref={containerRef} className="flex flex-col items-center gap-8 w-full max-w-[760px] py-4">
            <div className="w-full aspect-[1/1.414] min-h-[700px] md:min-h-[900px] bg-white text-slate-800 shadow-2xl rounded-2xl p-6 md:p-10 border border-slate-250 flex flex-col">
              {renderPage1()}
            </div>
            <div className="w-full aspect-[1/1.414] min-h-[700px] md:min-h-[900px] bg-white text-slate-800 shadow-2xl rounded-2xl p-6 md:p-10 border border-slate-250 flex flex-col">
              {renderPage2()}
            </div>
            <div className="w-full aspect-[1/1.414] min-h-[700px] md:min-h-[900px] bg-white text-slate-800 shadow-2xl rounded-2xl p-6 md:p-10 border border-slate-250 flex flex-col">
              {renderPage3()}
            </div>
            <div className="w-full aspect-[1/1.414] min-h-[700px] md:min-h-[900px] bg-white text-slate-800 shadow-2xl rounded-2xl p-6 md:p-10 border border-slate-250 flex flex-col">
              {renderPage4()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
