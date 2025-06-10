import { motion } from "framer-motion";
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
        <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden text-center sm:py-12 blue-diffused-background">
            {/* Blue glowing sphere background */}
            {/* <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-4xl h-150 rounded-full bg-blue-500 opacity-20 blur-3xl transform scale-150"></div>
                <div className="absolute w-1/2 h-1/2 rounded-full bg-blue-400 opacity-10 blur-3xl transform scale-125"></div>
            </div> */}

            {/* Content above the sphere */}
            <div className="relative z-10 flex flex-col items-center justify-center max-w-7xl mx-auto pt-16 sm:pt-20 md:pt-0 pb-16 sm:pb-20 md:pb-0">
                {/* New Feature Tag */}
                <div className="inline-flex items-center bg-gray-800 bg-opacity-70 text-blue-300 text-sm md:text-base font-medium py-2 px-3 md:px-4 rounded-full mb-6 md:mb-8 border border-blue-500/30 text-center flex-wrap justify-center">
                    <span className="text-blue-400 mr-2 text-xs">●</span>
                    <span className="whitespace-nowrap">Mapito is developed and managed by - </span>
                    <a href="https://shiportfolio.onrender.com/" target="_blank" className="ml-0 md:ml-2 mr-2 underline whitespace-nowrap">Wint Wah</a>
                    {/* <svg className="w-4 h-4 text-blue-400 mt-1 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg> */}
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 max-w-4xl mx-auto">
                    Plan and Achieve Your Journey with Mapito.
                </h1>

                {/* Subtitle */}
                <p className="text-gray-500 text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
                    Turn your goals into action with our AI-powered platform built to guide,
                    test, and grow your potential — all in one place.
                </p>

                {/* buttons */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-16 justify-center">

                    <Link to="/signup" className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 text-xl border border-gray-600 cursor-pointer">
                        Get started for free
                    </Link>

                    <button onClick={handleLearnMore} className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 text-xl cursor-pointer">
                        <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12.93a1 1 0 00-1-1v-2a1 1 0 10-2 0v2a1 1 0 001 1h2zm4.364 12.364l-1.414 1.414a1 1 0 001.414 1.414l1.414-1.414a1 1 0 00-1.414-1.414zM18 10a1 1 0 00-1-1h-2a1 1 0 100 2h2a1 1 0 001-1zM6 10a1 1 0 00-1-1H3a1 1 0 100 2h2a1 1 0 001-1zm1.636 4.364l1.414-1.414a1 1 0 00-1.414-1.414l-1.414 1.414a1 1 0 001.414 1.414zM10 16a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1zm-4.364-1.636l1.414 1.414a1 1 0 001.414-1.414L7.636 12.364a1 1 0 00-1.414 1.414z" clipRule="evenodd"></path>
                        </svg>
                        Learn More
                    </button>

                </div>
            </div>

            {/* For the Bot Component */}
            <div className="absolute bottom-0 right-0 z-20">
                <Bot />
            </div>
        </section>
    );
}
