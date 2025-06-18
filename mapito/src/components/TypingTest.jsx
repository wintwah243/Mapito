import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const TypingTest = () => {
  const [quote, setQuote] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [testActive, setTestActive] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [charStats, setCharStats] = useState({ correct: 0, incorrect: 0 });
  const [wpmData, setWpmData] = useState([]);
  const [history, setHistory] = useState([]);

  const inputRef = useRef();
  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTest = () => {
    setUserInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(0);
    setTimeLeft(60);
    setTestActive(false);
    setTestComplete(false);
    setCharStats({ correct: 0, incorrect: 0 });
    setWpmData([]);
    clearTimer();
    inputRef.current.focus();
  };

  const fetchQuote = async () => {
    try {
      resetTest();
      const res = await axios.get("https://api.quotable.io/random?minLength=100&maxLength=200");
      setQuote(res.data.content);
    } catch (error) {
      console.error("Error fetching quote:", error);
      setQuote("The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!");
    }
  };

  useEffect(() => {
    fetchQuote();
    const storedHistory = JSON.parse(localStorage.getItem("typingHistory")) || [];
    setHistory(storedHistory);
    return () => clearTimer();
  }, []);

  useEffect(() => {
    if (testActive && timeLeft > 0 && !testComplete) {
      clearTimer();
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            return 0;
          }
          const elapsedSeconds = 60 - prev + 1;
          const minutes = elapsedSeconds / 60;
          const wordsTyped = charStats.correct / 5;
          const currentWpm = Math.round(wordsTyped / minutes);
          setWpmData((data) => [...data, { time: elapsedSeconds, wpm: currentWpm }]);
          return prev - 1;
        });
      }, 1000);
    }
    if ((timeLeft === 0 || testComplete) && testActive) {
      finishTest();
    }
  }, [testActive, timeLeft, testComplete]);

  const handleChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
    if (!testActive && value.length > 0) {
      setTestActive(true);
      setStartTime(Date.now());
    }
    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === quote[i]) correct++;
      else incorrect++;
    }
    setCharStats({ correct, incorrect });
    if (startTime) {
      const elapsedTime = (Date.now() - startTime) / 1000 / 60;
      const wordsTyped = correct / 5;
      setWpm(Math.round(wordsTyped / elapsedTime));
      setAccuracy(Math.round((correct / value.length) * 100));
    }
    if (value.length === quote.length) {
      setTestComplete(true);
    }
  };

  const finishTest = () => {
    setTestActive(false);
    clearTimer();
    const endTime = Date.now();
    const minutes = (endTime - startTime) / 1000 / 60;
    const words = charStats.correct / 5;
    const acc = userInput.length > 0 ? (charStats.correct / userInput.length) * 100 : 0;
    const result = { date: new Date().toLocaleString(), wpm: Math.round(words / minutes), accuracy: Math.round(acc) };
    const updatedHistory = [result, ...history.slice(0, 9)];
    localStorage.setItem("typingHistory", JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
    setWpm(result.wpm);
    setAccuracy(result.accuracy);
  };

  const getCharClass = (char, i) => {
    if (!userInput[i]) return "text-gray-400";
    if (userInput[i] === char) return "text-green-500 bg-green-50";
    if (i < userInput.length) return "text-red-500 bg-red-50 underline";
    return "text-gray-400";
  };

  return (
    <section>
      <div className="min-h-screen bg-white mt-20">
        <Navbar />
        <div className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Typing Speed Test</h1>
            <p className="text-gray-600 text-sm md:text-base">Improve your typing skills with random quotes</p>
          </div>

          {/* Guidelines / Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 shadow rounded-lg">
              <h2 className="font-semibold text-lg mb-2 text-blue-700">How It Works?</h2>
              <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
                <li>Test will automatically begin if you start typing quotes.</li>
                <li>WPM calculation will be displayed with charts and real time calculation</li>
                <li>Test will automatically stop when you finish typing quotes.</li>
                <li>Check out result and WPM with interactive charts.</li>
              </ul>
            </div>
            <div className="bg-white p-4 shadow rounded-lg">
              <h2 className="font-semibold text-lg mb-2 text-blue-700">Notice</h2>
              <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
                <li>Random quotes from quotable.io</li>
                <li>if unexpected error occurs, default quote will appear.</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden p-4 md:p-6 space-y-6">


            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-blue-600">Time Left</p>
                <p className="text-2xl font-bold text-blue-800">{testComplete ? "Done" : `${timeLeft}s`}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-green-600">WPM</p>
                <p className="text-2xl font-bold text-green-800">{wpm}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-purple-600">Accuracy</p>
                <p className="text-2xl font-bold text-purple-800">{accuracy}%</p>
              </div>
              <button onClick={fetchQuote} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold w-full md:w-auto">
                {testComplete ? "Try Again" : "Restart"}
              </button>
            </div>

            <div onClick={() => inputRef.current.focus()} className="bg-gray-100 border border-gray-300 rounded-lg p-4 md:p-6 h-40 md:h-52 overflow-y-auto text-sm md:text-lg leading-relaxed font-mono">
              {quote.split("").map((char, i) => (
                <span key={i} className={getCharClass(char, i)}>{char}</span>
              ))}
            </div>

            <textarea
              ref={inputRef}
              className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm md:text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              rows={4}
              placeholder={testComplete ? "Test completed! Click 'Try Again' to restart" : "Start typing here..."}
              value={userInput}
              onChange={handleChange}
              disabled={testComplete}
              autoFocus
            />

            {wpmData.length > 0 && (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={wpmData}>
                    <XAxis dataKey="time" label={{ value: "Time (s)", position: "insideBottomRight", offset: 0 }} />
                    <YAxis label={{ value: "WPM", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="wpm" stroke="#8884d8" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* {history.length > 0 && (
              <div className="bg-white p-4 rounded-xl shadow-md mt-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Personal Typing History</h2>
                <ul className="space-y-1 text-sm text-gray-600">
                  {history.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.date}</span>
                      <span>{item.wpm} WPM, {item.accuracy}% Accuracy</span>
                    </li>
                  ))}
                </ul>
              </div>
            )} */}
          </div>
        </div>
        <Footer />
      </div>
    </section>
  );
};

export default TypingTest;
