import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Keyboard, Plus, Trash2, RotateCcw, Save, ArrowLeft, BookOpen, Play, Pause, RotateCw, Edit } from 'lucide-react';

export default function App() {
  const [texts, setTexts] = useState([]);
  const [currentTextId, setCurrentTextId] = useState(null);
  const [currentPage, setCurrentPage] = useState('library'); // 'library' or 'practice'
  const [mode, setMode] = useState('read'); // 'read' or 'type'
  const [hiddenIndices, setHiddenIndices] = useState(new Set());
  const [userInput, setUserInput] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTextId, setEditingTextId] = useState(null);
  const [newTextTitle, setNewTextTitle] = useState('');
  const [newTextContent, setNewTextContent] = useState('');
  const [newTextTimeLimit, setNewTextTimeLimit] = useState('');
  const [hidePercentage, setHidePercentage] = useState(10); // Percentage of words to hide per click
  const [wordInputs, setWordInputs] = useState({}); // Store user inputs for each hidden word
  const [showAnswers, setShowAnswers] = useState(false); // Toggle to show/hide answers
  const [timeRemaining, setTimeRemaining] = useState(null); // Timer in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);

  // Load texts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('memorizationTexts');
    if (saved) {
      const parsed = JSON.parse(saved);
      setTexts(parsed);
      if (parsed.length > 0) {
        setCurrentTextId(parsed[0].id);
      }
    } else {
      // Pre-install default TOEFL templates
      const defaultTexts = [
        {
          id: 1,
          title: "TOEFL Speaking - Task 1: Independent Speaking",
          content: "There are several reasons why [your choice/opinion] is the best option. First, [reason 1 with specific example]. For instance, [personal example]. Second, [reason 2 with example]. This is because [explanation]. Finally, [reason 3 if applicable]. In conclusion, I believe [your opinion] is the most suitable choice for these reasons.",
          timeLimit: 45 // seconds
        },
        {
          id: 2,
          title: "TOEFL Speaking - Task 2: Campus Situation",
          content: "The reading passage describes [problem/situation]. According to the reading, [key details from reading]. The student in the conversation [agrees/disagrees] with this plan. The student has [positive/negative] feelings about it for [number] reasons. First, [student's reason 1 with details]. Second, [student's reason 2 with details]. Therefore, the student [supports/opposes] the plan because [summary of main reasons].",
          timeLimit: 60 // seconds
        },
        {
          id: 3,
          title: "TOEFL Speaking - Task 3: Academic Course",
          content: "The reading passage defines/explains [academic concept]. According to the reading, [definition/key points]. In the lecture, the professor gives [number] examples to demonstrate this concept. First, the professor discusses [first example with details]. Second, the professor explains [second example with details]. These examples clearly illustrate how [connection to concept].",
          timeLimit: 60 // seconds
        },
        {
          id: 4,
          title: "TOEFL Speaking - Task 4: Academic Lecture",
          content: "In this lecture, the professor discusses [main topic]. The professor explains that [main point 1] and [main point 2]. For example, the professor mentions [specific example 1]. Additionally, the professor describes [specific example 2]. The lecture focuses on [summary of main topic and key points].",
          timeLimit: 60 // seconds
        },
        {
          id: 5,
          title: "TOEFL Writing - Task 1: Integrated Writing",
          content: "The reading passage discusses [main topic of reading] while the lecture presents [main idea of lecture that contradicts/supports the reading]. The professor challenges/supports the ideas in the reading by providing [number] specific points.\n\nFirst, the reading states that [reading point 1]. However, the professor argues that [lecture point 1 that contradicts/supports]. For example, [specific example from lecture].\n\nSecond, according to the reading [reading point 2], but the professor explains that [lecture point 2]. The professor points out that [specific detail from lecture].\n\nFinally, the reading claims [reading point 3], yet the lecture contradicts/supports this by stating [lecture point 3]. The professor demonstrates this by [specific example from lecture].\n\nIn conclusion, the lecture effectively [challenges/supports] the reading's claims through [number] specific points.",
          timeLimit: 1200 // 20 minutes in seconds
        },
        {
          id: 6,
          title: "TOEFL Writing - Task 2: Independent Writing",
          content: "In today's world, [general statement about the topic]. While some people believe [opposing viewpoint], I strongly believe [your thesis statement] for several compelling reasons.\n\nFirst, [first main reason]. For example, [specific example with details]. This clearly shows that [explanation of how example supports your point]. Many [people/situations] demonstrate [relevance of your example].\n\nSecond, [second main reason]. A good example of this is [specific example]. This example illustrates that [how the example supports your argument]. Furthermore, [additional explanation].\n\nAdditionally, [third reason if you choose to include one]. [Example and explanation].\n\nIn conclusion, while [acknowledge opposing view briefly], I maintain that [restatement of your position]. [Final thought about future implications or broader context].",
          timeLimit: 1800 // 30 minutes in seconds
        }
      ];
      setTexts(defaultTexts);
      setCurrentTextId(defaultTexts[0].id);
      localStorage.setItem('memorizationTexts', JSON.stringify(defaultTexts));
    }
  }, []);

  // Save texts to localStorage whenever they change
  useEffect(() => {
    if (texts.length > 0) {
      localStorage.setItem('memorizationTexts', JSON.stringify(texts));
    }
  }, [texts]);

  const currentText = texts.find(t => t.id === currentTextId);

  // Timer countdown effect
  useEffect(() => {
    if (isTimerRunning && timeRemaining !== null && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setTimerExpired(true);
            // Play audio alert
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKfj8LZjHAU5k9jyz3wvBSl+zPLaizsKGGS35+yrWBgNSpzg8sFuIgYtg9Hy04s4CBlot+3nn04MDFCn5PC2YxwGOJPY8tB9MQUqgM/y2Ys5CRdluubsrVoaDU2c4/PCZSEG');
            audio.play().catch(() => {}); // Ignore errors if audio fails
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerRunning, timeRemaining]);

  // Initialize timer when text changes
  useEffect(() => {
    if (currentText && currentText.timeLimit) {
      setTimeRemaining(currentText.timeLimit);
      setIsTimerRunning(false);
      setTimerExpired(false);
    } else {
      setTimeRemaining(null);
      setIsTimerRunning(false);
      setTimerExpired(false);
    }
  }, [currentTextId, currentText]);
  const words = currentText ? currentText.content.split(/(\s+)/) : [];
  const wordIndices = words.map((word, idx) => ({ word, idx })).filter(({ word }) => word.trim().length > 0);

  const addText = () => {
    if (newTextTitle.trim() && newTextContent.trim()) {
      const newText = {
        id: Date.now(),
        title: newTextTitle.trim(),
        content: newTextContent.trim()
      };

      // Add time limit if provided
      if (newTextTimeLimit && parseInt(newTextTimeLimit) > 0) {
        newText.timeLimit = parseInt(newTextTimeLimit);
      }

      setTexts([...texts, newText]);
      setCurrentTextId(newText.id);
      setNewTextTitle('');
      setNewTextContent('');
      setNewTextTimeLimit('');
      setShowAddForm(false);
      setHiddenIndices(new Set());
    }
  };

  const startEdit = (text) => {
    setEditingTextId(text.id);
    setNewTextTitle(text.title);
    setNewTextContent(text.content);
    setNewTextTimeLimit(text.timeLimit || '');
    setShowAddForm(true);
  };

  const updateText = () => {
    if (newTextTitle.trim() && newTextContent.trim() && editingTextId) {
      const updatedTexts = texts.map(text => {
        if (text.id === editingTextId) {
          const updatedText = {
            ...text,
            title: newTextTitle.trim(),
            content: newTextContent.trim()
          };

          // Update or remove time limit
          if (newTextTimeLimit && parseInt(newTextTimeLimit) > 0) {
            updatedText.timeLimit = parseInt(newTextTimeLimit);
          } else {
            delete updatedText.timeLimit;
          }

          return updatedText;
        }
        return text;
      });

      setTexts(updatedTexts);
      setNewTextTitle('');
      setNewTextContent('');
      setNewTextTimeLimit('');
      setShowAddForm(false);
      setEditingTextId(null);
      setHiddenIndices(new Set());
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingTextId(null);
    setNewTextTitle('');
    setNewTextContent('');
    setNewTextTimeLimit('');
  };

  const deleteText = (id) => {
    const newTexts = texts.filter(t => t.id !== id);
    setTexts(newTexts);
    if (currentTextId === id) {
      setCurrentTextId(newTexts.length > 0 ? newTexts[0].id : null);
      setHiddenIndices(new Set());
    }
  };

  const hideRandomWord = () => {
    // Filter out words that are already hidden AND words that contain brackets []
    const visibleWordIndices = wordIndices.filter(({ idx, word }) => {
      if (hiddenIndices.has(idx)) return false;
      // Don't hide words that contain brackets
      if (word.includes('[') || word.includes(']')) return false;
      return true;
    });

    if (visibleWordIndices.length === 0) return;

    // Calculate how many words to hide based on percentage
    const numWordsToHide = Math.max(1, Math.ceil(visibleWordIndices.length * (hidePercentage / 100)));
    const actualWordsToHide = Math.min(numWordsToHide, visibleWordIndices.length);

    // Randomly select words to hide
    const shuffled = [...visibleWordIndices].sort(() => Math.random() - 0.5);
    const wordsToHide = shuffled.slice(0, actualWordsToHide);

    const newHiddenIndices = new Set(hiddenIndices);
    wordsToHide.forEach(({ idx }) => newHiddenIndices.add(idx));

    setHiddenIndices(newHiddenIndices);
    setUserInput('');
  };

  const reset = () => {
    setHiddenIndices(new Set());
    setUserInput('');
    setWordInputs({});
    setShowAnswers(false);
    if (currentText && currentText.timeLimit) {
      setTimeRemaining(currentText.timeLimit);
      setIsTimerRunning(false);
      setTimerExpired(false);
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (timeRemaining !== null && timeRemaining > 0) {
      setIsTimerRunning(true);
      setTimerExpired(false);
    }
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    if (currentText && currentText.timeLimit) {
      setTimeRemaining(currentText.timeLimit);
      setIsTimerRunning(false);
      setTimerExpired(false);
    }
  };

  const handleWordInputChange = (idx, value) => {
    setWordInputs(prev => ({
      ...prev,
      [idx]: value
    }));
  };

  const checkWordCorrect = (idx, originalWord) => {
    const userWord = wordInputs[idx] || '';
    if (!userWord) return null; // No input yet
    return userWord.toLowerCase().trim() === originalWord.toLowerCase().trim();
  };

  const checkTypedText = () => {
    if (!currentText) return false;
    const originalText = currentText.content.toLowerCase().trim();
    const typed = userInput.toLowerCase().trim();
    return originalText === typed;
  };

  const allWordsHidden = wordIndices.length > 0 && hiddenIndices.size === wordIndices.length;

  // Library Page
  if (currentPage === 'library') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-dune text-orange-600 mb-2 text-center dune-glow tracking-wider">
            MEMORIZATION LIBRARY
          </h1>
          <p className="text-center text-amber-700 mb-8 font-fremen">Master your speaking and writing templates</p>

          {showAddForm ? (
            <div className="bg-white rounded-lg shadow-2xl border-2 border-orange-300 p-6 mb-6">
              <h2 className="text-2xl font-bold font-dune text-orange-700 mb-4">
                {editingTextId ? 'Edit Template' : 'New Template'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-fremen tracking-wide">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newTextTitle}
                    onChange={(e) => setNewTextTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-amber-50 border-2 border-amber-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Template name..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-fremen tracking-wide">
                    Content
                  </label>
                  <textarea
                    value={newTextContent}
                    onChange={(e) => setNewTextContent(e.target.value)}
                    className="w-full px-4 py-2 bg-amber-50 border-2 border-amber-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-48"
                    placeholder="Enter text to memorize..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-fremen tracking-wide">
                    Time Limit (optional, in seconds)
                  </label>
                  <input
                    type="number"
                    value={newTextTimeLimit}
                    onChange={(e) => setNewTextTimeLimit(e.target.value)}
                    className="w-full px-4 py-2 bg-amber-50 border-2 border-amber-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Time in seconds"
                    min="1"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Enter time in seconds. Leave empty for unlimited practice.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={editingTextId ? updateText : addText}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all font-bold font-fremen flex items-center justify-center gap-2 shadow-lg dune-glow"
                  >
                    <Save size={20} />
                    {editingTextId ? 'Update Template' : 'Save Template'}
                  </button>
                  <button
                    onClick={cancelForm}
                    className="px-6 py-3 bg-gray-200 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-300 transition-colors font-medium font-fremen"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 flex justify-center">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all font-bold font-fremen flex items-center gap-2 shadow-lg dune-glow"
              >
                <Plus size={20} />
                New Template
              </button>
            </div>
          )}

          {/* Text Library Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {texts.map(text => (
              <div
                key={text.id}
                className="bg-white border-2 border-orange-200 rounded-lg shadow-lg p-5 hover:shadow-2xl hover:border-orange-400 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold font-fremen text-orange-700 flex-1">
                    {text.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(text)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-blue-300"
                      title="Edit template"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteText(text.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-300"
                      title="Delete template"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {text.content}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentTextId(text.id);
                      setHiddenIndices(new Set());
                      setUserInput('');
                      setWordInputs({});
                      setCurrentPage('practice');
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-bold font-fremen flex items-center justify-center gap-2 dune-glow-blue"
                  >
                    <BookOpen size={18} />
                    Start Practice
                  </button>
                </div>
              </div>
            ))}
          </div>

          {texts.length === 0 && !showAddForm && (
            <div className="bg-white border-2 border-orange-200 rounded-lg shadow-lg p-12 text-center">
              <BookOpen size={48} className="mx-auto text-orange-500 mb-4" />
              <p className="text-gray-700 text-lg font-fremen">
                No templates yet. Click "New Template" to begin.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Practice Page - safety check
  if (!currentText) {
    setTimeout(() => setCurrentPage('library'), 0);
    return null;
  }

  // Practice Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => {
              setCurrentPage('library');
              setHiddenIndices(new Set());
              setUserInput('');
              setWordInputs({});
            }}
            className="px-4 py-2 bg-white text-gray-700 border-2 border-orange-300 rounded-lg hover:bg-orange-50 transition-colors font-bold font-fremen flex items-center gap-2 shadow-md"
          >
            <ArrowLeft size={20} />
            Back to Library
          </button>
          <h1 className="text-3xl font-bold font-dune text-orange-600 flex-1 text-center dune-glow tracking-wide">
            {currentText?.title || 'Practice Mode'}
          </h1>
          <div className="w-48"></div> {/* Spacer for centering */}
        </div>

        {/* Timer Display */}
        {currentText && currentText.timeLimit && (
          <div className="mb-6 bg-white border-2 border-orange-300 rounded-lg shadow-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-sm font-bold font-fremen text-gray-700 mb-1 tracking-wider">TIMER</h2>
                <p className="text-xs text-gray-600">
                  {currentText.timeLimit >= 60
                    ? `${Math.floor(currentText.timeLimit / 60)} minute${Math.floor(currentText.timeLimit / 60) > 1 ? 's' : ''}`
                    : `${currentText.timeLimit} seconds`}
                </p>
              </div>

              <div className="flex-1 text-center">
                <div className={`text-5xl font-bold font-dune ${
                  timerExpired
                    ? 'text-red-600 dune-glow'
                    : timeRemaining <= 10 && timeRemaining > 0
                    ? 'text-orange-500'
                    : 'text-blue-600 dune-glow-blue'
                }`}>
                  {formatTime(timeRemaining)}
                </div>
                {timerExpired && (
                  <p className="text-red-600 font-bold font-fremen mt-2 text-sm tracking-wide">Time's Up!</p>
                )}
              </div>

              <div className="flex-1 flex justify-end gap-2">
                {!isTimerRunning ? (
                  <button
                    onClick={startTimer}
                    disabled={timeRemaining === 0}
                    className={`px-4 py-2 rounded-lg font-bold font-fremen transition-all flex items-center gap-2 ${
                      timeRemaining === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md border-2 border-green-400'
                    }`}
                  >
                    <Play size={18} />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all font-bold font-fremen flex items-center gap-2 shadow-md border-2 border-orange-400"
                  >
                    <Pause size={18} />
                    Pause
                  </button>
                )}
                <button
                  onClick={resetTimer}
                  className="px-4 py-2 bg-gray-200 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-300 transition-all font-bold font-fremen flex items-center gap-2 shadow-md"
                >
                  <RotateCw size={18} />
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Settings Panel */}
          <div className="bg-white border-2 border-orange-200 rounded-lg shadow-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mode Selector */}
              <div>
                <label className="block text-sm font-bold font-fremen text-gray-700 mb-2 tracking-wider">
                  Practice Mode
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode('read')}
                    className={`flex-1 py-2 px-3 rounded-lg font-bold font-fremen transition-all flex items-center justify-center gap-2 ${
                      mode === 'read'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md dune-glow-blue border-2 border-blue-400'
                        : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    <Eye size={18} />
                    Fill Blanks
                  </button>
                  <button
                    onClick={() => setMode('type')}
                    className={`flex-1 py-2 px-3 rounded-lg font-bold font-fremen transition-all flex items-center justify-center gap-2 ${
                      mode === 'type'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md dune-glow-blue border-2 border-blue-400'
                        : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    <Keyboard size={18} />
                    Type Full Text
                  </button>
                </div>
              </div>

              {/* Percentage Selector */}
              <div>
                <label className="block text-sm font-bold font-fremen text-gray-700 mb-2 tracking-wider">
                  Hide Rate: {hidePercentage}%
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={hidePercentage}
                    onChange={(e) => setHidePercentage(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={hidePercentage}
                    onChange={(e) => setHidePercentage(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-16 px-2 py-1 bg-amber-50 border-2 border-amber-300 text-gray-800 rounded text-center focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-600 text-sm font-bold">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Display Area */}
          <div className="bg-white border-2 border-orange-300 rounded-lg shadow-2xl p-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-gray-700 font-fremen">
                Progress: {hiddenIndices.size} / {wordIndices.length} words hidden
              </div>
              <div className="text-sm font-bold text-blue-600 font-dune tracking-wider">
                {wordIndices.length > 0 ? Math.round((hiddenIndices.size / wordIndices.length) * 100) : 0}% Complete
              </div>
            </div>

            {mode === 'read' ? (
              <div className="text-lg leading-relaxed text-gray-800 mb-6 p-4 bg-amber-50 border border-orange-200 rounded-lg min-h-48">
                {words.map((word, idx) => {
                  const isWhitespace = word.trim().length === 0;
                  const isHidden = hiddenIndices.has(idx);

                  if (isWhitespace) {
                    return <span key={idx}>{word}</span>;
                  }

                  if (isHidden) {
                    // If showing answers, display the word with orange highlight
                    if (showAnswers) {
                      return (
                        <span key={idx} className="bg-orange-400 text-white px-1 rounded font-bold">
                          {word}
                        </span>
                      );
                    }

                    const isCorrect = checkWordCorrect(idx, word);
                    let borderColor = 'border-orange-300';
                    let bgColor = 'bg-white';

                    if (isCorrect === true) {
                      borderColor = 'border-green-500';
                      bgColor = 'bg-green-50';
                    } else if (isCorrect === false) {
                      borderColor = 'border-red-500';
                      bgColor = 'bg-red-50';
                    }

                    return (
                      <input
                        key={idx}
                        type="text"
                        value={wordInputs[idx] || ''}
                        onChange={(e) => handleWordInputChange(idx, e.target.value)}
                        className={`inline-block border-2 ${borderColor} ${bgColor} text-gray-800 rounded px-1 mx-0.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        style={{ width: `${Math.max(word.length * 0.8, 3)}em` }}
                        placeholder="___"
                      />
                    );
                  }

                  return <span key={idx}>{word}</span>;
                })}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-lg leading-relaxed text-gray-800 p-4 bg-amber-50 border border-orange-200 rounded-lg min-h-32">
                  {words.map((word, idx) => {
                    const isWhitespace = word.trim().length === 0;
                    const isHidden = hiddenIndices.has(idx);

                    if (isWhitespace) {
                      return <span key={idx}>{word}</span>;
                    }

                    if (isHidden) {
                      return (
                        <span
                          key={idx}
                          className="inline-block bg-orange-300 rounded px-1 mx-0.5"
                          style={{ width: `${word.length * 0.6}em` }}
                        >
                          &nbsp;
                        </span>
                      );
                    }

                    return <span key={idx}>{word}</span>;
                  })}
                </div>

                <div>
                  <label className="block text-sm font-bold font-fremen text-gray-700 mb-2 tracking-wider">
                    Your Answer:
                  </label>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-orange-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-32"
                    placeholder="Type the complete text here..."
                  />
                  {userInput && (
                    <div className="mt-2">
                      {checkTypedText() ? (
                        <p className="text-green-600 font-bold font-fremen">✓ Perfect! Text matches correctly</p>
                      ) : (
                        <p className="text-gray-600 text-sm font-fremen">Keep typing...</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={hideRandomWord}
                disabled={allWordsHidden}
                className={`flex-1 py-3 px-6 rounded-lg font-bold font-fremen transition-all ${
                  allWordsHidden
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-2xl dune-glow-blue border-2 border-blue-400'
                }`}
              >
                {allWordsHidden ? 'All Words Hidden!' : `Hide ${hidePercentage}% More Words`}
              </button>
              {mode === 'read' && hiddenIndices.size > 0 && (
                <button
                  onClick={() => setShowAnswers(!showAnswers)}
                  className={`px-6 py-3 rounded-lg transition-all font-bold font-fremen shadow-md hover:shadow-lg flex items-center gap-2 border-2 ${
                    showAnswers
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 border-orange-400'
                      : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 border-purple-400'
                  }`}
                >
                  {showAnswers ? <EyeOff size={20} /> : <Eye size={20} />}
                  {showAnswers ? 'Hide Answers' : 'Show Answers'}
                </button>
              )}
              <button
                onClick={reset}
                className="px-6 py-3 bg-gray-200 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-300 transition-all font-bold font-fremen shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <RotateCcw size={20} />
                Reset
              </button>
            </div>

            {allWordsHidden && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-400 rounded-lg">
                <p className="text-green-700 font-bold font-dune text-center tracking-wider">
                  🎉 Great job! All words are hidden. Reset to start over.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
