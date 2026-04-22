import { useState, useEffect, useMemo, useRef, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MUSCLE_DATA } from '../../data/muscles';
import { ArrowRight, ArrowLeft, RefreshCw, Star, Settings2, Layout, Rotate3d, Info, CheckCircle2 } from 'lucide-react';
import { StudyMode, FlashcardFront } from '../../types';

export default function StudyView() {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0); // For slide transitions
  
  // Settings & Filter State
  const [frontType, setFrontType] = useState<FlashcardFront>(() => {
    return (localStorage.getItem('anatomy_study_front_type') as FlashcardFront) || 'image';
  });
  const [studyMode, setStudyMode] = useState<StudyMode>(() => {
    return (localStorage.getItem('anatomy_study_mode') as StudyMode) || 'all';
  });
  const [starredIds, setStarredIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('anatomy_starred_muscles');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [showSettings, setShowSettings] = useState(false);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('anatomy_study_front_type', frontType);
  }, [frontType]);

  useEffect(() => {
    localStorage.setItem('anatomy_study_mode', studyMode);
  }, [studyMode]);

  useEffect(() => {
    localStorage.setItem('anatomy_starred_muscles', JSON.stringify(Array.from(starredIds)));
  }, [starredIds]);

  // Filtered source data
  const sourceData = useMemo(() => {
    if (studyMode === 'starred') {
      const filtered = MUSCLE_DATA.filter(m => starredIds.has(m.id));
      return filtered.length > 0 ? filtered : MUSCLE_DATA;
    }
    return MUSCLE_DATA;
  }, [studyMode, starredIds]);

  // Ensure index is valid
  useEffect(() => {
    if (index >= sourceData.length) setIndex(0);
  }, [sourceData, index]);

  const muscle = sourceData[index] || MUSCLE_DATA[0];

  const handleNext = () => {
    setDirection(1);
    setIsFlipped(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % sourceData.length);
    }, 50);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIsFlipped(false);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + sourceData.length) % sourceData.length);
    }, 50);
  };

  const toggleStar = (id: string, e?: MouseEvent) => {
    e?.stopPropagation();
    const next = new Set(starredIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setStarredIds(next);
  };

  const toggleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="flex flex-col min-h-full bg-slate-50 text-slate-900 font-sans">
      {/* Header Bar */}
      <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white relative z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
            <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Flashcard Progress</span>
            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-teal-600 transition-all duration-500" 
                    style={{ width: `${((index + 1) / sourceData.length) * 100}%` }}
                />
            </div>
            <span className="text-[10px] font-bold text-slate-500">{index + 1} / {sourceData.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
            <button 
                onClick={() => setStudyMode(studyMode === 'all' ? 'starred' : 'all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    studyMode === 'starred' 
                    ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
                }`}
            >
                <Star size={14} className={studyMode === 'starred' ? 'fill-amber-500 text-amber-500' : ''} />
                {studyMode === 'starred' ? 'Starred Only' : 'All Muscles'}
            </button>
            
            <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2.5 rounded-xl transition-all border shadow-sm ${showSettings ? 'bg-teal-700 border-teal-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-900'}`}
            >
                <Settings2 size={18} />
            </button>
        </div>
      </div>

      <main className="flex-1 relative flex flex-col items-center justify-center p-4 sm:p-8">
        {/* Settings Dropdown */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-2 right-4 z-[60] w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-5"
            >
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Study Configuration</h4>
               <div className="space-y-2">
                 <button 
                    onClick={() => setFrontType('image')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold transition-all ${frontType === 'image' ? 'bg-teal-50 border-teal-500 text-teal-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                 >
                    <span>IMAGE ON FRONT</span>
                    <Layout size={14} />
                 </button>
                 <button 
                    onClick={() => setFrontType('name')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold transition-all ${frontType === 'name' ? 'bg-teal-50 border-teal-500 text-teal-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                 >
                    <span>NAME ON FRONT</span>
                    <Layout size={14} />
                 </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Card Container */}
        <div className="relative w-full max-w-3xl aspect-[4/5] sm:aspect-[4/3] perspective-1000 group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={muscle.id}
                    initial={{ x: direction * 100, opacity: 0, scale: 0.95 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: -direction * 100, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="w-full h-full relative preserve-3d"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <motion.div 
                        className="w-full h-full cursor-pointer relative"
                        initial={false}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.7, type: "spring", stiffness: 200, damping: 25 }}
                        style={{ transformStyle: 'preserve-3d' }}
                        onClick={toggleFlip}
                    >
                        {/* FRONT FACE */}
                        <div 
                            className="absolute inset-0 w-full h-full bg-white border border-slate-200 rounded-[40px] shadow-xl flex flex-col items-center justify-center p-8 backface-hidden overflow-hidden"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            <div className="absolute top-8 left-8 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question Phase</span>
                            </div>

                            <button 
                                onClick={(e) => toggleStar(muscle.id, e)}
                                className={`absolute top-8 right-8 p-3 rounded-2xl border transition-all shadow-sm ${starredIds.has(muscle.id) ? 'bg-amber-50 border-amber-300 text-amber-500' : 'bg-slate-50 border-slate-200 text-slate-300 hover:text-amber-500 hover:bg-white'}`}
                            >
                                <Star size={24} className={starredIds.has(muscle.id) ? 'fill-amber-500' : ''} />
                            </button>

                            <div className="w-full max-w-[80%] h-[70%] flex items-center justify-center">
                                {frontType === 'image' ? (
                                    <img 
                                        src={muscle.imageUrl} 
                                        alt="Muscle visual" 
                                        className="max-w-full max-h-full object-contain rounded-2xl shadow-sm filter drop-shadow-lg"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="text-center px-4">
                                        <span className="text-teal-600 text-[11px] font-black uppercase tracking-[0.4em] block mb-6 opacity-70">Structural Identification</span>
                                        <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-slate-800 leading-none">{muscle.name}</h2>
                                        <p className="mt-8 text-slate-400 text-sm italic font-medium">Click to reveal clinical report & visual</p>
                                    </div>
                                )}
                            </div>

                            <div className="absolute bottom-10 flex flex-col items-center gap-2 text-slate-400 opacity-40">
                                <Rotate3d size={24} />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Toggle Flip</span>
                            </div>
                        </div>

                        {/* BACK FACE */}
                        <div 
                            className="absolute inset-0 w-full h-full bg-white border border-teal-200 rounded-[40px] shadow-2xl flex flex-col backface-hidden overflow-hidden"
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                            <div className="flex-1 overflow-y-auto p-8 sm:p-12 custom-scrollbar">
                                <div className="flex justify-between items-start mb-10 pb-8 border-b border-slate-100">
                                    <div>
                                        <span className="text-teal-600 text-[10px] font-black uppercase tracking-widest block mb-1">Clinical Solution</span>
                                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">{muscle.name}</h2>
                                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest italic tracking-tight">m. {muscle.name.toLowerCase()}</p>
                                    </div>
                                    <button 
                                        onClick={(e) => toggleStar(muscle.id, e)}
                                        className={`p-3 rounded-2xl border transition-all shadow-sm ${starredIds.has(muscle.id) ? 'bg-amber-50 border-amber-300 text-amber-500' : 'bg-slate-50 border-slate-200 text-slate-300'}`}
                                    >
                                        <Star size={24} className={starredIds.has(muscle.id) ? 'fill-amber-500' : ''} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    {/* Medical Data */}
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 gap-6">
                                            <BackSection label="Origin" content={muscle.origin} />
                                            <BackSection label="Insertion" content={muscle.insertion} />
                                            <BackSection label="Primary Action" content={muscle.action} />
                                        </div>
                                        
                                        <div className="bg-teal-50/50 p-6 rounded-3xl border border-teal-100 shadow-inner">
                                            <label className="text-[10px] font-black text-teal-700 uppercase tracking-widest block mb-2">Innervation Pathway</label>
                                            <p className="text-lg font-black text-slate-800 leading-tight">{muscle.innervation}</p>
                                        </div>

                                        <BackSection label="Blood Supply" content={muscle.bloodSupply} />
                                    </div>

                                    {/* Large Visual Reference - Especially if Name was on front */}
                                    <div className="space-y-8">
                                        <div className="bg-slate-50 rounded-3xl border border-slate-100 p-4 aspect-square flex items-center justify-center shadow-inner group/ref relative">
                                            <img 
                                                src={muscle.imageUrl} 
                                                alt="Anatomic visual" 
                                                className="max-w-full max-h-full object-contain filter contrast-110 brightness-105 drop-shadow-lg rounded-xl"
                                                referrerPolicy="no-referrer"
                                            />
                                            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-2 py-1 rounded text-[8px] font-black text-slate-500 uppercase tracking-widest shadow-sm">REFERENCE CADAVER</div>
                                        </div>

                                        {muscle.notes && (
                                            <div className="bg-amber-50/30 p-5 rounded-2xl border-l-4 border-amber-400">
                                                <label className="text-[9px] font-black text-amber-700 uppercase tracking-widest block mb-2">Clinical Insights</label>
                                                <p className="text-xs italic text-slate-600 leading-relaxed font-semibold">{muscle.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-3">
                                <div className="w-2 h-0.5 bg-teal-500 rounded-full" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Integrated Study Suite</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Navigation Interface - Ensuring high visibility */}
        <div className="mt-12 sm:mt-16 flex items-center gap-4 sm:gap-8 w-full max-w-2xl justify-between">
            <button 
                onClick={handlePrev}
                className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-[32px] bg-white border border-slate-200 text-slate-400 hover:text-teal-600 hover:border-teal-500 hover:shadow-xl hover:shadow-teal-100 transition-all active:scale-90 shadow-md group"
                id="study-prev"
            >
                <ArrowLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
            </button>

            <button 
                onClick={toggleFlip}
                className={`flex-1 h-16 sm:h-20 rounded-[32px] font-black uppercase tracking-[0.25em] text-sm transition-all shadow-xl flex items-center justify-center gap-4 active:scale-[0.98] ${
                    isFlipped 
                    ? 'bg-teal-700 text-white shadow-teal-700/20 hover:bg-teal-800' 
                    : 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-black'
                }`}
            >
                {isFlipped ? 'Back to Question' : 'Reveal Answer'}
                <RefreshCw size={22} className={`${isFlipped ? 'rotate-180' : 'rotate-0'} transition-transform duration-700`} />
            </button>

            <button 
                onClick={handleNext}
                className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-[32px] bg-white border border-slate-200 text-slate-400 hover:text-teal-600 hover:border-teal-500 hover:shadow-xl hover:shadow-teal-100 transition-all active:scale-90 shadow-md group"
                id="study-next"
            >
                <ArrowRight size={32} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </main>

      <style>{`
        .perspective-1000 {
            perspective: 1500px;
        }
        .preserve-3d {
            transform-style: preserve-3d;
        }
        .backface-hidden {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
      `}</style>
    </div>
  );
}

function BackSection({ label, content }: { label: string; content: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
      <p className="text-base font-bold text-slate-800 leading-snug">{content}</p>
    </div>
  );
}
