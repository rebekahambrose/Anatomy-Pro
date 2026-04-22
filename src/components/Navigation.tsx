import { BookOpen, Brain, Search, LayoutGrid } from 'lucide-react';
import { ViewType } from '../types';

interface NavigationProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function Navigation({ activeView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: 'study', label: 'Study', icon: BookOpen },
    { id: 'quiz', label: 'Quiz', icon: Brain },
    { id: 'library', label: 'Library', icon: Search },
    { id: 'home', label: 'Dashboard', icon: LayoutGrid },
  ];

  return (
    <nav className="h-20 bg-white border-t border-slate-200 px-6 sm:px-12 flex justify-center shrink-0 safe-area-bottom z-50">
      <div className="w-full max-w-lg flex items-center justify-between">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewType)}
            className="flex flex-col items-center group transition-all"
            id={`nav-${item.id}`}
          >
            <div className={`p-2 rounded-xl mb-1 transition-all ${
              activeView === item.id 
                ? 'bg-teal-50 text-teal-700' 
                : 'text-slate-400 group-hover:bg-slate-50 group-hover:text-slate-600'
            }`}>
              <item.icon size={22} className={activeView === item.id ? 'stroke-[2.5px]' : 'stroke-2'} />
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${
              activeView === item.id ? 'text-teal-700' : 'text-slate-400'
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
