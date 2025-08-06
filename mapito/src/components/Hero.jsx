import React, { useState, useEffect } from 'react';
import { FaDownload, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { jsPDF } from "jspdf";
import { useNavigate, useLocation } from 'react-router-dom';
import Bot from './Bot';

const Hero = () => {
  const [goal, setGoal] = useState('');
  const [roadmap, setRoadmap] = useState([]);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [completed, setCompleted] = useState([]); 

  const navigate = useNavigate();
  const location = useLocation();

  const getUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload.userId || payload.sub;
    } catch {
      return null;
    }
  };

  const progressPct = roadmap.length
    ? Math.round((completed.filter(Boolean).length / roadmap.length) * 100)
    : 0;

  const saveRoadmapCache = (userId, nextGoal, steps, finalDescriptions) => {
    localStorage.setItem(
      `roadmap_${userId}`,
      JSON.stringify({ goal: nextGoal, roadmap: steps, details: finalDescriptions })
    );
  };

  const saveProgress = (userId, arr) => {
    localStorage.setItem(`roadmap_${userId}_progress`, JSON.stringify(arr));
  };

  const loadProgress = (userId, stepsLen) => {
    const raw = localStorage.getItem(`roadmap_${userId}_progress`);
    if (!raw) return Array(stepsLen).fill(false);
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return Array(stepsLen).fill(false);
      // ensure length matches steps
      if (parsed.length !== stepsLen) {
        const copy = Array(stepsLen).fill(false);
        for (let i = 0; i < Math.min(parsed.length, stepsLen); i++) copy[i] = !!parsed[i];
        return copy;
      }
      return parsed.map(Boolean);
    } catch {
      return Array(stepsLen).fill(false);
    }
  };

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

      const lines = (data.roadmap || '')
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

      const finalDescriptions =
        Array.isArray(data.details) && data.details.length === steps.length
          ? data.details
          : parsedDescriptions;

      setRoadmap(steps);
      setDetails(finalDescriptions);

      const userId = getUserId();
      if (userId) {
        // reset progress for a new roadmap
        const freshProgress = Array(steps.length).fill(false);
        setCompleted(freshProgress);
        saveRoadmapCache(userId, goal, steps, finalDescriptions);
        saveProgress(userId, freshProgress);
      }

      await fetch('https://mapito.onrender.com/api/roadmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ goal, roadmap: steps.join('\n'), details: finalDescriptions }),
      });

    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!isTokenValid(token)) {
      navigate('/signup');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchSavedRoadmap = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('https://mapito.onrender.com/api/roadmaps/latest', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error();

        const data = await response.json();
        if (!data.goal || !data.roadmap) throw new Error();

        setGoal(data.goal);

        const lines = (data.roadmap || '')
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

        const finalDescriptions =
          Array.isArray(data.details) && data.details.length === steps.length
            ? data.details
            : parsedDescriptions;

        setRoadmap(steps);
        setDetails(finalDescriptions);

        // load progress
        const userId = getUserId();
        const prog = userId ? loadProgress(userId, steps.length) : Array(steps.length).fill(false);
        setCompleted(prog);
      } catch {
        // fallback to localStorage
        const userId = getUserId();
        if (!userId) return;

        const cached = localStorage.getItem(`roadmap_${userId}`);
        if (!cached) return;

        try {
          const parsed = JSON.parse(cached);
          if (!parsed || !parsed.roadmap?.length) return;
          setGoal(parsed.goal || '');
          setRoadmap(parsed.roadmap || []);
          setDetails(parsed.details || []);
          setCompleted(loadProgress(userId, (parsed.roadmap || []).length));
        } catch (err) {
          console.error("Failed to parse cached roadmap:", err);
        }
      }
    };

    fetchSavedRoadmap();
  }, [location]);

  // download roadmap
  const handleDownload = () => {
  const doc = new jsPDF();
  const marginX = 12;
  const maxWidth = doc.internal.pageSize.getWidth() - marginX * 2;
  const pageHeight = doc.internal.pageSize.getHeight();
  const lineGap = 6;  
  const sectionGap = 8; 

  doc.setFontSize(18);
  doc.text(goal || "My Roadmap", marginX, 18);

  const total = roadmap.length || 0;
  const done = completed?.filter(Boolean).length || 0;
  if (total > 0) {
    doc.setFontSize(11);
    doc.text(`Progress: ${done}/${total} steps completed`, marginX, 26);
  }

  doc.setFontSize(12);
  let y = 36;

  const addPageIfNeeded = (neededHeight = 0) => {
    if (y + neededHeight > pageHeight - 15) {
      doc.addPage();
      y = 20;
    }
  };

  roadmap.forEach((step, i) => {
    const cleanStep = (step || '').replace(/[*#-]/g, '').trim();
    const prefix = completed?.[i] ? '✔ ' : '';
    const detailRaw = (details?.[i] || 'No description available.').toString();

    doc.setFont(undefined, 'bold');
    const titleLines = doc.splitTextToSize(`${i + 1}. ${prefix}${cleanStep}`, maxWidth);
    addPageIfNeeded(titleLines.length * lineGap + sectionGap);
    titleLines.forEach(line => {
      doc.text(line, marginX, y);
      y += lineGap;
    });

    doc.setFont(undefined, 'normal');
    const detailLines = doc.splitTextToSize(detailRaw, maxWidth);
    // If details are long, break across pages 
    detailLines.forEach((line, idx) => {
      addPageIfNeeded(lineGap);
      doc.text(line, marginX + 4, y); // slight indent for details
      y += lineGap;
    });

    // Space between steps
    y += sectionGap;
  });

  doc.save(`${goal || "roadmap"}.pdf`);
};

  const handleClearRoadmap = () => {
    setRoadmap([]);
    setDetails([]);
    setGoal('');
    setExpandedIndex(null);
    setCompleted([]);

    const userId = getUserId();
    if (userId) {
      localStorage.removeItem(`roadmap_${userId}`);
      localStorage.removeItem(`roadmap_${userId}_progress`);
    }
  };

  const toggleComplete = (index) => {
    const userId = getUserId();
    setCompleted(prev => {
      const next = [...prev];
      next[index] = !next[index];
      if (userId) saveProgress(userId, next);
      return next;
    });
  };

  return (
    <section id='hero' className="bg-white mt-20">
      <div className="flex flex-col items-center justify-center px-4 py-12 sm:p-6 lg:p-8">
        {/* Feature Tag */}
        <div className="inline-flex items-center bg-gray-800 bg-opacity-70 text-blue-300 text-xs sm:text-sm md:text-base font-medium py-1.5 px-3 md:px-4 rounded-full mb-4 sm:mb-6 border border-blue-500/30 flex-wrap justify-center text-center max-w-xs sm:max-w-full">
          <span className="text-blue-400 mr-2 text-xs">●</span>
          <span className="whitespace-nowrap"> You've successfully logged in! </span>
        </div>

        {/* Header */}
        <motion.div
          className="w-full max-w-2xl text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Get your AI-Powered <span className="text-blue-600"> Roadmap</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto">
            Transform your learning goals into structured, actionable steps with personalized guidance.
          </p>
        </motion.div>

        {/* Input */}
        <motion.div
          className="w-full max-w-md mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your goal (e.g., Frontend Developer)"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              className="bg-gray-900 text-white rounded-lg p-3 font-medium text-sm sm:text-base duration-200 flex items-center justify-center gap-2 cursor-pointer"
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

        {/* Overall Progress Bar */}
        {roadmap.length > 0 && (
          <div className="w-full max-w-4xl px-2 sm:px-6 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Overall Progress</span>
              <span className="text-sm font-medium text-gray-900">{progressPct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

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
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-sm sm:text-base flex items-center gap-2 cursor-pointer"
                >
                  <FaDownload /> Download PDF
                </button>
                <button
                  onClick={handleClearRoadmap}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold text-sm sm:text-base cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="flex flex-col gap-4 w-full">
                {roadmap.map((step, index) => {
                  const isExpanded = expandedIndex === index;
                  const isDone = !!completed[index];
                  return (
                    <div
                      key={index}
                      className={`rounded-xl shadow-sm transition-transform duration-200 ${
                        index % 2 === 0 ? 'bg-purple-100' : 'bg-blue-100'
                      } ${isExpanded ? 'scale-[1.02]' : ''}`}
                      style={{ padding: '12px 16px' }}
                    >
                      {/* Header row */}
                      <div
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-white text-gray-900 font-bold border ${isDone ? 'border-green-500' : 'border-gray-300'} select-none`}>
                          {index + 1}
                        </div>
                        <span className={`text-gray-800 text-sm sm:text-base font-medium ${isDone ? 'line-through' : ''}`}>
                          {step}
                        </span>
                        {isDone && (
                          <span className="ml-auto inline-flex items-center gap-1 text-green-700 text-xs font-semibold">
                            <FaCheckCircle /> Completed
                          </span>
                        )}
                      </div>

                      {/* Expandable details */}
                      {isExpanded && (
                        <div className="mt-3">
                          <p className="text-gray-700 text-sm sm:text-base whitespace-pre-line mb-3">
                            {details[index] || "No description available."}
                          </p>

                          {/* Step progress bar */}
                          <div className="mb-3">
                            <div className="w-full bg-white/70 border border-white/60 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${isDone ? 'bg-green-500' : 'bg-gray-300'}`}
                                style={{ width: isDone ? '100%' : '0%' }}
                              />
                            </div>
                            <div className="text-xs mt-1 text-gray-600">
                              {isDone ? '100% complete' : 'Not started'}
                            </div>
                          </div>

                          {/* Complete / Undo button */}
                          <div className="flex gap-2">
                            {!isDone ? (
                              <button
                                className="px-3 py-1.5 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800"
                                onClick={(e) => { e.stopPropagation(); toggleComplete(index); }}
                              >
                                Mark as Complete
                              </button>
                            ) : (
                              <button
                                className="px-3 py-1.5 text-sm rounded-md bg-white border border-gray-300 hover:bg-gray-50"
                                onClick={(e) => { e.stopPropagation(); toggleComplete(index); }}
                              >
                                Undo
                              </button>
                            )}
                          </div>
                        </div>
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
