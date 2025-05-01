import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaInfoCircle, FaClipboardList, FaCode } from 'react-icons/fa';

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white w-full flex items-center justify-between py-4 px-6 md:px-12 fixed top-0 left-0 z-50 shadow"
    >
      {/* Logo */}
      <div className="text-2xl font-bold text-gray-900 cursor-pointer">Mapito</div>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-8 text-gray-700 font-semibold">
        <Link to="/" className="hover:text-indigo-600 transition-all duration-300">Home</Link>

        <button onclick={() => navigate("/aboutus")}>
        <Link to="/aboutus" className="hover:text-indigo-600 transition-all duration-300">About us</Link>
        </button>
        
        <button
          onClick={() => navigate("/signup")}
          className="cursor-pointer hover:text-indigo-600 transition-all duration-300"
        >
          Take quiz
        </button>
        <button onClick={() => navigate("/signup")}>
        <Link to="/code" className="hover:text-indigo-600 transition-all duration-300">Run code</Link>
        </button>
      </div>

      {/* Desktop Login Button */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          to="/login"
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-full text-sm font-medium transition-all duration-300"
        >
          Login
        </Link>
      </div>

      {/* Hamburger for Mobile */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Side Menu for Mobile */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-64 bg-white z-40 shadow-lg p-6 flex flex-col gap-6 md:hidden"
      >
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-indigo-600">Menu</span>
          <button onClick={toggleMenu}>
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <Link to="/" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3">
            <FaHome size={20} className="text-gray-600" />
            Home
          </Link>
   
          <button onclick={() => navigate("/aboutus")}>
          <Link to="/aboutus" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3">
            <FaInfoCircle size={20} className="text-gray-600" />
            About us
          </Link>
          </button>

          <button
            onClick={() => {
              toggleMenu();
              navigate("/signup");
            }}
            className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3"
          >
            <FaClipboardList size={20} className="text-gray-600" />
            Take quiz
          </button>


            <button
                onClick={() => {
                    toggleMenu();
                    navigate("/signup");
                }}>
          <Link to="/code" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3">
            <FaCode size={20} className="text-gray-600" />
            Run code
          </Link>
          </button>
          
          <Link
            to="/login"
            onClick={toggleMenu}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-full text-sm font-medium"
          >
            Login
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  );
}
