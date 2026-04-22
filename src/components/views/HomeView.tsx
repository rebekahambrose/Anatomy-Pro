import { ViewType } from '../../types';
import { BookOpen, Brain, Search, Activity, Award } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: ViewType) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <header className="bg-white px-6 sm:px-8 pt-10 pb-16 border-b border-slate-200 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-teal-50 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-0.5 bg-teal-600 rounded-full"></span>
            <span className="text-[10px] font-black text-teal-700 uppercase tracking-[0.25em]">Master Workspace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tighter uppercase">
            Performance <br /> <span className="text-teal-700">Analytics</span> & Lab
          </h1>
        </div>
      </header>

      <main className="px-6 sm:px-8 -mt-10 relative z-20 space-y-6">
        {/* Stats Card */}
        <div className="bg-teal-900 p-6 sm:p-8 rounded-[32px] shadow-xl shadow-teal-900/20 text-white border border-teal-800 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
             <Activity size={100} />
           </div>
           <div className="relative z-10">
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-2">
                 <div className="bg-teal-500/20 p-2 rounded-lg">
                   <Activity className="text-teal-400" size={18} />
                 </div>
                 <span className="text-xs font-bold text-teal-300 uppercase tracking-widest">Active Progress</span>
               </div>
               <Award className="text-teal-400" size={24} />
             </div>
             
             <div className="grid grid-cols-2 gap-8 divide-x divide-teal-800">
               <div>
                  <p className="text-4xl font-black text-white tracking-tighter">18</p>
                  <p className="text-[10px] font-bold text-teal-400 uppercase tracking-wider mt-1">Muscles Proficient</p>
               </div>
               <div className="pl-8">
                  <p className="text-4xl font-black text-white tracking-tighter">85<span className="text-teal-500 text-2xl">%</span></p>
                  <p className="text-[10px] font-bold text-teal-400 uppercase tracking-wider mt-1">Diagnostic Accuracy</p>
               </div>
             </div>
           </div>
        </div>

        {/* Action Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <QuickActionCard 
            title="Study Lab"
            subtitle="Identification Flashcards"
            icon={BookOpen}
            color="bg-white"
            iconColor="text-teal-700"
            onClick={() => onNavigate('study')}
            id="home-study"
          />
          <QuickActionCard 
            title="Diagnostic Quiz"
            subtitle="Clinical Assessment"
            icon={Brain}
            color="bg-white"
            iconColor="text-teal-700"
            onClick={() => onNavigate('quiz')}
            id="home-quiz"
          />
          <QuickActionCard 
            title="Reference"
            subtitle="Full Anatomy Library"
            icon={Search}
            color="bg-white"
            iconColor="text-slate-400"
            onClick={() => onNavigate('library')}
            id="home-library"
            className="sm:col-span-2"
          />
        </div>
      </main>

      <footer className="px-8 mt-12 mb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">© 2026 TEXAS TECH UNIVERSITY AT LAB</span>
        <div className="flex gap-4">
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
        </div>
      </footer>
    </div>
  );
}

function QuickActionCard({ 
  title, 
  subtitle, 
  icon: Icon, 
  color, 
  onClick, 
  iconColor,
  id,
  className = ""
}: { 
  title: string; 
  subtitle: string; 
  icon: any; 
  color: string; 
  onClick: () => void;
  iconColor: string;
  id?: string;
  className?: string;
}) {
  return (
    <button 
      onClick={onClick}
      className={`${color} ${className} p-5 sm:p-6 rounded-[28px] shadow-sm border border-slate-200 text-left flex items-center gap-4 sm:gap-6 group hover:border-teal-500 hover:shadow-md transition-all active:scale-[0.98]`}
      id={id}
    >
      <div className={`bg-slate-50 p-4 rounded-2xl ${iconColor} group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="font-black text-lg sm:text-xl uppercase tracking-tighter text-slate-900">{title}</h3>
        <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">{subtitle}</p>
      </div>
    </button>
  );
}
