import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { quizQuestions } from "../utils/data";

const languageMap = {
  javascript: 63,
  python: 71,
  java: 62,
};

const CodeCompiler = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(quizQuestions[0]);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(quizQuestions[0].starterCode["javascript"]);
  const [output, setOutput] = useState("");

  const handleQuestionChange = (e) => {
    const question = quizQuestions.find((q) => q.id === parseInt(e.target.value));
    setSelectedQuestion(question);
    setCode(question.starterCode[language]);
    setOutput("");
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(selectedQuestion.starterCode[newLang]);
    setOutput("");
  };

  const runCode = async () => {
    setOutput("Running tests...");
    const results = [];

    for (const testCase of selectedQuestion.testCases) {
      let fullCode = "";

      if (language === "javascript") {
        fullCode = `${code}\nconsole.log(greet("${testCase.input}"));`;
      } else if (language === "python") {
        fullCode = `${code}\nprint(greet("${testCase.input}"))`;
      } else if (language === "java") {
        const mainCode = code.replace(
          "// Test code will be injected",
          `System.out.println(greet("${testCase.input}"));`
        );
        fullCode = mainCode;
      }

      try {
        const submission = await axios.post(
          "https://judge0-ce.p.rapidapi.com/submissions",
          {
            source_code: fullCode,
            language_id: languageMap[language],
          },
          {
            headers: {
              "content-type": "application/json",
              "X-RapidAPI-Key": import.meta.env.VITE_JUDGE0_API,
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );

        const token = submission.data.token;
        await new Promise((res) => setTimeout(res, 2000));

        const result = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_JUDGE0_API,
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );

        let userOutput = (result.data.stdout || "").trim();
        let expectedOutput = String(testCase.expectedOutput).trim();

        const normalize = (str) => str.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();
        const normalizedUserOutput = normalize(userOutput);
        const normalizedExpected = normalize(expectedOutput);

        const pass = normalizedUserOutput === normalizedExpected;

        results.push({
          input: testCase.input,
          expected: expectedOutput,
          output: userOutput,
          pass,
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          expected: String(testCase.expectedOutput),
          output: "Error: " + (error.response?.data?.message || "Unknown error"),
          pass: false,
        });
      }
    }

    const finalOutput = results
      .map(
        (r, i) => `Test Case ${i + 1}:
  Input: ${r.input}
  Expected: ${r.expected}
  Output: ${r.output}
  Result: ${r.pass ? "✅ Passed" : "❌ Failed"}\n`
      )
      .join("\n");

    setOutput(finalOutput);
  };

  return (
    <section className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* Banner */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Interactive Code Playground</h1>
          <p className="text-gray-600 text-md max-w-2xl mx-auto">
            Write, run, and test your code directly in the browser. Learn, debug, and challenge yourself with real-time coding problems.
          </p>
        </div>

        {/* Supported Technologies */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {["JavaScript", "Python", "Java"].map((tech) => (
            <span key={tech} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
               {tech} Supported
            </span>
          ))}
        </div>

        {/* Guidelines / Tips */} 
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  <div className="bg-white p-4 shadow rounded-lg">
    <h2 className="font-semibold text-lg mb-2 text-blue-700"> Tips & Guidelines</h2>
    <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
      <li>Select a coding question and preferred language below.</li>
      <li>The starter code is pre-filled based on language selection.</li>
      <li>Click "Run Code" to test your function against test cases.</li>
      <li>Check output and passed/failed results below the editor.</li>
    </ul>
  </div>

  <div className="bg-white p-4 shadow rounded-lg">
    <h2 className="font-semibold text-lg mb-2 text-blue-700"> Environment Info</h2>
    <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
      <li>Runs on Judge0 API with real-time output.</li>
      <li>Supports JavaScript, Python, and Java.</li>
      <li>Each test case is evaluated independently.</li>
      <li>Errors and output are shown below the editor.</li>
    </ul>
  </div>
</div>


        {/* Question + Language Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-medium text-sm mb-1"> Choose a Question:</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              value={selectedQuestion.id}
              onChange={handleQuestionChange}
            >
              {quizQuestions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-600">{selectedQuestion.description}</p>
            <div className="text-sm mt-2">
              <strong>Difficulty:</strong>{" "}
              {selectedQuestion.difficulty === "Easy" ? (
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs ml-1">Easy</span>
              ) : (
                <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs ml-1">Difficult</span>
              )}
            </div>
            <div className="text-sm mt-1">
              <strong>Tags:</strong>{" "}
              {selectedQuestion.tags.map((tag, idx) => (
                <span key={idx} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs mr-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium text-sm mb-1"> Choose Language:</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
          </div>
        </div>

        {/* Editor */}
        <div className="border border-gray-300 rounded-lg shadow mb-6 overflow-hidden">
          <Editor
            height="300px"
            language={language}
            value={code}
            onChange={(val) => setCode(val)}
            theme="vs-dark"
          />
        </div>

        {/* Run Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={runCode}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow"
          >
            ▶️ Run Code
          </button>
        </div>

        {/* Output Panel */}
        <div className="bg-black text-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Output</h3>
          <pre className="whitespace-pre-wrap text-sm">{output}</pre>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default CodeCompiler;
