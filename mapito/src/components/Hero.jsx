import React, { useState } from 'react';
import { FaRocket, FaLightbulb, FaCode, FaTools, FaCheckCircle, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { jsPDF } from "jspdf";
import { useNavigate } from 'react-router-dom';
import Bot from './Bot';

const Hero = () => {
    const [goal, setGoal] = useState('');
    const [roadmap, setRoadmap] = useState([]);
    const [details, setDetails] = useState([]);          
    const [loading, setLoading] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState(null);  
    const navigate = useNavigate();

    const icons = [
        <FaRocket className="text-white" size={14} />,
        <FaLightbulb className="text-white" size={14} />,
        <FaCode className="text-white" size={14} />,
        <FaTools className="text-white" size={14} />,
        <FaCheckCircle className="text-white" size={14} />,
    ];

    const handleGenerate = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signup');
            return;
        }

        if (!goal.trim()) return;
        setLoading(true);

        try {
            const response = await fetch('https://mapito.onrender.com/api/generate-roadmap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ goal }),
            });

            const data = await response.json();

            const lines = data.roadmap
                .split('\n')
                .map(line => line.replace(/\*/g, '').trim())
                .filter(line => line.length > 0); 

            const steps = [];
            const parsedDescriptions = [];

            lines.forEach(line => {
                const match = line.match(/^\d+\.\s*(.+?)\s*-\s*(.+)$/);
                if (match) {
                    steps.push(match[1].trim());
                    parsedDescriptions.push(match[2].trim());
                } else {
                    steps.push(line);
                    parsedDescriptions.push("No description available.");
                }
            });

            // Prefer backend `details` if available and length matches
            const finalDescriptions =
                Array.isArray(data.details) && data.details.length === steps.length
                    ? data.details
                    : parsedDescriptions;

            setRoadmap(steps);
            setDetails(finalDescriptions);

            await fetch('https://mapito.onrender.com/api/roadmaps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ goal, roadmap: steps.join('\n') }),
            });
        } catch (error) {
            console.error('Error generating roadmap:', error);
        } finally {
            setLoading(false);
        }
    };


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

    const handleClearRoadmap = () => {
        setRoadmap([]);
        setDetails([]);
        setGoal('');
        setExpandedIndex(null);
    };

    const toggleExpand = (index) => {
        setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
    };

    return (
        <section id='hero' className="bg-white mt-20">
            <div className="flex flex-col items-center justify-center px-4 py-12 sm:p-6 lg:p-8">
                {/* Feature Tag */}
                <div className="inline-flex items-center bg-gray-800 bg-opacity-70 text-blue-300 text-xs sm:text-sm md:text-base font-medium py-1.5 px-3 md:px-4 rounded-full mb-4 sm:mb-6 border border-blue-500/30 flex-wrap justify-center text-center max-w-xs sm:max-w-full">
                    <span className="text-blue-400 mr-2 text-xs">●</span>
                    <span className="whitespace-nowrap"> You've successfully logged in!  </span>
                </div>
                {/* Header */}
                <motion.div className="w-full max-w-2xl text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        Get your AI-Powered <span className="text-indigo-600"> Roadmap</span>
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto">
                        Transform your learning goals into structured, actionable steps with personalized guidance.
                    </p>
                </motion.div>

                {/* Input */}
                <motion.div className="w-full max-w-md mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <input
                            type="text"
                            className="flex-1 border border-gray-300 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your goal (e.g., Frontend Developer)"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
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

                {/* Roadmap */}
                {roadmap.length > 0 && (
                    <div className="w-full max-w-4xl px-2 sm:px-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                            <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 text-center sm:text-left">
                                Your Roadmap
                            </h2>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDownload}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold text-sm sm:text-base flex items-center gap-2"
                                >
                                    <FaDownload /> Download PDF
                                </button>
                                <button
                                    onClick={handleClearRoadmap}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold text-sm sm:text-base"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="flex flex-col gap-4 w-full">
                                {roadmap.map((step, index) => {
                                    const isExpanded = expandedIndex === index;
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                            className={`cursor-pointer rounded-xl shadow-sm transition-transform duration-200
                                                ${index % 2 === 0 ? 'bg-purple-100' : 'bg-blue-100'} 
                                                ${isExpanded ? 'scale-[1.02]' : ''}`}
                                            style={{ padding: '12px 16px' }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-gray-900 font-bold border border-gray-300 select-none">
                                                    {index + 1}
                                                </div>
                                                <span className="text-gray-800 text-sm sm:text-base font-medium">{step}</span>
                                            </div>
                                            {isExpanded && (
                                                <p className="mt-3 text-gray-700 text-sm sm:text-base whitespace-pre-line">
                                                    {details[index] || "No description available."}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Bot />
        </section>
    );
};

export default Hero;
