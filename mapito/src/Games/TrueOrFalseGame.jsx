import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const owlIdle = 'https://cdn-icons-png.flaticon.com/512/616/616408.png';
const owlHappy = 'https://i.pinimg.com/1200x/74/ef/ef/74efefaaa3a01bc8cc9250dda5a5bc61.jpg';
const owlSad = 'https://i.pinimg.com/1200x/c7/f5/7f/c7f57f35584bfea39fe7661cc60a9841.jpg';
const owlThinking = 'https://i.pinimg.com/1200x/de/15/16/de151616ec6bc013a1dbd09aca28593b.jpg';

// Game questions
const questions = [
  { 
    statement: "In JavaScript, `typeof null` returns 'object'.", 
    answer: true,
    explanation: "This is a historical bug in JavaScript that's maintained for backward compatibility."
  },
  { 
    statement: "JavaScript arrays are not objects.", 
    answer: false,
    explanation: "Arrays are a special type of object in JavaScript with additional array-specific methods."
  },
  { 
    statement: "`const` allows variable reassignment.", 
    answer: false,
    explanation: "`const` creates a read-only reference to a value. The value it holds cannot be reassigned."
  },
  { 
    statement: "`==` checks for strict equality in JS.", 
    answer: false,
    explanation: "`==` performs type coercion before comparison. Use `===` for strict equality."
  },
  { 
    statement: "`NaN === NaN` is true in JS.", 
    answer: false,
    explanation: "NaN is the only value in JavaScript that is not equal to itself. Use isNaN() to check for NaN."
  },
];

const Owl = ({ expression = 'idle', size = 120 }) => {
  const images = {
    idle: owlIdle,
    happy: owlHappy,
    sad: owlSad,
    thinking: owlThinking
  };

  return (
    <motion.img
      src={images[expression]}
      alt="Owlio the Owl"
      style={{ width: size, height: size }}
      className="mx-auto rounded-full bg-white p-2 shadow-md"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
};

const TrueOrFalseGame = () => {
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [expression, setExpression] = useState('idle');
  const [progress, setProgress] = useState(0);

  const handleAnswer = (choice) => {
    setShowExplanation(false);
    const correct = questions[current].answer === choice;
    if (correct) {
      setScore(score + 1);
      setFeedback('Correct! 🎉');
      setExpression('happy');
    } else {
      setFeedback('Oops! ❌');
      setExpression('sad');
    }

    setTimeout(() => {
      setFeedback('');
      setExpression('thinking');
      setShowExplanation(true);
      
      setTimeout(() => {
        if (current + 1 < questions.length) {
          setCurrent(current + 1);
          setProgress(((current + 1) / questions.length) * 100);
        } else {
          setFinished(true);
        }
        setShowExplanation(false);
        setExpression('idle');
      }, 3000);
    }, 2000);
  };

  const restart = () => {
    setStarted(false);
    setCurrent(0);
    setScore(0);
    setFeedback('');
    setExpression('idle');
    setFinished(false);
    setProgress(0);
    setShowExplanation(false);
  };

  if (!started) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 mt-10">
        <Navbar />
        <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center border-4 border-blue-100">
          <Owl expression="idle" size={140} />
          <h1 className="text-4xl font-bold my-4 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            True or False Challenge
          </h1>
          <p className="text-gray-700 text-lg mb-6">
            Help <strong className="text-blue-600">Owlio</strong> decide if each coding statement is true or false!
          </p>
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Beginner Friendly</span>
              <span>{questions.length} Questions</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <motion.button
              onClick={() => setStarted(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition text-lg font-semibold shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Game
            </motion.button>
            <motion.button
              onClick={() => navigate('/codinggame')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-lg font-medium"
              whileHover={{ scale: 1.02 }}
            >
              Back to Games
            </motion.button>
          </div>
        </div>
      </section>
    );
  }

  if (finished) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 mt-10">
        <Navbar />
        <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center border-4 border-blue-100">
          <Owl expression={score >= 4 ? 'happy' : 'sad'} size={140} />
          <h2 className="text-3xl font-bold text-gray-800 my-4">
            {score === questions.length ? 'Perfect Score! 🏆' : score >= 4 ? 'Great Job! 🎉' : 'Game Over!'}
          </h2>
          <div className="mb-6">
            <div className="text-5xl font-bold my-4">
              <span className={score >= 4 ? 'text-green-600' : 'text-blue-600'}>{score}</span>
              <span className="text-gray-400">/{questions.length}</span>
            </div>
            <div className="bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${score >= 4 ? 'bg-green-500' : 'bg-blue-500'}`} 
                style={{ width: `${(score/questions.length)*100}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            {score === questions.length 
              ? "You're a JavaScript master!" 
              : score >= 4 
                ? "You know your stuff!" 
                : "Keep practicing and you'll improve!"}
          </p>
          <div className="flex flex-col gap-3">
            <motion.button
              onClick={restart}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition font-semibold shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              Play Again
            </motion.button>
            <motion.button
              onClick={() => navigate('/codinggame')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              whileHover={{ scale: 1.02 }}
            >
              More Games
            </motion.button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 mt-10">
      <Navbar />
      <div className="bg-white bg-opacity-95 p-6 rounded-2xl shadow-2xl max-w-xl w-full text-center border-4 border-blue-100">
        <div className="mb-4 relative">
          <Owl expression={expression} size={100} />
          <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {current + 1}/{questions.length}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-5 rounded-xl mb-6 min-h-32 flex items-center justify-center">
          {feedback ? (
            <motion.div
              className={`text-2xl font-bold ${expression === 'happy' ? 'text-green-600' : 'text-red-600'}`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              {feedback}
            </motion.div>
          ) : (
            <p className="text-lg text-gray-700 font-medium">
              {questions[current].statement}
            </p>
          )}
        </div>
        
        {showExplanation && (
          <motion.div
            className="bg-blue-50 p-4 rounded-lg mb-6 text-left text-blue-800 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="font-bold mb-1">💡 Explanation:</div>
            {questions[current].explanation}
          </motion.div>
        )}
        
        <div className="flex justify-center gap-4 mb-4">
          <motion.button
            onClick={() => handleAnswer(true)}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition font-bold text-lg shadow-md flex-1"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!!feedback}
          >
            True
          </motion.button>
          <motion.button
            onClick={() => handleAnswer(false)}
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition font-bold text-lg shadow-md flex-1"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!!feedback}
          >
            False
          </motion.button>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={restart}
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
          >
            ↻ Restart
          </button>
          <div className="text-sm text-gray-600">
            Score: <span className="font-bold">{score}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrueOrFalseGame;