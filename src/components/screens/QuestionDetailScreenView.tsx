import React from 'react';
import { Question } from '../../types/quiz';
import { ArrowLeft, CheckCircle2, Trash2 } from 'lucide-react';

interface Props {
  question: Question;
  onBack: () => void;
  onDeleteQuestion?: (id: string) => void;
}

export const QuestionDetailScreenView: React.FC<Props> = ({
  question,
  onBack,
  onDeleteQuestion,
}) => {
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-[#F8F6FC] overflow-y-auto">
      <div className="space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1 text-gray-600 hover:text-purple-700 rounded-lg hover:bg-purple-100/50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-gray-800">Question Details</span>
          {question.isCustom && onDeleteQuestion ? (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this custom question?')) {
                  onDeleteQuestion(question.id);
                  onBack();
                }
              }}
              className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition"
              title="Delete Question"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-6" />
          )}
        </div>

        {/* Category & Source Badges */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            {question.category}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              question.isCustom
                ? 'bg-blue-100 text-blue-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {question.isCustom ? 'Custom Saved' : 'OpenTDB API'}
          </span>
        </div>

        {/* Question Box */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100">
          <p className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-1">
            Question Text
          </p>
          <h3 className="text-sm font-bold text-gray-900 leading-snug">
            {question.question}
          </h3>
        </div>

        {/* Options Breakdown */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-700">Options Breakdown</p>
          {question.options.map((opt, idx) => {
            const isCorrect = opt === question.correctAnswer;
            const letter = optionLetters[idx] || `${idx + 1}`;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between transition ${
                  isCorrect
                    ? 'bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-400'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCorrect
                        ? 'bg-emerald-600 text-white'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {letter}
                  </div>
                  <span
                    className={`text-xs ${
                      isCorrect ? 'font-bold text-emerald-950' : 'text-gray-700'
                    }`}
                  >
                    {opt}
                  </span>
                </div>

                {isCorrect && (
                  <div className="flex items-center space-x-1 text-emerald-700 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Correct Answer</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {question.explanation && (
          <div className="p-3 bg-purple-50 border border-purple-200/80 rounded-xl">
            <p className="text-[11px] font-bold text-purple-800 uppercase tracking-wider mb-0.5">
              Educational Note
            </p>
            <p className="text-xs text-purple-900/90 leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 pb-2">
        <button
          onClick={onBack}
          className="w-full bg-purple-700 hover:bg-purple-800 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-purple-900/10 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};
