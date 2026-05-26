import React, { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface CaseStudyFormProps {
  onSubmit: (requirement: string) => void;
  isLoading: boolean;
}

export function CaseStudyForm({ onSubmit, isLoading }: CaseStudyFormProps) {
  const [requirement, setRequirement] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requirement.trim()) {
      onSubmit(requirement);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-600">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Project Requirements</h2>
            <p className="text-slate-500 text-sm">Briefly describe the software solution your team built.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <textarea
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="Example: We built a POS system for a pharmacy chain that integrates with their inventory and has real-time sync with their web shop. It uses barcodes and supports multiple payment gateways..."
              className="w-full h-48 px-6 py-4 rounded-2xl bg-slate-50 border-slate-200 border focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all resize-none text-slate-700 placeholder:text-slate-400"
              disabled={isLoading}
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-mono">
              {requirement.length} characters
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !requirement.trim()}
            className="w-full py-4 rounded-2xl bg-slate-900 text-white font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-900/10"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Processing requirements...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span className="uppercase tracking-widest text-xs font-bold">Generate Case Study</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <p className="text-xs font-bold text-slate-400 w-full text-center mb-2 uppercase tracking-widest">Requirement presets</p>
        <button 
          onClick={() => setRequirement("POS System with inventory management and reporting for a retail store.")}
          className="px-4 py-2 rounded-full border border-slate-200 text-xs text-slate-600 font-medium hover:border-blue-300 hover:text-blue-600 transition-colors bg-white shadow-sm"
        >
          Retail POS
        </button>
        <button 
          onClick={() => setRequirement("Healthcare Patient Management Dashboard for a multi-specialty clinic.")}
          className="px-4 py-2 rounded-full border border-slate-200 text-xs text-slate-600 font-medium hover:border-blue-300 hover:text-blue-600 transition-colors bg-white shadow-sm"
        >
          Clinic Dashboard
        </button>
        <button 
          onClick={() => setRequirement("Logistics Fleet Tracking system with real-time GPS and driver management.")}
          className="px-4 py-2 rounded-full border border-slate-200 text-xs text-slate-600 font-medium hover:border-blue-300 hover:text-blue-600 transition-colors bg-white shadow-sm"
        >
          Logistics Tracking
        </button>
      </div>
    </div>
  );
}
