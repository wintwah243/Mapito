import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaInfoCircle, FaClipboardList, FaCode, FaKeyboard, FaStickyNote, FaUserFriends, FaBook, FaBell } from 'react-icons/fa';
import { ChevronDown } from "lucide-react";

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false); //for toggle menu
  const navigate = useNavigate();
  const toggleMenu = () => setIsOpen(!isOpen); //for mobile view

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white w-full flex items-center justify-between py-4 px-6 md:px-12 fixed top-0 left-0 z-50 shadow"
    >
      {/* header */}
      <div className="text-2xl font-bold text-gray-900 cursor-pointer">Mapito</div>

      {/* Desktop Links */}
  <div className="hidden md:flex items-center gap-8 text-gray-700 font-semibold">
  <Link 
    to="/" 
    className="hover:text-indigo-600 transition-all duration-300 py-2 cursor-pointer"
  >
    Home
  </Link>

  <button
    onClick={() => navigate("/landingaboutus")}
    className="hover:text-indigo-600 transition-all duration-300 py-2 cursor-pointer"
  >
    About us
  </button>

    <button
    onClick={() => navigate("/landingdocumentation")}
    className="hover:text-indigo-600 transition-all duration-300 py-2 cursor-pointer"
  >
    Documentations
  </button>

    <button
    onClick={() => navigate("/landingnotice")}
    className="hover:text-indigo-600 transition-all duration-300 py-2 cursor-pointer"
  >
    Notice Board
  </button>
</div>

      {/* Desktop signup Button */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          to="/signup"
          className="bg-blue-600 text-white py-2 px-5 rounded-lg text-sm font-bold transition-all duration-300 cursor-pointer"
        >
          Sign Up Free
        </Link>
         <Link
          to="/login"
          className="bg-black text-white py-2 px-5 rounded-lg text-sm font-bold transition-all duration-300 cursor-pointer"
        >
          Login
        </Link>
      </div>

      {/* for responsive mobile view */}
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

      {/* Side Menu for Mobile view - no authentication check becos i have separated two files. Landing & Home */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-64 bg-white z-40 shadow-lg p-6 flex flex-col gap-6 md:hidden"
      >
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-black">Mapito</span>
{/*  <button onClick={toggleMenu}>
       <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button> */}
        </div>

        <div className="flex flex-col gap-4">
          <Link to="/" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3">
            <FaHome size={20} className="text-gray-600" />
            Home
          </Link>
   
          <button
           onClick={() => {
           toggleMenu();
           navigate("/landingaboutus");
            }}
            className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3 w-full text-left"
           >
          <FaInfoCircle size={20} className="text-gray-600" />
         About us
        </button>

          <button
                onClick={() => {
                    toggleMenu();
                    navigate("/landingdocumentation");
                }}
              className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3"
              >
            <FaBook size={20} className="text-gray-600" />
            Documentation
          </button>
          
          <button
                onClick={() => {
                    toggleMenu();
                    navigate("/landingnotice");
                }}
              className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3"
              >
            <FaBell size={20} className="text-gray-600" />
            Notice Board
          </button>

          {/* mobile view signup button */}
          <div className="flex flex-col gap-3 w-full">
          <Link
            to="/signup"
            onClick={toggleMenu}
            className="flex items-center justify-center bg-blue-600 text-white py-2 px-5 rounded-lg text-sm font-bold"
          >
            Sign Up Free
          </Link>
            
          <Link
            to="/login"
            onClick={toggleMenu}
            className="flex items-center justify-center bg-black text-white py-2 px-5 rounded-lg text-sm font-bold"
          >
            Login
          </Link>
          </div>
          
        </div>
      </motion.div>
    </motion.nav>
  );
};
