/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navigation from './components/Navigation';
import HomeView from './components/views/HomeView';
import StudyView from './components/views/StudyView';
import QuizView from './components/views/QuizView';
import LibraryView from './components/views/LibraryView';
import { ViewType } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('home');

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Top Navigation Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-teal-700 rounded-md flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 flex items-center">
            Anatomy<span className="text-teal-700">Pro</span> 
            <span className="hidden sm:inline-block text-[10px] font-normal bg-slate-100 text-slate-500 px-2 py-0.5 rounded ml-2 uppercase tracking-wider">Graduate Student Ed.</span>
          </span>
        </div>
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Daily Goal</span>
            <div className="flex items-center">
              <div className="w-24 h-1.5 bg-slate-100 rounded-full mr-2 overflow-hidden">
                <div className="h-full bg-teal-600 w-3/4"></div>
              </div>
              <span className="text-xs font-semibold">45/60</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm">RO</div>
        </div>
      </header>

      <main className="flex-1 relative overflow-y-auto">
        <div className="min-h-full">
          {activeView === 'home' && <HomeView onNavigate={setActiveView} />}
          {activeView === 'study' && <StudyView />}
          {activeView === 'quiz' && <QuizView />}
          {activeView === 'library' && <LibraryView />}
        </div>
      </main>
      
      <Navigation activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
}
