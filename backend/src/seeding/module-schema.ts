import { z } from 'zod';

const SubtitleSchema = z.object({
  start: z.number(),
  end: z.number(),
  text: z.string(),
});

const VideoSchema = z.object({
  title: z.string(),
  videoUrl: z.string().url(),
  duration: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  subtitles: z.array(SubtitleSchema).optional(),
});

const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).min(2),
  correctAnswer: z.number(),
  hint: z.string().optional(),
  correctExplanation: z.string().optional(),
  incorrectExplanation: z.string().optional(),
});

const QuizSchema = z.object({
  passingScore: z.number().default(80),
  questionsPerAttempt: z.number().default(5),
  questions: z.array(QuizQuestionSchema).min(1),
});

const FlashcardSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const SlideSchema = z.object({
  pdfUrl: z.string().url(),
  pageCount: z.number().optional(),
});

const InfographicSchema = z.object({
  title: z.string(),
  imageUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
});

const ReportSchema = z.object({
  title: z.string(),
  content: z.string(),
});

const AudioSchema = z.object({
  title: z.string(),
  audioUrl: z.string().url(),
  duration: z.string().optional(),
  subtitles: z.array(SubtitleSchema).optional(),
});

const CrosswordClueSchema = z.object({
  number: z.number(),
  direction: z.enum(['across', 'down']),
  clue: z.string(),
  answer: z.string(),
  startRow: z.number(),
  startCol: z.number(),
});

const GameSchema = z.object({
  gridSize: z.number(),
  clues: z.array(CrosswordClueSchema),
});

const ResourcesSchema = z.object({
  videos: z.array(VideoSchema).optional(),
  quiz: QuizSchema.optional(),
  flashcards: z.array(FlashcardSchema).optional(),
  slides: SlideSchema.optional(),
  infographics: z.array(InfographicSchema).optional(),
  reports: z.array(ReportSchema).optional(),
  audio: z.array(AudioSchema).optional(),
  game: GameSchema.optional(),
});

export const ModuleSchema = z.object({
  order: z.number(),
  title: z.string(),
  description: z.string().optional(),
  characterVideoUrl: z.string().url().optional(),
  overview: z.string().optional(),
  objectives: z.array(z.string()).optional(),
  resources: ResourcesSchema,
});

export type ModuleData = z.infer<typeof ModuleSchema>;
