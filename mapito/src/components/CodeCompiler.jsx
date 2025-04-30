import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Navbar from "./Navbar";

const languageMap = {
  javascript: 63,
  python: 71,
  java: 62,
};

const defaultSnippets = {
  javascript: `// JavaScript Example
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("World"));`,
  python: `# Python Example
def greet(name):
    return "Hello, " + name + "!"

print(greet("World"))`,
  java: `// Java Example
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
};

const CodeCompiler = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(defaultSnippets["javascript"]);
  const [output, setOutput] = useState("");

  const runCode = async () => {
    try {
      const res = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: code,
          language_id: languageMap[language],
        },
        {
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": "599386d3famshadd98fda4fff721p1825e5jsnfeda3c9d0c49",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const token = res.data.token;
      setOutput("Running...");

      setTimeout(async () => {
        const result = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              "X-RapidAPI-Key": "599386d3famshadd98fda4fff721p1825e5jsnfeda3c9d0c49",
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );

        setOutput(result.data.stdout || result.data.stderr || "No Output");
      }, 2000);
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setCode(defaultSnippets[selectedLang]); // Load snippet
  };

  return (
    <div className="max-w-5xl mx-auto p-4 pt-20">
        <Navbar />
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <label htmlFor="language" className="text-sm font-medium text-gray-700">
          Choose Language:
        </label>
        <select
          id="language"
          onChange={handleLanguageChange}
          value={language}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-md">
        <Editor
          height="300px"
          language={language}
          value={code}
          onChange={(value) => setCode(value)}
          className="w-full"
        />
      </div>

      <button
        onClick={runCode}
        className="mt-4 bg-gray-900 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
      >
        Run Code
      </button>

      <div className="mt-6 bg-gray-900 text-white p-4 rounded-lg shadow-md">
        <h3 className="font-semibold mb-2">Output:</h3>
        <pre className="whitespace-pre-wrap break-words">{output}</pre>
      </div>
    </div>
  );
};

export default CodeCompiler;
