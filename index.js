import React, { useState, useEffect, useMemo } from 'react';
import { Clipboard, CheckCircle, XCircle, ChevronRight, Hash, FileText, Play, BookOpen, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

// --- Configuration Data ---
// NEW: Placeholder for a rectangular school logo (change this URL)
const SCHOOL_LOGO_URL = "https://placehold.co/150x50/3730a3/ffffff?text=SCHOOL+LOGO"; 

// NEW: Unique Submission Code - Change this manually for each new test
const MANUAL_SUBMISSION_CODE = "MMQUIZ-2025-SPRING"; 

const QUIZ_DATA_CONFIG = {
  title: "MathMania Rapid Round",
  subtitle: "Grade 7 Challenge", 
  questionsPerSet: 5,
  googleFormLink: "https://forms.gle/TF4N5rrGsBnrzroJA", // <-- CHANGE THIS LINK
  sets: [
    { 
      id: 'set1', name: "Set A", 
      questions: [
        { id: 1, text: "A shirt costs ₹500. If a discount of 20% is offered, what is the final selling price of the shirt?", answer: "400" },
        { id: 2, text: "If a car travels at 60 km/hr for 15 minutes, how much distance has it covered in kilometers?", answer: "15" },
        { id: 3, text: "If the side of a square is 10 cm, by what percentage has the perimeter increased if the side is increased by 2 cm?", answer: "20%" },
        { id: 4, text: "Solve for x: $4x - 5 = x + 7$.", answer: "x=4" },
        { id: 5, text: "A person walks 9 km North and 12 km East. How far is the person from the starting point, in km?", answer: "15" },
      ]
    },
    { 
      id: 'set2', name: "Set B", 
      questions: [
        { id: 6, text: "A rectangle is three times as long as it is wide. If the width is 4 cm, what is its area in $\\text{cm}^2$?", answer: "48" },
        { id: 7, text: "A water tank is 1/4 full. When 300 liters of water are added, it becomes 3/4 full. What is the capacity of the tank in liters?", answer: "600" },
        { id: 8, text: "The price of a book, ₹400, first increased by 10% and then decreased by 5% on the new price. What is the final price of the book?", answer: "418" },
        { id: 9, text: "The average weight of 4 students is 30 kg. If a new student joins the group, the new average weight becomes 32 kg. What is the weight of the new student?", answer: "40" },
        { id: 10, text: "A group of 8 friends equally split a bill of ₹2,400. If 2 friends suddenly leave before paying, how much more does each of the remaining friends have to pay?", answer: "100" },
      ]
    },
    { 
      id: 'set3', name: "Set C", 
      questions: [
        { id: 11, text: "The original price of a bag was 1500. After a 30% increase in price, what is the new price?", answer: "1950" },
        { id: 12, text: "If $2x + 10 = 50$, what is the value of $x$?", answer: "20" },
        { id: 13, text: "A cyclist rides at 15 km/hr for 4 hours. If they must complete the same distance in 3 hours, what speed is required?", answer: "20 km/hr" },
        { id: 14, text: "A number is increased by 10% and then the result is decreased by 10%. If the final result is 99, what was the original number?", answer: "100" },
        { id: 15, text: "What is the area of a right-angled triangle whose two sides containing the right angle are 12 cm and 5 cm?", answer: "30" },
      ]
    },
    { 
      id: 'set4', name: "Set D", 
      questions: [
        { id: 16, text: "A group of 7 people bought tickets worth a total of ₹1050. What is the average cost of one ticket?", answer: "150" },
        { id: 17, text: "A recipe requires $\\frac{3}{4}$ cup of flour. If you want to make half the recipe, how much flour (in cups) is needed?", answer: "3/8" },
        { id: 18, text: "A rectangle has a perimeter of 28 cm. If the length is 8 cm, what is its width?", answer: "6" },
        { id: 19, text: "A worker's salary is ₹20,000. If he spends 60% of his salary, how much money does he save?", answer: "8000" },
        { id: 20, text: "The product of two numbers is 180. If one of the numbers is -12, what is the other number?", answer: "-15" },
      ]
    },
    { 
      id: 'set5', name: "Set E", 
      questions: [
        { id: 21, text: "The ratio of two angles is 2:3. If they are supplementary (add up to $180^{\\circ}$), what is the measure of the smaller angle?", answer: "72" },
        { id: 22, text: "If the area of a circle is $154 \\text{ cm}^2$ (use $\\pi \\approx \\frac{22}{7}$), what is its radius?", answer: "7" },
        { id: 23, text: "In an expression, if $y=3$, what is the value of $5y^2 - 10$?", answer: "35" },
        { id: 24, text: "A rectangular park is 20 m long and 10 m wide. If a path 1 m wide runs outside the park, what is the area of the path?", answer: "64" },
        { id: 25, text: "A man cycles 10 km at 20 km/hr and then 10 km at 5 km/hr. What is his average speed for the whole journey?", answer: "8 km/hr" },
      ]
    },
    { 
      id: 'set6', name: "Set F", 
      questions: [
        { id: 26, text: "Two friends, A and B, share ₹240 in the ratio 5:3. How much more money does A get than B?", answer: "60" },
        { id: 27, text: "Find the value of $\\sqrt{169} + \\sqrt{25}$.", answer: "18" },
        { id: 28, text: "A shopkeeper marked an item for ₹500 and sold it for ₹425. What was the percentage discount offered?", answer: "15%" },
        { id: 29, text: "If the average of four numbers is 15, and three of the numbers are 12, 18, and 16, what is the fourth number?", answer: "14" },
        { id: 30, text: "A watch's price is increased by 10% to ₹1100. What was the original price of the watch?", answer: "1000" },
      ]
    },
  ]
};

// --- Utility Functions ---

const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[currentIndex], array[randomIndex]];
  }
  return array;
};

const normalizeAnswer = (answer) => {
  return String(answer).toLowerCase().replace(/\s/g, '').replace(/[₹$%°√]/g, '').replace(/km\/hr/g, '').replace(/x=/g, '');
};

const App = () => {
  // --- STATE HOOKS (Must be first and unconditional) ---
  const [quizData, setQuizData] = useState(null); 
  const [selectedSet, setSelectedSet] = useState(null); 
  const [quizStarted, setQuizStarted] = useState(false); 
  const [setChosen, setSetChosen] = useState(false); 
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState(null);
  
  // State to track if the current set is finished
  const [setCompleted, setSetCompleted] = useState(false); 
  
  // Submission Code
  const completionCode = MANUAL_SUBMISSION_CODE; 
  
  // State for shuffle confirmation message
  const [shuffleMessage, setShuffleMessage] = useState('');

  // --- EFFECTS AND CALLBACKS ---
  
  // 1. Initialization and Shuffling
  // This initial shuffle ensures the first load is randomized
  useEffect(() => {
    shuffleAllSets();
  }, []);
  
  // Function to shuffle all sets
  const shuffleAllSets = () => {
    const shuffledSets = QUIZ_DATA_CONFIG.sets.map(set => ({
      ...set,
      // Create a fresh copy of the questions array before shuffling
      questions: shuffleArray([...set.questions]) 
    }));
    setQuizData({ ...QUIZ_DATA_CONFIG, sets: shuffledSets });
  }

  // 2. Security Handlers (Prevent cheating/viewing answers)
  useEffect(() => {
    const handleContextmenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextmenu);
    
    const handleKeydown = (e) => {
        if (e.key === 'F12') e.preventDefault();
    };
    document.addEventListener('keydown', handleKeydown);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextmenu);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []); 

  // --- HANDLERS ---
  
  const handleSetSelection = (set) => {
    setSelectedSet(set);
    setSetChosen(true); // Move to instruction screen
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };
  
  // Added: Explicit shuffle handler
  const handleShuffleQuestions = () => {
    shuffleAllSets();
    setShuffleMessage("Questions re-shuffled successfully!");
    setTimeout(() => setShuffleMessage(''), 2000);
  }
  
  // Reset function to go back to set selection
  const handleResetQuiz = () => {
    setSetCompleted(false);
    setQuizStarted(false);
    setSetChosen(false);
    setCurrentQuestionIndex(0);
    setSelectedSet(null);
    setShuffleMessage(''); // Clear any shuffle messages
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    
    if (feedback !== null) {
        setFeedback(null); 
    }
  };

  const moveToNextQuestion = () => {
    // Check if this is the last question in the current set
    if (selectedSet && currentQuestionIndex >= selectedSet.questions.length - 1) {
      setSetCompleted(true); // Signal current set is complete
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    const currentQuestion = selectedSet?.questions[currentQuestionIndex];
    if (!currentQuestion || feedback === 'correct' || setCompleted) return;

    const normalizedInput = normalizeAnswer(inputValue);
    const normalizedCorrectAnswer = normalizeAnswer(currentQuestion.answer);

    if (normalizedInput === normalizedCorrectAnswer) {
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        setInputValue('');
        moveToNextQuestion();
      }, 500);
    } else {
      setFeedback('incorrect');
    }
  };


  // --- CONDITIONAL RENDERING SETUP (After all hooks) ---

  // Show loading state if data is still null
  if (!quizData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-indigo-700">Loading MathMania Quiz...</div>
      </div>
    );
  }

  const currentQuestion = selectedSet?.questions[currentQuestionIndex];


  // --- UI COMPONENTS ---

  const Header = () => (
    <div className="text-center mb-8 bg-white p-4 rounded-xl shadow-lg border-b-4 border-indigo-600 w-full max-w-lg">
      <div className="flex items-center justify-center space-x-4">
          <img 
              src={SCHOOL_LOGO_URL} 
              alt="School Logo" 
              className="w-auto h-12 object-contain border border-gray-200 p-1" // Rectangular logo style
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x50/3730a3/ffffff?text=SCHOOL+LOGO" }} // Fallback
          />
          <div>
              <h1 className="text-3xl font-extrabold text-indigo-700 mb-0">{quizData.title}</h1>
              <p className="text-md text-gray-500 font-medium">{quizData.subtitle}</p>
          </div>
      </div>
    </div>
  );
  
  const SetSelectionScreen = () => (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg text-center">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 border-b-2 pb-2">Select Your Challenge</h2>
      <p className="text-gray-600 mb-8">Choose a set of problems to begin the challenge.</p>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 mb-6">
        {quizData.sets.map((set) => (
          <button
            key={set.id}
            onClick={() => handleSetSelection(set)}
            className="flex flex-col items-center justify-center p-4 bg-indigo-50 hover:bg-indigo-600 border border-indigo-300 rounded-xl text-indigo-700 font-extrabold shadow-md hover:shadow-xl hover:text-white"
          >
            <Play className="w-6 h-6 mb-1 text-indigo-500 group-hover:text-white" />
            {set.name}
          </button>
        ))}
      </div>
      
      {/* NEW: Shuffle Button */}
      <button
        onClick={handleShuffleQuestions}
        className="w-full sm:w-auto mt-4 px-6 py-3 bg-lime-500 text-indigo-900 rounded-xl text-lg font-extrabold hover:bg-lime-600 shadow-md flex items-center justify-center mx-auto"
      >
        <RefreshCw className="w-5 h-5 mr-2" /> Shuffle All Questions
      </button>
      {shuffleMessage && (
        <p className="mt-3 text-sm text-lime-600 font-semibold">{shuffleMessage}</p>
      )}
    </div>
  );
  
  const InstructionScreen = () => (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border-4 border-lime-500 w-full max-w-lg text-gray-800">
      <h2 className="text-3xl font-extrabold text-indigo-600 mb-4 flex items-center">
        <BookOpen className="w-8 h-8 mr-3 text-lime-500" /> Instructions for {selectedSet.name}
      </h2>
      
      <div className="space-y-4 text-gray-600">
        <p className="text-lg font-semibold border-b border-gray-300 pb-2">
          This is an untimed challenge. Focus on accuracy!
        </p>
        
        <ul className="list-disc list-inside space-y-2 ml-4 text-left">
          <li>
            <span className="font-bold text-indigo-500">Answering:</span> Type your final answer in the text box. Click "Submit" to check.
          </li>
          <li>
            <span className="font-bold text-indigo-500">Immediate Feedback:</span> The system will check for correctness instantly.
          </li>
          <li>
            <span className="font-bold text-indigo-500">No Penalty:</span> You may try again until the answer is correct before moving to the next question.
          </li>
          <li>
            <span className="font-bold text-indigo-500">Completion:</span> Upon correctly answering all questions, a unique code will be displayed for submission.
          </li>
          <li className="font-bold text-lime-600">
            <span className="font-bold">Math Notation:</span> Use standard numbers, fractions (e.g., 3/8), or required units.
          </li>
        </ul>
        
        <div className="p-3 bg-lime-50 border border-lime-400 rounded-lg flex items-center mt-6">
          <AlertTriangle className="w-5 h-5 mr-2 text-lime-600 flex-shrink-0" />
          <p className="text-sm">
            <span className="font-bold text-lime-600">Ready?</span> The challenge begins immediately after clicking the button below.
          </p>
        </div>
      </div>
      
      <button
        onClick={handleStartQuiz}
        className="mt-8 w-full bg-indigo-600 text-white py-3 rounded-xl text-xl font-extrabold hover:bg-indigo-700 shadow-xl disabled:opacity-50"
      >
        Start Challenge <ChevronRight className="inline w-6 h-6 ml-2" />
      </button>
    </div>
  );

  const QuestionCard = () => {
      const isIncorrect = feedback === 'incorrect';
      const questionNumber = currentQuestionIndex + 1;
      const totalQuestions = selectedSet.questions.length;

      // --- STABILITY FIX: Compute dynamic classes explicitly ---
      // Base classes for stability (size, padding, general look)
      const baseClasses = "w-full px-4 py-3 border-2 rounded-xl text-xl text-gray-800 focus:outline-none shadow-inner";

      // Dynamic classes for color (border/background)
      let dynamicClasses = "border-gray-300 bg-gray-50 focus:border-indigo-500";

      if (feedback === 'correct') {
          dynamicClasses = "border-lime-500 bg-lime-50";
      } else if (isIncorrect) {
          dynamicClasses = "border-red-500 bg-red-100";
      }
      // --- END STABILITY FIX ---

      return (
        <div className="bg-white text-gray-800 p-6 md:p-8 rounded-xl shadow-2xl border-t-8 border-indigo-600 w-full max-w-lg">
          
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-semibold text-indigo-600">
              {selectedSet.name}
            </h2>
            <div className="text-lg font-bold text-gray-500 flex items-center">
              <Hash className="w-5 h-5 mr-1" /> Q {questionNumber} of {totalQuestions}
            </div>
          </div>

          <div className="mb-8 min-h-[80px]">
            <p className="text-2xl text-gray-800 font-bold leading-relaxed">
              <span dangerouslySetInnerHTML={{ __html: currentQuestion.text }} />
            </p>
          </div>

          <form onSubmit={handleAnswerSubmit} className="space-y-4">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Your Solution Here..."
              // Use the computed stable class string
              className={`${baseClasses} ${dynamicClasses}`} 
              autoFocus
              disabled={feedback === 'correct'} 
            />

            <div className="min-h-10 flex items-center justify-center">
              {feedback === 'correct' && (
                <div className="text-lime-600 font-extrabold flex items-center text-xl">
                  <CheckCircle className="w-7 h-7 mr-2" /> Correct!
                </div>
              )}
              {isIncorrect && (
                <div className="text-red-600 font-semibold flex items-center text-xl">
                  <XCircle className="w-7 h-7 mr-2" /> Incorrect. Try again.
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl text-2xl font-extrabold hover:bg-indigo-700 shadow-xl disabled:opacity-50"
              disabled={!inputValue.trim() || feedback === 'correct'}
            >
              {feedback === 'correct' ? 'Next Question' : 'Submit Solution'}
              <ChevronRight className="inline w-6 h-6 ml-2" />
            </button>
          </form>
        </div>
      );
  };

  const CompletionScreen = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      const el = document.createElement('textarea');
      el.value = completionCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="bg-white text-gray-800 p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-lg text-center border-8 border-lime-500">
        
        <CheckCircle className="w-16 h-16 text-lime-500 mx-auto mb-4" />
        
        <h2 className="text-4xl font-extrabold mb-2 text-indigo-700">
          SET COMPLETED!
        </h2>
        <p className="text-xl font-semibold mb-8 text-gray-600">
          You successfully completed the **{selectedSet.name}** challenge.
        </p>

        {/* Unique Code Section - Now using the fixed MANUAL_SUBMISSION_CODE */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg border border-lime-400">
          <p className="text-md font-medium text-lime-600 flex items-center justify-center mb-2">
            <Hash className="w-5 h-5 mr-1" /> Your Submission Key
          </p>
          <div className="flex items-center justify-center space-x-3">
            <span className="text-3xl font-mono tracking-widest text-indigo-700 bg-white p-3 rounded border border-dashed border-indigo-300 select-all shadow-inner">
              {completionCode}
            </span>
            <button
              onClick={handleCopy}
              className={`p-4 rounded-full shadow-lg ${copied ? 'bg-lime-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              aria-label="Copy code to clipboard"
            >
              <Clipboard className="w-6 h-6" />
            </button>
          </div>
          {copied && <p className="text-xs text-lime-600 mt-2 font-semibold">Key Copied!</p>}
        </div>

        <p className="text-lg text-gray-600 mb-6">
          Submit this key in the form below to register your completion for **{selectedSet.name}**.
        </p>

        {/* Google Form Link */}
        <a
          href={quizData.googleFormLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full py-3 rounded-xl text-xl font-extrabold shadow-xl bg-lime-500 hover:bg-lime-600 text-indigo-900 mb-4"
        >
          <FileText className="w-6 h-6 mr-2" /> Go to Submission Form
        </a>
        
        {/* Button to go back to set selection */}
        <button
          onClick={handleResetQuiz}
          className="inline-flex items-center justify-center w-full py-3 rounded-xl text-xl font-extrabold shadow-md bg-gray-200 hover:bg-gray-300 text-indigo-600"
        >
          <ArrowLeft className="w-6 h-6 mr-2" /> Start Another Set
        </button>
      </div>
    );
  };

  const QuizContainer = () => {
    // Check for set completion first
    if (setCompleted) {
      return <CompletionScreen />;
    }
    if (!setChosen) {
        return <SetSelectionScreen />;
    }
    if (setChosen && !quizStarted) {
        return <InstructionScreen />;
    }
    if (!currentQuestion) {
      return (
        <div className="text-center text-xl p-8 bg-white rounded-xl shadow-lg">
          <p className="text-red-500">Error: Quiz questions not found. Please check QUIZ_DATA configuration.</p>
        </div>
      );
    }
    return <QuestionCard />;
  };

  // --- Main Render ---
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-10 pb-10 p-4 relative bg-gray-100" // Background color: bg-gray-100
      style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none', WebkitUserDrag: 'none' }}
    >
      <Header />
      <div className="relative z-10">
        <QuizContainer />
      </div>
      
      {/* Visual math theme elements */}
      <div className="absolute top-1/4 right-1/4 text-5xl text-indigo-100 opacity-5 hidden md:block">$\infty$</div>
      <div className="absolute bottom-1/4 left-1/4 text-5xl text-lime-100 opacity-5 hidden md:block">$\sum$</div>

    </div>
  );
};

export default App;
