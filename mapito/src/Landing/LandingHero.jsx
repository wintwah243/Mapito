import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
    const [goal, setGoal] = useState('');
    const navigate = useNavigate();

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

    return (
        <section className="bg-white">
            <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 mt-20">
                {/* Header */}
                <div className="w-full max-w-3xl text-center mb-8 px-4">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                        Generate your <span className="text-blue-600">Roadmap </span> Here.
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600">
                        Mapito empowers beginner developers to transform complex visions into structured,
                        actionable roadmaps.
                    </p>
                </div>

                {/* Input */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl mb-10 px-4">
                    <input
                        type="text"
                        className="border border-gray-300 rounded-lg p-3 flex-1 text-sm sm:text-base"
                        placeholder="Enter your goal (e.g., Frontend developer)"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                    />
                    <button
                        onClick={() => navigate("/signup")}
                        className="bg-black hover:bg-gray-800 text-white rounded-lg px-6 py-3 font-semibold text-sm sm:text-base"
                    >
                        Try it now
                    </button>
                </div>

                {/* Roadmap Title */}
                <div className="w-full max-w-3xl px-4 mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 text-center sm:text-left">
                        Example Roadmap
                    </h2>
                </div>

                {/* Step-by-step Roadmap */}
                <div className="w-full max-w-3xl px-4">
                    {demoRoadmap.map((step, index) => (
                        <motion.div
                            key={index}
                            className="mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                            <div
                                className={`rounded-xl p-4 flex items-center gap-4 shadow-sm ${
                                    index % 2 === 0 ? "bg-blue-100" : "bg-purple-200"
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
}
