import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const games = [
  {
    id: 1,
    title: "Guess the Output",
    description: "Predict the result of a code snippet.",
    image: "https://i.pinimg.com/736x/2a/c5/ca/2ac5caf5b83c11fd103f239030db9949.jpg",
  },
  {
    id: 2,
    title: "Code Order Game",
    description: "Drag and drop code blocks in the correct order.",
    image: "https://i.pinimg.com/736x/e8/5e/ef/e85eefb675b633a0a4b10a0001822ec5.jpg",
  },
  {
    id: 3,
    title: "Find the Bug",
    description: "Spot the error in the code and fix it.",
    image: "https://i.pinimg.com/originals/6d/80/2f/6d802ffd14b32795b4deb0b886a7815a.gif",
  },
  {
    id: 4,
    title: "Fill in the Blanks",
    description: "Complete the missing parts of code.",
    image: "https://i.pinimg.com/736x/63/61/80/6361803f3e957e6f300c2e65858ee062.jpg",
  },
  {
    id: 5,
    title: "True or False",
    description: "Decide whether the statements about code are true or false.",
    image: "https://i.pinimg.com/1200x/7b/51/73/7b51738124dd0eb93c80a62054f8fa74.jpg",
  },
  {
    id: 6,
    title: "Code Flashcards",
    description: "Flip flashcards to review coding questions and answers.",
    image: "https://i.pinimg.com/1200x/c5/95/e7/c595e76937cc3c9036b516da05cfb3f0.jpg",
  },
  {
    id: 7,
    title: "Concept Puzzle",
    description: "Solve puzzles based on programming concepts.",
    image: "https://i.pinimg.com/1200x/45/0f/a3/450fa347ec26c47b6a832d8fbf4ca81f.jpg",
  },
];

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
          {games.map((game) => (
            <div
              key={game.id}
              className="p-2 bg-white rounded-2xl shadow hover:shadow-xl transition-all cursor-pointer border border-gray-200 group"
              onClick={() => handleGameClick(game.id)}
            >
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-50 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform"
              />
              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 mb-2">
                {game.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {game.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CodingGames;
