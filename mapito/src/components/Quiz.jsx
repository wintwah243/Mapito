import React, { useState, useEffect } from 'react';
import { quizData } from '../utils/data';
import Navbar from './Navbar';
import { FaReact, FaPython, FaJava, FaPhp, FaBrain, FaJsSquare } from 'react-icons/fa';

const Quiz = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [quizEnded, setQuizEnded] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // 1 minute

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizEnded(false);
        setSelectedAnswer('');
        setTimeLeft(60); // Reset timer
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
        setTimeLeft(60); // Reset timer
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
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Banner and About Section */}
            <div className="mt-16 w-full bg-white text-white py-10 px-4 text-center">
                <h1 className="text-3xl text-gray-900 font-bold mb-2">Welcome to the Mapito Quiz!</h1>
                <p className="text-md max-w-2xl text-gray-500 mx-auto">
                    Test your knowledge in Technology Field. Choose a category and begin your journey to mastery.
                </p>
            </div>

            {/* Language Selector */}
            {!selectedLanguage && (
                <div className="max-w-4xl mx-auto px-4 mt-10">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Choose a Language</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white">
                        {[
                            { label: 'JavaScript', icon: <FaJsSquare className="bg-gray-200 p-[5px] rounded-full text-gray-900 text-4xl mr-2" />, key: 'javascript' },
                            { label: 'React', icon: <FaReact className="bg-gray-200 p-[5px] rounded-full text-gray-900 text-4xl mr-2" />, key: 'react' },
                            { label: 'Python', icon: <FaPython className="bg-gray-200 p-[5px] rounded-full text-gray-900 text-4xl mr-2" />, key: 'python' },
                            { label: 'Java', icon: <FaJava className="bg-gray-200 p-[5px] rounded-full text-gray-900 text-4xl mr-2" />, key: 'java' },
                            { label: 'PHP', icon: <FaPhp className="bg-gray-200 p-[5px] rounded-full text-gray-900 text-4xl mr-2" />, key: 'php' },
                            { label: 'AI', icon: <FaBrain className="bg-gray-200 p-[5px] rounded-full text-gray-900 text-4xl mr-2" />, key: 'ai' },
                        ].map(({ label, icon, key }) => (
                            <button
                                key={key}
                                onClick={() => handleLanguageSelect(key)}
                                className="flex items-center bg-white text-gray-900 border border-black p-6 rounded-xl shadow-md cursor-pointer transition duration-300"
                            >
                                {icon}
                                <div>
                                    <p className="text-sm mb-1">Category</p>
                                    <h3 className="text-xl font-semibold">{label}</h3>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Quiz Section */}
            {selectedLanguage && (
                <div className="max-w-2xl mx-auto px-4 mt-10 bg-white rounded-xl shadow-md p-6">
                    {!quizEnded ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} Quiz
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Time left: {timeLeft} sec
                                </p>
                            </div>

                            <div className="mb-6">
                                <p className="text-xl text-gray-800">{currentQuestion.question}</p>
                            </div>
                            <div className="space-y-4">
                                {currentQuestion.options.map((option, index) => (
                                    <div key={index} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={option}
                                            name="quiz-option"
                                            value={option}
                                            checked={selectedAnswer === option}
                                            onChange={() => handleAnswerSelect(option)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={option} className="text-lg text-gray-700">
                                            {option}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-center">
                                <button
                                    onClick={handleNextQuestion}
                                    className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition duration-300"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900">
                                Quiz Completed
                            </h2>
                            <p className="text-lg text-center text-gray-800 mb-4">
                                Your score: {score} / {quizData[selectedLanguage].length}
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={handleRestart}
                                    className="bg-gray-900 text-white px-6 py-2 rounded-[10px] hover:bg-green-700 transition duration-300"
                                >
                                    Restart Quiz
                                </button>
                                <button
                                    onClick={() => setSelectedLanguage('')}
                                    className="bg-gray-100 text-gray-900 px-6 py-2 rounded-[10px] border border-gray-300 hover:bg-gray-200 transition duration-300"
                                >
                                    Stop Quiz
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Quiz;
