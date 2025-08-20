import React, { useState, useEffect, useRef } from 'react';
import { FaDownload, FaMicrophone, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { jsPDF } from "jspdf";
import { useNavigate, useLocation } from 'react-router-dom';
import Bot from './Bot';
import { roadmapSuggestions } from '../utils/data';

const Hero = () => {
  const [goal, setGoal] = useState('');
  const [roadmap, setRoadmap] = useState([]);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false); // roadmap suggestions tag
  const [showRoadmapList, setShowRoadmapList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const roadmapListRef = useRef(null);

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

  // Load completed steps from localStorage on component mount
  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    const savedCompletedSteps = localStorage.getItem(`completedSteps_${userId}`);
    if (savedCompletedSteps) {
      setCompletedSteps(JSON.parse(savedCompletedSteps));
    }
  }, []);

  // Save completed steps to localStorage whenever they change
  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    localStorage.setItem(`completedSteps_${userId}`, JSON.stringify(completedSteps));
  }, [completedSteps]);

  // Load completed steps when roadmap changes (user switches between different roadmaps)
  useEffect(() => {
    const userId = getUserId();
    if (!userId || !roadmap.length) return;

    const savedCompletedSteps = localStorage.getItem(`completedSteps_${userId}_${goal}`);
    if (savedCompletedSteps) {
      setCompletedSteps(JSON.parse(savedCompletedSteps));
    } else {
      setCompletedSteps([]);
    }
  }, [roadmap, goal]);

  const toggleStepCompletion = (index) => {
    setCompletedSteps(prev => {
      const newCompletedSteps = prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index];
      
      // Save to localStorage by user ID and goal
      const userId = getUserId();
      if (userId && goal) {
        localStorage.setItem(
          `completedSteps_${userId}_${goal}`,
          JSON.stringify(newCompletedSteps)
        );
      }
      return newCompletedSteps;
    });
  };

  // Calculate progress percentage
  const progressPercentage = roadmap.length > 0 
    ? Math.round((completedSteps.length / roadmap.length) * 100) 
    : 0;

  // to process step description
  const processStepDescription = (description) => {
    let result = {
      description,
      timeDuration: null,
      resourceLinks: null
    };

    // Extract Time/Duration include in roadmap details
    const timeMatch = description.match(/(Time|Duration):\s*(.*?)(?=\s*Resource:|$)/i);
    if (timeMatch) {
      result.timeDuration = timeMatch[2].trim();
      result.description = result.description.replace(timeMatch[0], "").trim();
    }

    // Extract Resources
    const resourceMatch = description.match(/Resource:\s*(.*)/i);
    if (resourceMatch) {
      result.description = result.description.split("Resource:")[0].trim();
      const resources = resourceMatch[1].split(",").map(r => r.trim()).filter(Boolean);

      result.resourceLinks = resources.map((res, i) => {
        const urlMatch = res.match(/\((https?:\/\/[^\s)]+)\)/);
        const url = urlMatch ? urlMatch[1] :
          res.startsWith("http") ? res :
            `https://www.google.com/search?q=${encodeURIComponent(res)}`;
        const displayText = urlMatch ? res.replace(/\s*\(https?:\/\/[^\s]+\)/, '') : res;

        return (
          <span key={i}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {displayText}
            </a>
            {i < resources.length - 1 && ", "}
          </span>
        );
      });
    }

    return result;
  };

  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setGoal(prev => prev + ' ' + transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const saveRoadmapCache = (userId, nextGoal, steps, finalDescriptions) => {
    localStorage.setItem(
      `roadmap_${userId}`,
      JSON.stringify({ goal: nextGoal, roadmap: steps, details: finalDescriptions })
    );
  };

  const handleGenerate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signup');
      return;
    }

    if (!goal.trim()) return;
    setLoading(true);
    setCompletedSteps([]); // Reset completed steps when generating a new roadmap

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
        saveRoadmapCache(userId, goal, steps, finalDescriptions);
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
      } catch (err) {
        console.error("Failed to parse cached roadmap:", err);
      }
    };

    fetchSavedRoadmap();
  }, [location]);

  const handleDownload = () => {
    const doc = new jsPDF();
    const marginX = 12;
    const maxWidth = doc.internal.pageSize.getWidth() - marginX * 2;
    const pageHeight = doc.internal.pageSize.getHeight();
    const lineGap = 6;
    const sectionGap = 8;

    doc.setFontSize(18);
    doc.text(goal || "My Roadmap", marginX, 18);

    doc.setFontSize(12);
    let y = 30;

    const addPageIfNeeded = (neededHeight = 0) => {
      if (y + neededHeight > pageHeight - 15) {
        doc.addPage();
        y = 20;
      }
    };

    roadmap.forEach((step, i) => {
      const cleanStep = (step || '').replace(/[*#-]/g, '').trim();
      const detailRaw = (details?.[i] || 'No description available.').toString();

      doc.setFont(undefined, 'bold');
      const titleLines = doc.splitTextToSize(`${i + 1}. ${cleanStep}`, maxWidth);
      addPageIfNeeded(titleLines.length * lineGap + sectionGap);
      titleLines.forEach(line => {
        doc.text(line, marginX, y);
        y += lineGap;
      });

      doc.setFont(undefined, 'normal');
      const detailLines = doc.splitTextToSize(detailRaw, maxWidth);
      detailLines.forEach(() => {
        addPageIfNeeded(lineGap);
      });
      // Re-loop to actually draw after page checks
      detailLines.forEach(line => {
        doc.text(line, marginX + 4, y);
        y += lineGap;
      });

      y += sectionGap;
    });

    doc.save(`${goal || "roadmap"}.pdf`);
  };

  const handleClearRoadmap = () => {
    setRoadmap([]);
    setDetails([]);
    setGoal('');
    setExpandedIndex(null);
    setCompletedSteps([]);

    const userId = getUserId();
    if (userId) {
      localStorage.removeItem(`roadmap_${userId}`);
    }
  };

  // helper to close expand roadmap list
  useEffect(() => {
    function handleClickOutside(event) {
      if (roadmapListRef.current && !roadmapListRef.current.contains(event.target)) {
        setShowRoadmapList(false); // hide when clicked outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            Generate your <span className="text-blue-600"> Roadmap</span> Here.
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto">
            Transform your goals into structured, actionable steps with personalized guidance.
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
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                placeholder="Enter your goal (e.g., Web Developer)"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              {speechSupported && (
                <button
                  onClick={startListening}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  title={isListening ? 'Listening... Click to stop' : 'Click to speak'}
                  disabled={loading}
                >
                  <FaMicrophone className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={handleGenerate}
              className="bg-gray-900 text-white rounded-lg p-3 font-medium text-sm sm:text-base duration-200 flex items-center justify-center gap-2 cursor-pointer"
              disabled={loading || isListening}
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

          {/* Suggestion Tags */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10 p-3">
              <div className="flex flex-wrap gap-2">
                {roadmapSuggestions.slice(0, 13).map((suggestion, index) => (
                  <button
                    key={index}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium px-2.5 py-1 rounded cursor-pointer transition-colors"
                    onClick={() => {
                      setGoal(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Available Roadmaps Toggle */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setShowRoadmapList(!showRoadmapList)}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                >
                  <span>{showRoadmapList ? 'Hide' : 'Show'} all available roadmap topics</span>
                  {showRoadmapList ? <FaTimes className="ml-1 text-xs" /> : <FaPlus className="ml-1 text-xs" />}
                </button>
              </div>
            </div>
          )}

          {/* Expanded Roadmap List */}
          {showRoadmapList && (
            <div
              ref={roadmapListRef}
              className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10 p-3 max-h-60 overflow-y-auto">
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Search roadmap topics..."
                  className="w-full p-2 border rounded text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {roadmapSuggestions
                  .filter(suggestion =>
                    suggestion.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((suggestion, index) => (
                    <button
                      key={index}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded cursor-pointer transition-colors text-left truncate"
                      onClick={() => {
                        setGoal(suggestion);
                        setShowRoadmapList(false);
                        setShowSuggestions(false);
                      }}
                      title={suggestion}
                    >
                      {suggestion}
                    </button>
                  ))}
              </div>
            </div>
          )}
          
          {isListening && (
            <div className="flex items-center justify-center gap-2 text-sm text-blue-600 mt-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              Listening... Speak now
            </div>
          )}
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

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress: {completedSteps.length}/{roadmap.length} steps ({progressPercentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="relative">
              <div className="flex flex-col gap-4 w-full">
                {roadmap.map((step, index) => {
                  const description = details[index] || "No description available.";
                  const isCompleted = completedSteps.includes(index);
                  const processed = processStepDescription(description);

                  return (
                    <div
                      key={index}
                      className={`rounded-xl shadow-sm transition-transform duration-200 ${index % 2 === 0 ? "bg-purple-100" : "bg-blue-100"
                        } hover:scale-[1.02] ${isCompleted ? 'opacity-70' : ''}`}
                      style={{ padding: "12px 16px" }}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="flex items-center gap-4 cursor-pointer flex-1"
                          onClick={() => setSelectedStep({
                            index,
                            title: step,
                            description: processed.description,
                            timeDuration: processed.timeDuration,
                            resourceLinks: processed.resourceLinks
                          })}
                        >
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isCompleted ? 'bg-green-100 border-green-400' : 'bg-white border-gray-300'} border text-gray-900 font-bold select-none`}>
                            {isCompleted ? <FaCheck className="text-green-600" /> : index + 1}
                          </div>
                          <span className={`text-gray-800 text-sm sm:text-base font-medium ${isCompleted ? 'line-through' : ''}`}>
                            {step}
                          </span>
                        </div>
                        {/* <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStepCompletion(index);
                          }}
                          className={`ml-4 p-2 rounded-full ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                          title={isCompleted ? 'Mark as not done' : 'Mark as done'}
                        >
                          <FaCheck className="w-4 h-4" /> 
                        </button> */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Sidebar Modal */}
            {selectedStep && (
              <div className="fixed inset-y-0 right-0 z-50 flex">
                {/* Sidebar Panel */}
                <div className="relative bg-white shadow-lg w-85 max-w-lg h-full flex flex-col">

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedStep(null)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* Content */}
                  <div className="p-6 overflow-y-auto">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Step {selectedStep.index + 1}: {selectedStep.title}
                    </h3>

                    <p className="text-gray-700 whitespace-pre-line mb-4">
                      {selectedStep.description}
                    </p>

                    {selectedStep.timeDuration && (
                      <div className="p-3 bg-gray-50 rounded-lg mb-4">
                        <h4 className="font-semibold text-gray-800">⏳ Time Required:</h4>
                        <p className="mt-1 text-gray-600">{selectedStep.timeDuration}</p>
                      </div>
                    )}

                    {selectedStep.resourceLinks && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800">📚 Resources:</h4>
                        <div className="mt-2 space-y-2 text-blue-600">
                          {selectedStep.resourceLinks}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        toggleStepCompletion(selectedStep.index);
                        setSelectedStep(null);
                      }}
                      className={`mt-6 w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 ${completedSteps.includes(selectedStep.index) 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-black text-white hover:bg-blue-200'}`}
                    >
                      <FaCheck />
                      {completedSteps.includes(selectedStep.index) 
                        ? 'Mark as Not Done' 
                        : 'Mark as Done'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Bot />
    </section>
  );
};

export default Hero;
