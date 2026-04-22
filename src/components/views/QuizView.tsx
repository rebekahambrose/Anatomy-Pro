import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MUSCLE_DATA } from '../../data/muscles';
import { CheckCircle2, XCircle, Brain, Trophy } from 'lucide-react';
import { Muscle, QuizQuestion } from '../../types';

export default function QuizView() {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const generateQuestion = () => {
    const muscle = MUSCLE_DATA[Math.floor(Math.random() * MUSCLE_DATA.length)];
    const quizFormats: ('forward' | 'reverse' | 'visual')[] = ['forward', 'reverse', 'visual'];
    const format = quizFormats[Math.floor(Math.random() * quizFormats.length)];
    const questionTypes: ('innervation' | 'action' | 'visual')[] = ['innervation', 'action'];
    const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    let questionText = '';
    let correctAnswer = '';
    let options: string[] = [];

    if (format === 'visual') {
      questionText = "Clinical Case: Identify the highlighted muscle from the visual study above.";
      correctAnswer = muscle.name;
      
      const otherMuscles = MUSCLE_DATA.filter(m => m.id !== muscle.id);
      const distractors = otherMuscles
        .map(m => m.name)
        .filter(val => val !== correctAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
        
      options = [...distractors, correctAnswer].sort(() => Math.random() - 0.5);
    } else if (format === 'forward') {
      questionText = qType === 'innervation' 
        ? `Diagnostic Query: What is the correct innervation for the ${muscle.name}?`
        : `Functional Query: What is the primary action of the ${muscle.name}?`;
      correctAnswer = qType === 'innervation' ? muscle.innervation : muscle.action;
      
      const otherMuscles = MUSCLE_DATA.filter(m => m.id !== muscle.id);
      const distractors = otherMuscles
        .map(m => qType === 'innervation' ? m.innervation : m.action)
        .filter(val => val !== correctAnswer && val !== '')
        .filter((val, index, self) => self.indexOf(val) === index)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      options = [...distractors, correctAnswer].sort(() => Math.random() - 0.5);
    } else {
      questionText = qType === 'innervation'
        ? `Which muscle is innervated by the following nerve structure: ${muscle.innervation}?`
        : `Which muscle performs the following clinical action: ${muscle.action}?`;
      correctAnswer = muscle.name;
      
      const otherMuscles = MUSCLE_DATA.filter(m => m.id !== muscle.id);
      const distractors = otherMuscles
        .map(m => m.name)
        .filter(val => val !== correctAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
        
      options = [...distractors, correctAnswer].sort(() => Math.random() - 0.5);
    }

    setQuestion({
      id: Math.random().toString(36).substr(2, 9),
      type: format === 'visual' ? 'action' : qType as 'innervation' | 'action', // type doesn't matter much for display now
      muscle,
      options,
      correctAnswer,
      questionText
    });
    setSelectedOption(null);
    setIsCorrect(null);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;
    
    setSelectedOption(option);
    const correct = option === question?.correctAnswer;
    setIsCorrect(correct);
    setTotalQuestions(prev => prev + 1);
    if (correct) setScore(prev => prev + 1);
  };

  if (!question) return null;

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <main className="flex-1 p-4 sm:p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          <header className="mb-8 flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-teal-700 p-2.5 rounded-xl text-white shadow-lg shadow-teal-700/30">
                <Brain size={20} />
              </div>
              <div>
                <h1 className="text-slate-800 font-bold tracking-tight">Clinical Diagnosis</h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Diagnostic Master</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Performance</span>
              <span className="text-xl font-black text-teal-700 leading-none">
                {totalQuestions === 0 ? '0' : Math.round((score / totalQuestions) * 100)}%
              </span>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <div className="bg-white rounded-[32px] p-6 sm:p-10 shadow-sm border border-slate-200 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 pointer-events-none">
                  <Brain size={160} />
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-0.5 w-6 bg-teal-600 rounded-full"></span>
                  <span className="text-[10px] font-black text-teal-700 uppercase tracking-[0.2em]">
                    Diagnostic Challenge
                  </span>
                </div>

                {/* Display Image for Visual Identification */}
                {question.questionText.includes('Identify the highlighted muscle') && (
                  <div className="mb-6 bg-slate-50 rounded-2xl border border-slate-100 p-4 flex items-center justify-center max-h-[300px]">
                    <img 
                      src={question.muscle.imageUrl} 
                      alt="Diagnostic Visual" 
                      className="max-w-full max-h-[250px] object-contain rounded-xl shadow-md transition-all grayscale contrast-125"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">
                  {question.questionText}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {question.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrectOption = option === question.correctAnswer;
                  
                  let bgColor = 'bg-white hover:bg-slate-50';
                  let borderColor = 'border-slate-200';
                  let textColor = 'text-slate-700';

                  if (selectedOption) {
                    if (isCorrectOption) {
                      bgColor = 'bg-teal-50';
                      borderColor = 'border-teal-500';
                      textColor = 'text-teal-900';
                    } else if (isSelected) {
                      bgColor = 'bg-rose-50';
                      borderColor = 'border-rose-400';
                      textColor = 'text-rose-900';
                    } else {
                      bgColor = 'bg-white opacity-40';
                      borderColor = 'border-slate-100';
                      textColor = 'text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(option)}
                      disabled={!!selectedOption}
                      className={`w-full p-5 rounded-2xl border-2 ${borderColor} ${bgColor} ${textColor} text-left transition-all duration-300 flex items-center justify-between group active:scale-[0.98] shadow-sm`}
                      id={`quiz-option-${idx}`}
                    >
                      <span className="text-sm sm:text-base font-semibold leading-snug">{option}</span>
                      {selectedOption && (
                        isCorrectOption ? <CheckCircle2 className="text-teal-600 shrink-0" /> : 
                        isSelected ? <XCircle className="text-rose-500 shrink-0" /> : null
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {selectedOption && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={generateQuestion}
              className="w-full mt-8 bg-teal-700 text-white py-4 px-8 rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-teal-700/20 flex items-center justify-center gap-3 active:scale-95 transition-all text-sm"
              id="quiz-next"
            >
              Continue to Next Case
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}
        </div>
      </main>
    </div>
  );
}

function ArrowRight({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
