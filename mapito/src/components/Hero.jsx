import React, { useState } from 'react';
import { FaRocket, FaLightbulb, FaCode, FaTools, FaCheckCircle, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from "jspdf";
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const [goal, setGoal] = useState('');
    const [roadmap, setRoadmap] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const icons = [
        <FaRocket className="text-white" size={14} />,
        <FaLightbulb className="text-white" size={14} />,
        <FaCode className="text-white" size={14} />,
        <FaTools className="text-white" size={14} />,
        <FaCheckCircle className="text-white" size={14} />,
    ];

    //to handle generate roadmap
    const handleGenerate = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signup');
            return;
        }

        if (!goal.trim()) return;
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/generate-roadmap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ goal }),
            });

            const data = await response.json();
            const steps = data.roadmap
                .split('\n')
                .map(step => step.trim())
                .filter(step => step.length > 0);

            setRoadmap(steps);
        } catch (error) {
            console.error('Error generating roadmap:', error);
        }

        setLoading(false);
    };

    //to handle download roadmap with pdf file
    const handleDownload = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(goal || "My Roadmap", 10, 20);
    
        doc.setFontSize(12);
        let yPosition = 30;
        roadmap.forEach((step, index) => {
            const cleanStep = step.replace(/[*#-]/g, '').trim();
            doc.text(`${index + 1}. ${cleanStep}`, 10, yPosition);
            yPosition += 10;
            
            if (yPosition > 280) { 
                doc.addPage();
                yPosition = 20;
            }
        });
    
        doc.save(`${goal || "roadmap"}.pdf`);
    };

    return (
        <section id='hero' className="bg-gradient-to-b from-gray-50 to-white">
            <div className="flex flex-col items-center justify-center px-4 py-12 sm:p-6 lg:p-8">
                {/* Header Section */}
                <motion.div 
                    className="w-full max-w-2xl text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        Plan your <span className="text-indigo-600">Roadmap</span> with AI
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto">
                        Transform your learning goals into structured, actionable steps with personalized guidance.
                    </p>
                </motion.div>

                {/* Input Section */}
                <motion.div 
                    className="w-full max-w-md mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <input
                            type="text"
                            className="flex-1 border border-gray-300 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your goal (e.g., Frontend Developer)"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <button
                            onClick={handleGenerate}
                            className="bg-gray-900 text-white rounded-lg p-3 font-medium text-sm sm:text-base duration-200 flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : 'Generate'}
                        </button>
                    </div>
                </motion.div>

                {/* Roadmap Section */}
                {roadmap.length > 0 && (
                    <motion.div 
                        className="w-full max-w-4xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">
                                Your {goal ? `${goal} ` : ''}Roadmap
                            </h2>
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 bg-white border border-indigo-500 text-indigo-600 hover:bg-indigo-50 py-2 px-4 rounded-lg font-medium text-sm sm:text-base transition-colors duration-200"
                            >
                                <FaDownload size={14} />
                                Download PDF
                            </button>
                        </div>

                        <div className="relative">
                            {/* Timeline line */}
                            <div className="hidden sm:block absolute left-1/2 h-full w-0.5 bg-indigo-200 transform -translate-x-1/2"></div>
                            
                            {/* Mobile timeline dots */}
                            <div className="sm:hidden absolute left-4 h-full w-1 bg-indigo-200 rounded-full"></div>

                            {roadmap.map((step, index) => (
                                <motion.div
                                    key={index}
                                    className="relative mb-8 pl-8 sm:pl-0"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                >
                                    {/* Mobile dot */}
                                    <div className="sm:hidden absolute left-0 top-6 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white transform -translate-x-1/2"></div>
                                    
                                    {/* Desktop dot */}
                                    <div className="hidden sm:block absolute left-1/2 top-6 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white transform -translate-x-1/2 -translate-y-1/2"></div>
                                    
                                    {/* Card */}
                                    <div className={`bg-indigo-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow ${index % 2 === 0 ? 'sm:mr-auto sm:max-w-md' : 'sm:ml-auto sm:max-w-md'}`}>
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md">
                                                    {index === 0 ? (
                                                        <FaRocket className="text-white" size={14} />
                                                    ) : index === roadmap.length - 1 ? (
                                                        <FaCheckCircle className="text-white" size={14} />
                                                    ) : (
                                                        icons[index % icons.length]
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm sm:text-base font-medium text-gray-800">
                                                    <ReactMarkdown>
                                                        {step.replace(/^###\s*/, '')}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Hero;
