import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import {
  FaPlay,
  FaStop,
  FaMicrophone,
  FaVideo,
  FaPaperPlane,
  FaRobot,
  FaUser,
} from 'react-icons/fa';

function MockInterview() {
  const [role, setRole] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  const handleStop = () => {
    // Stop webcam
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    // Reset states
    setStarted(false);
    setConversation([]);
    setRole('');
    setLoading(false);
    setIsRecording(false);
    setError('');
    setFinalTranscript('');
    setInterimTranscript('');
  };

  const initWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setError('Could not access camera/microphone');
    }
  };

  const initSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition)
      return setError('Speech recognition not supported in this browser');

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      if (final) {
        // Append final transcript to finalTranscript state
        setFinalTranscript((prev) => (prev ? prev + ' ' + final.trim() : final.trim()));
        // Clear interim transcript when final transcript is appended
        setInterimTranscript('');
      } else {
        setInterimTranscript(interim);
      }
    };

    recognitionRef.current.onerror = (event) => {
      setError('Speech recognition error: ' + event.error);
      setIsRecording(false);
      recognitionRef.current.stop();
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setFinalTranscript(''); // Reset final transcript on new recording start
      recognitionRef.current.start();
      setError('');
    }
    setIsRecording(!isRecording);
  };

  const handleStart = async () => {
    if (!role.trim()) return setError('Please enter a job role');
    setError('');
    setStarted(true);
    setLoading(true);
    try {
      if (videoEnabled) await initWebcam();
      initSpeechRecognition();

      const res = await fetch('https://mapito.onrender.com/api/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
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
    const answer = (finalTranscript + ' ' + interimTranscript).trim();
    if (!answer) return;

    setLoading(true);
    const history = conversation.map((msg) => `${msg.from}: ${msg.text}`).join('\n');

    try {
      const res = await fetch('https://mapito.onrender.com/api/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, answer, history }),
      });

      const data = await res.json();
      if (res.ok) {
        setConversation((prev) => [
          ...prev,
          { from: 'user', text: answer },
          { from: 'ai', text: data.message },
        ]);
        setFinalTranscript('');
        setInterimTranscript('');
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
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  return (
    <section className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 mt-10 mb-10">
        <div className="max-w-5xl mx-auto px-4">
          
          {/* Instructions Banner */}
          <div className="bg-indigo-600 text-white rounded-lg p-5 mb-6 shadow-md">
            <h2 className="text-xl font-semibold mb-2">How to Use the Mock Interview</h2>
            <p className="text-indigo-100 max-w-3xl">
              This tool helps you practice coding interviews by simulating real interview
              conversations with AI. Follow the steps below to get started and make the most
              of your practice session.
            </p>
          </div>

          {/* Step by Step Guidelines */}
          <div className="bg-white border border-indigo-300 rounded-lg p-6 mb-8 shadow-sm">
            <h3 className="text-lg font-semibold text-indigo-700 mb-4">Step-by-Step Guidelines</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Enter the job role you want to practice for (e.g., Frontend Developer).</li>
              <li>Toggle video on if you want to record yourself during the interview.</li>
              <li>Click "Start Interview" to begin the session.</li>
              <li>Press the microphone button to start/stop recording your spoken answers.</li>
              <li>Speak clearly, and your speech will appear in the input box as you talk.</li>
              <li>Once ready, click the send button to submit your answer and get AI feedback.</li>
              <li>Repeat the process to continue the mock interview with new questions.</li>
            </ol>
          </div>

          {/* Notice Board */}
          <div className="bg-red-500 text-white rounded-xl p-6 mb-6 shadow-lg border-l-8 border-yellow-300">
            <h2 className="text-2xl font-bold mb-3 uppercase tracking-wide">⚠️ Important Notice</h2>
            <p className="text-white text-lg leading-relaxed">
              In case of VPN issues, unstable internet connection or exceeding free tier limit of our AI, the interview system may not connect to the AI properly.
              <strong className="block mt-2 text-yellow-200">
                Instead, you will receive predefined questions and feedback created by the developer — not real-time AI responses.
              </strong>
              Please ensure a stable network or vpn connection for the best experience.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 md:p-10">
            <h1 className="text-3xl font-semibold text-gray-800 flex items-center mb-2">
              <FaRobot className="text-indigo-600 mr-3" />
              Improve Your Coding Interview Skills
            </h1>
            <p className="text-gray-600 mb-8">
              Practice your job interview skills using AI. Get instant feedback on your spoken or
              typed answers.
            </p>

            {!started ? (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Job Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Frontend Developer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => setVideoEnabled(!videoEnabled)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${videoEnabled
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                      }`}
                  >
                    <FaVideo />
                    {videoEnabled ? 'Video On' : 'Video Off'}
                  </button>
                </div>

                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-70"
                >
                  <FaPlay className="mr-2" />
                  {loading ? 'Starting...' : 'Start Interview'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {videoEnabled && (
                  <div className="relative h-64 bg-black rounded-lg overflow-hidden shadow-md">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={toggleRecording}
                      className={`absolute bottom-4 left-4 p-3 rounded-full text-white shadow-lg transition-colors ${isRecording ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
                      title={isRecording ? 'Stop Recording' : 'Start Recording'}
                    >
                      <FaMicrophone />
                    </button>
                  </div>
                )}

                <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 p-4 shadow-inner">
                  {conversation.map((msg, i) => (
                    <div
                      key={i}
                      className={`mb-4 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                      <div
                        className={`inline-flex items-start gap-2 p-3 rounded-lg max-w-[75%] break-words whitespace-pre-wrap ${msg.from === 'user'
                            ? 'bg-indigo-100 text-indigo-900 ml-auto'
                            : 'bg-gray-200 text-gray-800'
                          }`}
                      >
                        {msg.from === 'user' ? <FaUser /> : <FaRobot />}
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 items-end">
                  <textarea
                    rows={3}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder={
                      isRecording
                        ? 'Speaking... (microphone enabled)'
                        : 'Type or speak your answer here'
                    }
                    value={finalTranscript + interimTranscript}
                    onChange={(e) => {
                      if (!isRecording) {
                        setFinalTranscript(e.target.value);
                        setInterimTranscript('');
                      }
                    }}
                    disabled={isRecording}
                  />
                  <button
                    onClick={handleSendAnswer}
                    disabled={loading || !(finalTranscript.trim() || interimTranscript.trim())}
                    className="h-12 w-12 flex items-center justify-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    aria-label="Send Answer"
                  >
                    <FaPaperPlane />
                  </button>
                </div>

                {/* STOP INTERVIEW BUTTON */}
                <button
                  onClick={() => {
                    // Stop video stream
                    if (videoRef.current?.srcObject) {
                      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
                      videoRef.current.srcObject = null;
                    }
                    // Stop speech recognition
                    if (recognitionRef.current) {
                      recognitionRef.current.stop();
                    }
                    // Reset all state
                    setStarted(false);
                    setLoading(false);
                    setConversation([]);
                    setError('');
                    setIsRecording(false);
                    setFinalTranscript('');
                    setInterimTranscript('');
                  }}
                  className="mt-4 w-full flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <FaStop className="mr-2" />
                  Stop Interview
                </button>
              </div>
            )}

            {error && (
              <div className="mt-6 bg-red-100 text-red-800 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
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
