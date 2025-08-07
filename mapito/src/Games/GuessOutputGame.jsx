import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import monkeyDefault from '../assets/images/monkey-default.png';
import monkeyHappy from '../assets/images/monkey-happy.jpg';
import monkeySad from '../assets/images/monkey-sad.jpg';
import monkeyThinking from '../assets/images/monkey-thinking.jpg';
import monkeySurprised from '../assets/images/monkey-suprised.png';
import bananaImage from '../assets/images/banana.png';

const Monkey = ({ expression = 'default', size = 150 }) => {
  const expressionImages = {
    default: monkeyDefault,
    happy: monkeyHappy,
    sad: monkeySad,
    thinking: monkeyThinking,
    surprised: monkeySurprised
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <img 
        src={expressionImages[expression] || monkeyDefault} 
        alt="Monkey" 
        style={{ width: size, height: size }}
        className="object-contain"
      />
    </motion.div>
  );
};

const BananaReward = () => (
  <motion.div
    className="absolute -top-10 -right-10"
    initial={{ scale: 0, rotate: -45 }}
    animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  >
    <img src={bananaImage} alt="Banana reward" className="w-10 h-10" />
  </motion.div>
);

const questions = [
  {
    code: `console.log(typeof null);`,
    options: ['object', 'null', 'undefined', 'string'],
    answer: 'object',
  },
  {
    code: `let a = [1, 2]; let b = a; b.push(3); console.log(a);`,
    options: ['[1, 2]', '[1, 2, 3]', '[3]', '[1, 3]'],
    answer: '[1, 2, 3]',
  },
  {
    code: `console.log(1 + '2' + 3);`,
    options: ['6', '123', '33', 'NaN'],
    answer: '123',
  },
  {
    code: `console.log(0.1 + 0.2 === 0.3);`,
    options: ['true', 'false', 'undefined', 'error'],
    answer: 'false',
  },
  {
    code: `const set = new Set([1, 1, 2, 3]); console.log(set.size);`,
    options: ['4', '3', '2', '1'],
    answer: '3',
  },
];

const GuessOutputGame = () => {
  const navigate = useNavigate();
  const [monkeyExpression, setMonkeyExpression] = useState('default');
  const [showBanana, setShowBanana] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const handleSelect = (option) => {
    if (showAnswer) return;
    
    setSelected(option);
    setShowAnswer(true);

    if (option === questions[current].answer) {
      setScore((prev) => prev + 1);
      setMonkeyExpression('happy');
      setShowBanana(true);
      setTimeout(() => setShowBanana(false), 1500);
    } else {
      setMonkeyExpression('sad');
    }

    setUserAnswers((prev) => {
      const updated = [...prev];
      updated[current] = option;
      return updated;
    });
  };

  const nextQuestion = () => {
    setCurrent((prev) => prev + 1);
    setSelected('');
    setShowAnswer(false);
    setMonkeyExpression('default');
  };

  const stopGame = () => {
    setCurrent(0);
    setSelected('');
    setShowAnswer(false);
    setScore(0);
    setUserAnswers([]);
    setReviewMode(false);
    setShowIntro(true);
    setMonkeyExpression('default');
  };

  const goBack = () => {
    navigate('/codinggame');
  };

  const startReview = () => {
    setReviewMode(true);
    setMonkeyExpression('thinking');
  };

  if (showIntro) {
    return (
      <section className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-12 text-center border border-gray-100 relative overflow-hidden">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <Monkey expression="happy" size={200} />
          </motion.div>
          
          <div className="relative z-10 mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Guess the Output
            </h1>
            <p className="mb-6 text-gray-600 text-lg leading-relaxed">
              Welcome to the "Guess the Output" game!  
              Meet your coding buddy, Mono the Monkey! He'll react to your answers as you test your JavaScript knowledge.
            </p>
          </div>
          
          <div className="flex flex-col space-y-4 relative z-10">
            <motion.button
              onClick={() => setShowIntro(false)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Game with Mono
            </motion.button>
            <motion.button
              onClick={goBack}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Back to Games
            </motion.button>
          </div>
        </div>
      </section>
    );
  }

  if (reviewMode) {
    return (
      <section className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-6xl mx-auto p-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Review Your Answers</h2>
            <div className="space-y-6">
              {questions.map((q, idx) => {
                const userAnswer = userAnswers[idx] || 'No answer';
                const isCorrect = userAnswer === q.answer;

                return (
                  <motion.div
                    key={idx}
                    className={`p-6 rounded-xl border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'} transition-all hover:shadow-md`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="flex items-start mb-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold mr-3">
                        {idx + 1}
                      </span>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-auto font-mono flex-1">
                        {q.code}
                      </pre>
                    </div>
                    <div className="ml-11 space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Your answer:</span>{" "}
                        <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          {userAnswer}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-gray-700">
                          <span className="font-medium">Correct answer:</span>{" "}
                          <span className="font-semibold text-green-700">{q.answer}</span>
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex justify-center gap-4 mt-10">
              <motion.button
                onClick={() => setReviewMode(false)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Results
              </motion.button>
              <motion.button
                onClick={stopGame}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Restart Game
              </motion.button>
              <motion.button
                onClick={goBack}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Games
              </motion.button>
            </div>
          </div>

          <div className="w-full md:w-64 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 flex flex-col items-center">
            <div className="relative">
              <Monkey expression="thinking" size={150} />
            </div>
            <div className="mt-4 text-center">
              <h3 className="font-bold text-lg text-gray-800">Mono the Monkey</h3>
              <p className="text-gray-600 mt-1">Let's review your answers!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8 flex flex-col md:flex-row gap-8">
        {/* Game Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Guess the Output</h1>
              {current < questions.length && (
                <p className="text-gray-500 mt-1">
                  Question {current + 1} of {questions.length}
                </p>
              )}
            </div>
            <div className="flex gap-3 flex-wrap justify-end">
              <motion.button
                onClick={stopGame}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Stop Game
              </motion.button>
              <motion.button
                onClick={goBack}
                className="px-5 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Games
              </motion.button>
            </div>
          </header>

          {current < questions.length ? (
            <div className="space-y-6">
              <motion.div 
                className="bg-gray-800 p-5 rounded-xl shadow-inner"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <pre className="text-gray-100 text-sm overflow-auto font-mono">
                  {questions[current].code}
                </pre>
              </motion.div>

              <div className="grid gap-4">
                {questions[current].options.map((opt, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleSelect(opt)}
                    disabled={showAnswer}
                    className={`p-4 rounded-xl text-left transition-all duration-200 border-2
                      ${showAnswer && opt === questions[current].answer
                        ? 'bg-green-100 border-green-500 shadow-green-sm'
                        : showAnswer && opt === selected
                        ? 'bg-red-100 border-red-500 shadow-red-sm'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md'
                      }
                      ${!showAnswer && 'hover:scale-[1.01]'}
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={!showAnswer ? { scale: 1.02 } : {}}
                    whileTap={!showAnswer ? { scale: 0.98 } : {}}
                  >
                    <span className="font-medium text-gray-800">{opt}</span>
                  </motion.button>
                ))}
              </div>

              {showAnswer && (
                <motion.div 
                  className="mt-8 flex justify-between items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {current < questions.length - 1 ? (
                    <motion.button
                      onClick={nextQuestion}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-md hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next Question →
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={startReview}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 font-medium shadow-md hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Review Answers
                    </motion.button>
                  )}
                </motion.div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mb-8">
                <motion.div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white text-4xl mb-4 shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {score === questions.length ? '🏆' : score >= questions.length * 0.8 ? '🌟' : '🎉'}
                </motion.div>
                <motion.h2 
                  className="text-3xl font-bold text-gray-800 mb-2"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  Game Over!
                </motion.h2>
                <motion.p 
                  className="text-xl text-gray-600"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Your score: <span className="font-bold text-blue-600">{score}</span> / {questions.length}
                </motion.p>
                <motion.div 
                  className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl inline-block"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-gray-700 mb-4">
                    {score === questions.length ? "Perfect score! Amazing job!" :
                    score >= questions.length * 0.8 ? "Great performance! You know your stuff!" :
                    score >= questions.length * 0.5 ? "Good effort! Keep practicing!" :
                    "Keep at it! You'll improve with practice!"}
                  </p>
                </motion.div>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  onClick={stopGame}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Again
                </motion.button>
                <motion.button
                  onClick={goBack}
                  className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Games
                </motion.button>
                <motion.button
                  onClick={startReview}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Review Answers
                </motion.button>
              </div>
            </div>
          )}
        </div>
        
        {/* Monkey Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 flex flex-col items-center">
          <div className="relative">
            <Monkey expression={monkeyExpression} size={150} />
            <AnimatePresence>
              {showBanana && <BananaReward />}
            </AnimatePresence>
          </div>
          
          <div className="mt-4 text-center">
            <h3 className="font-bold text-lg text-gray-800">Mono the Monkey</h3>
            <p className="text-gray-600 mt-1">
              {monkeyExpression === 'happy' ? "Great job! 🎉" :
               monkeyExpression === 'sad' ? "Oops! Try again!" :
               monkeyExpression === 'thinking' ? "Hmm... what's the answer?" :
               "Let's play!"}
            </p>
            
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800">Your Score</h4>
              <p className="text-2xl font-bold text-blue-600">
                {score} / {questions.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {current < questions.length ? 
                 `Question ${current + 1} of ${questions.length}` : 
                 "Game Complete!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuessOutputGame;