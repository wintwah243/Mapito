import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from 'react-confetti';
import Navbar from "../components/Navbar";
import owl from "../assets/images/fillintheblank.png"

const FillInTheBlanksGame = () => {
    const navigate = useNavigate();

    const questions = [
        {
            id: 1,
            code: `function greet(name) {
  return "Hello, " + ____ + "!";
}`,
            answer: "name",
            hint: "The variable being concatenated in the string"
        },
        {
            id: 2,
            code: `const numbers = [1, 2, 3];
const doubled = numbers.map(num => ____ * 2);`,
            answer: "num",
            hint: "The parameter passed to the map callback function"
        },
        {
            id: 3,
            code: `function calculateTotal(price, quantity) {
  return ____ * quantity;
}`,
            answer: "price",
            hint: "What would you multiply by quantity to get a total?"
        }
    ];

    const [gameState, setGameState] = useState({
        started: false,
        currentQuestion: 0,
        userAnswer: "",
        result: null,
        score: 0,
        showConfetti: false,
        showHint: false,
        timeLeft: 30,
        timerActive: false,
        quizCompleted: false
    });

    const startGame = () => {
        setGameState(prev => ({
            ...prev,
            started: true,
            currentQuestion: 0,
            userAnswer: "",
            result: null,
            score: 0,
            timeLeft: 30,
            timerActive: true,
            quizCompleted: false
        }));
    };

    const stopQuiz = () => {
        setGameState(prev => ({
            ...prev,
            started: false,
            timerActive: false,
            quizCompleted: true
        }));
    };

    const handleSubmit = () => {
        const isCorrect = gameState.userAnswer.trim() === questions[gameState.currentQuestion].answer;

        setGameState(prev => ({
            ...prev,
            result: isCorrect ? "correct" : "incorrect",
            score: isCorrect ? prev.score + 1 : prev.score,
            timerActive: false
        }));

        if (isCorrect && gameState.currentQuestion === questions.length - 1) {
            setGameState(prev => ({
                ...prev,
                showConfetti: true,
                quizCompleted: true
            }));
            setTimeout(() => setGameState(prev => ({ ...prev, showConfetti: false })), 5000);
        }
    };

    const nextQuestion = () => {
        if (gameState.currentQuestion < questions.length - 1) {
            setGameState(prev => ({
                ...prev,
                currentQuestion: prev.currentQuestion + 1,
                userAnswer: "",
                result: null,
                timeLeft: 30,
                timerActive: true,
                showHint: false
            }));
        }
    };

    const handlePlayAgain = () => {
        startGame();
    };

    const toggleHint = () => {
        setGameState(prev => ({ ...prev, showHint: !prev.showHint }));
    };

    useEffect(() => {
        let timer;
        if (gameState.timerActive && gameState.timeLeft > 0) {
            timer = setTimeout(() => {
                setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
            }, 1000);
        } else if (gameState.timeLeft === 0 && gameState.timerActive) {
            setGameState(prev => ({
                ...prev,
                result: "timeout",
                timerActive: false,
                quizCompleted: prev.currentQuestion === questions.length - 1
            }));
        }
        return () => clearTimeout(timer);
    }, [gameState.timeLeft, gameState.timerActive]);


    const currentQuestionData = questions[gameState.currentQuestion];

    return (
        <section>
            <Navbar />
            <div className="min-h-screen bg-white mt-20">
                {gameState.showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

                <div className="w-full min-h-screen bg-white mt-20 flex justify-center items-center px-4">
                    <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden sm:px-6 py-6">
                        
                    {/* Header */}
                    <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
                        <div className="flex justify-between items-center">
                            <h1 className="text-xl text-white">
                             Fill in the Blanks
                            </h1>
                            <div className="flex items-center space-x-4">
                                <div className="text-white font-medium">
                                    Score: <span className="text-yellow-400">{gameState.score}</span>/{questions.length}
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${gameState.timerActive ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                                    {gameState.timeLeft}s
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Game Content */}
                    <div className="p-6">
                        {!gameState.started ? (
                            <div className="text-center py-10">
                                <div className="mb-8">
                                    <img
                                        src={owl}
                                        alt="Coding Challenge"
                                        className="w-64 mx-auto mb-6"
                                    />
                                    <h2 className="text-3xl font-bold text-white mb-3">Are you ready to take coding challenge?</h2>
                                    <p className="text-gray-300 max-w-2xl mx-auto">
                                        Complete the missing parts of the code snippets. You'll have {questions.length} questions with 30 seconds each.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                    <button
                                        onClick={startGame}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg transition-all transform hover:scale-105 active:scale-95"
                                    >
                                        Start Challenge
                                    </button>

                                    <button
                                        onClick={() => navigate("/codinggame")}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg transition-all transform hover:scale-105 active:scale-95"
                                    >
                                        Back to Home
                                    </button>
                                </div>

                            </div>
                        ) : (
                            <>
                                {/* Question indicator */}
                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-gray-400">
                                        Question {gameState.currentQuestion + 1} of {questions.length}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={toggleHint}
                                            className="text-sm bg-gray-700 hover:bg-gray-600 text-blue-400 px-3 py-1 rounded"
                                        >
                                            {gameState.showHint ? 'Hide Hint' : 'Need Hint?'}
                                        </button>
                                    </div>
                                </div>

                                {/* Hint */}
                                {gameState.showHint && (
                                    <div className="bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-200 p-4 mb-6 rounded-r-lg">
                                        <p className="font-medium">💡 Hint: {currentQuestionData.hint}</p>
                                    </div>
                                )}

                                {/* Question Section */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-white mb-4">
                                        Fill in the missing part:
                                    </h2>
                                   <pre className="text-xs sm:text-sm md:text-base bg-gray-900 border border-gray-700 text-green-400 rounded-lg p-4 sm:p-6 mb-6 font-mono overflow-x-auto whitespace-pre-wrap">
                                        <code>
                                            {currentQuestionData.code.split('____').map((part, i) => (
                                                <React.Fragment key={i}>
                                                    {part}
                                                    {i < currentQuestionData.code.split('____').length - 1 && (
                                                        <span className="relative">
                                                            <span className="bg-blue-900/50 border border-blue-700 px-2 py-1 rounded text-white">
                                                                {gameState.userAnswer || "____"}
                                                            </span>
                                                        </span>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </code>
                                    </pre>

                                    {/* Answer Input */}
                                    <div className="mb-6">
                                        <label className="block text-gray-300 font-medium mb-2">
                                            Your Answer:
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700 text-sm sm:text-base border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                            value={gameState.userAnswer}
                                            onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                                            placeholder="Type the missing code..."
                                            disabled={gameState.result !== null}
                                        />
                                    </div>
                                </div>

                                {/* Feedback */}
                                {gameState.result && (
                                    <div className={`mb-6 p-4 rounded-lg border ${gameState.result === "correct"
                                            ? "bg-green-900/30 border-green-700 text-green-400"
                                            : gameState.result === "timeout"
                                                ? "bg-red-900/30 border-red-700 text-red-400"
                                                : "bg-red-900/30 border-red-700 text-red-400"
                                        }`}>
                                        <div className="flex items-center">
                                            {gameState.result === "correct" ? (
                                                <>
                                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="font-bold">Correct!</span> Well done!
                                                </>
                                            ) : gameState.result === "timeout" ? (
                                                <>
                                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="font-bold">Time's up!</span> The answer was: {currentQuestionData.answer}
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    <span className="font-bold">Incorrect.</span> The answer was: {currentQuestionData.answer}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex flex-wrap gap-4 justify-between">
                                    <div className="flex gap-4">
                                        {!gameState.result ? (
                                            <button
                                                onClick={handleSubmit}
                                                disabled={!gameState.userAnswer.trim()}
                                                className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-all ${!gameState.userAnswer.trim()
                                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                        : 'bg-blue-600 hover:bg-blue-500 text-white transform hover:scale-105 active:scale-95'
                                                    }`}
                                            >
                                                Submit Answer
                                            </button>
                                        ) : gameState.currentQuestion < questions.length - 1 ? (
                                            <button
                                                onClick={nextQuestion}
                                                className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all transform hover:scale-105 active:scale-95"
                                            >
                                                Next Question
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handlePlayAgain}
                                                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all transform hover:scale-105 active:scale-95"
                                            >
                                                Play Again
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={stopQuiz}
                                            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all transform hover:scale-105 active:scale-95"
                                        >
                                            Stop Quiz
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FillInTheBlanksGame;
