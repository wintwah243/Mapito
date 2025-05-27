import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import { FaPlay, FaStop, FaMicrophone, FaVideo, FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import Footer from './Footer';

function MockInterview() {
  const [role, setRole] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  // Initialize webcam
  const initWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Could not access camera/microphone');
    }
  };

  // Initialize speech recognition
  const initSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in your browser');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setTranscript(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      setError('Speech recognition error: ' + event.error);
    };
  };

  // Start/stop recording
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Start interview
  const handleStart = async () => {
    if (!role.trim()) return setError('Please enter a job role');
    
    setStarted(true);
    setLoading(true);
    
    try {
      if (videoEnabled) await initWebcam();
      initSpeechRecognition();
      
      const res = await fetch('https://mapito.onrender.com/api/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      
      const data = await res.json();
      if (res.ok) {
        setConversation([{ from: 'ai', text: data.message }]);
      } else {
        setError(data.error || 'Failed to start interview');
      }
    } catch (err) {
      setError('Network error');
    }
    
    setLoading(false);
  };

  // Send response
  const handleSendAnswer = async () => {
    if (!transcript.trim()) return;
    
    setLoading(true);
    const history = conversation.map(msg => `${msg.from}: ${msg.text}`).join('\n');
    
    try {
      const res = await fetch('http://localhost:8000/api/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          role,
          answer: transcript,
          history
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setConversation(prev => [
          ...prev,
          { from: 'user', text: transcript },
          { from: 'ai', text: data.message }
        ]);
        setTranscript('');
      } else {
        setError(data.error || 'Failed to process answer');
      }
    } catch (err) {
      setError('Network error');
    }
    
    setLoading(false);
  };

  // Clean up
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <section>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 mt-20">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <FaRobot className="text-indigo-500 mr-3" />
              Practice Your Coding Interview With Our AI
            </h1>
            
            {!started ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Role
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Frontend Developer, Data Scientist or etc..."
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => setVideoEnabled(!videoEnabled)}
                    className={`flex items-center px-4 py-2 rounded-lg ${videoEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
                  >
                    <FaVideo className="mr-2" />
                    {videoEnabled ? 'Video On' : 'Video Off'}
                  </button>
                </div>
                
                <button
                  onClick={handleStart}
                  className="flex items-center justify-center w-full px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
                  disabled={loading}
                >
                  <FaPlay className="mr-2" />
                  {loading ? 'Starting...' : 'Start Interview'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {videoEnabled && (
                  <div className="relative bg-black rounded-lg overflow-hidden h-64">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 flex space-x-2">
                      <button
                        onClick={toggleRecording}
                        className={`p-3 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gray-800'} text-white`}
                      >
                        <FaMicrophone />
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 h-64 overflow-y-auto">
                  {conversation.map((msg, i) => (
                    <div key={i} className={`mb-3 ${msg.from === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-flex items-start max-w-3/4 p-3 rounded-lg ${msg.from === 'user' ? 'bg-blue-100' : 'bg-gray-200'}`}>
                        <span className="mr-2 mt-1">
                          {msg.from === 'user' ? <FaUser /> : <FaRobot />}
                        </span>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder={isRecording ? "Speaking..." : "Type or speak your answer"}
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      disabled={isRecording}
                    />
                    {isRecording && (
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                        Listening...
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSendAnswer}
                    disabled={loading || !transcript.trim()}
                    className="flex items-center justify-center h-12 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    {/* footer section */}
      <Footer />
    </section>
  );
}

export default MockInterview;
