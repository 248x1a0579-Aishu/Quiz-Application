import React from 'react';
import { CATEGORIES } from '../../data/initialQuestions';
import { Category, Question } from '../../types/quiz';
import {
  Trophy,
  Play,
  PlusCircle,
  Globe,
  Atom,
  Laptop,
  Calculator,
  ChevronRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface Props {
  bestScorePercentage: number;
  customQuestions: Question[];
  onStartQuiz: (category: Category) => void;
  onNavigateToAddQuestion: () => void;
  onNavigateToQuestionDetail: (q: Question) => void;
  getQuestionCount: (cat: Category) => number;
}

export const HomeScreenView: React.FC<Props> = ({
  bestScorePercentage,
  customQuestions,
  onStartQuiz,
  onNavigateToAddQuestion,
  onNavigateToQuestionDetail,
  getQuestionCount,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-6 h-6 text-purple-600" />;
      case 'Atom':
        return <Atom className="w-6 h-6 text-purple-600" />;
      case 'Laptop':
        return <Laptop className="w-6 h-6 text-purple-600" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-purple-600" />;
      default:
        return <Globe className="w-6 h-6 text-purple-600" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F6FC]">
      {/* Best Score Banner */}
      <div className="rounded-2xl p-5 text-white bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 shadow-md shadow-purple-900/10 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Trophy className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-purple-200 font-semibold">Your Best Score</p>
              <h2 className="text-3xl font-extrabold tracking-tight mt-0.5">{bestScorePercentage}%</h2>
            </div>
          </div>
          <button
            onClick={() => onStartQuiz(CATEGORIES[0])}
            className="flex items-center space-x-1.5 bg-white text-purple-700 font-bold px-3.5 py-2 rounded-xl text-sm shadow hover:bg-purple-50 active:scale-95 transition"
          >
            <Play className="w-4 h-4 fill-purple-700" />
            <span>Play</span>
          </button>
        </div>
      </div>

      {/* Header and Add Button */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Quiz Categories</h3>
          <p className="text-xs text-gray-500">Choose a subject to test your skills</p>
        </div>
        <button
          onClick={onNavigateToAddQuestion}
          className="flex items-center space-x-1 text-xs font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 px-2.5 py-1.5 rounded-lg transition"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Question</span>
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-2.5">
        {CATEGORIES.map((cat) => {
          const count = getQuestionCount(cat);
          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-4 border border-purple-100/70 shadow-sm hover:shadow transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                  {getCategoryIcon(cat.iconName)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-base group-hover:text-purple-700 transition">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                    {count} Questions Available
                  </p>
                </div>
              </div>
              <button
                onClick={() => onStartQuiz(cat)}
                className="bg-purple-700 hover:bg-purple-800 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-1"
              >
                <span>Start</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Saved Custom Questions Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-purple-700" />
            <h4 className="font-bold text-gray-800 text-sm">Question Library ({customQuestions.length})</h4>
          </div>
          <span className="text-[11px] text-gray-500 font-medium">Tap to view details</span>
        </div>

        {customQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-4 text-center border border-dashed border-purple-200">
            <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-gray-700">No custom questions added yet</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Use the "Add Question" button to create your own!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5">
            {customQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => onNavigateToQuestionDetail(q)}
                className="w-full text-left bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:border-purple-300 transition flex items-center justify-between"
              >
                <div className="overflow-hidden pr-2">
                  <p className="text-xs font-semibold text-gray-800 truncate">{q.question}</p>
                  <span className="inline-block text-[10px] bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full mt-1">
                    {q.category}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
