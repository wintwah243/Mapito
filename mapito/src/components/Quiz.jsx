import React, { useState, useEffect, useRef } from 'react';
import { quizData } from '../utils/data';
import Navbar from './Navbar';
import Footer from './Footer';

const Quiz = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [quizEnded, setQuizEnded] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [userAnswers, setUserAnswers] = useState([]);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [reviewIndex, setReviewIndex] = useState(0);
    const [isConfiguringQuiz, setIsConfiguringQuiz] = useState(false);
    const [quizConfig, setQuizConfig] = useState({
        questionCount: 0,
        countdownTime: 30
    });
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const quizHeaderRef = useRef(null);

    const handleStopQuiz = () => {
        setSelectedCategory('');
        setSelectedLanguage('');
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizEnded(false);
        setSelectedAnswer('');
        setTimeLeft(60);
        setUserAnswers([]);
        setIsReviewMode(false);
        setReviewIndex(0);
        setIsConfiguringQuiz(false);
    };

    const handleLanguageSelect = (category, language) => {
        setSelectedCategory(category);
        setSelectedLanguage(language);
        setIsConfiguringQuiz(true); // Show configuration screen
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizEnded(false);
        setSelectedAnswer('');
        setTimeLeft(60);
        setUserAnswers([]);
        setIsReviewMode(false);
        setReviewIndex(0);
        setTimeout(() => {
            quizHeaderRef.current?.scrollIntoView({
                behavior: 'auto',
                block: 'start'
            });
        }, 0);
    };

    const handleConfigSubmit = () => {
        // Get all questions for the selected language
        const allQuestions = quizData[selectedCategory]?.[selectedLanguage] || [];
        // Shuffle and select the requested number of questions
        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, quizConfig.questionCount);

        setFilteredQuestions(selectedQuestions);
        setTimeLeft(quizConfig.countdownTime);
        setIsConfiguringQuiz(false);
    };

    const currentQuestion = filteredQuestions[currentQuestionIndex];

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
    };

    const handleNextQuestion = () => {
        if (!currentQuestion) return;

        const isCorrect = selectedAnswer === currentQuestion.answer;

        // update score
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        // record this question for review
        setUserAnswers(prev => ([
            ...prev,
            {
                question: currentQuestion.question,
                options: currentQuestion.options,
                correctAnswer: currentQuestion.answer,
                userAnswer: selectedAnswer,
                isCorrect
            }
        ]));

        // move to next or end
        if (currentQuestionIndex < filteredQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer('');
        } else {
            setQuizEnded(true);
            setSelectedAnswer('');
        }
    };

    const handleRestart = () => {
        setIsConfiguringQuiz(true); 
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizEnded(false);
        setSelectedAnswer('');
        setUserAnswers([]);
        setIsReviewMode(false);
        setReviewIndex(0);
    };

    // Review controls
    const startReview = () => {
        setIsReviewMode(true);
        setReviewIndex(0);
    };

    const nextReview = () => {
        setReviewIndex((prev) => Math.min(prev + 1, userAnswers.length - 1));
    };

    const prevReview = () => {
        setReviewIndex((prev) => Math.max(prev - 1, 0));
    };

    useEffect(() => {
        let timer;
        if (selectedLanguage && !quizEnded && !isReviewMode && !isConfiguringQuiz) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        // On time up, end quiz and allow review of what they answered 
                        setQuizEnded(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [selectedLanguage, quizEnded, isReviewMode, isConfiguringQuiz]);

    const quizCategories = [
        {
            name: "Beginner",
            quizzes: [
                { label: 'JavaScript', emoji: '🌟', key: 'javascript' },
                { label: 'Python', emoji: '🤖', key: 'python' },
                { label: 'HTML', emoji: '🖥️', key: 'html' },
                { label: 'CSS', emoji: '🎨', key: 'css' },
                { label: 'Git', emoji: '🔄', key: 'git' },
                { label: 'Command Line', emoji: '💻', key: 'cli' }
            ]
        },
        {
            name: "Intermediate",
            quizzes: [
                { label: 'React', emoji: '⚛️', key: 'react' },
                { label: 'Node.js', emoji: '🟢', key: 'node' },
                { label: 'TypeScript', emoji: '🔵', key: 'typescript' },
                { label: 'Express', emoji: '🚂', key: 'express' },
                { label: 'MongoDB', emoji: '🍃', key: 'mongodb' },
                { label: 'SQL', emoji: '🗃️', key: 'sql' }
            ]
        },
        {
            name: "Advanced",
            quizzes: [
                { label: 'Docker', emoji: '🐳', key: 'docker' },
                { label: 'Kubernetes', emoji: '☸️', key: 'kubernetes' },
                { label: 'AWS', emoji: '☁️', key: 'aws' },
                { label: 'GraphQL', emoji: '📊', key: 'graphql' },
                { label: 'Machine Learning', emoji: '🧠', key: 'ml' },
                { label: 'Blockchain', emoji: '⛓️', key: 'blockchain' }
            ]
        }
    ];

    // Get max available questions for the selected language
    const maxQuestions = selectedLanguage
        ? (quizData[selectedCategory]?.[selectedLanguage]?.length || 10)
        : 10;

    return (
        <div className="min-h-screen bg-white mt-20">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-white text-white py-16 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl text-gray-900 font-bold mb-4">Take Tech Challenge With Mapito Quiz</h1>
                    <p className="text-xl opacity-90 text-gray-900">
                        Improve and practice your programming knowledge with Mapito quiz.
                        Choose a category that interests you and apply your knowledge through quiz.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white min-h-screen" ref={quizHeaderRef}>
                {!selectedLanguage && (
                    <div className="max-w-4xl mx-auto">
                        {quizCategories.map((category) => (
                            <div key={category.name} className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                                    {category.name} Level
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {category.quizzes.map(({ label, emoji, key }) => (
                                        <button
                                            key={key}
                                            onClick={() => handleLanguageSelect(category.name.toLowerCase(), key)}
                                            className="flex items-start bg-white border border-gray-200 hover:border-blue-500 hover:shadow-lg rounded-2xl p-6 space-x-4 transition duration-300 ease-in-out"
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
                        ))}
                    </div>
                )}

                {/* Quiz Configuration */}
                {isConfiguringQuiz && (
                    <section className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-gray-900 px-6 py-4">
                                <h2 className="text-xl font-bold text-white">
                                    Configure Your {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} Quiz
                                </h2>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        How many questions do you want in your quiz?
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={quizConfig.questionCount}
                                            onChange={(e) => setQuizConfig({
                                                ...quizConfig,
                                                questionCount: parseInt(e.target.value)
                                            })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                                <option key={num} value={num}>
                                                    {num} question{num !== 1 ? 's' : ''}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Please select countdown time for your quiz
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[30, 60, 90, 120].map((time) => (
                                            <button
                                                key={time}
                                                onClick={() => setQuizConfig({
                                                    ...quizConfig,
                                                    countdownTime: time
                                                })}
                                                className={`py-3 rounded-md text-center font-medium ${quizConfig.countdownTime === time
                                                        ? 'bg-gray-900 text-white'
                                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {time}s
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        <span className="text-sm text-gray-600 mr-3">Custom:</span>
                                        <input
                                            type="number"
                                            min="10"
                                            max="300"
                                            value={quizConfig.countdownTime}
                                            onChange={(e) => setQuizConfig({
                                                ...quizConfig,
                                                countdownTime: parseInt(e.target.value) || 60
                                            })}
                                            className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">seconds</span>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        onClick={() => {
                                            setIsConfiguringQuiz(false);
                                            setSelectedLanguage('');
                                        }}
                                        className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleConfigSubmit}
                                        className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Start Quiz
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Quiz or Review */}
                {selectedLanguage && !isConfiguringQuiz && (
                    <section className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            {/* Header */}
                            <div className="bg-gray-900 px-6 py-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-white">
                                        {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} Challenge
                                    </h2>

                                    <div className="flex items-center space-x-4">
                                        {!isReviewMode && (
                                            <div className="bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                {!quizEnded
                                                    ? `Question ${currentQuestionIndex + 1}/${filteredQuestions.length}`
                                                    : `Completed`}
                                            </div>
                                        )}
                                        <button
                                            onClick={handleStopQuiz}
                                            className="ml-4 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full"
                                        >
                                            {isReviewMode ? 'Exit' : 'Stop Quiz'}
                                        </button>
                                    </div>
                                </div>

                                {!quizEnded && !isReviewMode && (
                                    <div className="mt-2">
                                        <div className="w-full bg-blue-500 rounded-full h-2">
                                            <div
                                                className="bg-white h-2 rounded-full"
                                                style={{ width: `${(timeLeft / quizConfig.countdownTime) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-right text-xs text-blue-200 mt-1">
                                            Time remaining: {timeLeft}s
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                {/* Answering Mode */}
                                {!quizEnded && !isReviewMode && currentQuestion && (
                                    <>
                                        <h3 className="text-lg font-medium text-gray-800 mb-6">
                                            {currentQuestion.question}
                                        </h3>
                                        <div className="space-y-3">
                                            {currentQuestion.options.map((option, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedAnswer === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                                                    onClick={() => handleAnswerSelect(option)}
                                                >
                                                    <div className="flex items-center">
                                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${selectedAnswer === option ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
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
                                                className={`px-6 py-2 rounded-md font-medium ${!selectedAnswer ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-900 hover:bg-blue-700 text-white'}`}
                                            >
                                                {currentQuestionIndex === filteredQuestions.length - 1 ? 'Finish' : 'Next'}
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* Completed Summary */}
                                {quizEnded && !isReviewMode && (
                                    <div className="text-center py-8">
                                        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h3>
                                        <p className="text-gray-600 mb-6">
                                            You scored {score} out of {filteredQuestions.length}
                                        </p>
                                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                                            <button
                                                onClick={handleRestart}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Try Again
                                            </button>
                                            <button
                                                onClick={() => setSelectedLanguage('')}
                                                className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                            >
                                                Choose Another Quiz
                                            </button>
                                            <button
                                                onClick={startReview}
                                                className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                                            >
                                                Review Answers
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Review Mode */}
                                {quizEnded && isReviewMode && userAnswers.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-sm text-gray-600">
                                                Reviewing {reviewIndex + 1} / {userAnswers.length}
                                            </div>
                                            <div className="text-sm">
                                                Score: <span className="font-semibold">{score}</span> / {userAnswers.length}
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                            {userAnswers[reviewIndex].question}
                                        </h3>

                                        <div className="space-y-2">
                                            <div className={`p-3 border rounded-md ${userAnswers[reviewIndex].isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
                                                <p className="text-sm">
                                                    <span className="font-semibold">
                                                        Your answer:
                                                    </span>{' '}
                                                    {userAnswers[reviewIndex].userAnswer || <em className="text-gray-500">No answer</em>}
                                                </p>
                                                <p className="text-xs mt-1">
                                                    {userAnswers[reviewIndex].isCorrect ? '✅ Correct' : '❌ Incorrect'}
                                                </p>
                                            </div>

                                            <div className="p-3 border rounded-md bg-gray-50">
                                                <p className="text-sm">
                                                    <span className="font-semibold">Correct answer:</span>{' '}
                                                    {userAnswers[reviewIndex].correctAnswer}
                                                </p>
                                            </div>

                                            {/* Optional: show all options with highlighting */}
                                            <div className="mt-4">
                                                <p className="text-xs text-gray-500 mb-2">Options:</p>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {userAnswers[reviewIndex].options.map((opt, i) => {
                                                        const isUser = opt === userAnswers[reviewIndex].userAnswer;
                                                        const isCorrect = opt === userAnswers[reviewIndex].correctAnswer;
                                                        return (
                                                            <div
                                                                key={i}
                                                                className={`p-2 rounded border text-sm
                                                                    ${isCorrect ? 'border-green-500 bg-green-50' :
                                                                        isUser ? 'border-red-400 bg-red-50' :
                                                                            'border-gray-200 bg-white'}`}
                                                            >
                                                                {opt}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-between">
                                            <button
                                                onClick={prevReview}
                                                disabled={reviewIndex === 0}
                                                className={`px-4 py-2 rounded-md border ${reviewIndex === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`}
                                            >
                                                Prev
                                            </button>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setIsReviewMode(false)}
                                                    className="px-4 py-2 rounded-md bg-white border hover:bg-gray-50"
                                                >
                                                    Summary
                                                </button>
                                                <button
                                                    onClick={nextReview}
                                                    disabled={reviewIndex === userAnswers.length - 1}
                                                    className={`px-4 py-2 rounded-md text-white ${reviewIndex === userAnswers.length - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'}`}
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-center gap-3">
                                            <button
                                                onClick={handleRestart}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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

            <Footer />
        </div>
    );
};

export default Quiz;
