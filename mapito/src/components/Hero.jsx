import React, { useState, useEffect } from 'react';
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
            const steps = data.roadmap
                .split('\n')
                .map(step => step.trim())
                .filter(step => step.length > 0);

            setRoadmap(steps);
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
        setGoal('');
    };

    return (
        <section id='hero' className="bg-white mt-10">
            <div className="flex flex-col items-center justify-center px-4 py-12 sm:p-6 lg:p-8">
                {/* Header */}
                <motion.div className="w-full max-w-2xl text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        Get your AI-Powered <span className="text-blue-600"> Roadmap</span>
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
                            <div className="hidden sm:block absolute left-1/2 h-full w-0.5 bg-indigo-200 transform -translate-x-1/2"></div>
                            <div className="sm:hidden absolute left-4 h-full w-1 bg-indigo-200"></div>

                            {roadmap.map((step, index) => (
                                <motion.div
                                    key={index}
                                    className="relative mb-10 pl-8 sm:pl-0"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                >
                                    <div className="sm:hidden absolute left-0 top-6 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white transform -translate-x-1/2"></div>
                                    <div className={`bg-indigo-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow ${index % 2 === 0 ? 'sm:mr-auto sm:max-w-md' : 'sm:ml-auto sm:max-w-md'}`}>
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1 sm:hidden">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700 flex items-center justify-center">
                                                    {index === 0 ? <FaRocket className="text-white" size={14} /> : index === roadmap.length - 1 ? <FaCheckCircle className="text-white" size={14} /> : icons[index % icons.length]}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm sm:text-base font-semibold text-indigo-800">
                                                    <ReactMarkdown>{step}</ReactMarkdown>
                                                </div>
                                            </div>
                                            <div className="hidden sm:block flex-shrink-0 ml-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700 flex items-center justify-center">
                                                    {index === 0 ? <FaRocket className="text-white" size={14} /> : index === roadmap.length - 1 ? <FaCheckCircle className="text-white" size={14} /> : icons[index % icons.length]}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
 </section>
    );
};

export default Hero;
