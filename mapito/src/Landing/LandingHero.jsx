import { useState } from 'react';
import { FaRocket, FaLightbulb, FaCode, FaTools, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Hero() {
    const [goal, setGoal] = useState('');

    const demoRoadmap = [
        "Learn HTML & CSS Fundamentals",
        "Master JavaScript Basics",
        "Explore Frontend Frameworks (React, Vue, or Angular)",
        "Build Portfolio Projects",
        "Learn Version Control with Git",
        "Understand APIs and HTTP Requests",
        "Practice Responsive Design",
        "Prepare for Interviews"
    ];
    const icons = [
        <FaRocket className="text-white" size={18} />,
        <FaLightbulb className="text-white" size={18} />,
        <FaCode className="text-white" size={18} />,
        <FaTools className="text-white" size={18} />,
        <FaCheckCircle className="text-white" size={18} />
    ];

    return (
        <section className="bg-white">
            <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:p-4 mt-20">
                {/* Header */}
                <div className="w-full max-w-2xl text-center mb-8 px-2">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                        Get your AI-Powered <span className="text-blue-600">Roadmap</span>
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600">
                        Mapito empowers beginner developers to transform complex visions into structured,
                        actionable roadmaps.
                    </p>
                </div>

                {/* Input */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-12">
                    <input
                        type="text"
                        className="border border-gray-300 rounded-lg p-3 flex-1 text-sm sm:text-base"
                        placeholder="Enter your goal(e.g., Frontend developer)"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                    />
                    <button
                        onClick={() => navigate("/signup")}
                        className="bg-black hover:bg-gray-800 text-white rounded-lg p-3 font-semibold text-sm sm:text-base"
                    >
                        Try it now
                    </button>
                </div>

                {/* Demo Roadmap */}
                <div className="w-full max-w-4xl px-2 sm:px-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 text-center sm:text-left">Example Roadmap</h2>

                    </div>
                </div>

                {/* Roadmap */}
                <div className="w-full max-w-xl">
                    {demoRoadmap.map((step, index) => (
                        <motion.div
                            key={index}
                            className="mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                            <div
                                className={`rounded-xl p-4 flex items-center gap-4 shadow-sm ${index % 2 === 0 ? "bg-blue-100" : "bg-purple-200"
                                    }`}
                            >
                                <div className="text-lg font-semibold w-7 h-7 rounded-full bg-white flex items-center justify-center text-black">
                                    {index + 1}
                                </div>
                                <div className="text-sm sm:text-base text-black">
                                    {step}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
