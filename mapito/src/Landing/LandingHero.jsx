import { useState } from 'react';
import { FaRocket, FaLightbulb, FaCode, FaTools, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

const LandingHero = () => {
    const [goal, setGoal] = useState('');
    const navigate = useNavigate();

    const icons = [
        <FaRocket className="text-white" />,
        <FaLightbulb className="text-white" />,
        <FaCode className="text-white" />,
        <FaTools className="text-white" />,
        <FaCheckCircle className="text-white" />,
    ];

    const demoRoadmap = [
        "### 1. Learn HTML & CSS Fundamentals",
        "### 2. Master JavaScript Basics",
        "### 3. Explore Frontend Frameworks (React, Vue, or Angular)",
        "### 4. Build Portfolio Projects",
        "### 5. Learn Version Control with Git",
        "### 6. Understand APIs and HTTP Requests",
        "### 7. Practice Responsive Design",
        "### 8. Learn Testing Fundamentals",
        "### 9. Optimize Performance",
        "### 10. Prepare for Interviews"
    ];


    return (
        <section id='hero'>
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
                <h1 className="text-4xl font-bold text-center mb-6">Plan your Roadmap with <span className='text-indigo-700'>AI</span></h1>
                <p className="text-lg text-gray-600 mb-6 text-center max-w-2xl">
                    Mapito empowers individuals to transform complex visions into structured, actionable roadmaps, providing clarity, direction, and a powerful foundation for achieving meaningful goals.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <input
                        type="text"
                        className="border border-gray-300 rounded-md p-3 flex-1"
                        placeholder="Enter your goal (e.g., Frontend Developer)"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                    />
                    <button
                        onClick={() => navigate("/signup")}
                        className="bg-gray-900 hover:bg-indigo-700 text-white rounded-md p-3 font-semibold"
                    >
                        Try It Now
                    </button>
                </div>

                {/* Demo Roadmap */}
                <div className="mt-12 p-6 w-full max-w-4xl">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-bold text-indigo-700">Example Roadmap</h2>
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-full font-semibold transition duration-300"
                        >
                            Get Started
                        </button>
                    </div>

                    <div className="relative border-l-4 border-indigo-300 ml-6">
                        {demoRoadmap.map((step, index) => (
                            <motion.div
                                key={index}
                                className={`flex flex-col sm:flex-row items-center mb-16 ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                            >
                                <div className="w-full sm:w-1/2 flex justify-center">
                                    <div className="relative">
                                        <span className="absolute left-1/2 transform -translate-x-1/2 -top-8 flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full ring-8 ring-white shadow-lg">
                                            {index === 0 ? (
                                                <FaRocket className="text-white" />
                                            ) : index === demoRoadmap.length - 1 ? (
                                                <FaCheckCircle className="text-white" />
                                            ) : (
                                                icons[index % icons.length]
                                            )}
                                        </span>
                                        <div className="mt-8 p-6 w-72 sm:w-80 bg-indigo-50 rounded-lg shadow-md hover:shadow-lg transition">
                                            <div className="text-lg font-semibold text-indigo-800 text-center sm:text-left">
                                                <ReactMarkdown>
                                                    {step}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingHero;