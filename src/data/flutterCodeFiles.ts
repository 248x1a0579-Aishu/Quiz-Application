export interface FlutterFile {
  path: string;
  filename: string;
  category: 'config' | 'model' | 'service' | 'provider' | 'screen' | 'widget' | 'test';
  description: string;
  code: string;
}

export const FLUTTER_CODE_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    filename: 'pubspec.yaml',
    category: 'config',
    description: 'Project dependencies and metadata configuration',
    code: `name: quiz_master
description: "A simple, attractive quiz application for college project built with Flutter & Provider."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.3.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  # State management with ChangeNotifier
  provider: ^6.1.2
  # For fetching trivia questions from OpenTDB
  http: ^1.2.1
  # For persisting custom questions and best scores locally
  shared_preferences: ^2.2.3
  # For unescaping HTML entities like &quot; and &#039; from API
  html_unescape: ^2.0.0
  # Beautiful icons
  cupertino_icons: ^1.0.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`,
  },
  {
    path: 'lib/main.dart',
    filename: 'main.dart',
    category: 'config',
    description: 'Application entry point with MultiProvider and Purple & White Theme',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/quiz_provider.dart';
import 'screens/home_screen.dart';

void main() async {
  // Ensure Flutter engine bindings are initialized before calling async plugins
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const QuizMasterApp());
}

class QuizMasterApp extends StatelessWidget {
  const QuizMasterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => QuizProvider()..initialize(),
        ),
      ],
      child: MaterialApp(
        title: 'Quiz Master',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: Colors.deepPurple,
            primary: Colors.deepPurple,
            onPrimary: Colors.white,
            surface: Colors.white,
            brightness: Brightness.light,
          ),
          scaffoldBackgroundColor: const Color(0xFFF7F4FD),
          appBarTheme: const AppBarTheme(
            backgroundColor: Colors.deepPurple,
            foregroundColor: Colors.white,
            elevation: 0,
            centerTitle: true,
            titleTextStyle: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              letterSpacing: 0.5,
            ),
          ),
          cardTheme: CardTheme(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            color: Colors.white,
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.deepPurple,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
              textStyle: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        home: const HomeScreen(),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/models/question_model.dart',
    filename: 'question_model.dart',
    category: 'model',
    description: 'Data model for quiz questions with JSON serialization & option shuffling',
    code: `import 'dart:convert';
import 'package:html_unescape/html_unescape.dart';

class Question {
  final String id;
  final String category;
  final String question;
  final String correctAnswer;
  final List<String> incorrectAnswers;
  final List<String> options;
  final bool isCustom;

  Question({
    required this.id,
    required this.category,
    required this.question,
    required this.correctAnswer,
    required this.incorrectAnswers,
    required this.options,
    this.isCustom = false,
  });

  // Factory constructor to parse Open Trivia DB API JSON response
  factory Question.fromOpenTdbJson(Map<String, dynamic> json) {
    final unescape = HtmlUnescape();
    final cleanQuestion = unescape.convert(json['question'] ?? '');
    final cleanCorrect = unescape.convert(json['correct_answer'] ?? '');
    final cleanIncorrect = (json['incorrect_answers'] as List<dynamic>?)
            ?.map((e) => unescape.convert(e.toString()))
            .toList() ??
        [];

    final allOptions = [...cleanIncorrect, cleanCorrect];
    allOptions.shuffle(); // Shuffle choices so correct answer isn't predictable

    return Question(
      id: 'api_\${DateTime.now().microsecondsSinceEpoch}_\${allOptions.hashCode}',
      category: json['category'] ?? 'General Knowledge',
      question: cleanQuestion,
      correctAnswer: cleanCorrect,
      incorrectAnswers: cleanIncorrect,
      options: allOptions,
      isCustom: false,
    );
  }

  // Convert to JSON map for local SharedPreferences storage
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'category': category,
      'question': question,
      'correctAnswer': correctAnswer,
      'incorrectAnswers': incorrectAnswers,
      'options': options,
      'isCustom': isCustom,
    };
  }

  // Create Question instance from stored JSON map
  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      id: json['id'] ?? '',
      category: json['category'] ?? 'General',
      question: json['question'] ?? '',
      correctAnswer: json['correctAnswer'] ?? '',
      incorrectAnswers: List<String>.from(json['incorrectAnswers'] ?? []),
      options: List<String>.from(json['options'] ?? []),
      isCustom: json['isCustom'] ?? true,
    );
  }
}
`,
  },
  {
    path: 'lib/models/category_model.dart',
    filename: 'category_model.dart',
    category: 'model',
    description: 'Quiz Category definition with OpenTDB API ID mapping',
    code: `import 'package:flutter/material.dart';

class QuizCategory {
  final int id;
  final String name;
  final int apiCategoryId;
  final IconData icon;
  final String description;

  const QuizCategory({
    required this.id,
    required this.name,
    required this.apiCategoryId,
    required this.icon,
    required this.description,
  });

  static const List<QuizCategory> defaultCategories = [
    QuizCategory(
      id: 1,
      name: 'General Knowledge',
      apiCategoryId: 9,
      icon: Icons.public_rounded,
      description: 'World history, geography, arts, and famous trivia',
    ),
    QuizCategory(
      id: 2,
      name: 'Science',
      apiCategoryId: 17,
      icon: Icons.science_rounded,
      description: 'Physics, chemistry, biology, and the natural world',
    ),
    QuizCategory(
      id: 3,
      name: 'Computer Science',
      apiCategoryId: 18,
      icon: Icons.computer_rounded,
      description: 'Programming, hardware, networks, and algorithms',
    ),
    QuizCategory(
      id: 4,
      name: 'Mathematics',
      apiCategoryId: 19,
      icon: Icons.calculate_rounded,
      description: 'Numbers, algebra, geometry, and problem solving',
    ),
  ];
}
`,
  },
  {
    path: 'lib/services/quiz_api_service.dart',
    filename: 'quiz_api_service.dart',
    category: 'service',
    description: 'Fetches trivia questions from Open Trivia DB API with error handling',
    code: `import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/question_model.dart';

class QuizApiService {
  static const String _baseUrl = 'https://opentdb.com/api.php';

  // Fetches multiple-choice questions for a specific category
  static Future<List<Question>> fetchQuestions({
    required int categoryId,
    int amount = 10,
  }) async {
    final uri = Uri.parse('\$_baseUrl?amount=\$amount&category=\$categoryId&type=multiple');

    try {
      final response = await http.get(uri).timeout(
        const Duration(seconds: 8),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final int responseCode = data['response_code'] ?? -1;

        if (responseCode == 0 && data['results'] != null) {
          final List results = data['results'];
          return results.map((item) => Question.fromOpenTdbJson(item)).toList();
        } else if (responseCode == 5) {
          throw Exception('OpenTDB rate limit reached. Please wait a moment.');
        } else {
          throw Exception('No questions returned by API.');
        }
      } else {
        throw Exception('Server error: HTTP \${response.statusCode}');
      }
    } catch (e) {
      // Re-throw so Provider can catch and display retry UI or fallback
      throw Exception('Failed to connect to Quiz API: \$e');
    }
  }
}
`,
  },
  {
    path: 'lib/services/storage_service.dart',
    filename: 'storage_service.dart',
    category: 'service',
    description: 'Local persistence for custom questions and high scores via SharedPreferences',
    code: `import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/question_model.dart';

class StorageService {
  static const String _customQuestionsKey = 'custom_questions_list';
  static const String _bestScoreKey = 'user_best_score_record';

  // Save a new custom question to SharedPreferences
  static Future<bool> saveCustomQuestion(Question question) async {
    final prefs = await SharedPreferences.getInstance();
    final existingList = await getCustomQuestions();
    existingList.insert(0, question);

    final List<String> jsonStringList =
        existingList.map((q) => json.encode(q.toJson())).toList();

    return await prefs.setStringList(_customQuestionsKey, jsonStringList);
  }

  // Load all custom questions created by the user
  static Future<List<Question>> getCustomQuestions() async {
    final prefs = await SharedPreferences.getInstance();
    final List<String>? rawList = prefs.getStringList(_customQuestionsKey);

    if (rawList == null || rawList.isEmpty) {
      return [];
    }

    try {
      return rawList.map((str) {
        final Map<String, dynamic> jsonMap = json.decode(str);
        return Question.fromJson(jsonMap);
      }).toList();
    } catch (e) {
      return [];
    }
  }

  // Delete a custom question by ID
  static Future<bool> deleteCustomQuestion(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final existingList = await getCustomQuestions();
    existingList.removeWhere((q) => q.id == id);

    final List<String> jsonStringList =
        existingList.map((q) => json.encode(q.toJson())).toList();

    return await prefs.setStringList(_customQuestionsKey, jsonStringList);
  }

  // Save the highest score percentage attained
  static Future<void> saveBestScore(int score, int total) async {
    if (total == 0) return;
    final prefs = await SharedPreferences.getInstance();
    final int percentage = ((score / total) * 100).round();
    final int currentBest = prefs.getInt(_bestScoreKey) ?? 0;

    if (percentage > currentBest) {
      await prefs.setInt(_bestScoreKey, percentage);
    }
  }

  // Retrieve best score percentage
  static Future<int> getBestScore() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_bestScoreKey) ?? 0;
  }
}
`,
  },
  {
    path: 'lib/providers/quiz_provider.dart',
    filename: 'quiz_provider.dart',
    category: 'provider',
    description: 'Central ChangeNotifier managing quiz questions, scoring, loading, and custom questions',
    code: `import 'package:flutter/foundation.dart';
import '../models/question_model.dart';
import '../models/category_model.dart';
import '../services/quiz_api_service.dart';
import '../services/storage_service.dart';

class QuizProvider extends ChangeNotifier {
  // State variables
  List<Question> _questions = [];
  int _currentIndex = 0;
  String? _selectedAnswer;
  int _score = 0;
  bool _isLoading = false;
  String? _errorMessage;
  int _bestScorePercentage = 0;
  QuizCategory? _activeCategory;
  List<Question> _customQuestions = [];

  // Getters
  List<Question> get questions => _questions;
  int get currentIndex => _currentIndex;
  String? get selectedAnswer => _selectedAnswer;
  int get score => _score;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  int get bestScorePercentage => _bestScorePercentage;
  QuizCategory? get activeCategory => _activeCategory;
  List<Question> get customQuestions => _customQuestions;

  Question? get currentQuestion {
    if (_questions.isEmpty || _currentIndex >= _questions.length) return null;
    return _questions[_currentIndex];
  }

  bool get isLastQuestion =>
      _questions.isNotEmpty && _currentIndex == _questions.length - 1;

  // Initialize data on app start
  Future<void> initialize() async {
    await loadBestScore();
    await loadCustomQuestions();
  }

  Future<void> loadBestScore() async {
    _bestScorePercentage = await StorageService.getBestScore();
    notifyListeners();
  }

  Future<void> loadCustomQuestions() async {
    _customQuestions = await StorageService.getCustomQuestions();
    notifyListeners();
  }

  // Get total question count for a category (Custom + Default)
  int getQuestionCountForCategory(String categoryName) {
    final customCount = _customQuestions
        .where((q) => q.category.toLowerCase() == categoryName.toLowerCase())
        .length;
    // Standard pool has 10 API questions plus whatever custom questions exist
    return 10 + customCount;
  }

  // Load questions for the selected category
  Future<void> startQuizForCategory(QuizCategory category) async {
    _activeCategory = category;
    _currentIndex = 0;
    _score = 0;
    _selectedAnswer = null;
    _isLoading = true;
    _errorMessage = null;
    _questions = [];
    notifyListeners();

    try {
      // 1. Filter any custom questions created for this category
      final matchingCustom = _customQuestions
          .where((q) => q.category.toLowerCase() == category.name.toLowerCase())
          .toList();

      // 2. Try fetching dynamic questions from Open Trivia DB API
      try {
        final apiQuestions = await QuizApiService.fetchQuestions(
          categoryId: category.apiCategoryId,
          amount: 10,
        );
        _questions = [...matchingCustom, ...apiQuestions];
      } catch (apiError) {
        // If API fails (e.g. no internet or rate limit), use custom questions or fallback
        if (matchingCustom.isNotEmpty) {
          _questions = matchingCustom;
        } else {
          // Provide built-in fallback questions so the user is never stuck
          _questions = _getOfflineFallbackQuestions(category.name);
        }
      }

      if (_questions.isEmpty) {
        _errorMessage = 'No questions available for this category yet.';
      }
    } catch (e) {
      _errorMessage = 'Could not load quiz questions: \$e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // User selects an option
  void selectAnswer(String answer) {
    _selectedAnswer = answer;
    notifyListeners();
  }

  // Move to next question or finalize score
  bool nextQuestion() {
    if (_selectedAnswer == null) {
      return false; // Validation: Answer must be selected
    }

    // Check answer correctness
    if (currentQuestion != null &&
        _selectedAnswer == currentQuestion!.correctAnswer) {
      _score++;
    }

    if (!isLastQuestion) {
      _currentIndex++;
      _selectedAnswer = null;
      notifyListeners();
      return true;
    } else {
      // Save best score to SharedPreferences
      StorageService.saveBestScore(_score, _questions.length).then((_) {
        loadBestScore();
      });
      notifyListeners();
      return true;
    }
  }

  // Reset quiz to play again
  void restartQuiz() {
    _currentIndex = 0;
    _score = 0;
    _selectedAnswer = null;
    _questions.shuffle();
    notifyListeners();
  }

  // Add custom user-created question
  Future<void> addCustomQuestion(Question question) async {
    await StorageService.saveCustomQuestion(question);
    await loadCustomQuestions();
  }

  // Delete custom question
  Future<void> deleteQuestion(String id) async {
    await StorageService.deleteCustomQuestion(id);
    await loadCustomQuestions();
  }

  // Built-in offline fallback questions ensuring robust behavior
  List<Question> _getOfflineFallbackQuestions(String category) {
    if (category.contains('Computer')) {
      return [
        Question(
          id: 'fb_cs_1',
          category: category,
          question: 'What is the primary programming language used by Flutter?',
          correctAnswer: 'Dart',
          incorrectAnswers: ['Java', 'Swift', 'Python'],
          options: ['Java', 'Dart', 'Swift', 'Python']..shuffle(),
          isCustom: false,
        ),
        Question(
          id: 'fb_cs_2',
          category: category,
          question: 'What does RAM stand for?',
          correctAnswer: 'Random Access Memory',
          incorrectAnswers: ['Read Only Memory', 'Run Active Module', 'Real Action Method'],
          options: ['Random Access Memory', 'Read Only Memory', 'Run Active Module', 'Real Action Method']..shuffle(),
          isCustom: false,
        ),
      ];
    } else if (category.contains('Science')) {
      return [
        Question(
          id: 'fb_sci_1',
          category: category,
          question: 'What is the chemical formula for water?',
          correctAnswer: 'H2O',
          incorrectAnswers: ['CO2', 'NaCl', 'O2'],
          options: ['H2O', 'CO2', 'NaCl', 'O2']..shuffle(),
          isCustom: false,
        ),
      ];
    } else {
      return [
        Question(
          id: 'fb_gk_1',
          category: category,
          question: 'Which planet is known as the Red Planet?',
          correctAnswer: 'Mars',
          incorrectAnswers: ['Venus', 'Jupiter', 'Saturn'],
          options: ['Venus', 'Mars', 'Jupiter', 'Saturn']..shuffle(),
          isCustom: false,
        ),
      ];
    }
  }
}
`,
  },
  {
    path: 'lib/screens/home_screen.dart',
    filename: 'home_screen.dart',
    category: 'screen',
    description: 'Main landing screen with category cards, best score banner, and navigation',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/category_model.dart';
import '../providers/quiz_provider.dart';
import 'quiz_screen.dart';
import 'add_question_screen.dart';
import 'question_detail_screen.dart';
import '../widgets/category_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final quizProvider = context.watch<QuizProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiz Master'),
        actions: [
          IconButton(
            tooltip: 'Add Custom Question',
            icon: const Icon(Icons.add_circle_outline_rounded),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const AddQuestionScreen()),
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Best Score Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Colors.deepPurple, Color(0xFF8E24AA)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.deepPurple.withOpacity(0.3),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.emoji_events_rounded,
                        color: Colors.amber,
                        size: 36,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Your Best Score',
                            style: TextStyle(
                              color: Colors.white70,
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '\${quizProvider.bestScorePercentage}%',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Colors.deepPurple,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 10),
                      ),
                      onPressed: () {
                        // Quick start with first category
                        _startQuiz(context, QuizCategory.defaultCategories[0]);
                      },
                      icon: const Icon(Icons.play_arrow_rounded, size: 20),
                      label: const Text('Play'),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Categories Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Quiz Categories',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF2E1065),
                    ),
                  ),
                  TextButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const AddQuestionScreen(),
                        ),
                      );
                    },
                    icon: const Icon(Icons.add, size: 18),
                    label: const Text('Add Question'),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Categories Grid/List
              ...QuizCategory.defaultCategories.map((category) {
                final questionCount =
                    quizProvider.getQuestionCountForCategory(category.name);
                return CategoryCard(
                  category: category,
                  questionCount: questionCount,
                  onStart: () => _startQuiz(context, category),
                );
              }),

              const SizedBox(height: 24),

              // Custom Questions List Preview
              if (quizProvider.customQuestions.isNotEmpty) ...[
                const Text(
                  'Your Added Questions',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF2E1065),
                  ),
                ),
                const SizedBox(height: 8),
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: quizProvider.customQuestions.length,
                  itemBuilder: (context, index) {
                    final q = quizProvider.customQuestions[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: Colors.deepPurple.shade50,
                          child: const Icon(
                            Icons.help_outline_rounded,
                            color: Colors.deepPurple,
                          ),
                        ),
                        title: Text(
                          q.question,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontWeight: FontWeight.w600),
                        ),
                        subtitle: Text(q.category),
                        trailing: const Icon(Icons.arrow_forward_ios_rounded,
                            size: 14),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => QuestionDetailScreen(question: q),
                            ),
                          );
                        },
                      ),
                    );
                  },
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  void _startQuiz(BuildContext context, QuizCategory category) {
    context.read<QuizProvider>().startQuizForCategory(category);
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const QuizScreen()),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/quiz_screen.dart',
    filename: 'quiz_screen.dart',
    category: 'screen',
    description: 'Interactive multiple choice question screen with validation and progress tracking',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import 'results_screen.dart';
import '../widgets/option_tile.dart';
import '../widgets/error_view.dart';

class QuizScreen extends StatelessWidget {
  const QuizScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final quiz = context.watch<QuizProvider>();

    // 1. Loading State
    if (quiz.isLoading) {
      return Scaffold(
        appBar: AppBar(title: Text(quiz.activeCategory?.name ?? 'Quiz')),
        body: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(color: Colors.deepPurple),
              SizedBox(height: 16),
              Text(
                'Loading questions...',
                style: TextStyle(fontSize: 16, color: Colors.deepPurple),
              ),
            ],
          ),
        ),
      );
    }

    // 2. Error State with Retry
    if (quiz.errorMessage != null || quiz.questions.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('Quiz Master')),
        body: ErrorView(
          message: quiz.errorMessage ?? 'No questions available.',
          onRetry: () {
            if (quiz.activeCategory != null) {
              quiz.startQuizForCategory(quiz.activeCategory!);
            }
          },
        ),
      );
    }

    final question = quiz.currentQuestion!;
    final progress = (quiz.currentIndex + 1) / quiz.questions.length;

    return Scaffold(
      appBar: AppBar(
        title: Text(quiz.activeCategory?.name ?? 'Quiz'),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'Score: \${quiz.score}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          )
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Progress Bar
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: LinearProgressIndicator(
                  value: progress,
                  minHeight: 8,
                  backgroundColor: Colors.deepPurple.shade100,
                  valueColor:
                      const AlwaysStoppedAnimation<Color>(Colors.deepPurple),
                ),
              ),
              const SizedBox(height: 12),

              // Question Index Indicator
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Question \${quiz.currentIndex + 1} of \${quiz.questions.length}',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey.shade700,
                    ),
                  ),
                  if (question.isCustom)
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.deepPurple.shade50,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        'Custom',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.deepPurple,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 20),

              // Question Card
              Card(
                elevation: 3,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Text(
                    question.question,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1E1B4B),
                      height: 1.4,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // 4 Multiple Choice Options
              ...question.options.asMap().entries.map((entry) {
                final index = entry.key;
                final optionText = entry.value;
                final letter = String.fromCharCode(65 + index); // A, B, C, D
                final isSelected = quiz.selectedAnswer == optionText;

                return OptionTile(
                  letter: letter,
                  text: optionText,
                  isSelected: isSelected,
                  onTap: () {
                    quiz.selectAnswer(optionText);
                  },
                );
              }),

              const SizedBox(height: 32),

              // Next / Submit Button
              ElevatedButton(
                onPressed: () {
                  // Prevent skipping without selecting
                  if (quiz.selectedAnswer == null) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Please select an answer to proceed!'),
                        backgroundColor: Colors.orange,
                        duration: Duration(seconds: 2),
                      ),
                    );
                    return;
                  }

                  final isFinal = quiz.isLastQuestion;
                  quiz.nextQuestion();

                  if (isFinal) {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const ResultsScreen()),
                    );
                  }
                },
                child: Text(
                  quiz.isLastQuestion ? 'Submit Quiz' : 'Next Question',
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/results_screen.dart',
    filename: 'results_screen.dart',
    category: 'screen',
    description: 'Score summary, percentage calculation, congratulatory message, and restart actions',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import 'home_screen.dart';
import 'quiz_screen.dart';

class ResultsScreen extends StatelessWidget {
  const ResultsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final quiz = context.watch<QuizProvider>();
    final total = quiz.questions.length;
    final score = quiz.score;
    final percentage = total > 0 ? ((score / total) * 100).round() : 0;

    // Congratulatory message and icon based on score percentage
    String message;
    IconData trophyIcon;
    Color iconColor;

    if (percentage >= 80) {
      message = 'Outstanding Performance!';
      trophyIcon = Icons.military_tech_rounded;
      iconColor = Colors.amber;
    } else if (percentage >= 50) {
      message = 'Well Done! Great Effort!';
      trophyIcon = Icons.thumb_up_alt_rounded;
      iconColor = Colors.deepPurple;
    } else {
      message = 'Keep Practicing! You Can Do Better!';
      trophyIcon = Icons.school_rounded;
      iconColor = Colors.orange;
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiz Results'),
        automaticallyImplyLeading: false,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),

              // Celebration Icon
              Center(
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: iconColor.withOpacity(0.15),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    trophyIcon,
                    size: 80,
                    color: iconColor,
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Congratulatory title
              Center(
                child: Text(
                  message,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1E1B4B),
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Results Score Card
              Card(
                elevation: 3,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                      vertical: 24.0, horizontal: 20.0),
                  child: Column(
                    children: [
                      Text(
                        '\$percentage%',
                        style: const TextStyle(
                          fontSize: 48,
                          fontWeight: FontWeight.bold,
                          color: Colors.deepPurple,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Total Score: \$score / \$total',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF4B5563),
                        ),
                      ),
                      const Divider(height: 32),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildStatItem('Correct', '\$score', Colors.green),
                          _buildStatItem(
                              'Incorrect', '\${total - score}', Colors.red),
                          _buildStatItem('Total', '\$total', Colors.deepPurple),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 36),

              // Action Buttons
              ElevatedButton.icon(
                onPressed: () {
                  quiz.restartQuiz();
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (_) => const QuizScreen()),
                  );
                },
                icon: const Icon(Icons.replay_rounded),
                label: const Text('Restart Quiz'),
              ),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.deepPurple,
                  side: const BorderSide(color: Colors.deepPurple, width: 2),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                onPressed: () {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (_) => const HomeScreen()),
                    (route) => false,
                  );
                },
                icon: const Icon(Icons.home_rounded),
                label: const Text(
                  'Back to Home',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            color: Colors.grey,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
`,
  },
  {
    path: 'lib/screens/add_question_screen.dart',
    filename: 'add_question_screen.dart',
    category: 'screen',
    description: 'Form with strict validation for creating and saving custom quiz questions locally',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/question_model.dart';
import '../models/category_model.dart';
import '../providers/quiz_provider.dart';

class AddQuestionScreen extends StatefulWidget {
  const AddQuestionScreen({super.key});

  @override
  State<AddQuestionScreen> createState() => _AddQuestionScreenState();
}

class _AddQuestionScreenState extends State<AddQuestionScreen> {
  final _formKey = GlobalKey<FormState>();

  // Text Editing Controllers
  final _questionController = TextEditingController();
  final _optionAController = TextEditingController();
  final _optionBController = TextEditingController();
  final _optionCController = TextEditingController();
  final _optionDController = TextEditingController();

  String _selectedCategory = 'General Knowledge';
  String? _selectedCorrectLetter; // 'A', 'B', 'C', or 'D'

  @override
  void dispose() {
    _questionController.dispose();
    _optionAController.dispose();
    _optionBController.dispose();
    _optionCController.dispose();
    _optionDController.dispose();
    super.dispose();
  }

  void _saveQuestion() async {
    // 1. Form validation checks
    if (!_formKey.currentState!.validate()) {
      return;
    }

    // 2. Radio button selection check
    if (_selectedCorrectLetter == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select the correct answer option using the radio buttons!'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    // Determine correct answer string based on chosen letter
    String correctAnswer = '';
    List<String> incorrectAnswers = [];

    final optA = _optionAController.text.trim();
    final optB = _optionBController.text.trim();
    final optC = _optionCController.text.trim();
    final optD = _optionDController.text.trim();

    switch (_selectedCorrectLetter) {
      case 'A':
        correctAnswer = optA;
        incorrectAnswers = [optB, optC, optD];
        break;
      case 'B':
        correctAnswer = optB;
        incorrectAnswers = [optA, optC, optD];
        break;
      case 'C':
        correctAnswer = optC;
        incorrectAnswers = [optA, optB, optD];
        break;
      case 'D':
        correctAnswer = optD;
        incorrectAnswers = [optA, optB, optC];
        break;
    }

    final newQuestion = Question(
      id: 'custom_\${DateTime.now().millisecondsSinceEpoch}',
      category: _selectedCategory,
      question: _questionController.text.trim(),
      correctAnswer: correctAnswer,
      incorrectAnswers: incorrectAnswers,
      options: [optA, optB, optC, optD],
      isCustom: true,
    );

    await context.read<QuizProvider>().addCustomQuestion(newQuestion);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Question saved successfully!'),
          backgroundColor: Colors.green,
        ),
      );
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Custom Question'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Category Selector
                const Text(
                  'Select Category',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _selectedCategory,
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  items: QuizCategory.defaultCategories
                      .map((cat) => DropdownMenuItem(
                            value: cat.name,
                            child: Text(cat.name),
                          ))
                      .toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedCategory = val);
                  },
                ),
                const SizedBox(height: 20),

                // Question Text Field
                const Text(
                  'Question Text',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _questionController,
                  maxLines: 3,
                  decoration: InputDecoration(
                    hintText: 'Enter your question here...',
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Question text cannot be empty';
                    }
                    if (value.trim().length < 8) {
                      return 'Question should be at least 8 characters';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 24),

                // Answer Options with Radio Buttons
                const Text(
                  'Answer Options (Select the correct one):',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 12),

                _buildOptionField('A', _optionAController),
                _buildOptionField('B', _optionBController),
                _buildOptionField('C', _optionCController),
                _buildOptionField('D', _optionDController),

                const SizedBox(height: 32),

                // Submit Button
                ElevatedButton(
                  onPressed: _saveQuestion,
                  child: const Text('Save Question'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildOptionField(String letter, TextEditingController controller) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        children: [
          Radio<String>(
            value: letter,
            groupValue: _selectedCorrectLetter,
            activeColor: Colors.deepPurple,
            onChanged: (val) {
              setState(() => _selectedCorrectLetter = val);
            },
          ),
          Expanded(
            child: TextFormField(
              controller: controller,
              decoration: InputDecoration(
                labelText: 'Option \$letter',
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Option \$letter cannot be empty';
                }
                return null;
              },
            ),
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/question_detail_screen.dart',
    filename: 'question_detail_screen.dart',
    category: 'screen',
    description: 'Detailed inspection of question, category, choices, and marked correct answer',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/question_model.dart';
import '../providers/quiz_provider.dart';

class QuestionDetailScreen extends StatelessWidget {
  final Question question;

  const QuestionDetailScreen({super.key, required this.question});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Question Details'),
        actions: [
          if (question.isCustom)
            IconButton(
              tooltip: 'Delete Question',
              icon: const Icon(Icons.delete_outline_rounded),
              onPressed: () async {
                final confirm = await showDialog<bool>(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Delete Question?'),
                    content: const Text(
                        'Are you sure you want to remove this question from local storage?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(ctx, false),
                        child: const Text('Cancel'),
                      ),
                      TextButton(
                        onPressed: () => Navigator.pop(ctx, true),
                        style: TextButton.styleFrom(
                            foregroundColor: Colors.red),
                        child: const Text('Delete'),
                      ),
                    ],
                  ),
                );

                if (confirm == true && context.mounted) {
                  await context
                      .read<QuizProvider>()
                      .deleteQuestion(question.id);
                  if (context.mounted) {
                    Navigator.pop(context);
                  }
                }
              },
            ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Category & Source Badge
              Row(
                children: [
                  Chip(
                    backgroundColor: Colors.deepPurple.shade50,
                    label: Text(
                      question.category,
                      style: const TextStyle(
                        color: Colors.deepPurple,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Chip(
                    backgroundColor: question.isCustom
                        ? Colors.blue.shade50
                        : Colors.green.shade50,
                    label: Text(
                      question.isCustom ? 'Custom Local' : 'API Sourced',
                      style: TextStyle(
                        color: question.isCustom
                            ? Colors.blue.shade800
                            : Colors.green.shade800,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Full Question Card
              Card(
                elevation: 2,
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Full Question',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        question.question,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF1E1B4B),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              const Text(
                'Answer Options',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF2E1065),
                ),
              ),
              const SizedBox(height: 12),

              // Options with correct indicator
              ...question.options.asMap().entries.map((entry) {
                final letter = String.fromCharCode(65 + entry.key);
                final text = entry.value;
                final isCorrect = text == question.correctAnswer;

                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isCorrect ? const Color(0xFFE8F5E9) : Colors.white,
                    border: Border.all(
                      color: isCorrect ? Colors.green : Colors.grey.shade300,
                      width: isCorrect ? 2 : 1,
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 16,
                        backgroundColor: isCorrect
                            ? Colors.green
                            : Colors.deepPurple.shade50,
                        child: Text(
                          letter,
                          style: TextStyle(
                            color: isCorrect ? Colors.white : Colors.deepPurple,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Text(
                          text,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: isCorrect
                                ? FontWeight.bold
                                : FontWeight.normal,
                            color: isCorrect
                                ? Colors.green.shade900
                                : Colors.black87,
                          ),
                        ),
                      ),
                      if (isCorrect)
                        const Row(
                          children: [
                            Icon(Icons.check_circle_rounded,
                                color: Colors.green),
                            SizedBox(width: 4),
                            Text(
                              'Correct',
                              style: TextStyle(
                                color: Colors.green,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                    ],
                  ),
                );
              }),
            ],
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/category_card.dart',
    filename: 'category_card.dart',
    category: 'widget',
    description: 'Reusable card for category representation and launching quizzes',
    code: `import 'package:flutter/material.dart';
import '../models/category_model.dart';

class CategoryCard extends StatelessWidget {
  final QuizCategory category;
  final int questionCount;
  final VoidCallback onStart;

  const CategoryCard({
    super.key,
    required this.category,
    required this.questionCount,
    required this.onStart,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 14),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            // Category Icon with Circle Background
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.deepPurple.shade50,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                category.icon,
                color: Colors.deepPurple,
                size: 28,
              ),
            ),
            const SizedBox(width: 16),

            // Category Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    category.name,
                    style: const TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1E1B4B),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '\$questionCount Questions Available',
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.grey.shade600,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),

            // Start Quiz Button
            ElevatedButton(
              onPressed: onStart,
              style: ElevatedButton.styleFrom(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: const Text('Start'),
            ),
          ],
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/option_tile.dart',
    filename: 'option_tile.dart',
    category: 'widget',
    description: 'Multiple-choice option selector with letter badge and highlight',
    code: `import 'package:flutter/material.dart';

class OptionTile extends StatelessWidget {
  final String letter;
  final String text;
  final bool isSelected;
  final VoidCallback onTap;

  const OptionTile({
    super.key,
    required this.letter,
    required this.text,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isSelected ? Colors.deepPurple.shade50 : Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: isSelected ? Colors.deepPurple : Colors.grey.shade300,
              width: isSelected ? 2 : 1,
            ),
            boxShadow: [
              if (isSelected)
                BoxShadow(
                  color: Colors.deepPurple.withOpacity(0.1),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
            ],
          ),
          child: Row(
            children: [
              // Letter Badge (A, B, C, D)
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: isSelected
                      ? Colors.deepPurple
                      : Colors.deepPurple.shade50,
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: Text(
                  letter,
                  style: TextStyle(
                    color: isSelected ? Colors.white : Colors.deepPurple,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
              const SizedBox(width: 14),

              // Option Text
              Expanded(
                child: Text(
                  text,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight:
                        isSelected ? FontWeight.bold : FontWeight.w500,
                    color: isSelected
                        ? Colors.deepPurple.shade900
                        : const Color(0xFF1F2937),
                  ),
                ),
              ),

              // Radio Check Circle
              Icon(
                isSelected
                    ? Icons.check_circle_rounded
                    : Icons.radio_button_unchecked_rounded,
                color: isSelected ? Colors.deepPurple : Colors.grey.shade400,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/error_view.dart',
    filename: 'error_view.dart',
    category: 'widget',
    description: 'Error and retry widget satisfying project requirement 3',
    code: `import 'package:flutter/material.dart';

class ErrorView extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;

  const ErrorView({
    super.key,
    required this.message,
    required this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.red.shade50,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.wifi_off_rounded,
                size: 54,
                color: Colors.redAccent,
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Oops! Something went wrong',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1E1B4B),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              message,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey.shade700,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh_rounded),
              label: const Text('Retry Connection'),
            ),
          ],
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'test/widget_test.dart',
    filename: 'widget_test.dart',
    category: 'test',
    description: 'Flutter widget test verifying Home Screen rendering, categories, and Provider binding',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:quiz_master/providers/quiz_provider.dart';
import 'package:quiz_master/screens/home_screen.dart';

void main() {
  testWidgets('Quiz Master Home Screen displays title and categories',
      (WidgetTester tester) async {
    // Build our app and trigger a frame with QuizProvider
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => QuizProvider(),
        child: const MaterialApp(
          home: HomeScreen(),
        ),
      ),
    );

    // Verify that the AppBar title 'Quiz Master' is rendered
    expect(find.text('Quiz Master'), findsOneWidget);

    // Verify that the Best Score banner is present
    expect(find.text('Your Best Score'), findsOneWidget);

    // Verify that the Categories section header is present
    expect(find.text('Quiz Categories'), findsOneWidget);

    // Verify standard category names
    expect(find.text('General Knowledge'), findsOneWidget);
    expect(find.text('Science'), findsOneWidget);
    expect(find.text('Computer Science'), findsOneWidget);
    expect(find.text('Mathematics'), findsOneWidget);

    // Verify that at least one Start button exists
    expect(find.text('Start'), findsWidgets);
  });
}
`,
  },
];
