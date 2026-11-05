import { Question } from '../types/quiz';
import { INITIAL_QUESTIONS } from '../data/initialQuestions';

const STORAGE_CUSTOM_KEY = 'quiz_master_custom_questions';
const STORAGE_BEST_SCORE_KEY = 'quiz_master_best_score';

// Helper to decode HTML entities like &quot;, &#039;, &amp; returned by OpenTDB
export function decodeHtml(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

export function getCustomQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load custom questions from localStorage', e);
    return [];
  }
}

export function saveCustomQuestion(q: Omit<Question, 'id'>): Question {
  const customList = getCustomQuestions();
  const newQuestion: Question = {
    ...q,
    id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    isCustom: true,
  };
  customList.unshift(newQuestion);
  localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(customList));
  return newQuestion;
}

export function deleteCustomQuestion(id: string): void {
  const customList = getCustomQuestions().filter((q) => q.id !== id);
  localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(customList));
}

export function getBestScore(): { score: number; total: number; percentage: number } {
  try {
    const raw = localStorage.getItem(STORAGE_BEST_SCORE_KEY);
    if (!raw) return { score: 0, total: 0, percentage: 0 };
    return JSON.parse(raw);
  } catch {
    return { score: 0, total: 0, percentage: 0 };
  }
}

export function updateBestScore(score: number, total: number): { isNewBest: boolean; percentage: number } {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const current = getBestScore();
  let isNewBest = false;

  if (current.total === 0 || percentage > current.percentage) {
    localStorage.setItem(
      STORAGE_BEST_SCORE_KEY,
      JSON.stringify({ score, total, percentage, updatedAt: new Date().toISOString() })
    );
    isNewBest = true;
  }
  return { isNewBest, percentage };
}

// Fetch questions for a category from OpenTDB with graceful fallback
export async function fetchQuestionsForCategory(
  categoryName: string,
  apiCategoryId: number,
  amount: number = 10
): Promise<{ questions: Question[]; fromApi: boolean; error?: string }> {
  const customMatching = getCustomQuestions().filter(
    (q) => q.category.toLowerCase() === categoryName.toLowerCase()
  );
  const fallbackMatching = INITIAL_QUESTIONS.filter(
    (q) => q.category.toLowerCase() === categoryName.toLowerCase()
  );

  try {
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${apiCategoryId}&type=multiple`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    if (data.response_code === 0 && Array.isArray(data.results) && data.results.length > 0) {
      const apiQuestions: Question[] = data.results.map((item: any, idx: number) => {
        const decodedCorrect = decodeHtml(item.correct_answer);
        const decodedIncorrect = (item.incorrect_answers || []).map((ans: string) => decodeHtml(ans));
        // Shuffle options
        const allOpts = [...decodedIncorrect, decodedCorrect].sort(() => Math.random() - 0.5);

        return {
          id: `api-${item.category}-${idx}-${Date.now()}`,
          category: categoryName,
          question: decodeHtml(item.question),
          correctAnswer: decodedCorrect,
          incorrectAnswers: decodedIncorrect,
          options: allOpts,
          isCustom: false,
        };
      });

      // Mix in any user custom questions for this category
      const combined = [...customMatching, ...apiQuestions];
      return { questions: combined.slice(0, 10), fromApi: true };
    } else {
      // response_code 1 (no results) or 5 (rate limit)
      const combined = [...customMatching, ...fallbackMatching];
      return {
        questions: combined,
        fromApi: false,
        error: 'Rate limit or no new questions from API. Displaying saved questions.',
      };
    }
  } catch (err: any) {
    console.warn('OpenTDB API unreachable, falling back to local questions:', err);
    const combined = [...customMatching, ...fallbackMatching];
    return {
      questions: combined,
      fromApi: false,
      error: 'Could not connect to OpenTDB API. Using locally stored questions.',
    };
  }
}
