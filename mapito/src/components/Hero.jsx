import React, { useState } from 'react';

const Hero = () => {
  const [goal, setGoal] = useState('');
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal }),
      });

      const data = await response.json();

      // Split the roadmap into steps
      const steps = data.roadmap
        .split('\n')
        .map(step => step.trim())
        .filter(step => step.length > 0);

      setRoadmap(steps);
    } catch (error) {
      console.error('Error generating roadmap:', error);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-indigo-100 to-white">
      <h1 className="text-4xl font-bold text-center mb-6">Mapito 🚀</h1>
      <p className="text-lg text-gray-600 mb-6 text-center max-w-2xl">
      Mapito empowers individuals to transform complex visions into structured, actionable roadmaps, providing clarity, direction, and a powerful foundation for achieving meaningful goals
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <input
          type="text"
          className="border border-gray-300 rounded-md p-3 flex-1"
          placeholder="Enter your goal (e.g., Frontend Developer)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md p-3 font-semibold"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {roadmap.length > 0 && (
        <div className="mt-8 p-6 rounded-md  w-full max-w-2xl text-left">
          <h2 className="text-2xl font-semibold mb-6 text-center">Your Roadmap</h2>

          <ol className="relative border-l-2 border-indigo-400 ml-4">
            {roadmap.map((step, index) => (
              <li key={index} className="mb-10 ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-indigo-400 rounded-full ring-8 ring-indigo-100">
                  {index + 1}
                </span>
                <h3 className="font-medium leading-tight text-lg text-indigo-800">{step}</h3>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Hero;
