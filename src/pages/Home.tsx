import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CaseStudyPreview } from '../components/CaseStudyPreview';
import { CaseStudyData } from '../types';
import { defaultCaseStudy } from '../defaultData';
import { CISLogo } from '../components/CISLogo';
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  RefreshCcw, 
  Zap, 
  FileStack, 
  Compass, 
  Loader2,
  Save,
  Trash2,
  FileText,
  Plus
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface SavedDraft {
  id: string;
  title: string;
  timestamp: string;
  data: CaseStudyData;
}

export default function Home() {
  const [data, setData] = useState<CaseStudyData>(defaultCaseStudy);
  const [requirement, setRequirement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Tabbed system for Draft and Chat co-pilot
  const [activeTab, setActiveTab] = useState<'chat' | 'drafts'>('chat');
  const [drafts, setDrafts] = useState<SavedDraft[]>([]);

  // Load drafts on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cis_case_study_drafts');
      if (stored) {
        setDrafts(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading drafts", e);
    }
  }, []);

  // Sync drafts when edited
  const saveDraftsToStorage = (newDrafts: SavedDraft[]) => {
    setDrafts(newDrafts);
    try {
      localStorage.setItem('cis_case_study_drafts', JSON.stringify(newDrafts));
    } catch (e) {
      console.error("Error saving drafts to localstorage", e);
    }
  };

  const handleSaveDraft = (customTitle?: string) => {
    const defaultTitle = data.title || "Untitled Draft";
    const draftName = customTitle || prompt("Enter a custom name for this draft:", defaultTitle);
    if (draftName === null) return; // User cancelled
    
    const newDraft: SavedDraft = {
      id: Date.now().toString(),
      title: draftName.trim() || defaultTitle,
      timestamp: new Date().toLocaleString(),
      data: data
    };
    
    const updated = [newDraft, ...drafts];
    saveDraftsToStorage(updated);
    
    // Add info message to Co-Pilot history
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: `💾 **Saved Draft Successfully!**\n\nI have committed **"${newDraft.title}"** to your persistent drafts shelf. You can switch to the **"Saved Drafts"** tab above to restore or delete it at any point!`,
        timestamp: new Date()
      }
    ]);
  };

  const handleLoadDraft = (draft: SavedDraft) => {
    setData(draft.data);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: `♻️ **Restored Backup**\n\nLoaded the draft **"${draft.title}"** into your workspace. You can now continue editing, chat with your Co-Pilot, or download the Word file!`,
        timestamp: new Date()
      }
    ]);
    setActiveTab('chat');
  };

  const handleDeleteDraft = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this draft?")) return;
    const updated = drafts.filter(d => d.id !== id);
    saveDraftsToStorage(updated);
  };
  
  // Initialize messages with an immersive simulated interaction
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'g1',
      sender: 'assistant',
      text: `Hello! I am the **CIS Case Study Co-Pilot**.\n\nI am fully customized with Gemini core intelligence to compile multi-page, client-ready business case study documents conforming to CIS formatting layouts.\n\nYou can input any software system requirements from your team below, or tap one of the suggested presets to instantly draft a new document in the workspace!`,
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: 'g2',
      sender: 'user',
      text: `We built an omnichannel Point-of-Sale (POS) system for a large pharmacy chain with 120+ outlets. It integrates with native barcode scanners, supports real-time inventory sync, handles card checkout with offline caching databases, and outputs drug dispensing warning alerts.`,
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 'g3',
      sender: 'assistant',
      text: `Excellent! I have processed those pharmaceutical requirements and compiled a professional multi-page CIS Case Study for you in the preview workspace on the right.\n\n**Sections compiled across A4 Sheets:**\n- **Sheet 1**: Project Identity, Business Goal & Country Dynamics\n- **Sheet 2**: Technical Obstacles & CIS Methodological Approach (Discover, Solve, Simplify, Sustain)\n- **Sheet 3**: System Architecture, Ecosystem Channels, and Infrastructure Tech\n- **Sheet 4**: Key Deployed Features, Strategic Revenue Gains, and Concluding Output Metrics\n\nYou can navigate pages, scroll, and export the document directly to MS Word (.docx). Use the chat below to provide further instructions or revision updates!`,
      timestamp: new Date(Date.now() - 150000)
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom when message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleGenerate = async (reqText: string) => {
    if (!reqText.trim() || isLoading) return;
    
    // Add User Message to thread
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: reqText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setRequirement('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement: reqText }),
      });
      
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      
      // Update Preview Data State with new parsed Document
      setData(result);

      // Add Assistant response matching the document structure
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `I have compiled the new CIS Case Study for **"${result.title}"**!\n\nThe live layout has updated on the right side. All 4 sheets are complete and formatted.\n\nFeel free to download the Microsoft Word file (.docx) or use this chat menu for modifications!`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `Failed to synthesize case study content. Please connect requirements and try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!data) return;
    setIsDownloading(true);
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.title.replace(/\s+/g, '_')}_CaseStudy.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Failed to download Word document.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReset = () => {
    setData(defaultCaseStudy);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: "Preview data reset to default CIS OmniChannel Case Study template.",
        timestamp: new Date()
      }
    ]);
  };

  const applyPreset = (presetText: string) => {
    setRequirement(presetText);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#111827] text-slate-100 font-sans antialiased">
      
      {/* LEFT COLUMN: INTERACTIVE WORKSPACE HUB */}
      <div className="w-[36%] min-w-[380px] max-w-[480px] border-r border-[#374151] flex flex-col bg-[#1F2937] h-full shrink-0">
        
        {/* Chat / Drafts Tabbed Header */}
        <div className="px-4 py-3 bg-[#111827] border-b border-[#374151] flex flex-col shrink-0 select-none">
          <div className="flex items-center justify-between mb-2 pb-0.5">
            <div className="flex items-center gap-1.5">
              <CISLogo className="h-5.5 w-auto" />
              <div className="h-3.5 w-[1px] bg-slate-700"></div>
              <span className="text-[9.5px] font-black text-white uppercase tracking-wider">CIS Co-Pilot Suite</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#023D4A]/50 border border-[#023D4A]/40 text-[8px] font-bold text-emerald-400">
              <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></span>
              AUTO BACKUP ONLINE
            </div>
          </div>
          
          {/* Tabs switch */}
          <div className="flex gap-1 bg-[#1F2937] p-1 rounded-lg border border-[#374151]">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 rounded-md text-center text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-[#023D4A] text-white border border-[#03596c]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
              }`}
            >
              <MessageSquare size={11} className="text-[#F25B24]" />
              AI Co-Pilot
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('drafts')}
              className={`flex-1 py-1.5 rounded-md text-center text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'drafts'
                  ? 'bg-[#023D4A] text-white border border-[#03596c]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
              }`}
            >
              <FileStack size={11} className="text-[#F25B24]" />
              Saved Drafts ({drafts.length})
            </button>
          </div>
        </div>

        {activeTab === 'chat' ? (
          <>
            {/* Chat Scroll Thread */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 bg-gradient-to-b from-[#1F2937] to-[#111827]">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {/* Visual Label */}
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 px-1">
                      {msg.sender === 'user' ? 'User Instruction' : 'CIS Systems AI'}
                    </span>

                    {/* Bubble Container */}
                    <div className={`max-w-[90%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-[#023D4A] text-white border border-[#03596c] rounded-tr-xs' 
                        : 'bg-[#2D3748] text-slate-250 border border-[#3e4a5e] rounded-tl-xs'
                    }`}>
                      {/* Process markdown-like formatting simply for elegance */}
                      <div className="space-y-2 whitespace-pre-wrap">
                        {msg.text.split('\n\n').map((paragraph, idx) => {
                          const parts = paragraph.split('**');
                          return (
                            <p key={idx}>
                              {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-[#F25B24] font-extrabold">{part}</strong> : part)}
                            </p>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time identifier */}
                    <span className="text-[7px] font-mono text-slate-500 mt-1 px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing / API Waiting Animation */}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex flex-col items-start"
                >
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 px-1">CIS Systems AI</span>
                  <div className="bg-[#2D3748] border border-[#3e4a5e] text-slate-450 rounded-2xl rounded-tl-xs p-4 flex items-center gap-2.5 text-xs">
                    <Loader2 size={14} className="animate-spin text-[#F25B24]" />
                    <span className="animate-pulse">Compiling model parameters, parsing CIS layout matrix...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion & Input Panel */}
            <div className="p-4 bg-[#111827] border-t border-[#374151] shrink-0">
              
              {/* Preset Buttons */}
              <div className="mb-4">
                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Compass size={10} />
                  <span>Suggested templates presets</span>
                </div>
                <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none select-none">
                  <button
                    type="button"
                    onClick={() => applyPreset("Omnichannel Medical Clinic Portal with automated schedule queues, GPS tracking, and patient checkouts.")}
                    className="px-2.5 py-1.5 rounded-lg bg-[#1F2937] hover:bg-[#2D3748] border border-[#374151] hover:border-[#F25B24] transition-colors text-[9px] font-bold text-slate-300 shrink-0 uppercase tracking-wider"
                  >
                    🏥 Medical Clinic Hub
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("Unified Delivery Dispatch System with routing algorithm, GPS tracking, and driver client.")}
                    className="px-2.5 py-1.5 rounded-lg bg-[#1F2937] hover:bg-[#2D3748] border border-[#374151] hover:border-[#F25B24] transition-colors text-[9px] font-bold text-slate-300 shrink-0 uppercase tracking-wider"
                  >
                    🚚 Logistics Dispatcher
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("Enterprise E-Commerce stock manager with barcode scanners and real-time ledger accounting.")}
                    className="px-2.5 py-1.5 rounded-lg bg-[#1F2937] hover:bg-[#2D3748] border border-[#374151] hover:border-[#F25B24] transition-colors text-[9px] font-bold text-slate-300 shrink-0 uppercase tracking-wider"
                  >
                    📦 Stock Manager Suite
                  </button>
                </div>
              </div>

              {/* Prompt Entry Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleGenerate(requirement);
                }} 
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="Describe requirements or type revision..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#1F2937] border border-[#374151] focus:border-[#F25B24] focus:outline-none text-xs text-white placeholder:text-slate-500 disabled:opacity-60 transition-all font-sans"
                />
                <button
                  type="submit"
                  disabled={isLoading || !requirement.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#023D4A] hover:bg-[#03596c] disabled:opacity-45 disabled:cursor-not-allowed text-white flex items-center justify-center border border-[#374151] transition-colors shadow-sm"
                  title="Send to Co-Pilot"
                >
                  <Send size={14} className={isLoading ? "animate-pulse" : ""} />
                </button>
              </form>

              {/* Utility Reset and Info Links */}
              <div className="flex items-center justify-between mt-3 text-[8px] text-slate-500 select-none">
                <span>PLATFORM VER: 3.2 (GEMINI-FLASH ACTIVE)</span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="hover:text-white flex items-center gap-1 uppercase transition-colors"
                >
                  <RefreshCcw size={8} />
                  <span>Reset Preview</span>
                </button>
              </div>

            </div>
          </>
        ) : (
          /* SAVED DRAFTS CABINET VIEW */
          <div className="flex-1 flex flex-col bg-[#111827] overflow-hidden select-none">
            {/* Save Current Banner button block */}
            <div className="p-4 bg-[#1F2937] border-b border-[#374151]">
              <button
                type="button"
                onClick={() => handleSaveDraft()}
                className="w-full py-3 bg-[#F25B24] hover:bg-[#d04b1b] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer duration-150"
              >
                <Save size={15} />
                Save Current Preview State
              </button>
              <p className="text-[9px] text-slate-400 text-center mt-2 uppercase tracking-wide">
                Captured drafts are stored directly in your local browser Cache
              </p>
            </div>

            {/* List Segment */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                PERSISTED DRAFT LISTINGS ({drafts.length})
              </h3>
              
              {drafts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-700/50 rounded-2xl p-6">
                  <FileText className="text-slate-600 mb-3 animate-pulse" size={24} />
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">No Drafts Saved Yet</p>
                  <p className="text-[10px] text-slate-500 mt-2 max-w-[200px] leading-relaxed">
                    Make custom inline modifications to any sheet text field, then click the orange button above to snap save!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <AnimatePresence>
                    {drafts.map((draft) => (
                      <motion.div
                        key={draft.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => handleLoadDraft(draft)}
                        className="group p-3 bg-[#1F2937] border border-[#374151] hover:border-[#F25B24]/70 rounded-xl cursor-pointer flex items-center justify-between gap-3 text-slate-300 transition-all duration-150 shadow-xs"
                        title="Click to restore this backup standard in workspace"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-[#023D4A] flex items-center justify-center text-[#F25B24] shrink-0 border border-[#2d4952]">
                            <FileText size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-white uppercase tracking-tight truncate group-hover:text-[#F25B24] transition-colors">
                              {draft.title}
                            </h4>
                            <p className="text-[8px] text-slate-500 font-mono mt-0.5 tracking-wide">
                              {draft.timestamp}
                            </p>
                          </div>
                        </div>

                        {/* Actions block */}
                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newName = prompt("Rename your case study draft:", draft.title);
                              if (newName && newName.trim() !== "") {
                                const renamedList = drafts.map(d => 
                                  d.id === draft.id ? { ...d, title: newName.trim() } : d
                                );
                                saveDraftsToStorage(renamedList);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-[#F25B24] transition-colors rounded hover:bg-slate-800"
                            title="Rename Draft"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteDraft(draft.id, e)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors rounded hover:bg-slate-800"
                            title="Delete Draft"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Cabinet Info Box */}
            <div className="p-4 bg-[#1F2937] border-t border-[#374151] text-[9px] text-slate-500 select-none">
              <span className="font-extrabold text-slate-450 uppercase flex items-center gap-1.5 mb-1">
                🛡️ Safe Storage Standard
              </span>
              Saved drafts are locked to your local system configuration. They persist even when you refresh the page or restart your computer.
            </div>

          </div>
        )}

      </div>

      {/* RIGHT COLUMN: REALISTIC DOCUMENT WORKSPACE SANDBOX */}
      <div className="flex-1 h-full overflow-hidden bg-[#111827]">
        <CaseStudyPreview 
          data={data}
          onChangeData={setData}
          onDownload={handleDownload}
          onReset={handleReset}
          isDownloading={isDownloading}
        />
      </div>

    </div>
  );
}
