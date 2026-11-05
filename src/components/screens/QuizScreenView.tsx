import React from 'react';
import { Question } from '../../types/quiz';
import { ArrowLeft, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface Props {
  categoryName: string;
  questions: Question[];
  currentIndex: number;
  selectedAnswer: string | null;
  score: number;
  validationError: string | null;
  onSelectAnswer: (answer: string) => void;
  onNextQuestion: () => void;
  onBackToHome: () => void;
}

export const QuizScreenView: React.FC<Props> = ({
  categoryName,
  questions,
  currentIndex,
  selectedAnswer,
  score,
  validationError,
  onSelectAnswer,
  onNextQuestion,
  onBackToHome,
}) => {
  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const isLast = currentIndex === total - 1;
  const progressPercent = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

  if (!currentQuestion) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#F8F6FC] text-center">
        <p className="text-gray-600 font-semibold mb-4">No question loaded.</p>
        <button
          onClick={onBackToHome}
          className="bg-purple-700 text-white text-sm font-bold px-4 py-2 rounded-xl"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-[#F8F6FC] overflow-y-auto">
      <div className="space-y-4">
        {/* Top Bar with Category, Back button and Score badge */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="p-1.5 -ml-1 text-gray-600 hover:text-purple-700 rounded-lg hover:bg-purple-100/50 transition"
            title="Quit Quiz"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full uppercase tracking-wider">
              {categoryName}
            </span>
          </div>
          <div className="bg-purple-700 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-sm">
            Score: {score}
          </div>
        </div>

        {/* Progress Bar & Counter */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-gray-500">
            <span>
              Question {currentIndex + 1} of {total}
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-purple-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-700 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100/80">
          {currentQuestion.isCustom && (
            <span className="inline-block bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md mb-2">
              Custom Question
            </span>
          )}
          <h2 className="text-base font-bold text-gray-900 leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedAnswer === opt;
            const letter = optionLetters[idx] || `${idx + 1}`;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectAnswer(opt)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-150 flex items-center justify-between ${
                  isSelected
                    ? 'bg-purple-50 border-purple-600 shadow-sm ring-1 ring-purple-600'
                    : 'bg-white border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
                }`}
              >
                <div className="flex items-center space-x-3 pr-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-purple-700 text-white'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {letter}
                  </div>
                  <span
                    className={`text-xs font-semibold leading-relaxed ${
                      isSelected ? 'text-purple-950 font-bold' : 'text-gray-800'
                    }`}
                  >
                    {opt}
                  </span>
                </div>

                <div className="shrink-0 text-purple-700">
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 fill-purple-700 text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Validation Warning Notice if user tried to skip */}
        {validationError && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold animate-pulse">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Next / Submit Button */}
      <div className="pt-4 pb-2">
        <button
          onClick={onNextQuestion}
          className="w-full bg-purple-700 hover:bg-purple-800 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-purple-900/10 transition flex items-center justify-center space-x-2"
        >
          <span>{isLast ? 'Submit Quiz' : 'Next Question'}</span>
        </button>
      </div>
    </div>
  );
};
