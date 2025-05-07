import React from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaChartLine, FaMobileAlt, FaReact, FaMoneyBillWave, FaHeadset } from 'react-icons/fa';

const features = [
    {
        title: 'Secure & Private',
        icon: <FaLock className="text-blue-600 text-3xl" />,
        desc: 'Your learning data is encrypted and kept safe with modern security standards.',
    },
    {
        title: 'AI-Powered Insights',
        icon: <FaChartLine className="text-green-600 text-3xl" />,
        desc: 'Get smart, personalized suggestions based on your goals and progress.',
    },
    {
        title: 'Fully Responsive',
        icon: <FaMobileAlt className="text-pink-600 text-3xl" />,
        desc: 'Access your roadmap anytime, anywhere — optimized for all devices.',
    },
    {
        title: 'Built with React',
        icon: <FaReact className="text-cyan-500 text-3xl" />,
        desc: 'Crafted with the latest React stack for fast, scalable performance.',
    },
    {
        title: 'Wide Range of Tools',
        icon: <FaMoneyBillWave className="text-yellow-500 text-3xl" />,
        desc: 'Offer various tools to make your learning journey fun and productive along the way.',
    },
    {
        title: 'Support & Guidance',
        icon: <FaHeadset className="text-indigo-600 text-3xl" />,
        desc: 'Need help? Our Mapito AI Chat Bot is ready to assist you whenever you need it.',
    },
];

const LearnMore = () => {
    return (
        <section id='learnmore'>
            <div className="bg-white px-6 py-12 max-w-7xl mx-auto text-gray-800">

                {/* Title and Description */}
                <div className="text-center mb-12">
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold mb-4"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}>
                        Discover the Power of <span className='text-indigo-700'>Mapito</span>
                    </motion.h1>

                    <motion.p
                        className="text-lg text-gray-600 max-w-xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}>
                        Our project is designed to help you create personalized learning roadmaps and achieve your goals with the power of AI.
                    </motion.p>
                </div>

                {/* for features grid UI */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((item, i) => (
                        <motion.div
                            key={i}
                            className="bg-gray-100 p-6 rounded-2xl shadow hover:shadow-lg transition duration-300"
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}>

                            <div className="mb-3">{item.icon}</div>
                            <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Mission Section */}
                <motion.div
                    className="mt-20 bg-blue-50 p-10 rounded-xl text-center shadow-inner"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}>
                    <h2 className="text-3xl font-bold mb-4">
                        Our Mission
                    </h2>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                    At Mapito, we believe that achieving success should be an empowering and
                    straightforward journey. That’s why we created a platform that makes building
                    your personalized roadmap easy and accessible. Whether you're working towards
                    short-term goals or planning for long-term success, Mapito is here to support
                    and guide you at every step.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default LearnMore;
