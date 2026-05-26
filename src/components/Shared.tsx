import React from 'react';
import { Building2, MousePointer2, Smartphone, Globe, CheckCircle2, ChevronRight, Download, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <img 
              src="https://raw.githubusercontent.com/Anand-kumar-Saini/CIS-Logo/refs/heads/main/cis-logo.png" 
              alt="CIS Logo" 
              className="h-8 w-auto"
              referrerPolicy="no-referrer"
            />
            <span className="font-semibold text-lg tracking-tight text-slate-900 border-l border-slate-200 pl-3">Case Study Architect</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 uppercase tracking-widest">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-slate-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              System Ready
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  className?: string;
}

export function FeatureCard({ title, description, icon: Icon, className }: FeatureCardProps) {
  return (
    <div className={cn("p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow", className)}>
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 mb-4 border border-slate-100">
        <Icon size={24} />
      </div>
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
