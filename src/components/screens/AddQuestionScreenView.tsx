import React, { useState } from 'react';
import { CATEGORIES } from '../../data/initialQuestions';
import { Question } from '../../types/quiz';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
  onSaveQuestion: (question: Omit<Question, 'id'>) => void;
}

export const AddQuestionScreenView: React.FC<Props> = ({ onBack, onSaveQuestion }) => {
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [selectedRadio, setSelectedRadio] = useState<'A' | 'B' | 'C' | 'D' | null>(null);

  // Field errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!questionText.trim()) {
      newErrors.question = 'Question text cannot be empty';
    } else if (questionText.trim().length < 8) {
      newErrors.question = 'Question must be at least 8 characters';
    }

    if (!optionA.trim()) newErrors.optA = 'Option A cannot be empty';
    if (!optionB.trim()) newErrors.optB = 'Option B cannot be empty';
    if (!optionC.trim()) newErrors.optC = 'Option C cannot be empty';
    if (!optionD.trim()) newErrors.optD = 'Option D cannot be empty';

    if (!selectedRadio) {
      newErrors.radio = 'Please select which option (A, B, C, or D) is the correct answer';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && selectedRadio) {
      const optionsMap = {
        A: optionA.trim(),
        B: optionB.trim(),
        C: optionC.trim(),
        D: optionD.trim(),
      };

      const correctAnswer = optionsMap[selectedRadio];
      const incorrectAnswers = ['A', 'B', 'C', 'D']
        .filter((letter) => letter !== selectedRadio)
        .map((letter) => optionsMap[letter as 'A' | 'B' | 'C' | 'D']);

      const allOptions = [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()];

      onSaveQuestion({
        category,
        question: questionText.trim(),
        correctAnswer,
        incorrectAnswers,
        options: allOptions,
        isCustom: true,
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-[#F8F6FC] overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1 text-gray-600 hover:text-purple-700 rounded-lg hover:bg-purple-100/50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-gray-900">Add Custom Question</h2>
            <p className="text-[11px] text-gray-500">Create a multiple choice quiz question</p>
          </div>
        </div>

        {/* Global radio error if needed */}
        {errors.radio && (
          <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.radio}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={validateAndSave} className="space-y-3.5">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Select Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs font-medium p-2.5 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Question Text *
            </label>
            <textarea
              rows={2}
              value={questionText}
              onChange={(e) => {
                setQuestionText(e.target.value);
                if (errors.question) setErrors((prev) => ({ ...prev, question: '' }));
              }}
              placeholder="e.g. What is the chemical formula for water?"
              className={`w-full text-xs font-medium p-2.5 bg-white border rounded-xl focus:ring-1 outline-none resize-none ${
                errors.question
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-gray-200 focus:border-purple-600 focus:ring-purple-600'
              }`}
            />
            {errors.question && (
              <p className="text-[10px] text-rose-600 font-medium mt-0.5">{errors.question}</p>
            )}
          </div>

          {/* 4 Options with Radio Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700">
                Four Options & Correct Answer *
              </label>
              <span className="text-[10px] text-purple-700 font-semibold">
                Select radio button for correct option
              </span>
            </div>

            <div className="space-y-2">
              {[
                { letter: 'A' as const, val: optionA, setVal: setOptionA, err: errors.optA },
                { letter: 'B' as const, val: optionB, setVal: setOptionB, err: errors.optB },
                { letter: 'C' as const, val: optionC, setVal: setOptionC, err: errors.optC },
                { letter: 'D' as const, val: optionD, setVal: setOptionD, err: errors.optD },
              ].map(({ letter, val, setVal, err }) => {
                const isSelectedAsCorrect = selectedRadio === letter;

                return (
                  <div key={letter} className="relative">
                    <div
                      className={`flex items-center space-x-2 p-1.5 rounded-xl border bg-white transition ${
                        isSelectedAsCorrect
                          ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/20'
                          : err
                          ? 'border-rose-300'
                          : 'border-gray-200 focus-within:border-purple-500'
                      }`}
                    >
                      {/* Radio button */}
                      <label className="flex items-center pl-1 cursor-pointer">
                        <input
                          type="radio"
                          name="correct_answer_radio"
                          checked={isSelectedAsCorrect}
                          onChange={() => {
                            setSelectedRadio(letter);
                            if (errors.radio) setErrors((prev) => ({ ...prev, radio: '' }));
                          }}
                          className="w-4 h-4 text-emerald-600 accent-emerald-600 focus:ring-emerald-500"
                        />
                        <span
                          className={`ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded ${
                            isSelectedAsCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {letter}
                        </span>
                      </label>

                      {/* Text Input */}
                      <input
                        type="text"
                        value={val}
                        placeholder={`Option ${letter} text`}
                        onChange={(e) => {
                          setVal(e.target.value);
                          if (err) {
                            setErrors((prev) => ({
                              ...prev,
                              [`opt${letter}`]: '',
                            }));
                          }
                        }}
                        className="flex-1 text-xs bg-transparent border-none outline-none font-medium px-1 py-1"
                      />

                      {isSelectedAsCorrect && (
                        <span className="text-[10px] font-bold text-emerald-700 pr-2">
                          Correct ✓
                        </span>
                      )}
                    </div>
                    {err && (
                      <p className="text-[10px] text-rose-600 font-medium px-2 mt-0.5">
                        {err}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-purple-900/10 transition flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Question</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
