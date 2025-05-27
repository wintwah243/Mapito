import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { FaPlay, FaStop, FaMicrophone, FaVideo, FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';

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
  const recognitionRef = useRef(null);

  const initWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setError('Could not access camera/microphone');
    }
  };

  const initSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return setError('Speech recognition not supported in this browser');

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setTranscript(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      setError('Speech recognition error: ' + event.error);
    };
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  const handleStart = async () => {
    if (!role.trim()) return setError('Please enter a job role');
    setStarted(true);
    setLoading(true);
    try {
      if (videoEnabled) await initWebcam();
      initSpeechRecognition();

      const res = await fetch('http://localhost:8000/api/mock-interview', {
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
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  const handleSendAnswer = async () => {
    if (!transcript.trim()) return;

    setLoading(true);
    const history = conversation.map(msg => `${msg.from}: ${msg.text}`).join('\n');

    try {
      const res = await fetch('http://localhost:8000/api/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, answer: transcript, history })
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
    } catch {
      setError('Network error');
    }

    setLoading(false);
  };

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  return (
    <section className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 mt-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white shadow-md rounded-xl p-6 md:p-10">
            <h1 className="text-3xl font-semibold text-gray-800 flex items-center mb-2">
              <FaRobot className="text-indigo-600 mr-3" />
              Improve Your Coding interview With Us
            </h1>
            <p className="text-gray-600 mb-8">
              Practice your job interview skills using AI. Get instant feedback on your spoken or typed answers.
            </p>

            {!started ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Frontend Developer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setVideoEnabled(!videoEnabled)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      videoEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <FaVideo className="inline mr-2" />
                    {videoEnabled ? 'Video On' : 'Video Off'}
                  </button>
                </div>

                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <FaPlay className="mr-2" />
                  {loading ? 'Starting...' : 'Start Interview'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {videoEnabled && (
                  <div className="relative h-64 bg-black rounded-lg overflow-hidden">
                    <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                    <button
                      onClick={toggleRecording}
                      className={`absolute bottom-4 left-4 p-3 rounded-full text-white ${
                        isRecording ? 'bg-red-500' : 'bg-gray-700'
                      }`}
                    >
                      <FaMicrophone />
                    </button>
                  </div>
                )}

                <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 p-4">
                  {conversation.map((msg, i) => (
                    <div key={i} className={`mb-4 ${msg.from === 'user' ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`inline-flex items-start gap-2 p-3 rounded-lg max-w-[75%] ${
                          msg.from === 'user' ? 'bg-indigo-100 ml-auto' : 'bg-gray-200'
                        }`}
                      >
                        {msg.from === 'user' ? <FaUser /> : <FaRobot />}
                        <p className="text-gray-800 whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder={isRecording ? 'Speaking...' : 'Type or speak your answer'}
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      disabled={isRecording}
                    />
                    {isRecording && (
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                        Listening...
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSendAnswer}
                    disabled={loading || !transcript.trim()}
                    className="h-12 w-12 flex items-center justify-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 bg-red-100 text-red-800 border-l-4 border-red-500 p-4 rounded-md">
                {error}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </section>
  );
}

export default MockInterview;
