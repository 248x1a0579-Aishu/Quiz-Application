import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, RefreshCw, Home, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  score: number;
  total: number;
  isNewBest: boolean;
  onRestart: () => void;
  onBackToHome: () => void;
}

export const ResultsScreenView: React.FC<Props> = ({
  score,
  total,
  isNewBest,
  onRestart,
  onBackToHome,
}) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  useEffect(() => {
    // Fire celebration confetti if score is >= 50%
    if (percentage >= 50) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#7C3AED', '#A855F7', '#F59E0B', '#10B981'],
        });
      } catch {
        // ignore in non-browser env
      }
    }
  }, [percentage]);

  let headline = 'Keep Practicing!';
  let subline = 'Review the topics and try again to improve your score.';
  let badgeColor = 'text-orange-500 bg-orange-100 border-orange-200';
  let badgeIcon = <Award className="w-12 h-12 text-orange-500" />;

  if (percentage >= 80) {
    headline = 'Outstanding Performance! 🏆';
    subline = 'You have mastered this category with flying colors!';
    badgeColor = 'text-amber-500 bg-amber-100 border-amber-200';
    badgeIcon = <Trophy className="w-12 h-12 text-amber-500" />;
  } else if (percentage >= 50) {
    headline = 'Well Done! Great Effort! 👍';
    subline = 'You demonstrated a solid understanding of the questions.';
    badgeColor = 'text-purple-600 bg-purple-100 border-purple-200';
    badgeIcon = <Award className="w-12 h-12 text-purple-600" />;
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#F8F6FC] overflow-y-auto">
      <div className="space-y-5 text-center pt-2">
        {/* Celebration Trophy Icon */}
        <div className="flex justify-center">
          <div className={`p-4 rounded-3xl border-2 shadow-sm ${badgeColor}`}>
            {badgeIcon}
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{headline}</h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">{subline}</p>
        </div>

        {/* New Best Score Badge */}
        {isNewBest && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            <span>✨ New Personal Best Score!</span>
          </div>
        )}

        {/* Score Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100">
          <div className="text-4xl font-black text-purple-700 tracking-tight">
            {percentage}%
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
            Total Score: {score} / {total}
          </p>

          <div className="w-full h-px bg-gray-100 my-4" />

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-600 mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">Correct</span>
              </div>
              <span className="text-base font-extrabold text-emerald-700">{score}</span>
            </div>

            <div className="p-2 rounded-xl bg-rose-50 text-center">
              <div className="flex items-center justify-center gap-1 text-rose-600 mb-0.5">
                <XCircle className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">Incorrect</span>
              </div>
              <span className="text-base font-extrabold text-rose-700">{total - score}</span>
            </div>

            <div className="p-2 rounded-xl bg-purple-50 text-center">
              <div className="flex items-center justify-center gap-1 text-purple-700 mb-0.5">
                <Award className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">Total</span>
              </div>
              <span className="text-base font-extrabold text-purple-700">{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-4 pb-2">
        <button
          onClick={onRestart}
          className="w-full bg-purple-700 hover:bg-purple-800 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-purple-900/10 transition flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Restart Quiz</span>
        </button>

        <button
          onClick={onBackToHome}
          className="w-full bg-white hover:bg-purple-50 active:scale-[0.99] text-purple-700 font-bold py-3 px-4 rounded-xl border-2 border-purple-200 transition flex items-center justify-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};
