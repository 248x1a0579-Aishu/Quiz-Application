import React, { useState } from 'react';
import { FLUTTER_CODE_FILES, FlutterFile } from '../data/flutterCodeFiles';
import {
  FileCode,
  Copy,
  Check,
  Download,
  FolderTree,
  Sparkles,
  Users,
} from 'lucide-react';

export const CodeExplorerTab: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_CODE_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getMemberTag = (path: string) => {
    if (path.includes('home_screen') || path.includes('category_')) {
      return { member: 'Member 1', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    }
    if (
      path.includes('quiz_screen') ||
      path.includes('results_screen') ||
      path.includes('quiz_api') ||
      path.includes('option_tile')
    ) {
      return { member: 'Member 2', color: 'bg-purple-100 text-purple-700 border-purple-200' };
    }
    if (
      path.includes('add_question') ||
      path.includes('storage_service') ||
      path.includes('test') ||
      path.includes('question_detail')
    ) {
      return { member: 'Member 3', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    }
    return { member: 'Shared Architecture', color: 'bg-gray-100 text-gray-700 border-gray-200' };
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 lg:p-6 space-y-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/10 backdrop-blur">
              <FolderTree className="w-5 h-5 text-purple-200" />
            </span>
            <h2 className="text-lg font-bold">Complete Flutter Project Source Files</h2>
          </div>
          <p className="text-xs text-purple-200 mt-1 max-w-xl">
            Clean, null-safe Dart files with Provider architecture, OpenTDB API integration,
            SharedPreferences persistence, and full unit/widget tests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-white text-purple-900 font-bold px-3.5 py-2 rounded-xl text-xs hover:bg-purple-50 transition shadow"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied File!' : 'Copy Active File'}</span>
          </button>
          <button
            onClick={handleDownloadSingle}
            className="flex items-center gap-1.5 bg-purple-700 hover:bg-purple-600 border border-purple-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Download .dart</span>
          </button>
        </div>
      </div>

      {/* Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Sidebar: File Tree */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-3 shadow-sm overflow-hidden flex flex-col h-[650px]">
          <div className="flex items-center justify-between px-2 py-1.5 mb-2 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Project Structure
            </span>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              {FLUTTER_CODE_FILES.length} Files
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {FLUTTER_CODE_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              const tag = getMemberTag(file.path);

              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-purple-50 border border-purple-300 font-bold text-purple-900 shadow-sm'
                      : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileCode
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-purple-700' : 'text-gray-400'
                      }`}
                    />
                    <span className="font-mono text-[11px] truncate">{file.path}</span>
                  </div>
                  <div className="flex items-center justify-between pl-6 text-[10px]">
                    <span className="text-gray-500 truncate max-w-[150px]">{file.filename}</span>
                    <span className={`px-1.5 py-0.2 rounded border font-semibold ${tag.color}`}>
                      {tag.member}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Code Display */}
        <div className="lg:col-span-8 bg-gray-900 text-gray-100 rounded-2xl border border-gray-800 shadow-sm overflow-hidden flex flex-col h-[650px]">
          {/* File Header Bar */}
          <div className="bg-gray-950 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-purple-300 font-bold pl-2">
                {selectedFile.path}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400 hidden sm:inline">
                {selectedFile.description}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-2.5 py-1 rounded-lg border border-gray-700 transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Code Viewer with Line Numbers */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-gray-200 bg-[#0D1117]">
            <pre className="whitespace-pre">
              <code>{selectedFile.code}</code>
            </pre>
          </div>

          {/* Footer note */}
          <div className="bg-gray-950 px-4 py-2 border-t border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
            <span>Location: <code className="text-purple-400">quiz_master/{selectedFile.path}</code></span>
            <span>Target: Flutter 3.35+ / Dart 3.3+</span>
          </div>
        </div>
      </div>
    </div>
  );
};
