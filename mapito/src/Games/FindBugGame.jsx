import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import Navbar from '../components/Navbar';
import useSound from 'use-sound';
import wrongSound from '../assets/sounds/wrong.mp3';
import winSound from '../assets/sounds/win.mp3';
import clickSound from '../assets/sounds/click.mp3';
import gameIntroSound from '../assets/sounds/puzzle_game_intro.mp3';

const BugGame = () => {
    const navigate = useNavigate();
    const { width, height } = useWindowSize();
    const [gameState, setGameState] = useState('intro');
    const [currentLevel, setCurrentLevel] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [selectedLines, setSelectedLines] = useState([]);
    const [hintUsed, setHintUsed] = useState(false);
    const [timer, setTimer] = useState(null);
    const [wrongAnswerFeedback, setWrongAnswerFeedback] = useState(null);
    const [attempts, setAttempts] = useState(0);

    // modal css
    const modalStyles = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        padding: '2rem',
        borderRadius: '0.5rem',
        border: '1px solid rgba(55, 65, 81, 1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '32rem',
        width: '90%',
    };

    const overlayStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 999,
    };

    //sound effect
    const [playWrong] = useSound(wrongSound, { volume: 0.5 });
    const [playWin] = useSound(winSound, { volume: 0.7 });
    const [playClick] = useSound(clickSound, { volume: 0.3 });

    // Add stop function from useSound
    const [playIntro, { stop }] = useSound(gameIntroSound, {
        volume: 0.7,
        interrupt: true // Allows the sound to be interrupted
    });

    // Play sound when component mounts (user enters game)
    React.useEffect(() => {
        playIntro();

        // Cleanup function to stop sound when component unmounts
        return () => {
            stop();
        };
    }, [playIntro, stop]);

    // Game levels with increasing difficulty
    const levels = [
        {
            id: 1,
            title: "Simple Function Bug",
            description: "Find the syntax error in this basic function",
            code: [
                { line: 1, text: "function calculateSum(a, b) {", hasBug: false },
                { line: 2, text: "  return a + b", hasBug: true }, // Missing semicolon
                { line: 3, text: "}", hasBug: false }
            ],
            timeLimit: 60,
            reward: 100,
            explanation: "Missing semicolon at the end of line 2. In JavaScript, semicolons are technically optional but considered good practice.",
            hints: [
                "Look for missing punctuation",
                "Check the end of line 2",
                "JavaScript statements typically end with something"
            ]
        },
        {
            id: 2,
            title: "Conditional Logic Error",
            description: "Find the logical error in this conditional statement",
            code: [
                { line: 1, text: "function isAdult(age) {", hasBug: false },
                { line: 2, text: "  if (age > 18) {", hasBug: false },
                { line: 3, text: "    return true;", hasBug: false },
                { line: 4, text: "  } else {", hasBug: false },
                { line: 5, text: "    return false;", hasBug: true }, // Should be age >= 18
                { line: 6, text: "  }", hasBug: false },
                { line: 7, text: "}", hasBug: false }
            ],
            timeLimit: 90,
            reward: 150,
            explanation: "The condition should be 'age >= 18' to properly handle the case when someone is exactly 18 years old.",
            hints: [
                "Think about edge cases",
                "What if someone is exactly 18?",
                "Check the comparison operator"
            ]
        },
        {
            id: 3,
            title: "Array Manipulation Bug",
            description: "Find the error in this array processing function",
            code: [
                { line: 1, text: "function doubleArray(arr) {", hasBug: false },
                { line: 2, text: "  return arr.map(item => {", hasBug: false },
                { line: 3, text: "    item * 2;", hasBug: true }, // Missing return
                { line: 4, text: "  });", hasBug: false },
                { line: 5, text: "}", hasBug: false }
            ],
            timeLimit: 120,
            reward: 200,
            explanation: "The arrow function in the map callback is missing the 'return' statement, so it will return undefined for each element.",
            hints: [
                "Check the arrow function implementation",
                "What does map expect to receive?",
                "The function isn't returning anything"
            ]
        }
    ];

    // Start a new game
    const startGame = () => {
        playIntro();
        playClick();
        setGameState('playing');
        setCurrentLevel(0);
        setScore(0);
        setAttempts(0);
        setWrongAnswerFeedback(null);
        startLevel(0);
    };

    // Start a specific level
    const startLevel = (levelIndex) => {
        stop();
        setSelectedLines([]);
        setHintUsed(false);
        setAttempts(0);
        setWrongAnswerFeedback(null);
        setTimeLeft(levels[levelIndex].timeLimit);

        // Clear any existing timer
        if (timer) clearInterval(timer);

        // Start new timer
        const timerId = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    setGameState('lost');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        setTimer(timerId);
    };

    // Handle line selection
    const toggleLineSelection = (lineNumber) => {
        if (gameState !== 'playing') return;

        setSelectedLines(prev =>
            prev.includes(lineNumber)
                ? prev.filter(num => num !== lineNumber)
                : [...prev, lineNumber]
        );
    };

    // Submit answer
    const submitAnswer = () => {
        if (gameState !== 'playing' || selectedLines.length === 0) return;

        const currentLevelData = levels[currentLevel];
        const correctLines = currentLevelData.code
            .filter(line => line.hasBug)
            .map(line => line.line);

        const isCorrect = selectedLines.length === correctLines.length &&
            selectedLines.every(line => correctLines.includes(line));

        if (isCorrect) {
            playWin();
            // Calculate score with time bonus and hint penalty
            const timeBonus = Math.floor(timeLeft / 5);
            const hintPenalty = hintUsed ? 30 : 0;
            const attemptsPenalty = attempts * 10; // Penalty for multiple attempts
            const levelScore = currentLevelData.reward + timeBonus - hintPenalty - attemptsPenalty;

            setScore(prev => prev + Math.max(0, levelScore)); // Ensure score doesn't go negative
            setGameState('won');
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
            clearInterval(timer);
            setWrongAnswerFeedback(null);
        } else {
            // Wrong answer handling
            playWrong();
            setAttempts(prev => prev + 1);
            setScore(prev => Math.max(0, prev - 20));

            // Provide specific feedback
            let feedback = "";

            // Case 1: Selected correct lines but also extra incorrect ones
            const correctSelections = selectedLines.filter(line => correctLines.includes(line));
            if (correctSelections.length > 0) {
                feedback = `You correctly identified line${correctSelections.length > 1 ? 's' : ''} ${correctSelections.join(', ')} but included incorrect selections.`;
            }
            // Case 2: Missed all correct lines
            else if (selectedLines.length > 0) {
                feedback = "None of the selected lines contain bugs. Try looking elsewhere.";
            }

            // Add hint based on attempts
            if (attempts >= 1 && attempts < currentLevelData.hints.length) {
                feedback += ` Hint: ${currentLevelData.hints[attempts - 1]}`;
            } else if (attempts >= currentLevelData.hints.length) {
                feedback += " Try reviewing the entire code carefully.";
            }

            setWrongAnswerFeedback(feedback);

            // Flash incorrect lines
            const incorrectLines = selectedLines.filter(line => !correctLines.includes(line));
            if (incorrectLines.length > 0) {
                const codeElements = incorrectLines.map(line => document.querySelector(`.line-${line}`));
                codeElements.forEach(el => {
                    el.classList.add('bg-red-900');
                    setTimeout(() => el.classList.remove('bg-red-900'), 1000);
                });
            }
        }
    };

    // Use hint
    const useHint = () => {
        playClick();
        if (hintUsed || gameState !== 'playing') return;

        const currentLevelData = levels[currentLevel];
        const bugLines = currentLevelData.code
            .filter(line => line.hasBug)
            .map(line => line.line);

        if (bugLines.length > 0) {
            setSelectedLines([bugLines[0]]); // Reveal first bug line
            setHintUsed(true);

            // Show which line was revealed
            const hintElement = document.querySelector(`.line-${bugLines[0]}`);
            hintElement.classList.add('bg-yellow-900');
            setTimeout(() => hintElement.classList.remove('bg-yellow-900'), 2000);
        }
    };

    // Next level
    const nextLevel = () => {
        playClick();
        const nextLevelIndex = currentLevel + 1;
        if (nextLevelIndex < levels.length) {
            setCurrentLevel(nextLevelIndex);
            startLevel(nextLevelIndex);
            setGameState('playing');
        } else {
            // Game completed
            setGameState('completed');
        }
    };

    // Pause game
    const pauseGame = () => {
        playClick();
        clearInterval(timer);
        setGameState('paused');
    };

    // Resume game
    const resumeGame = () => {
        stop();
        playClick();
        setGameState('playing');

        // Restart timer
        const timerId = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    setGameState('lost');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        setTimer(timerId);
    };

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [timer]);

    const goMainMenu = () => {
        setGameState('intro');
        playIntro();
    }

    return (
        <div className="min-h-screen bg-white text-white mt-10">
            {showConfetti && <Confetti width={width} height={height} recycle={false} />}

            {/* Header */}
            <Navbar />


            {/* Main Game Area */}
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Intro Screen */}
                {gameState === 'intro' && (
                    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl mt-10">
                        <h1 className="text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Find the Bug
                        </h1>

                        <div className="mb-8">
                            <p className="mb-4">
                                Test your debugging skills by finding errors in code snippets. Each level presents a piece of code with one or more bugs.
                                Your task is to identify the problematic lines before time runs out!
                            </p>

                            <div className="bg-gray-900 p-4 rounded-lg mb-6 border border-gray-700">
                                <h3 className="text-lg font-bold text-yellow-400 mb-2">Example:</h3>
                                <div className="font-mono text-sm space-y-1">
                                    <div className="px-3 py-2 bg-gray-800 rounded">1 | function example() {'{'}</div>
                                    <div className="px-3 py-2 bg-gray-800 rounded">2 |   return "Hello world" <span className="text-red-400">// Missing semicolon</span></div>
                                    <div className="px-3 py-2 bg-gray-800 rounded">3 | {'}'}</div>
                                </div>
                                <p className="mt-2 text-sm text-gray-400">Click on line 2 to select it as the buggy line.</p>
                            </div>

                            <h3 className="text-xl font-bold text-green-400 mb-2">Features:</h3>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li>{levels.length} challenging levels with increasing difficulty</li>
                                <li>Time pressure with bonus points for quick solutions</li>
                                <li>Detailed feedback on wrong answers</li>
                                <li>Hints available (with score penalty)</li>
                                <li>Detailed explanations for each bug</li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
                            <button
                                onClick={startGame}
                                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-bold text-lg text-white hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl"
                            >
                                Start Challenge
                            </button>
                            <button
                                onClick={() => navigate('/codinggame')}
                                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-bold text-lg text-white hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl"
                            >
                                Go Back to Games
                            </button>
                        </div>
                    </div>
                )}

                {/* Game Screen */}
                {(gameState === 'playing' || gameState === 'won' || gameState === 'paused' || gameState === 'lost' || gameState === 'completed') && (
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-2xl mt-10">
                        {(gameState === 'playing' || gameState === 'paused') && (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center px-3 py-1">
                                    <span className="text-yellow-400 mr-1">Trophy-</span>
                                    <span className="font-bold">{score}</span>
                                </div>
                                <div className="flex items-center px-3 py-1">
                                    <span className="text-red-400 mr-1">Time-</span>
                                    <span className={`font-bold ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>
                                        {timeLeft}s
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-blue-400">{levels[currentLevel].title}</h2>
                                <p className="text-gray-300">{levels[currentLevel].description}</p>
                            </div>
                            <span className="text-xs font-bold px-3 py-1">
                                Level {currentLevel + 1} of {levels.length}
                            </span>
                        </div>

                        {/* Code Display */}
                        <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
                            <div className="font-mono text-sm space-y-1">
                                {levels[currentLevel].code.map((line) => (
                                    <div
                                        key={line.line}
                                        onClick={() => toggleLineSelection(line.line)}
                                        className={`px-3 py-2 rounded cursor-pointer transition-colors line-${line.line} ${selectedLines.includes(line.line)
                                            ? 'bg-yellow-900 bg-opacity-50 border border-yellow-700'
                                            : 'bg-gray-800 hover:bg-gray-700'
                                            }`}
                                    >
                                        <span className="text-gray-500 mr-4">{line.line} |</span>
                                        <span className="text-gray-300">
                                            {line.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Wrong answer feedback */}
                        {wrongAnswerFeedback && (
                            <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg animate-pulse">
                                <div className="flex items-center">
                                    <span className="text-red-300">{wrongAnswerFeedback}</span>
                                </div>
                            </div>
                        )}

                        {/* Controls */}
                        <div className="flex flex-wrap justify-between gap-4">
                            <button
                                onClick={useHint}
                                disabled={hintUsed}
                                className={`px-4 py-2 rounded-lg font-medium flex items-center ${hintUsed
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-purple-600 hover:bg-purple-700'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                {hintUsed ? 'Hint Used' : 'Get Hint (-30pts)'}
                            </button>

                            <div className="flex space-x-4">
                                <button
                                    onClick={pauseGame}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Pause
                                </button>

                                <button
                                    onClick={submitAnswer}
                                    disabled={selectedLines.length === 0}
                                    className={`px-4 py-2 rounded-lg font-medium flex items-center ${selectedLines.length === 0
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Submit Answer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Paused Screen */}
                {gameState === 'paused' && (
                    <>
                        <div style={overlayStyles} onClick={resumeGame} />
                        <div style={modalStyles}>
                            <h2 className="text-3xl font-bold text-yellow-400 mb-4">Game Paused</h2>
                            <p className="text-xl mb-8">Your current progress has been saved.</p>
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                                <button
                                    onClick={resumeGame}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-all transform hover:scale-105"
                                >
                                    Resume Game
                                </button>
                                <button
                                    onClick={() => {
                                        setGameState('intro');
                                        playIntro();
                                    }}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-all transform hover:scale-105"
                                >
                                    Quit Game
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Level Complete Screen */}
                {gameState === 'won' && (
                    <div style={overlayStyles}>
                        <div style={modalStyles}>
                            <div className="text-6xl mb-4 text-center">🎉</div>
                            <h2 className="text-3xl font-bold text-green-400 mb-2 text-center">Level Complete!</h2>
                            <p className="text-xl mb-6 text-center">
                                You found all the bugs!
                            </p>

                            <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
                                <h3 className="text-lg font-bold text-blue-400 mb-2 text-center">Bug Explanation:</h3>
                                <p className="text-gray-300 text-center">{levels[currentLevel].explanation}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {currentLevel < levels.length - 1 ? (
                                    <button
                                        onClick={nextLevel}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold flex items-center justify-center transition-all transform hover:scale-105"
                                    >
                                        Next Level
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setGameState('completed')}
                                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold flex items-center justify-center transition-all transform hover:scale-105"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                        </svg>
                                        View Results
                                    </button>
                                )}
                                <button
                                    onClick={goMainMenu}
                                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-bold transition-all transform hover:scale-105"
                                >
                                    Stop Game
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Time's Up Screen */}
                {gameState === 'lost' && (
                    <div style={overlayStyles}>
                        <div style={modalStyles}>
                            <div className="text-6xl mb-4 text-center">⏰</div>
                            <h2 className="text-3xl font-bold text-red-400 mb-2 text-center">Time's Up!</h2>
                            <p className="text-xl mb-6 text-center">
                                You ran out of time on this level.
                            </p>

                            <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
                                <h3 className="text-lg font-bold text-blue-400 mb-2 text-center">The bug was on:</h3>
                                <div className="font-mono text-sm">
                                    {levels[currentLevel].code
                                        .filter(line => line.hasBug)
                                        .map(line => (
                                            <div key={line.line} className="px-3 py-2 bg-gray-800 rounded mb-1 text-center">
                                                <span className="text-gray-500 mr-4">{line.line} |</span>
                                                <span className="text-gray-300">{line.text}</span>
                                            </div>
                                        ))}
                                </div>
                                <p className="mt-2 text-gray-300 text-center">{levels[currentLevel].explanation}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => startLevel(currentLevel)}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold flex items-center justify-center transition-all transform hover:scale-105"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                    </svg>
                                    Try Again
                                </button>

                                <button
                                    onClick={() => {
                                        setGameState('intro');
                                        playIntro();
                                    }}
                                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-bold flex items-center justify-center transition-all transform hover:scale-105"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 100-2H9V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Main Menu
                                </button>
                            </div>
                        </div>
                    </div>
                )}

               {/* Game Completed Screen */}
                {gameState === 'completed' && (
                    <div style={overlayStyles}>
                        <div style={modalStyles}>
                            <div className="text-6xl mb-4 text-center">🏆</div>
                            <h2 className="text-3xl font-bold text-yellow-400 mb-2 text-center">Challenge Complete!</h2>
                            <p className="text-xl mb-6 text-center">
                                You've finished all levels with a total score of:
                            </p>
                            <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent mb-8 text-center">
                                {score} pts
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={startGame}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold flex items-center justify-center transition-all transform hover:scale-105"
                                >
                                    Play Again
                                </button>

                                <button
                                    onClick={goMainMenu}
                                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-bold flex items-center justify-center transition-all transform hover:scale-105"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 100-2H9V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BugGame;
