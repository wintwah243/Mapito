import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Navbar from "./Navbar";

const languageMap = {
  javascript: 63,
  python: 71,
  java: 62,
};

const questions = [
  {
    id: 1,
    title: "Greet Function",
    description: "Write a function greet(name) that returns 'Hello, name!'",
    difficulty: "Easy",
    tags: ["String", "Function"],
    testCases: [
      { input: "Alice", expectedOutput: "Hello, Alice!" },
      { input: "Bob", expectedOutput: "Hello, Bob!" },
    ],
    starterCode: {
      javascript: `function greet(name) {
  // Your code here
}`,
      python: `def greet(name):
    # Your code here`,
      java: `public class Main {
    public static String greet(String name) {
        // Your code here
    }

    public static void main(String[] args) {
        // Test code will be injected
    }
}`,
    },
  },
  {
    id: 2,
    title: "Add Two Numbers",
    description: "Write a function that returns the sum of two numbers.",
    difficulty: "Easy",
    tags: ["Math", "Function"],
    testCases: [
      { input: "3,5", expectedOutput: "8" },
      { input: "10,20", expectedOutput: "30" },
    ],
    starterCode: {
      javascript: `function add(a, b) {
  // Your code here
}`,
      python: `def add(a, b):
    # Your code here`,
      java: `public class Main {
    public static int add(int a, int b) {
        // Your code here
    }

    public static void main(String[] args) {
        // Test code will be injected
    }
}`,
    },
  },
  {
    id: 3,
    title: "Check Even or Odd",
    description: "Write a function that checks if a number is even or odd.",
    difficulty: "Easy",
    tags: ["Conditionals", "Math"],
    testCases: [
      { input: "4", expectedOutput: "Even" },
      { input: "7", expectedOutput: "Odd" },
    ],
    starterCode: {
      javascript: `function checkEvenOdd(n) {
  // Your code here
}`,
      python: `def check_even_odd(n):
    # Your code here`,
      java: `public class Main {
    public static String checkEvenOdd(int n) {
        // Your code here
    }

    public static void main(String[] args) {
        // Test code will be injected
    }
}`,
    },
  },
];


const CodeCompiler = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(questions[0].starterCode["javascript"]);
  const [output, setOutput] = useState("");

  const handleQuestionChange = (e) => {
    const question = questions.find((q) => q.id === parseInt(e.target.value));
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
              "X-RapidAPI-Key": "599386d3famshadd98fda4fff721p1825e5jsnfeda3c9d0c49",
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
              "X-RapidAPI-Key": "599386d3famshadd98fda4fff721p1825e5jsnfeda3c9d0c49",
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );

        const userOutput = result.data.stdout?.trim();
        const expected = testCase.expectedOutput;
        const pass = userOutput === expected;

        results.push({
          input: testCase.input,
          expected,
          output: userOutput,
          pass,
        });
      } catch {
        results.push({
          input: testCase.input,
          expected: testCase.expectedOutput,
          output: "Error",
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
    <div className="max-w-5xl mx-auto p-4 pt-20">
      <Navbar />

      {/* Question Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Choose Question:</label>
        <select
          className="border border-gray-300 rounded px-3 py-2"
          onChange={handleQuestionChange}
          value={selectedQuestion.id}
        >
          {questions.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-gray-600">{selectedQuestion.description}</p>
        <div className="text-sm">
          <strong>Difficulty:</strong> {selectedQuestion.difficulty}
        </div>
        <div className="text-sm">
          <strong>Tags:</strong>{" "}
          {selectedQuestion.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs mr-1"
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
          className="border border-gray-300 rounded px-3 py-2"
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
  );
};

export default CodeCompiler;
