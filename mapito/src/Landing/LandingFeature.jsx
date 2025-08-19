import React from 'react';
import { motion } from 'framer-motion';

const processSteps = [
  {
    id: 1,
    title: 'Sign Up & Choose Your Goal',
    description: 'Create your account and select your learning objective.',
  },
  {
    id: 2,
    title: 'Generate Roadmap based on goals',
    description: 'Use our Mapito tool to build a learning path tailored to you.', 
  },
  {
    id: 3,
    title: 'Start Practicing with Various Tools',
    description: 'Ask our AI mentor, run code to practice, and take quizzes.',
  },
  {
    id: 4,
    title: 'Play Fun Coding Games & Relax',
    description: 'Improve and practice your coding skills by playing coding games.',
  }
];

const WorkingProcess = () => {
  return (
    <>
      <div className="mt-20 bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p 
            className="text-sm text-blue-600 font-medium uppercase tracking-wider"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            A Clear Process
          </motion.p>
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold text-gray-900 mt-4 leading-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our Working Process
          </motion.h2>
          <motion.p 
            className="mt-6 text-xl text-gray-500 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Simple steps to achieve your learning goals efficiently - from a roadmap to mock interview, a complete guide for developers
          </motion.p>
        </div>

        {/* Enhanced Timeline */}
        <div className="mt-24 relative">

          {/* Horizontal Timeline Line - Desktop */}
          <div className="hidden md:block absolute left-16 right-16 top-12 h-2 bg-gray-200 z-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 w-full h-full"></div>
          </div>

          {/* Steps Container */}
          <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-16 md:gap-8 lg:gap-16">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex flex-col items-center text-center relative w-full md:w-auto"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  {/* for Animated Dot */}
                  <motion.span
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-600 border-4 border-white z-20 shadow-lg"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: index * 0.3 }}
                  />
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-blue-100 flex items-center justify-center z-10 relative shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-6">{step.title}</h3>
                <p className="text-gray-500 mt-3 max-w-xs leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Vertical Timeline Line for Mobile view */}
          <div className="md:hidden absolute top-0 left-8 h-full z-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400 to-blue-500 rounded-full"></div>
            
            {/* dots between timeline */}
            {[0, 1, 2].map((dot) => (
              <div 
                key={dot}
                className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-blue-500"
                style={{ top: `${dot * 33.33 + 16.665}%` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkingProcess;
