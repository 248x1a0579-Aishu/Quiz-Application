import React, { useState } from 'react';
import {
  BookOpen,
  GitBranch,
  Terminal,
  Smartphone,
  CheckCircle,
  HelpCircle,
  Download,
  Users,
  Layers,
  Sparkles,
} from 'lucide-react';

export const CollegeGuideTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'setup' | 'github' | 'run' | 'apk' | 'web'>('setup');

  return (
    <div className="w-full max-w-5xl mx-auto p-4 lg:p-6 space-y-6">
      {/* Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'setup', label: '1. Android Studio Setup', icon: Terminal },
          { id: 'github', label: '2. 3-Member GitHub Workflow', icon: GitBranch },
          { id: 'run', label: '3. Run on Phone / Emulator', icon: Smartphone },
          { id: 'apk', label: '4. Build Release APK', icon: Download },
          { id: 'web', label: '5. Run on Flutter Web', icon: Layers },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Panels */}
      {activeSection === 'setup' && (
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-700" />
              <span>Creating the Flutter Project in Android Studio (Step-by-Step)</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Follow these simple steps in Android Studio to set up Quiz Master without any confusion.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-900">Open Android Studio and Create Project</h4>
                <p className="text-xs text-gray-600">
                  Launch Android Studio and click <strong>New Flutter Project</strong>. If you do not see this option, ensure the <strong>Flutter</strong> and <strong>Dart</strong> plugins are installed under <em>Plugins / Marketplace</em>.
                </p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded-xl font-mono text-xs mt-2">
                  <span className="text-gray-400"># Alternatively, run from terminal:</span><br />
                  flutter create --org com.quizmaster quiz_master
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-900">Set Project Metadata</h4>
                <p className="text-xs text-gray-600">
                  Set <strong>Project name</strong> to <code>quiz_master</code>, <strong>Project type</strong> to <code>Application</code>, and check both <strong>Android</strong> and <strong>Web</strong> under Platforms.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-900">Configure Dependencies in pubspec.yaml</h4>
                <p className="text-xs text-gray-600">
                  Open <code>pubspec.yaml</code> in the root of your project and paste the required dependencies (Provider, HTTP, SharedPreferences, HtmlUnescape). Then run:
                </p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded-xl font-mono text-xs mt-2">
                  flutter pub get
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0 text-xs">
                4
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-900">Create Folder Architecture</h4>
                <p className="text-xs text-gray-600">
                  Inside the <code>lib/</code> directory, right-click and create 5 folders:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
                  {['models/', 'services/', 'providers/', 'screens/', 'widgets/'].map((folder) => (
                    <div key={folder} className="p-2 bg-purple-50 border border-purple-200 rounded-xl text-center font-mono text-xs font-bold text-purple-800">
                      lib/{folder}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'github' && (
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-700" />
              <span>3-Member Team Collaboration Strategy via GitHub</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              How Member 1, Member 2, and Member 3 work in parallel without merge conflicts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Member 1 */}
            <div className="p-4 rounded-2xl border-2 border-blue-200 bg-blue-50/40 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                Member 1 Responsibility
              </span>
              <h4 className="font-bold text-gray-900 text-sm">Home Screen & Categories</h4>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li><code>lib/screens/home_screen.dart</code></li>
                <li><code>lib/models/category_model.dart</code></li>
                <li><code>lib/widgets/category_card.dart</code></li>
                <li>Best score display integration</li>
              </ul>
              <div className="bg-white p-2.5 rounded-xl border border-blue-200 font-mono text-[11px] text-blue-900">
                git checkout -b feature/home-screen<br />
                git commit -m "feat: build home screen and categories"
              </div>
            </div>

            {/* Member 2 */}
            <div className="p-4 rounded-2xl border-2 border-purple-200 bg-purple-50/40 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                Member 2 Responsibility
              </span>
              <h4 className="font-bold text-gray-900 text-sm">Quiz Question & Results Screen</h4>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li><code>lib/screens/quiz_screen.dart</code></li>
                <li><code>lib/screens/results_screen.dart</code></li>
                <li><code>lib/services/quiz_api_service.dart</code></li>
                <li><code>lib/widgets/option_tile.dart</code></li>
              </ul>
              <div className="bg-white p-2.5 rounded-xl border border-purple-200 font-mono text-[11px] text-purple-900">
                git checkout -b feature/quiz-engine<br />
                git commit -m "feat: implement quiz flow, score, and results"
              </div>
            </div>

            {/* Member 3 */}
            <div className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Member 3 Responsibility
              </span>
              <h4 className="font-bold text-gray-900 text-sm">Add Questions, Storage & Tests</h4>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li><code>lib/screens/add_question_screen.dart</code></li>
                <li><code>lib/screens/question_detail_screen.dart</code></li>
                <li><code>lib/services/storage_service.dart</code></li>
                <li><code>test/widget_test.dart</code></li>
              </ul>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200 font-mono text-[11px] text-emerald-900">
                git checkout -b feature/add-questions-storage<br />
                git commit -m "feat: form validation, storage, and widget tests"
              </div>
            </div>
          </div>

          <div className="bg-gray-900 text-gray-100 p-4 rounded-2xl space-y-2 text-xs font-mono">
            <p className="text-purple-400 font-bold"># Initial Repository Setup by Team Lead:</p>
            <p className="text-gray-300">
              git init<br />
              git add .<br />
              git commit -m "Initial commit: Quiz Master Flutter project template"<br />
              git branch -M main<br />
              git remote add origin https://github.com/YOUR_USERNAME/quiz_master.git<br />
              git push -u origin main
            </p>
            <p className="text-purple-400 font-bold pt-2"># Pulling and Merging via Pull Requests:</p>
            <p className="text-gray-300">
              git checkout main<br />
              git pull origin main<br />
              git merge feature/home-screen
            </p>
          </div>
        </div>
      )}

      {activeSection === 'run' && (
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-700" />
              <span>Running on Android Emulator & Physical Phone</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Mandatory project requirement 10: Run on an Android phone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
              <h4 className="font-bold text-sm text-gray-900">Option A: Android Virtual Device (Emulator)</h4>
              <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                <li>In Android Studio, click <strong>Device Manager</strong> on the right sidebar.</li>
                <li>Click <strong>Create Virtual Device</strong> (e.g. Pixel 7 or Pixel 8).</li>
                <li>Select a recommended system image (API 34 / Android 14) and click <strong>Finish</strong>.</li>
                <li>Press the <strong>Play</strong> button next to the device to boot it.</li>
                <li>Press the green Run button in Android Studio or run:</li>
              </ol>
              <div className="bg-gray-900 text-gray-100 p-2.5 rounded-xl font-mono text-xs">
                flutter run
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
              <h4 className="font-bold text-sm text-gray-900">Option B: Physical Android Phone</h4>
              <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                <li>On your phone, go to <strong>Settings &gt; About Phone</strong> and tap <strong>Build Number</strong> 7 times to enable Developer Mode.</li>
                <li>Go to <strong>System &gt; Developer Options</strong> and turn on <strong>USB Debugging</strong>.</li>
                <li>Connect your phone to your computer via USB cable.</li>
                <li>Tap <em>Always allow from this computer</em> on the phone prompt.</li>
                <li>Verify your phone is recognized:</li>
              </ol>
              <div className="bg-gray-900 text-gray-100 p-2.5 rounded-xl font-mono text-xs">
                flutter devices<br />
                flutter run -d [device-id]
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'apk' && (
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-purple-700" />
              <span>Generating the Release APK (College Requirement 10)</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Generate a standalone <code>.apk</code> file that installs and runs on any Android phone.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-gray-700">
              Run this single command from your project root in the terminal:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-2xl font-mono text-xs space-y-1">
              <span className="text-gray-400"># Build optimized release APK</span><br />
              <span className="text-emerald-400 font-bold">flutter build apk --release</span>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 space-y-2">
              <p className="font-bold">Where is the generated APK located?</p>
              <p className="font-mono bg-white p-2 rounded-lg border border-purple-200">
                build/app/outputs/flutter-apk/app-release.apk
              </p>
              <p className="text-gray-600">
                You can copy this file to Google Drive, WhatsApp, or email it to your team and professor. On an Android phone, simply tap the file to install Quiz Master!
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'web' && (
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-700" />
              <span>Running Quiz Master on Flutter Web</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              How to preview and deploy your Flutter app in Google Chrome or any modern browser.
            </p>
          </div>

          <div className="bg-gray-900 text-gray-100 p-4 rounded-2xl font-mono text-xs space-y-2">
            <span className="text-gray-400"># 1. Enable web support in Flutter (if not already enabled)</span><br />
            <span>flutter config --enable-web</span><br /><br />
            <span className="text-gray-400"># 2. Run directly in Google Chrome</span><br />
            <span className="text-purple-400 font-bold">flutter run -d chrome</span><br /><br />
            <span className="text-gray-400"># 3. Build production web bundle for hosting</span><br />
            <span className="text-emerald-400 font-bold">flutter build web --release</span>
          </div>
          <p className="text-xs text-gray-600">
            The build outputs to <code>build/web/</code>, which can be deployed to GitHub Pages, Firebase Hosting, or Vercel with zero modifications!
          </p>
        </div>
      )}
    </div>
  );
};
