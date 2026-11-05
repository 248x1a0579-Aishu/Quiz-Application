import React, { useState } from 'react';
import { PhoneSimulator } from './components/PhoneSimulator';
import { CodeExplorerTab } from './components/CodeExplorerTab';
import { CollegeGuideTab } from './components/CollegeGuideTab';
import { WidgetTestTab } from './components/WidgetTestTab';
import {
  Smartphone,
  FileCode2,
  GraduationCap,
  CheckCircle2,
  Download,
  Github,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { FLUTTER_CODE_FILES } from './data/flutterCodeFiles';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'guide' | 'tests'>('simulator');

  const handleDownloadAllCode = () => {
    // Generate an aggregated text package of all Flutter files with separator comments
    const allCodeContent = FLUTTER_CODE_FILES.map((f) => {
      return `// ========================================================\n// FILE: ${f.path}\n// CATEGORY: ${f.category}\n// DESCRIPTION: ${f.description}\n// ========================================================\n\n${f.code}\n\n`;
    }).join('\n');

    const blob = new Blob([allCodeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quiz_master_flutter_all_files.dart';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F4F1FA] text-gray-800 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Tag */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-purple-600/20">
              QM
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-gray-950 text-base sm:text-lg tracking-tight">
                  Quiz Master
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                  College Project
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">
                Flutter 3.35+ • Provider & ChangeNotifier • SharedPreferences • OpenTDB API
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-purple-50/80 p-1 rounded-2xl border border-purple-100">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'simulator'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-gray-600 hover:text-purple-700 hover:bg-white/50'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>App Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'code'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-gray-600 hover:text-purple-700 hover:bg-white/50'
              }`}
            >
              <FileCode2 className="w-4 h-4" />
              <span>Flutter Code ({FLUTTER_CODE_FILES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'guide'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-gray-600 hover:text-purple-700 hover:bg-white/50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Project Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'tests'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-gray-600 hover:text-purple-700 hover:bg-white/50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Widget Tests</span>
              <span className="sm:hidden">Tests</span>
            </button>
          </nav>

          {/* Quick Action */}
          <div className="hidden lg:flex items-center space-x-2">
            <button
              onClick={handleDownloadAllCode}
              className="flex items-center space-x-1.5 text-xs font-bold bg-white text-purple-700 hover:bg-purple-50 px-3.5 py-2 rounded-xl border border-purple-200 transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Flutter Files</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 py-4 sm:py-6">
        {activeTab === 'simulator' && <PhoneSimulator />}
        {activeTab === 'code' && <CodeExplorerTab />}
        {activeTab === 'guide' && <CollegeGuideTab />}
        {activeTab === 'tests' && <WidgetTestTab />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-purple-100 py-4 px-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Quiz Master • Academic Project Submission for Flutter Application Development</span>
          <div className="flex items-center gap-4 text-purple-700 font-semibold">
            <span>Team of 3 Collaboration</span>
            <span>•</span>
            <span>Android Release APK Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
