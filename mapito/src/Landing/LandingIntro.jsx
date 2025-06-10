import { motion } from "framer-motion";
import AI from '../assets/images/robot.png';
import { Link } from "react-router-dom";
import Bot from "../components/Bot";

export default function LandingIntro() {
     // make scroll effect
    const handleLearnMore = () => {
        const learnmoreSection = document.getElementById('learnmore');
        if (learnmoreSection) {
            learnmoreSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="mt-5 min-h-screen flex flex-col md:flex-row items-center justify-center bg-white px-6 py-12 relative overflow-hidden">
            {/* Left Text Content */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6 z-10 max-w-xl">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight"
                >
                    Plan and Achieve Your Journey with <span className="text-indigo-600">Mapito</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-gray-600 text-lg"
                >
                    Turn your goals into action with our AI-powered platform built to guide, 
                    test, and grow your potential — all in one place.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="flex gap-4 justify-center md:justify-start"
                >
                    <Link
                        to="/signup"
                        className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 cursor-pointer"
                    >
                        Get Started
                    </Link>
                    <button
                        onClick={handleLearnMore}
                        className="border border-gray-400 hover:bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300 cursor-pointer"
                    >
                        Learn More
                    </button>
                </motion.div>
            </div>

            {/* Right robot Image */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mt-10 md:mt-0"
            >
                <motion.img
                    src={AI}
                    alt="AI Robot"
                    className="w-full max-w-[400px] md:max-w-[500px] mx-auto md:ml-10 object-contain" 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                />
            </motion.div>

            {/* For the Bot Component */}
            <div className="absolute bottom-0 right-0 z-20">
                <Bot />
            </div>
        </section>
    );
}
