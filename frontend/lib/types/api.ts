// User & Authentication
export interface User {
  id: number;
  lastName: string;
  knowledgeTokens: number;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Modules
export interface Module {
  id: number;
  title: string;
  description?: string;
  order: number;
  characterVideoUrl?: string;
  overview?: string;
  objectives?: string[];
  completed?: boolean;
  resources?: Resource[];
}

// Resources
export type ResourceType = 'video' | 'flashcard' | 'quiz' | 'slides' | 'infographics' | 'report' | 'audio' | 'game';

export interface Resource {
  id: number;
  moduleId: number;
  type: ResourceType;
  title: string;
  order: number;
}

// Video
export interface Subtitle {
  start: number;
  end: number;
  text: string;
}

export interface Video {
  id: number;
  resourceId: number;
  videoUrl: string;
  duration?: string;
  thumbnailUrl?: string;
  subtitles?: Subtitle[];
}

// Quiz
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  hint?: string;
}

export interface Quiz {
  id: number;
  resourceId: number;
  passingScore: number;
  questionsPerAttempt: number;
}

export interface QuizAttemptRequest {
  answers: { [questionId: number]: number };
}

export interface QuizFeedback {
  questionId: number;
  question: string;
  selectedOption: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizAttemptResponse {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  feedback: QuizFeedback[];
}

// Flashcards
export interface Flashcard {
  id: number;
  resourceId: number;
  question: string;
  answer: string;
  order: number;
}

// Slides
export interface Slides {
  id: number;
  resourceId: number;
  pdfUrl: string;
  pageCount?: number;
}

// Infographics
export interface Infographic {
  id: number;
  resourceId: number;
  imageUrl: string;
  thumbnailUrl?: string;
  order: number;
}

// Reports
export interface Report {
  id: number;
  resourceId: number;
  content: string;
  order: number;
}

// Audio
export interface AudioFile {
  id: number;
  resourceId: number;
  audioUrl: string;
  duration?: string;
  subtitles?: Subtitle[];
  order: number;
}

// Game (Crossword)
export interface CrosswordClue {
  number: number;
  direction: 'across' | 'down';
  clue: string;
  answer: string;
  startRow: number;
  startCol: number;
}

export interface Game {
  id: number;
  resourceId: number;
  gridSize: number;
  clues: CrosswordClue[];
}

// Progress
export interface UserProgress {
  totalModules: number;
  completedCount: number;
  progress: number;
  completedModules: number[];
  knowledgeTokens: number;
}

// Search
export interface SearchResult {
  id: number;
  resourceId: number;
  resourceTitle: string;
  resourceType: ResourceType;
  contentType: 'report' | 'video_subtitle' | 'audio_subtitle';
  matchedText: string;
  timestamp?: number;
}
