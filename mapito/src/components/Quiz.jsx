import React, { useState, useEffect } from 'react';
import { quizData } from '../utils/data';
import Navbar from './Navbar';
import { FaReact, FaPython, FaJava, FaPhp, FaBrain, FaJsSquare } from 'react-icons/fa';
import Footer from './Footer';

const Quiz = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [quizEnded, setQuizEnded] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizEnded(false);
        setSelectedAnswer('');
        setTimeLeft(60);
    };

    const currentQuestion = quizData[selectedLanguage]?.[currentQuestionIndex];

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
    };

    const handleNextQuestion = () => {
        if (selectedAnswer === currentQuestion.answer) {
            setScore(score + 1);
        }
        if (currentQuestionIndex < quizData[selectedLanguage]?.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer('');
        } else {
            setQuizEnded(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizEnded(false);
        setSelectedAnswer('');
        setTimeLeft(60);
    };

    useEffect(() => {
        let timer;
        if (selectedLanguage && !quizEnded) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setQuizEnded(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [selectedLanguage, quizEnded]);

    return (
        <div className="min-h-screen bg-white mt-20">
            <Navbar />

            {/* header section */}
            <div className="bg-white text-white py-16 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl text-gray-900 font-bold mb-4">Take Tech Challenge With Mapito Quiz</h1>
                    <p className="text-xl opacity-90 text-gray-900">
                        Put your skills to the test across a wide range of technology domains.
                        Choose a category that interests you and dive into your challenge to showcase
                        your expertise!
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white min-h-screen">
                {!selectedLanguage && (
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { label: 'JavaScript', emoji: '🌟', key: 'javascript' },
                                { label: 'React', emoji: '⚛️', key: 'react' },
                                { label: 'Python', emoji: '🤖', key: 'python' },
                                { label: 'Java', emoji: '☕', key: 'java' },
                                { label: 'PHP', emoji: '🐘', key: 'php' },
                                { label: 'AI', emoji: '🧠', key: 'ai' },
                            ].map(({ label, emoji, key }) => (
                                <button
                                    key={key}
                                    onClick={() => handleLanguageSelect(key)}
                                    className="flex items-start bg-white border border-gray-200 hover:border-indigo-500 hover:shadow-lg rounded-2xl p-6 space-x-4 transition duration-300 ease-in-out"
                                >
                                    <div className="text-4xl">{emoji}</div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
                                        <p className="text-sm text-gray-500">Explore challenges and sharpen your skills in {label}.</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quiz Interface */}
                {selectedLanguage && (
                    <section className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            {/* Quiz Header */}
                            <div className="bg-gray-900 px-6 py-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-white">
                                        {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} Challenge
                                    </h2>
                                    <div className="bg-indigo-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        Question {currentQuestionIndex + 1}/{quizData[selectedLanguage].length}
                                    </div>
                                </div>
                                {!quizEnded && (
                                    <div className="mt-2">
                                        <div className="w-full bg-indigo-500 rounded-full h-2">
                                            <div
                                                className="bg-white h-2 rounded-full"
                                                style={{ width: `${(timeLeft / 60) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-right text-xs text-indigo-200 mt-1">
                                            Time remaining: {timeLeft}s
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Quiz Content */}
                            <div className="p-6">
                                {!quizEnded ? (
                                    <>
                                        <h3 className="text-lg font-medium text-gray-800 mb-6">
                                            {currentQuestion.question}
                                        </h3>
                                        <div className="space-y-3">
                                            {currentQuestion.options.map((option, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedAnswer === option ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                                                    onClick={() => handleAnswerSelect(option)}
                                                >
                                                    <div className="flex items-center">
                                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${selectedAnswer === option ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'}`}>
                                                            {selectedAnswer === option && (
                                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                                            )}
                                                        </div>
                                                        <span className="text-gray-700">{option}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-8 flex justify-end">
                                            <button
                                                onClick={handleNextQuestion}
                                                disabled={!selectedAnswer}
                                                className={`px-6 py-2 rounded-md font-medium ${!selectedAnswer ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-900 hover:bg-indigo-700 text-white'}`}
                                            >
                                                {currentQuestionIndex === quizData[selectedLanguage].length - 1 ? 'Finish' : 'Next'}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h3>
                                        <p className="text-gray-600 mb-6">
                                            You scored {score} out of {quizData[selectedLanguage].length}
                                        </p>
                                        <div className="flex justify-center space-x-4">
                                            <button
                                                onClick={handleRestart}
                                                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                            >
                                                Try Again
                                            </button>
                                            <button
                                                onClick={() => setSelectedLanguage('')}
                                                className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                            >
                                                Choose Another Quiz
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </main>
           {/* Footer section */}
            <Footer />
        </div>
    );
};

export default Quiz;
