import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MUSCLE_DATA } from '../../data/muscles';
import { Search, ChevronRight, Brain } from 'lucide-react';
import { Muscle } from '../../types';

export default function LibraryView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<Muscle | null>(null);

  const filteredMuscles = MUSCLE_DATA.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.innervation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <header className="bg-white px-6 sm:px-8 pt-8 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-0.5 bg-teal-600 rounded-full"></span>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Anatomy Reference</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, nerve, or action..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-teal-500 transition-all font-medium text-sm shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="muscle-search"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
        {filteredMuscles.map((muscle) => (
          <button
            key={muscle.id}
            onClick={() => setSelectedMuscle(muscle)}
            className="w-full bg-white p-5 rounded-2xl shadow-sm border border-slate-200 text-left flex items-center justify-between hover:border-teal-500 hover:shadow-md transition-all group active:scale-[0.99]"
            id={`muscle-row-${muscle.id}`}
          >
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors uppercase tracking-tight text-sm">
                {muscle.name}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">{muscle.innervation}</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-teal-50 transition-colors">
              <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-600" />
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selectedMuscle && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMuscle(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-t-[40px] sm:rounded-[32px] overflow-hidden shadow-2xl relative z-10 border border-slate-100"
            >
              <div className="h-1.5 w-12 bg-slate-200 rounded-full mx-auto mt-4 sm:hidden" />
              <div className="p-6 sm:p-10 max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.25em] flex items-center gap-2">
                       <span className="w-4 h-px bg-teal-400" /> Verified Clinical Entry
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
                      {selectedMuscle.name}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setSelectedMuscle(null)}
                    className="bg-slate-100 text-slate-400 hover:text-slate-900 p-3 rounded-full transition-colors"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <div className="bg-slate-50 rounded-3xl border border-slate-100 p-4 aspect-video sm:aspect-square flex items-center justify-center overflow-hidden shadow-inner group/preview relative">
                      <img 
                        src={selectedMuscle.imageUrl} 
                        alt={selectedMuscle.name}
                        className="max-w-full max-h-full object-contain rounded-xl transition-transform duration-700 group-hover/preview:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur px-2 py-1 rounded text-[8px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200">
                        Reference Visual
                      </div>
                    </div>
                    <div className="space-y-6">
                      <DetailSection label="Origin" content={selectedMuscle.origin} />
                      <DetailSection label="Insertion" content={selectedMuscle.insertion} />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-teal-50 p-6 rounded-3xl border border-teal-100 shadow-sm relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-2 opacity-5">
                         <Brain size={80} />
                       </div>
                       <DetailSection label="Innervation" content={selectedMuscle.innervation} color="teal" />
                       <div className="mt-6 pt-6 border-t border-teal-200/50">
                         <DetailSection label="Major Action" content={selectedMuscle.action} color="teal" />
                       </div>
                    </div>
                    <DetailSection label="Blood Supply" content={selectedMuscle.bloodSupply} />
                    {selectedMuscle.notes && (
                      <div className="bg-slate-50 p-5 rounded-2xl border-l-4 border-slate-300">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Clinical Insight</span>
                        <p className="text-sm text-slate-600 italic leading-relaxed font-medium">{selectedMuscle.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailSection({ label, content, color = 'slate' }: { label: string; content: string; color?: 'teal' | 'slate' }) {
  const accentClass = color === 'teal' ? 'text-teal-700' : 'text-slate-400';
  
  return (
    <div className="relative">
      <span className={`text-[10px] font-black ${accentClass} uppercase tracking-[0.2em] block mb-2`}>{label}</span>
      <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">{content}</p>
    </div>
  );
}
