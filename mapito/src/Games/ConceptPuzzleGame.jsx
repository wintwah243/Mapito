import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import useSound from 'use-sound';
import correctSound from '../assets/sounds/correct.mp3';
import wrongSound from '../assets/sounds/wrong.mp3';
import clickSound from '../assets/sounds/click.mp3';
import retroSound from '../assets/sounds/retro.mp3';

const codingPuzzles = [
    {
        type: 'debug',
        title: 'Fix the Sum Function',
        description: 'The function should return the sum of two numbers',
        code: `function sum(a, b) {
  // This function should return the sum of a and b
  return a - b;
}`,
        solution: `function sum(a, b) {
  return a + b;
}`,
        explanation: 'Changed the minus operator (-) to a plus operator (+)',
        testCases: [
            { input: [2, 3], output: 5 },
            { input: [0, 0], output: 0 },
            { input: [-1, 1], output: 0 }
        ]
    },
    {
        type: 'output',
        title: 'Predict the Output',
        description: 'What will this code print to the console?',
        code: `console.log(2 + '2' - 1);`,
        solution: '21',
        explanation: 'First 2 + "2" becomes "22" (string concatenation), then "22" - 1 becomes 21 (type coercion)'
    },
    {
        type: 'complete',
        title: 'Complete the Function',
        description: 'Write a function that doubles a number',
        startingCode: `function double(num) {
  // Your code here
}`,
        solution: `function double(num) {
  return num * 2;
}`,
        testCases: [
            { input: [2], output: 4 },
            { input: [5], output: 10 },
            { input: [0], output: 0 }
        ]
    },
    {
        type: 'debug',
        title: 'Fix the Comparison',
        description: 'The function should return true if the numbers are equal',
        code: `function isEqual(a, b) {
  // Should return true if a equals b
  return a = b;
}`,
        solution: `function isEqual(a, b) {
  return a === b;
}`,
        explanation: 'Changed the assignment operator (=) to strict equality (===)',
        testCases: [
            { input: [5, 5], output: true },
            { input: [5, '5'], output: false },
            { input: [0, 1], output: false }
        ]
    },
    {
        type: 'output',
        title: 'Predict the Output',
        description: 'What will this code print to the console?',
        code: `let x = 5;
console.log(x++);
console.log(++x);`,
        solution: '5\n7',
        explanation: 'x++ returns the value before incrementing, ++x returns after incrementing'
    }
];

export default function CodingPuzzleAdventure() {
    const [gameState, setGameState] = useState('menu');
    const [currentPuzzle, setCurrentPuzzle] = useState(0);
    const [userCode, setUserCode] = useState('');
    const [output, setOutput] = useState('');
    const [feedback, setFeedback] = useState('');
    const [character, setCharacter] = useState('😊');
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [showNextButton, setShowNextButton] = useState(false);
    const navigate = useNavigate();

    //sound effect
    const [playCorrect] = useSound(correctSound, {
        volume: 0.5,
        interrupt: false  
    });
    const [playWrong] = useSound(wrongSound, {
        volume: 0.5,
        interrupt: false
    });
    const [playClick] = useSound(clickSound, {
        volume: 0.3,
        interrupt: false
    });

    // Add stop function from useSound
    const [playRetro, { stop }] = useSound(retroSound, {
        volume: 0.7,
        interrupt: true // Allows the sound to be interrupted
    });

    // Play sound when component mounts (user enters game)
    React.useEffect(() => {
        playRetro();

        // Cleanup function to stop sound when component unmounts
        return () => {
            stop();
        };
    }, [playRetro, stop]);

    useEffect(() => {
        if (gameState === 'playing') {
            const puzzle = codingPuzzles[currentPuzzle];
            if (puzzle.type === 'debug') {
                setUserCode(puzzle.code);
            } else if (puzzle.type === 'complete') {
                setUserCode(puzzle.startingCode);
            } else {
                setUserCode('');
            }
        }
        setOutput('');
        setFeedback('');
        setCharacter('🤔');
        setShowNextButton(false);
    }, [currentPuzzle, gameState]);

    const startGame = () => {
        playClick();
        stop();
        setGameState('playing');
        setCurrentPuzzle(0);
        setScore(0);
        setAttempts(0);
    };

const runCode = () => {
    setAttempts(prev => prev + 1);
    const puzzle = codingPuzzles[currentPuzzle];
    
    try {
        if (puzzle.type === 'output') {
            // Handle output prediction puzzle
            if (userCode.trim() === puzzle.solution) {
                setFeedback('Correct! Well done!');
                setCharacter('🎉');
                setScore(prev => prev + 100);
                setShowNextButton(true);
                playCorrect();
            } else {
                setFeedback('Not quite right. Try again!');
                setCharacter('😕');
                playWrong();
            }
            return;
        }

        // Handle debug and complete puzzles
        let allTestsPassed = true;
        let testResults = '';
        
        try {
            // Extract function name from the solution 
            const functionNameMatch = puzzle.solution.match(/function\s+(\w+)\s*\(/) || 
                                    puzzle.solution.match(/(?:const|let|var)\s+(\w+)\s*=\s*function\s*\(/) ||
                                    puzzle.solution.match(/(?:const|let|var)\s+(\w+)\s*=\s*\([^)]*\)\s*=>/);
            const functionName = functionNameMatch ? functionNameMatch[1] : null;

            if (!functionName) {
                throw new Error("Couldn't determine function name from solution");
            }

            // Create a function from the user's code with better error handling
            let testFn;
            try {
                // First evaluate the user's code to define the function
                const userFunction = new Function(`${userCode}; return ${functionName};`)();
                
                if (typeof userFunction !== 'function') {
                    throw new Error(`${functionName} is not a function`);
                }

                // Run each test case
                for (let i = 0; i < puzzle.testCases.length; i++) {
                    const testCase = puzzle.testCases[i];
                    try {
                        const result = userFunction(...testCase.input);
                        
                        const correct = JSON.stringify(result) === JSON.stringify(testCase.output);
                        if (!correct) allTestsPassed = false;
                        
                        testResults += `Test ${i+1}: ${correct ? '✅' : '❌'}\n`;
                        testResults += `Input: ${JSON.stringify(testCase.input)}\n`;
                        testResults += `Expected: ${JSON.stringify(testCase.output)}\n`;
                        testResults += `Received: ${JSON.stringify(result)}\n\n`;
                    } catch (e) {
                        allTestsPassed = false;
                        testResults += `Test ${i+1} failed with error: ${e.message}\n\n`;
                    }
                }
            } catch (e) {
                allTestsPassed = false;
                testResults = `Error in your code: ${e.message}\n`;
                setOutput(testResults);
                setFeedback('Your code has an error. Check the output for details.');
                setCharacter('😳');
                return;
            }
        } catch (e) {
            allTestsPassed = false;
            testResults += `Error creating test function: ${e.message}\n`;
        }

        setOutput(testResults);
        
        if (allTestsPassed) {
            playCorrect();
            setFeedback('All tests passed! Great job!');
            setCharacter('🎉');
            setScore(prev => prev + 100 - Math.min(attempts * 10, 50));
            setShowNextButton(true);
        } else {
            playWrong();
            setFeedback('Some tests failed. Keep trying!');
            setCharacter('😕');
        }
    } catch (error) {
        setOutput(`Error: ${error.message}`);
        setFeedback('Your code has an error. Check the output for details.');
        setCharacter('😳');
        console.error(error);
    }
};

    const nextPuzzle = () => {
        playClick();
        if (currentPuzzle + 1 < codingPuzzles.length) {
            setCurrentPuzzle(prev => prev + 1);
            setAttempts(0);
            setShowNextButton(false);
        } else {
            setGameState('results');
            setCharacter('🥳');
        }
    };

    const stopGame = () => {
        playClick();
        playRetro();
        setGameState('menu');
        setCurrentPuzzle(0);
        setUserCode('');
        setOutput('');
        setFeedback('');
        setCharacter('😊');
    };

    return (
        <section>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-white p-4 font-mono mt-10">
                <div className="bg-white shadow-2xl rounded-xl p-6 max-w-4xl w-full relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>

                    {/* Game container */}
                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                                Coding puzzle challenge
                            </h1>
                            {gameState === 'playing' && (
                                <div className="flex gap-4 items-center">
                                    <div className="px-3 py-1 text-black font-medium">
                                        Puzzle {currentPuzzle + 1}/{codingPuzzles.length}
                                    </div>
                                    <div className="px-3 py-1 text-black font-medium">
                                        Score: {score}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Character and status */}
                        <div className="flex items-start gap-4 mb-6">
                            <div className="bg-transparent p-4 rounded-lg border border-gray-600 flex items-center justify-center">
                                <img src="https://i.pinimg.com/1200x/45/0f/a3/450fa347ec26c47b6a832d8fbf4ca81f.jpg" alt="Character" className="w-16 h-16 object-contain" />
                            </div>
                            <div className="flex-1 bg-gray-700 p-4 rounded-lg border border-gray-600 min-h-16">
                                {gameState === 'menu' && (
                                    <p className="text-gray-300">Solve coding puzzles to level up your skills.</p>
                                )}
                                {gameState === 'playing' && (
                                    <div>
                                        <h2 className="text-xl font-bold text-blue-400 mb-1">{codingPuzzles[currentPuzzle].title}</h2>
                                        <p className="text-gray-300">{codingPuzzles[currentPuzzle].description}</p>
                                    </div>
                                )}
                                {gameState === 'results' && (
                                    <div>
                                        <h2 className="text-xl font-bold text-green-400 mb-2">Adventure Complete!</h2>
                                        <p className="text-gray-300">Your final score: {score}</p>
                                        <p className="text-gray-300">You solved {codingPuzzles.length} coding puzzles!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Game content */}
                        {gameState === 'menu' && (
                            <div className="space-y-6 text-center">
                                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                                    <h2 className="text-xl font-bold text-white mb-4">Ready for the Challenge?</h2>
                                    <p className="text-gray-300 mb-6">Test your coding skills with interactive puzzles:</p>
                                    <ul className="text-left text-gray-400 mb-6 space-y-2">
                                        <li>• Debug broken code</li>
                                        <li>• Predict program output</li>
                                        <li>• Complete functions</li>
                                    </ul>
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
                                        <button
                                            onClick={startGame}
                                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg text-lg hover:shadow-lg transition-all transform hover:scale-105"
                                        >
                                            Start Game
                                        </button>
                                        <button
                                            onClick={() => navigate('/codinggame')}
                                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg text-lg hover:shadow-lg transition-all transform hover:scale-105"
                                        >
                                            Go Back to Games
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )}

                        {gameState === 'playing' && (
                            <div className="space-y-4">
                                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400 text-sm font-mono">editor.js</span>
                                        <span className="text-gray-500 text-sm">{codingPuzzles[currentPuzzle].type.toUpperCase()} CHALLENGE</span>
                                    </div>
                                    <textarea
                                        value={userCode}
                                        onChange={(e) => setUserCode(e.target.value)}
                                        className="w-full h-48 bg-gray-900 text-green-400 font-mono text-sm p-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
                                        spellCheck="false"
                                    />
                                </div>

                                {codingPuzzles[currentPuzzle].type === 'output' && (
                                    <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                                        <p className="text-gray-400 mb-2">What will this code output?</p>
                                        <pre className="bg-gray-900 p-3 rounded text-green-400 text-sm overflow-x-auto">
                                            {codingPuzzles[currentPuzzle].code}
                                        </pre>
                                        <input
                                            type="text"
                                            value={userCode}
                                            onChange={(e) => setUserCode(e.target.value)}
                                            placeholder="Enter your prediction..."
                                            className="w-full mt-2 bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={runCode}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition"
                                    >
                                        {codingPuzzles[currentPuzzle].type === 'output' ? 'Check Answer' : 'Run Code'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setUserCode(codingPuzzles[currentPuzzle].type === 'debug' ?
                                                codingPuzzles[currentPuzzle].code :
                                                codingPuzzles[currentPuzzle].startingCode || '');
                                            setOutput('');
                                            setFeedback('');
                                            setCharacter('🤔');
                                        }}
                                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={stopGame}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition"
                                    >
                                        Stop Game
                                    </button>
                                </div>

                                {(output || feedback) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-3"
                                    >
                                        {output && (
                                            <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                                                <div className="text-gray-400 text-sm mb-1">Output:</div>
                                                <pre className="text-gray-300 text-sm whitespace-pre-wrap">{output}</pre>
                                            </div>
                                        )}
                                        
                                        {feedback && (
                                            <div className={`p-4 rounded-lg border-2 ${feedback.includes('Correct') || feedback.includes('passed') ?
                                                'bg-green-900/20 border-green-500 text-green-100' :
                                                'bg-red-900/20 border-red-500 text-red-100'
                                                } shadow-lg`}>
                                                <div className="flex items-start">
                                                    {feedback.includes('Correct') || feedback.includes('passed') ? (
                                                        <svg className="w-5 h-5 mr-2 mt-0.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5 mr-2 mt-0.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    )}
                                                    <p className="text-black font-medium">{feedback}</p>
                                                </div>

                                            {/* answer Explanation banner */}
                                                {codingPuzzles[currentPuzzle].explanation && (
                                                    <div className="mt-3 p-3 bg-gray-800/40 rounded-lg">
                                                        <p className="text-sm text-gray-300">
                                                            <span className="font-bold text-yellow-300">Explanation:</span> {codingPuzzles[currentPuzzle].explanation}
                                                        </p>
                                                    </div>
                                                )}
                                                
                                            {/* next button after puzzle */}
                                                {showNextButton && (
                                                    <motion.button
                                                        onClick={nextPuzzle}
                                                        className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition flex items-center justify-center gap-2 w-full"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        Next Puzzle
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                                        </svg>
                                                    </motion.button>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {gameState === 'results' && (
                            <div className="space-y-6 text-center">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="space-y-4"
                                >
                                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                                        Adventure Complete!
                                    </h2>
                                    <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 inline-block">
                                        <p className="text-5xl">{character}</p>
                                    </div>
                                    <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                                        <p className="text-xl font-semibold text-white">
                                            Final Score: <span className="text-yellow-400">{score}</span>
                                        </p>
                                        <p className="text-gray-400 mt-2">
                                            You solved all {codingPuzzles.length} coding puzzles!
                                        </p>
                                    </div>
                                    <div className="pt-4 space-x-4">
                                        <button
                                            onClick={startGame}
                                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-bold hover:shadow-lg transition"
                                        >
                                            Play Again
                                        </button>
                                        <button
                                            onClick={() => setGameState('menu')}
                                            className="px-8 py-3 bg-gray-700 text-gray-300 rounded-lg font-bold hover:bg-gray-600 transition"
                                        >
                                            Main Menu
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
