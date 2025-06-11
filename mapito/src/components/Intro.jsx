import { Link } from "react-router-dom";
import Bot from "./Bot";

export default function Intro() {

    const handleGetStarted = () => {
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            heroSection.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    const handleLearnMore = () => {
        const learnmoreSection = document.getElementById('learnmore');
        if (learnmoreSection) {
            learnmoreSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 relative overflow-hidden text-center sm:py-12 blue-diffused-background">
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl mx-auto pt-16 sm:pt-20 md:pt-0 pb-16 sm:pb-20 md:pb-0">

                {/* Feature Tag */}
                <div className="inline-flex items-center bg-gray-800 bg-opacity-70 text-blue-300 text-xs sm:text-sm md:text-base font-medium py-1.5 px-3 md:px-4 rounded-full mb-4 sm:mb-6 border border-blue-500/30 flex-wrap justify-center text-center max-w-xs sm:max-w-full">
                    <span className="text-blue-400 mr-2 text-xs">●</span>
                    <span className="whitespace-nowrap">Pls read this before using - </span>
                    <Link to="/notice" className="ml-1 underline whitespace-nowrap">notice board </Link>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold leading-tight mb-4 sm:mb-6 max-w-2xl sm:max-w-4xl mx-auto">
                    Plan and Achieve Your Journey with Mapito.
                </h1>

                {/* Subtitle */}
                <p className="text-gray-500 text-base sm:text-lg md:text-2xl mb-8 sm:mb-10 max-w-sm sm:max-w-2xl mx-auto">
                    Turn your goals into action with our AI-powered platform built to guide,
                    test, and grow your potential — all in one place.
                </p>

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-14 sm:mb-16 px-2 sm:px-0">

                    <button
                        onClick={handleGetStarted}
                        className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-300 text-base sm:text-xl border border-gray-600 cursor-pointer"
                    >
                        Get started for free
                    </button>

                    <button
                        onClick={handleLearnMore}
                        className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-300 text-base sm:text-xl cursor-pointer"
                    >
                        <svg className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12.93a1 1 0 00-1-1v-2a1 1 0 10-2 0v2a1 1 0 001 1h2zm4.364 12.364l-1.414 1.414a1 1 0 001.414 1.414l1.414-1.414a1 1 0 00-1.414-1.414zM18 10a1 1 0 00-1-1h-2a1 1 0 100 2h2a1 1 0 001-1zM6 10a1 1 0 00-1-1H3a1 1 0 100 2h2a1 1 0 001-1zm1.636 4.364l1.414-1.414a1 1 0 00-1.414-1.414l-1.414 1.414a1 1 0 001.414 1.414zM10 16a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1zm-4.364-1.636l1.414 1.414a1 1 0 001.414-1.414L7.636 12.364a1 1 0 00-1.414 1.414z" clipRule="evenodd" />
                        </svg>
                        Learn More
                    </button>
                </div>
            </div>

            {/* Bot */}
            <div className="absolute bottom-4 right-4 z-20">
                <Bot />
            </div>
        </section>
    );
};
