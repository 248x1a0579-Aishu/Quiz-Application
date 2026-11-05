import React, { useState, useEffect } from 'react';
import { Category, Question } from '../types/quiz';
import { CATEGORIES, INITIAL_QUESTIONS } from '../data/initialQuestions';
import {
  fetchQuestionsForCategory,
  getBestScore,
  updateBestScore,
  getCustomQuestions,
  saveCustomQuestion,
  deleteCustomQuestion,
} from '../services/quizService';
import { HomeScreenView } from './screens/HomeScreenView';
import { QuizScreenView } from './screens/QuizScreenView';
import { ResultsScreenView } from './screens/ResultsScreenView';
import { AddQuestionScreenView } from './screens/AddQuestionScreenView';
import { QuestionDetailScreenView } from './screens/QuestionDetailScreenView';
import {
  RotateCcw,
  Wifi,
  WifiOff,
  Sparkles,
  Smartphone,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export const PhoneSimulator: React.FC = () => {
  // Navigation screen
  const [currentScreen, setCurrentScreen] = useState<
    'home' | 'quiz' | 'results' | 'add' | 'detail'
  >('home');

  // Simulated orientation and network status (Requirements 3 & 8)
  const [isLandscape, setIsLandscape] = useState(false);
  const [networkState, setNetworkState] = useState<'online' | 'offline'>('online');

  // Data states
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [bestScore, setBestScore] = useState<{ score: number; total: number; percentage: number }>({
    score: 0,
    total: 0,
    percentage: 0,
  });

  // Active quiz state
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES[0]);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [isNewBestRecord, setIsNewBestRecord] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Loading & error handling (Requirement 3: Loading, error with retry)
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Selected question for detail view
  const [detailQuestion, setDetailQuestion] = useState<Question | null>(null);

  // On mount, load stored state
  useEffect(() => {
    setCustomQuestions(getCustomQuestions());
    setBestScore(getBestScore());
  }, []);

  const handleStartQuiz = async (category: Category) => {
    setActiveCategory(category);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setValidationError(null);
    setIsNewBestRecord(false);
    setLoadError(null);

    // If simulated offline:
    if (networkState === 'offline') {
      setIsLoadingQuestions(true);
      setTimeout(() => {
        setIsLoadingQuestions(false);
        setLoadError('Simulated network offline: Unable to reach OpenTDB. Click Retry or switch to Online.');
      }, 700);
      setCurrentScreen('quiz');
      return;
    }

    setIsLoadingQuestions(true);
    setCurrentScreen('quiz');

    try {
      const res = await fetchQuestionsForCategory(category.name, category.apiCategoryId, 10);
      if (res.questions.length === 0) {
        setLoadError('No questions found for this category.');
      } else {
        setQuizQuestions(res.questions);
      }
    } catch {
      setLoadError('Failed to load questions. Open Trivia DB could be rate-limited.');
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleRetryLoad = () => {
    handleStartQuiz(activeCategory);
  };

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setValidationError(null);
  };

  const handleNextQuestion = () => {
    // Validation requirement: Prevent user from skipping without selecting an answer
    if (!selectedAnswer) {
      setValidationError('⚠️ Please select an answer to proceed to the next question!');
      return;
    }

    const currentQ = quizQuestions[currentQuestionIndex];
    let newScore = quizScore;
    if (currentQ && selectedAnswer === currentQ.correctAnswer) {
      newScore += 1;
      setQuizScore(newScore);
    }

    const isLast = currentQuestionIndex === quizQuestions.length - 1;
    if (!isLast) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setValidationError(null);
    } else {
      // Finished quiz! Update best score
      const result = updateBestScore(newScore, quizQuestions.length);
      setIsNewBestRecord(result.isNewBest);
      setBestScore(getBestScore());
      setCurrentScreen('results');
    }
  };

  const handleSaveQuestion = (newQ: Omit<Question, 'id'>) => {
    const saved = saveCustomQuestion(newQ);
    setCustomQuestions(getCustomQuestions());
    setCurrentScreen('home');
  };

  const handleDeleteQuestion = (id: string) => {
    deleteCustomQuestion(id);
    setCustomQuestions(getCustomQuestions());
  };

  const handleRestartQuiz = () => {
    handleStartQuiz(activeCategory);
  };

  const handleNavigateToDetail = (q: Question) => {
    setDetailQuestion(q);
    setCurrentScreen('detail');
  };

  const getCategoryQuestionCount = (cat: Category) => {
    const customCount = customQuestions.filter(
      (q) => q.category.toLowerCase() === cat.name.toLowerCase()
    ).length;
    return 10 + customCount;
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 lg:p-6 w-full max-w-5xl mx-auto">
      {/* Top Device Controls Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-purple-100 shadow-sm mb-5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            QM
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
              <span>Quiz Master</span>
              <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                Flutter 3.35+ Live Simulator
              </span>
            </h1>
            <p className="text-[11px] text-gray-500">
              Interactive testbed for Android & Flutter Web project
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Orientation Toggle (Requirement 8) */}
          <button
            onClick={() => setIsLandscape(!isLandscape)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-semibold border transition ${
              isLandscape
                ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
            title="Test screen rotation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isLandscape ? 'Landscape' : 'Portrait'}</span>
          </button>

          {/* Network State Toggle (Requirement 3: Error & Retry testing) */}
          <button
            onClick={() => {
              const nextState = networkState === 'online' ? 'offline' : 'online';
              setNetworkState(nextState);
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-semibold border transition ${
              networkState === 'online'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
            title="Toggle between online API and simulated network error"
          >
            {networkState === 'online' ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>API: Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-600" />
                <span>Simulate Offline</span>
              </>
            )}
          </button>

          {/* Quick Reset All Data */}
          <button
            onClick={() => {
              if (window.confirm('Reset all saved custom questions and best scores?')) {
                localStorage.removeItem('quiz_master_custom_questions');
                localStorage.removeItem('quiz_master_best_score');
                setCustomQuestions([]);
                setBestScore({ score: 0, total: 0, percentage: 0 });
                setCurrentScreen('home');
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent transition"
            title="Reset SharedPreferences storage"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Realistic Mobile Device Frame */}
      <div
        className={`transition-all duration-300 relative bg-gray-950 p-3 sm:p-4 rounded-[44px] shadow-2xl border-4 border-gray-800 ring-1 ring-black/30 ${
          isLandscape
            ? 'w-full max-w-[700px] h-[400px]'
            : 'w-full max-w-[390px] h-[720px]'
        }`}
      >
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full flex items-center justify-center space-x-2 z-30">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-900 border border-gray-800" />
          <div className="w-2 h-2 rounded-full bg-purple-900/40" />
        </div>

        {/* Screen Bezel and Display Container */}
        <div className="w-full h-full bg-[#F8F6FC] rounded-[34px] overflow-hidden flex flex-col relative border border-gray-700/50">
          {/* Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-bold text-gray-700 select-none bg-purple-100/40 border-b border-purple-200/50 shrink-0">
            <span>9:41</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] text-purple-700 font-bold">5G</span>
              {networkState === 'online' ? (
                <Wifi className="w-3 h-3 text-purple-700" />
              ) : (
                <WifiOff className="w-3 h-3 text-rose-600" />
              )}
              <div className="w-4 h-2 rounded-sm border border-gray-700 flex items-center p-0.5">
                <div className="w-full h-full bg-purple-700 rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Screen Body Router */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {currentScreen === 'home' && (
              <HomeScreenView
                bestScorePercentage={bestScore.percentage}
                customQuestions={customQuestions}
                onStartQuiz={handleStartQuiz}
                onNavigateToAddQuestion={() => setCurrentScreen('add')}
                onNavigateToQuestionDetail={handleNavigateToDetail}
                getQuestionCount={getCategoryQuestionCount}
              />
            )}

            {currentScreen === 'quiz' && (
              <>
                {isLoadingQuestions ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#F8F6FC] text-center">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin mb-4" />
                    <p className="text-sm font-bold text-purple-900">
                      Fetching questions from OpenTDB API...
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      Category: {activeCategory.name}
                    </p>
                  </div>
                ) : loadError ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#F8F6FC] text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">Connection Notice</h3>
                      <p className="text-xs text-gray-600 mt-1 max-w-xs">{loadError}</p>
                    </div>
                    <div className="flex flex-col w-full max-w-xs gap-2 pt-2">
                      <button
                        onClick={handleRetryLoad}
                        className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry Connection</span>
                      </button>
                      <button
                        onClick={() => {
                          // Fallback to offline questions
                          setQuizQuestions(
                            INITIAL_QUESTIONS.filter(
                              (q) => q.category.toLowerCase() === activeCategory.name.toLowerCase()
                            )
                          );
                          setLoadError(null);
                        }}
                        className="w-full bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold py-2 px-4 rounded-xl text-xs"
                      >
                        Use Saved Offline Questions
                      </button>
                    </div>
                  </div>
                ) : (
                  <QuizScreenView
                    categoryName={activeCategory.name}
                    questions={quizQuestions}
                    currentIndex={currentQuestionIndex}
                    selectedAnswer={selectedAnswer}
                    score={quizScore}
                    validationError={validationError}
                    onSelectAnswer={handleSelectAnswer}
                    onNextQuestion={handleNextQuestion}
                    onBackToHome={() => setCurrentScreen('home')}
                  />
                )}
              </>
            )}

            {currentScreen === 'results' && (
              <ResultsScreenView
                score={quizScore}
                total={quizQuestions.length}
                isNewBest={isNewBestRecord}
                onRestart={handleRestartQuiz}
                onBackToHome={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'add' && (
              <AddQuestionScreenView
                onBack={() => setCurrentScreen('home')}
                onSaveQuestion={handleSaveQuestion}
              />
            )}

            {currentScreen === 'detail' && detailQuestion && (
              <QuestionDetailScreenView
                question={detailQuestion}
                onBack={() => setCurrentScreen('home')}
                onDeleteQuestion={handleDeleteQuestion}
              />
            )}
          </div>

          {/* Android Navigation Pill Bar at Bottom */}
          <div className="h-4 flex items-center justify-center bg-[#F8F6FC] shrink-0">
            <div className="w-28 h-1 bg-gray-400/60 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
