import React from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaLaptopCode, FaClipboardCheck, FaFileAlt, FaKeyboard, FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const features = [
  {
    id: 1,
    title: 'Documentation Resources',
    description: 'Various resources to explore - all in one place.',
    icon: <FaBrain className="text-blue-500 text-2xl" />,
    link: '/documentation',
  },
  {
    id: 2,
    title: 'Code Compiler',
    description: 'Write, run, and debug code directly in your browser for hands-on practice.',
    icon: <FaLaptopCode className="text-blue-500 text-2xl" />,
    link: '/code',
  },
  {
    id: 3,
    title: 'Smart Quizzes',
    description: 'Test your understanding with quizzes that adapt to your progress.',
    icon: <FaClipboardCheck className="text-blue-500 text-2xl" />,
    link: '/quiz',
  },
  {
    id: 4,
    title: 'AI Note Summarizer',
    description: 'Turn long study notes into quick, readable summaries instantly.',
    icon: <FaFileAlt className="text-blue-500 text-2xl" />,
    link: '/summarize',
  },
  {
    id: 5,
    title: 'Typing Speed Test',
    description: 'Track and improve your typing speed with real-time feedback.',
    icon: <FaKeyboard className="text-blue-500 text-2xl" />,
    link: '/typing-test',
  },
  {
    id: 6,
    title: 'AI Mock Interview',
    description: 'Practice with job-specific questions and improve your interview skills.',
    icon: <FaComments className="text-blue-500 text-2xl" />,
    link: '/mock-interview',
  },
];

const Feature = () => {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 sm:text-4xl tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Additional Features
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Everything you need to learn, practice, and get job-ready — all in one place.
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex flex-col items-start">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{feature.description}</p>
                </div>
                <div className="mt-auto">
                  <Link
                    to={feature.link}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition"
                  >
                    Try it now →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feature;
