import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Navbar from "./Navbar";
import { quizQuestions } from "../utils/data";
import Footer from "./Footer";

//language ID by judge0
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
        await new Promise((res) => setTimeout(res, 2000)); // Wait for Judge0 to process
  
        const result = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_JUDGE0_API,
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );
  
        // Improved output handling
        let userOutput = result.data.stdout || "";
        if (typeof userOutput !== "string") {
          userOutput = String(userOutput);
        }
        userOutput = userOutput.trim();
        
        let expectedOutput = testCase.expectedOutput;
        if (typeof expectedOutput !== "string") {
          expectedOutput = String(expectedOutput);
        }
        expectedOutput = expectedOutput.trim();
  
        // Normalize line endings and remove any extra whitespace
        const normalize = (str) => str.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
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
        console.error("Error running code:", error);
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
     <section>
    <div className="max-w-5xl mx-auto p-4 pt-20 mt-5 mb-20">
      <Navbar />

      {/* Header */}
      <div className="container mx-auto px-6 text-center">
          <h1 className="text-gray-900 text-3xl font-bold mb-6">Solve and Run code Here</h1>
          <p className="text-gray-400 text-sm max-w-3xl mx-auto">
          Write, solve, and run your code instantly using our interactive code editor below.
          </p>
        </div>

      {/* selector for question tags */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Choose Question:</label>
        <select
          className="border border-indigo-600 rounded px-3 py-2"
          onChange={handleQuestionChange}
          value={selectedQuestion.id}
        >
          {quizQuestions.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-gray-600">{selectedQuestion.description}</p>
        <div className="text-sm mb-2">
          <strong>Difficulty:</strong> {selectedQuestion.difficulty == "Easy" ?
           <span className="bg-green-200 text-gray-900 px-2 py-1 rounded text-xs mr-1">Easy</span>
            : <span className="bg-red-200 text-gray-900 px-2 py-1 rounded text-xs mr-1">Diffcult</span>
            }
        </div>

        <div className="text-sm">
          <strong>Tags:</strong>{" "}
          {selectedQuestion.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-purple-200 text-gray-800 px-2 py-1 rounded text-xs mr-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Language Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Choose Language:</label>
        <select
          className="border bg-gray-200 border-gray-300 rounded px-3 py-2"
          onChange={handleLanguageChange}
          value={language}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>

      {/* Code Editor */}
      <div className="border rounded overflow-hidden shadow">
        <Editor
          height="300px"
          language={language}
          value={code}
          onChange={(val) => setCode(val)}
        />
      </div>

      {/* Run Button */}
      <button
        className="mt-4 bg-gray-900 text-white px-6 py-2 rounded"
        onClick={runCode}
      >
        Run Code
      </button>

      {/* Output */}
      <div className="mt-6 bg-black text-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Output:</h3>
        <pre className="whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
       
    {/* Footer */}
    <Footer />
    </section>
  );
};

export default CodeCompiler;
