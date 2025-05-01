import { motion } from 'framer-motion';
import { FaCogs, FaClipboardList, FaCalendarCheck, FaCheckCircle } from 'react-icons/fa';

const steps = [
  {
    id: 1,
    title: 'Generate Your Roadmap',
    description: 'Use AI to create a personalized learning path tailored to your goals.',
    icon: <FaCogs size={24}/>
  },
  {
    id: 2,
    title: 'Take Skill Quizzes',
    description: 'Validate your knowledge and track progress with interactive quizzes.',
    icon: <FaClipboardList size={24} />
  },
  {
    id: 3,
    title: 'Chat With AI Assistant',
    description: 'Ask questions and get instant support from Mapito smart chatbot.',
    icon: <FaCalendarCheck size={24}/>
  },
  {
    id: 4,
    title: 'Practice in Code Editor',
    description: 'Write and run code directly in your browser to sharpen your skills.',
    icon: <FaCheckCircle size={24}/>
  }
];

export default function LandingFeature() {
  return (
    <div className="mt-20 bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">A Clear Process</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Our Working Process</h2>
      </div>

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className="flex flex-col items-center text-center relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            {index !== steps.length - 1 && (
              <div className="absolute hidden lg:block top-5 right-[-60%] w-full h-1 border-t-2 border-dashed border-gray-900 z-0"></div>
            )}

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold mb-4 shadow-lg flex-shrink-0 mx-auto">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}