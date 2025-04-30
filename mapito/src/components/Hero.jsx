import React, { useState } from 'react';
import { FaRocket, FaLightbulb, FaCode, FaTools, FaCheckCircle } from 'react-icons/fa';
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
        <FaRocket className="text-white" />,
        <FaLightbulb className="text-white" />,
        <FaCode className="text-white" />,
        <FaTools className="text-white" />,
        <FaCheckCircle className="text-white" />,
    ];

    const handleGenerate = async () => {
        // Check if there's a token in localStorage or sessionStorage
        const token = localStorage.getItem('token'); 
        
        if (!token) {
            // If no token is found, redirect to signup page
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
                        onClick={handleGenerate}
                        className="bg-gray-900 hover:bg-indigo-700 text-white rounded-md p-3 font-semibold"
                        disabled={loading}
                    >
                        {loading ? 'Generating...' : 'Generate'}
                    </button>
                </div>

                {roadmap.length > 0 && (
                    <div className="mt-12 p-6 w-full max-w-4xl">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-bold text-indigo-700">Your Roadmap</h2>
                            <button
                                onClick={handleDownload}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-full font-semibold transition duration-300"
                            >
                                Download
                            </button>
                        </div>

                        <div className="relative border-l-4 border-indigo-300 ml-6">
                            {roadmap.map((step, index) => (
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
                                                ) : index === roadmap.length - 1 ? (
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
                )}
            </div>
        </section>
    );
};

export default Hero;
