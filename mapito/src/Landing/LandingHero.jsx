import { useState } from 'react';
import { FaRocket, FaLightbulb, FaCode, FaTools, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

const LandingHero = () => {
    const [goal, setGoal] = useState('');
    const navigate = useNavigate();

    const icons = [
        <FaRocket className="text-white" size={18} />,
        <FaLightbulb className="text-white" size={18} />,
        <FaCode className="text-white" size={18} />,
        <FaTools className="text-white" size={18} />,
        <FaCheckCircle className="text-white" size={18} />,
    ];

    //display demo roadmap on landing page 
    const demoRoadmap = [
        "### Learn HTML & CSS Fundamentals",
        "### Master JavaScript Basics",
        "### Explore Frontend Frameworks (React, Vue, or Angular)",
        "### Build Portfolio Projects",
        "### Learn Version Control with Git",
        "### Understand APIs and HTTP Requests",
        "### Practice Responsive Design",
        "### Prepare for Interviews"
    ];

    return (
        <section id='hero' className="bg-white">
            <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:p-4 mt-20">
                {/* Header Section */}
                <div className="w-full max-w-2xl text-center mb-8 px-2">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">Plan your Roadmap with <span className='text-indigo-700'>AI</span></h1>
                    <p className="text-base sm:text-lg text-gray-600">
                        Mapito empowers individuals to transform complex visions into structured, actionable roadmaps.
                    </p>
                </div>

                {/* Input Section */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-12">
                    <input
                        type="text"
                        className="border border-gray-300 rounded-lg p-3 flex-1 text-sm sm:text-base"
                        placeholder="Enter your goal (e.g., Frontend Developer)"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                    />
                    <button
                        onClick={() => navigate("/signup")}
                        className="bg-gray-900 hover:bg-indigo-700 text-white rounded-lg p-3 font-semibold text-sm sm:text-base"
                    >
                        Try It Now
                    </button>
                </div>

                {/* Demo Roadmap */}
                <div className="w-full max-w-4xl px-2 sm:px-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 text-center sm:text-left">Example Roadmap</h2>
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-5 sm:px-6 rounded-full font-semibold text-sm sm:text-base transition duration-300 whitespace-nowrap"
                        >
                            Get Started
                        </button>
                    </div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="hidden sm:block absolute left-1/2 h-full w-0.5 bg-indigo-200 transform -translate-x-1/2"></div>
                        
                        {/* Mobile timeline dots */}
                        <div className="sm:hidden absolute left-4 h-full w-1 bg-indigo-200"></div>

                        {demoRoadmap.map((step, index) => (
                            <motion.div
                                key={index}
                                className="relative mb-10 pl-8 sm:pl-0"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                            >
                                {/* Mobile dot */}
                                <div className="sm:hidden absolute left-0 top-6 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white transform -translate-x-1/2"></div>
                                
                                {/* Desktop dot */}
                                {/* <div className="hidden sm:block absolute left-1/2 top-6 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white transform -translate-x-1/2 -translate-y-1/2"></div> */}
                                
                                {/* Card */}
                                <div className={`bg-indigo-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow ${index % 2 === 0 ? 'sm:mr-auto sm:max-w-md' : 'sm:ml-auto sm:max-w-md'}`}>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1 sm:hidden">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700 flex items-center justify-center">
                                                {index === 0 ? (
                                                    <FaRocket className="text-white" size={14} />
                                                ) : index === demoRoadmap.length - 1 ? (
                                                    <FaCheckCircle className="text-white" size={14} />
                                                ) : (
                                                    icons[index % icons.length]
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm sm:text-base font-semibold text-indigo-800">
                                                <ReactMarkdown>
                                                    {step}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                        <div className="hidden sm:block flex-shrink-0 ml-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700 flex items-center justify-center">
                                                {index === 0 ? (
                                                    <FaRocket className="text-white" size={14} />
                                                ) : index === demoRoadmap.length - 1 ? (
                                                    <FaCheckCircle className="text-white" size={14} />
                                                ) : (
                                                    icons[index % icons.length]
                                                )}
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
