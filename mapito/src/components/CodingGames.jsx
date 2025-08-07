import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Puzzle, Bug, Terminal, Keyboard, Layers } from "lucide-react"; 

const games = [
  { id: 1, title: "Guess the Output", description: "Predict the result of a code snippet." },
  { id: 2, title: "Code Order Game", description: "Drag and drop code blocks in the correct order." },
  { id: 3, title: "Find the Bug", description: "Spot the error in the code and fix it." },
  { id: 4, title: "Fill in the Blanks", description: "Complete the missing parts of code." },
  { id: 5, title: "True or False", description: "Decide whether the statements about code are true or false." },
  { id: 6, title: "Match the Output", description: "Match code snippets with their correct output." },
  { id: 7, title: "Code Typing Speed", description: "Type code snippets accurately and quickly." },
  { id: 8, title: "Debug Console", description: "Simulated console to test and debug mini code snippets." },
  { id: 9, title: "Code Flashcards", description: "Flip flashcards to review coding questions and answers." },
  { id: 10, title: "Concept Puzzle", description: "Solve puzzles based on programming concepts." },
];

const icons = [Puzzle, Layers, Bug, Keyboard, Terminal]; 

const CodingGames = () => {
  const navigate = useNavigate();

  const handleGameClick = (id) => {
    navigate(`/games/game${id}`);
  };

  return (
    <section className="min-h-screen bg-white mt-20">
      <Navbar />
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center text-gray-800">
          Coding Game Challenge
        </h1>
        <p className="text-center text-gray-600 text-lg mb-10">
          Play fun mini-games designed to sharpen your programming skills through interactive puzzles,
          problem-solving, typing, and logic challenges.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, idx) => {
            const Icon = icons[idx % icons.length];

            return (
              <div
                key={game.id}
                className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition-all cursor-pointer border border-gray-200 group"
                onClick={() => handleGameClick(game.id)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                    {game.title}
                  </h2>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{game.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CodingGames;
