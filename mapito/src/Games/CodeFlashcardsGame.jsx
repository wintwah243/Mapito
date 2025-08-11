import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaRedo} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import useSound from 'use-sound';
import clickSound from '../assets/sounds/click.mp3';
import acradeSound from '../assets/sounds/acrade.mp3'

const flashcards = [
  {
    question: `What does this code output?\n\nconsole.log(typeof null);`,
    answer: `"object" — it's a known JavaScript quirk`,
  },
  {
    question: `What does this do?\n\n[1, 2, 3].map(x => x * 2);`,
    answer: `Returns a new array: [2, 4, 6]`,
  },
  {
    question: `What is the result?\n\nBoolean("false")`,
    answer: `true — any non-empty string is truthy`,
  },
  {
    question: `What is hoisting in JavaScript?`,
    answer: `JavaScript moves function and variable declarations to the top of their scope.`,
  },
];

const CodeFlashcardsGame = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const navigate = useNavigate();

  //sound effect
  const [playClick] = useSound(clickSound, { volume: 0.3 });

  // Add stop function from useSound
    const [playAcrade, { stop }] = useSound(acradeSound, { 
      volume: 0.7,
      interrupt: true // Allows the sound to be interrupted
    });
  
    // Play sound when component mounts (user enters game)
    React.useEffect(() => {
      playAcrade();
      
      // Cleanup function to stop sound when component unmounts
      return () => {
        stop();
      };
    }, [playAcrade, stop]);

  const handleFlip = () => {
    if (gameStarted) {
      setFlipped(!flipped);
      playClick();
    }
  };

  const goNext = () => {
    if (!gameStarted) return;
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setFlipped(false);
  };

  const goPrev = () => {
    if (!gameStarted) return;
    setCurrentIndex((prev) =>
      prev === 0 ? flashcards.length - 1 : prev - 1
    );
    setFlipped(false);
  };

  const restart = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentIndex(0);
    setFlipped(false);
  };

  const stopGame = () => {
    setGameStarted(false);
  };

  const goBackToGames = () => {
    navigate("/codinggame"); 
  };

  const card = flashcards[currentIndex];

  return (
    <section className="min-h-screen bg-white mt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-12 flex flex-col items-center shadow-xl">
        {/* Header with character */}
        <div className="flex flex-col items-center mb-8">
          <motion.img 
            src="https://i.pinimg.com/1200x/da/eb/82/daeb828e434c33edc627fd2774f2e21c.jpg" 
            alt="Code Wizard"
            className="w-24 h-24 mb-4 rounded-full border-4 border-blue-100"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Code Flashcards</h1>
          <p className="text-gray-600">Memorize your Programming knowledge</p>
        </div>

        {/* Game controls */}
        <div className="flex gap-4 mb-8">
          {!gameStarted ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center shadow-sm"
            >
              Start Game
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopGame}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center shadow-sm"
            >
              Stop Game
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goBackToGames}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center shadow-sm"
          >
             Back to Games
          </motion.button>
        </div>

        {gameStarted && (
          <>
            {/* Progress indicator */}
            <div className="w-full max-w-md mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  Card {currentIndex + 1} of {flashcards.length}
                </span>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mx-4">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
                  ></div>
                </div>
                <button
                  onClick={restart}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <FaRedo className="mr-1" /> Restart
                </button>
              </div>
            </div>

            {/* Flashcard */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md perspective-1000 mb-8"
            >
              <div
                className={`relative w-full h-64 transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
                  flipped ? "rotate-y-180" : ""
                }`}
                onClick={handleFlip}
              >
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg p-6 flex flex-col border-2 border-blue-100" style={{ backfaceVisibility: "hidden" }}>
                  <div className="flex-grow flex items-center">
                    <pre className="text-left text-gray-800 whitespace-pre-wrap font-mono text-sm sm:text-base">
                      {card.question}
                    </pre>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    Click to reveal answer
                  </div>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden bg-gradient-to-r from-purple-500 to-red-600 text-white rounded-xl shadow-lg p-6 flex flex-col transform rotate-y-180 border-2 border-blue-300" style={{ backfaceVisibility: "hidden" }}>
                  <div className="flex-grow flex items-center">
                    <p className="text-white text-sm sm:text-base">{card.answer}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Navigation controls */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goPrev}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium flex items-center shadow-sm"
              >
                <FaArrowLeft className="mr-2" /> Previous
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFlip}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center shadow-sm"
              >
                {flipped ? "Show Question" : "Show Answer"}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goNext}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium flex items-center shadow-sm"
              >
                Next <FaArrowRight className="ml-2" />
              </motion.button>
            </div>
          </>
        )}

        {!gameStarted && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200 max-w-md">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">How to Play:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Click "Start Game" to begin</li>
              <li>Click on the card to flip and see the answer</li>
              <li>Use navigation buttons to move between cards</li>
              <li>Click "Stop Game" to pause your session</li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default CodeFlashcardsGame;
