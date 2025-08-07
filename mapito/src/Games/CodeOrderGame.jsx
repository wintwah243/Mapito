import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { arrayMoveImmutable } from 'array-move';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    TouchSensor,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const originalCode = [
    "function greet(name) {",
    "  if (!name) return 'Hello, Guest!';",
    "  return `Hello, ${name}!`;",
    "}",
];

// Game levels with increasing difficulty
const levels = [
    {
        id: 1,
        name: "The Greeting Function",
        description: "Arrange the simple greeting function",
        code: originalCode,
        timeLimit: 120,
        reward: 50
    },
    {
        id: 2,
        name: "The Calculator",
        description: "Reconstruct a basic calculator function",
        code: [
            "function calculate(a, b, op) {",
            "  switch(op) {",
            "    case '+': return a + b;",
            "    case '-': return a - b;",
            "    case '*': return a * b;",
            "    case '/': return b !== 0 ? a / b : 'Error';",
            "    default: return 'Invalid operator';",
            "  }",
            "}"
        ],
        timeLimit: 180,
        reward: 100
    }
];

const getShuffled = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Sortable item component
const SortableItem = ({ id, value, index }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none', // Prevent scrolling while dragging
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="p-3 bg-gray-900 rounded-md border border-gray-700 font-mono text-sm cursor-move hover:bg-gray-800 transition-all select-none"
        >
            <div 
                className="flex items-center"
                {...attributes}
                {...listeners}
                onTouchStart={(e) => {
                    // Prevent default to avoid scrolling
                    if (e.cancelable) e.preventDefault();
                    listeners.onTouchStart(e);
                }}
            >
                <span className="text-gray-500 mr-2 cursor-move">☰</span>
                <span className="text-gray-500 mr-2">{index + 1}.</span>
                <span className="text-blue-300">{value.text}</span>
            </div>
        </div>
    );
};

const CodeOrderGame = () => {
    const [currentLevel, setCurrentLevel] = useState(0);
    const [codeLines, setCodeLines] = useState([]);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(levels[0].timeLimit);
    const [gameStatus, setGameStatus] = useState('intro');
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();
    const [attempts, setAttempts] = useState(0);
    const [hintUsed, setHintUsed] = useState(false);
    const [timer, setTimer] = useState(null);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Require 5px movement before dragging starts
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250, // Delay before dragging starts (ms)
                tolerance: 5, // Allow some movement before cancelling
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    useEffect(() => {
        if (gameStatus !== 'playing') return;

        const timerId = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    setGameStatus('lost');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        setTimer(timerId);

        return () => clearInterval(timerId);
    }, [gameStatus]);

    useEffect(() => {
        if (gameStatus === 'playing') {
            const withIds = levels[currentLevel].code.map((line, index) => ({
                id: `line-${index}-${line.substring(0, 10).replace(/\s/g, '_')}`,
                text: line,
            }));

            setCodeLines(getShuffled(withIds));
            setTimeLeft(levels[currentLevel].timeLimit);
            setIsCorrect(null);
            setAttempts(0);
            setHintUsed(false);
        }
    }, [currentLevel, gameStatus]);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (gameStatus !== 'playing') return;
        if (!over || active.id === over.id) return;

        const oldIndex = codeLines.findIndex(item => item.id === active.id);
        const newIndex = codeLines.findIndex(item => item.id === over.id);

        const newOrder = arrayMoveImmutable(codeLines, oldIndex, newIndex);
        setCodeLines(newOrder);

        const isCorrectOrder = levels[currentLevel].code.every((line, idx) => line === newOrder[idx].text);
        setIsCorrect(isCorrectOrder);
        setAttempts(prev => prev + 1);

        if (isCorrectOrder) {
            setScore(prev => prev + levels[currentLevel].reward - (attempts * 5) - (hintUsed ? 20 : 0));
            setGameStatus('won');
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
            if (timer) clearInterval(timer);
        }
    };

    const useHint = () => {
        if (hintUsed) return;

        const correctOrder = levels[currentLevel].code;
        const currentOrder = codeLines.map(line => line.text);

        for (let i = 0; i < correctOrder.length; i++) {
            if (currentOrder[i] !== correctOrder[i]) {
                const correctLine = correctOrder[i];
                const correctItem = codeLines.find(item => item.text === correctLine);

                const newOrder = codeLines.filter(item => item.text !== correctLine);
                newOrder.splice(i, 0, correctItem);
                setCodeLines(newOrder);
                break;
            }
        }

        setHintUsed(true);
    };

    const nextLevel = () => {
        if (currentLevel < levels.length - 1) {
            setCurrentLevel(prev => prev + 1);
        } else {
            setCurrentLevel(0);
        }
        setGameStatus('playing');
    };

    const retryLevel = () => {
        const withIds = levels[currentLevel].code.map((line, index) => ({
            id: `line-${index}-${line.substring(0, 10).replace(/\s/g, '_')}`,
            text: line,
        }));
        setCodeLines(getShuffled(withIds));
        setTimeLeft(levels[currentLevel].timeLimit);
        setIsCorrect(null);
        setGameStatus('playing');
        setAttempts(0);
        setHintUsed(false);
    };

    const startGame = () => {
        setGameStatus('playing');
    };

    const stopGame = () => {
        if (timer) clearInterval(timer);
        setGameStatus('paused');
    };

    const resumeGame = () => {
        setGameStatus('playing');
    };

    const resetGame = () => {
        if (timer) clearInterval(timer);
        setCurrentLevel(0);
        setScore(0);
        setGameStatus('intro');
    };

    const activeItem = activeId ? codeLines.find(item => item.id === activeId) : null;

    return (
        <section className="min-h-screen bg-white text-white mt-20">
            {showConfetti && <Confetti width={width} height={height} recycle={false} />}
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                {/* Game Status Controls */}
                {(gameStatus === 'playing' || gameStatus === 'paused') && (
                    <div className="flex justify-end mb-4 space-x-2">
                        {gameStatus === 'playing' ? (
                            <button
                                onClick={stopGame}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-all"
                            >
                                ⏸️ Pause Game
                            </button>
                        ) : (
                            <button
                                onClick={resumeGame}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-all"
                            >
                                ▶️ Resume Game
                            </button>
                        )}
                        <button
                            onClick={resetGame}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-bold transition-all"
                        >
                            🔄 Reset Game
                        </button>
                    </div>
                )}

                {/* Header */}
                {gameStatus !== 'intro' && (
                    <div className="flex justify-between items-center mb-6 p-4 bg-black bg-opacity-50 rounded-lg">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-yellow-400">🏆 Score: {score}</h2>
                        </div>
                        <div className="text-center">
                            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
                                {levels[currentLevel].name}
                            </h1>
                            <p className="text-sm text-gray-300">{levels[currentLevel].description}</p>
                        </div>
                        <div className="text-center">
                            {gameStatus === 'playing' && (
                                <div className="text-xl font-bold flex items-center justify-center">
                                    ⏱️ <span className={timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-green-400'}>{timeLeft}s</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Intro Screen */}
                {gameStatus === 'intro' && (
                    <div className="max-w-3xl mx-auto p-8 bg-gray-500 bg-opacity-80 rounded-xl shadow-2xl border border-gray-700 text-center">
                        <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
                            Code Order Game
                        </h1>
                        <div className="mb-8 text-left">
                            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Welcome to the Code Order Game!</h2>
                            <p className="mb-4">
                                Test your programming knowledge by rearranging shuffled code lines back to their correct order.
                                Complete levels under time pressure to earn maximum points!
                            </p>
                            <h3 className="text-xl font-bold text-green-400 mt-6 mb-2">Game Features:</h3>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li>Multiple levels with increasing difficulty</li>
                                <li>Timed challenges to test your speed</li>
                                <li>Point system with penalties for multiple attempts</li>
                                <li>Hints available (with point cost)</li>
                                <li>Pause and resume functionality</li>
                            </ul>
                            <h3 className="text-xl font-bold text-blue-400 mt-6 mb-2">How to Play:</h3>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>Drag and drop code lines to reconstruct the function</li>
                                <li>Complete before time runs out to earn maximum points</li>
                                <li>Each attempt reduces your potential score by 5 points</li>
                                <li>Use hints wisely as they cost 20 points</li>
                            </ol>
                        </div>
                        <button
                            onClick={startGame}
                            className="px-8 py-4 bg-blue-600 hover:bg-green-700 rounded-lg font-bold text-xl transition-all transform hover:scale-105"
                        >
                            Start Game
                        </button>
                    </div>
                )}

                {/* Game */}
                {gameStatus === 'playing' && (
                    <div className="max-w-3xl mx-auto p-6 bg-gray-800 bg-opacity-80 rounded-xl shadow-2xl border border-gray-700">
                        <div className="flex justify-between mb-4">
                            <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-bold">
                                Level {currentLevel + 1} of {levels.length}
                            </span>
                            <button
                                onClick={useHint}
                                disabled={hintUsed}
                                className={`px-3 py-1 rounded-full text-xs font-bold ${hintUsed ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                            >
                                {hintUsed ? 'Hint Used' : '💡 Get Hint (-20pts)'}
                            </button>
                        </div>

                        <div className="mb-4 p-3 bg-gray-900 rounded-md border border-gray-700">
                            <h3 className="text-sm font-mono text-green-400 mb-2">// Expected function signature:</h3>
                            <pre className="text-yellow-200 font-mono text-sm">function {levels[currentLevel].code[0].match(/function\s+(\w+)/)[1]}(...)</pre>
                        </div>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={codeLines}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2 min-h-[50px]">
                                    {codeLines.map((value, index) => (
                                        <SortableItem key={value.id} id={value.id} value={value} index={index} />
                                    ))}
                                </div>
                            </SortableContext>
                            <DragOverlay>
                                {activeItem ? (
                                    <div className="p-3 bg-gray-900 rounded-md border border-gray-700 font-mono text-sm cursor-move hover:bg-gray-800 transition-all">
                                        <div className="flex items-center">
                                            <span className="text-gray-500 mr-2 cursor-move">☰</span>
                                            <span className="text-gray-500 mr-2">{codeLines.findIndex(item => item.id === activeId) + 1}.</span>
                                            <span className="text-blue-300">{activeItem.text}</span>
                                        </div>
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>

                        <div className="mt-4 text-center text-sm text-gray-400">
                            Attempts: {attempts} | Penalty: -{attempts * 5}pts
                        </div>
                    </div>
                )}

                {/* Paused Screen */}
                {gameStatus === 'paused' && (
                    <div className="max-w-3xl mx-auto p-8 bg-gray-800 bg-opacity-80 rounded-xl shadow-2xl border border-gray-700 text-center">
                        <h2 className="text-3xl font-bold text-yellow-400 mb-4">Game Paused</h2>
                        <p className="text-xl mb-8">Your current progress has been saved.</p>
                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                            <button
                                onClick={resumeGame}
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-all transform hover:scale-105"
                            >
                                Resume Game ▶️
                            </button>
                            <button
                                onClick={resetGame}
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-all transform hover:scale-105"
                            >
                                Quit Game 🚪
                            </button>
                        </div>
                    </div>
                )}

                {/* Won Screen */}
                {gameStatus === 'won' && (
                    <div className="max-w-3xl mx-auto p-6 bg-gray-800 bg-opacity-80 rounded-xl shadow-2xl border border-gray-700">
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">🎉</div>
                            <h2 className="text-3xl font-bold text-green-400 mb-2">Level Complete!</h2>
                            <p className="text-xl mb-6">
                                You earned <span className="font-bold text-yellow-400">{levels[currentLevel].reward - (attempts * 5) - (hintUsed ? 20 : 0)} points</span>
                            </p>
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                                <button
                                    onClick={nextLevel}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-all transform hover:scale-105"
                                >
                                    {currentLevel < levels.length - 1 ? 'Next Level ➡️' : 'Play Again 🔄'}
                                </button>
                                <button
                                    onClick={retryLevel}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-all transform hover:scale-105"
                                >
                                    Replay Level 🔄
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lost Screen */}
                {gameStatus === 'lost' && (
                    <div className="max-w-3xl mx-auto p-6 bg-gray-800 bg-opacity-80 rounded-xl shadow-2xl border border-gray-700">
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">💀</div>
                            <h2 className="text-3xl font-bold text-red-400 mb-2">Time's Up!</h2>
                            <p className="text-xl mb-6">
                                You were so close! Try again to master this level.
                            </p>
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                                <button
                                    onClick={retryLevel}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-all transform hover:scale-105"
                                >
                                    Try Again 🔄
                                </button>
                                <button
                                    onClick={resetGame}
                                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-bold transition-all transform hover:scale-105"
                                >
                                    Main Menu 🏠
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions - Only show during gameplay */}
                {gameStatus === 'playing' && (
                    <div className="max-w-3xl mx-auto mt-6 p-4 bg-black bg-opacity-50 rounded-lg text-sm text-gray-300">
                        <h3 className="text-lg font-bold text-yellow-400 mb-2">📜 How to Play:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Drag and drop the code lines to reconstruct the function</li>
                            <li>Complete before time runs out to earn maximum points</li>
                            <li>Each attempt reduces your potential score by 5 points</li>
                            <li>Hints are available but cost 20 points</li>
                            <li>Advance through levels of increasing difficulty</li>
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CodeOrderGame;
