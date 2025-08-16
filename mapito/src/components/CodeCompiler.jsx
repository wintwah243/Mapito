import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const languageMap = {
  javascript: 63,
  python: 71,
  java: 62,
};

const starterCode = {
  javascript: "// Write your JavaScript code here\nconsole.log('Hello World!');",
  python: "# Write your Python code here\nprint('Hello World!')",
  java: `// Write your Java code here
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World!");
  }
}`
};

const CodeCompiler = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(starterCode["javascript"]);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(starterCode[newLang]);
    setOutput("");
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running code...");
    
    try {
      const submission = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: code,
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

      const stdout = result.data.stdout || "";
      const stderr = result.data.stderr || "";
      const compileOutput = result.data.compile_output || "";
      
      let finalOutput = "";
      if (stdout) finalOutput += `Output:\n${stdout}\n`;
      if (stderr) finalOutput += `Error:\n${stderr}\n`;
      if (compileOutput) finalOutput += `Compilation:\n${compileOutput}\n`;
      
      if (!finalOutput) finalOutput = "No output generated";
      
      setOutput(finalOutput);
    } catch (error) {
      setOutput("Error: " + (error.response?.data?.message || "Unknown error"));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen mt-10">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* Banner */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Interactive Code Playground</h1>
          <p className="text-gray-600 text-md max-w-2xl mx-auto">
            Write, run, and test your code directly in our code editor. Learn, test, and challenge yourself with real-time code compiler.
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

        {/* Language Selector */}
        <div className="mb-6">
          <label className="block font-medium text-sm mb-1">Choose Language:</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white max-w-xs"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        {/* Editor */}
        <div className="border border-gray-300 rounded-lg shadow mb-6 overflow-hidden">
          <Editor
            height="400px"
            language={language}
            value={code}
            onChange={(val) => setCode(val)}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              scrollBeyondLastLine: false
            }}
          />
        </div>

        {/* Run Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={runCode}
            disabled={isRunning}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow ${
              isRunning ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isRunning ? "Running..." : "▶️ Run Code"}
          </button>
        </div>

        {/* Output Panel */}
        <div className="bg-black text-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Output</h3>
            <button 
              onClick={() => setOutput("")} 
              className="text-gray-300 hover:text-white text-sm"
            >
              Clear
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm font-mono overflow-auto max-h-64">
            {output || "Your output will appear here..."}
          </pre>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default CodeCompiler;
