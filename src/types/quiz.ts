export interface Question {
  id: string;
  category: string;
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  options: string[]; // Shuffled 4 options
  isCustom?: boolean;
  explanation?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  iconName: string;
  apiCategoryId: number;
  description: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  selectedAnswer: string | null;
  userAnswers: { questionId: string; selectedAnswer: string; isCorrect: boolean }[];
  isCompleted: boolean;
}
