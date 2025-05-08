import React from 'react';
import { motion } from 'framer-motion';

const FAQ = () => {
  return (
    <div className=" bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* FAQ Section */}
        <motion.div 
          className=""
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: "What is Mapito?",
                answer: "It's a developer-focused platform that offers AI-generated roadmaps and interactive tools to help you learn, practice, and grow."
              },
              {
                question: "Is Mapito free?",
                answer: "Yes! Core features like roadmap generation, quizzes, summarize note, mock interview and code practice are free."
              },
              {
                question: "Can I customize my roadmap?",
                answer: "No, You can not edit or update your roadmap but you can download your roadmap with pdf file."
              },
              {
                question: "What makes Mapito different?",
                answer: "Mapito blends AI-generated plans with hands-on tools like a live code editor, quiz engine, typing test, summarize notes and mock interviews — all in one place."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-5 cursor-pointer list-none">
                    <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 text-gray-600">
                    {item.answer}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
