import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Mapito?",
      answer: "It's a developer-focused platform that offers AI-generated roadmaps and interactive tools to help you learn, practice, and grow."
    },
    {
      question: "Is Mapito free?",
      answer: "Yes! Core features like roadmap generation, quizzes, and code practice are free."
    },
    {
      question: "Can I customize my roadmap?",
      answer: "No, You can not edit or update your roadmap but you can download your roadmap with pdf file."
    },
    {
      question: "What makes Mapito different?",
      answer: "Mapito blends AI-generated plans with hands-on tools like a live code editor, quiz engine, typing test, summarize notes and mock interviews — all in one place."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex justify-between items-center w-full p-5 cursor-pointer"
                >
                  <h3 className="text-lg font-medium text-gray-900 text-left">{item.question}</h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-5 text-gray-600">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Support Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-6 md:px-12 text-center mt-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Need Further Assistance?
        </h2>
        <p className="text-gray-700 mb-8 max-w-xl mx-auto">
          Our support team is ready to help you with any questions or issues.
          Connect with us directly through Telegram or Email for the fastest response.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <a
            href="https://t.me/shishi_ww"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4.5-1.032L3 20l1.5-4.5A8.94 8.94 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Connect on Telegram
          </a>

          <a
            href="mailto:wahwint72@gmail.com"
            className="px-6 py-3 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-900 transition"
          >
            Email Support
          </a>
        </div>

        <p className="text-sm text-gray-500">We typically respond within minutes during business hours.</p>
      </div>

    </div>
  );
};

export default FAQ;
