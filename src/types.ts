export interface Muscle {
  id: string;
  name: string;
  origin: string;
  insertion: string;
  action: string;
  innervation: string;
  bloodSupply: string;
  notes: string;
  imageUrl: string;
}

export type ViewType = 'study' | 'quiz' | 'library' | 'home';

export type StudyMode = 'all' | 'starred';
export type FlashcardFront = 'image' | 'name';

export interface QuizQuestion {
  id: string;
  type: 'innervation' | 'action' | 'visual';
  muscle: Muscle;
  options: string[];
  correctAnswer: string;
  questionText: string;
}
