import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaInfoCircle, FaClipboardList, FaCode, FaKeyboard, FaStickyNote, FaUserFriends, FaBook, FaBell } from 'react-icons/fa';
import { ChevronDown } from "lucide-react";

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false); //for toggle menu
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false); //for dropdown on desktop view
  const toggleMenu = () => setIsOpen(!isOpen); //for mobile view

  // used for dropdown menu
  const dropdownRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        //check user clicked item is inside the dropdown
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      //cleanup function
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

     //for desktop view
    const NavDropdownItem = ({ to, text, icon }) => (
      <button
        //no authentication check becos i have separated two files. Landing & Home
        onClick={() => navigate("/signup")}
        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
      >
        <span className="mr-3 text-gray-400">{icon}</span>
        <span>{text}</span>
      </button>
    );

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white w-full flex items-center justify-between py-4 px-6 md:px-12 fixed top-0 left-0 z-50 shadow"
    >
      {/* header--projectName */}
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

  {/* Dropdown for various features */}
  <div className="relative group" onMouseLeave={() => setDropdownOpen(false)}>
    <button
      className="flex items-center gap-1 hover:text-indigo-600 transition-all duration-300 py-2"
      onClick={() => setDropdownOpen(!dropdownOpen)}
      aria-expanded={dropdownOpen}
      aria-haspopup="true"
    >
      <span className="cursor-pointer">Features</span>
      <ChevronDown
        className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
      />
    </button>

    {/* Dropdown Menu on desktop view */}
    {dropdownOpen && (
      <div
        className="absolute left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2"
        ref={dropdownRef}
      >
        <NavDropdownItem
          to="/quiz"
          text="Quizzes"
          icon={<FaClipboardList className="w-5 h-5" />}
        />
        <NavDropdownItem
          to="/code"
          text="Problems"
          icon={<FaCode className="w-5 h-5" />}
        />
        <NavDropdownItem
          to="/typing-test"
          text="TypeTest"
          icon={<FaKeyboard className="w-5 h-5" />}
        />
        <NavDropdownItem
          to="/summarize"
          text="QuickNotes"
          icon={<FaStickyNote className="w-5 h-5" />}
        />
        <NavDropdownItem
          to="/mock-interview"
          text="Mock Interview"
          icon={<FaUserFriends className="w-5 h-5" />}
        />
      </div>
    )}
  </div>

    <button
    onClick={() => navigate("/signup")}
    className="hover:text-indigo-600 transition-all duration-300 py-2 cursor-pointer"
  >
    Documentations
  </button>

    <button
    onClick={() => navigate("/notice")}
    className="hover:text-indigo-600 transition-all duration-300 py-2 cursor-pointer"
  >
    Notice Board
  </button>
</div>

      {/* Desktop signup Button */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          to="/signup"
          className="bg-indigo-500 text-white py-2 px-5 rounded-lg text-sm font-medium transition-all duration-300"
        >
          Sign Up Free
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
          <span className="text-2xl font-bold text-indigo-600">Mapito</span>
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
              navigate("/signup");
            }}
            className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3"
          >
            <FaClipboardList size={20} className="text-gray-600" />
            Quizzes
          </button>

            <button
                onClick={() => {
                    toggleMenu();
                    navigate("/signup");
                }}
              className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3"
              >
            <FaCode size={20} className="text-gray-600" />
            Problems
          </button>

          <button
                onClick={() => {
                    toggleMenu();
                    navigate("/signup");
                }}
              className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3"
              >
            <FaKeyboard size={20} className="text-gray-600" />
            Typing test
          </button>

          <button
                onClick={() => {
                    toggleMenu();
                    navigate("/signup");
                }}
              className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3"
              >
            <FaStickyNote size={20} className="text-gray-600" />
            QuickNotes
          </button>

          <button
                onClick={() => {
                    toggleMenu();
                    navigate("/signup");
                }}
              className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3"
              >
            <FaUserFriends size={20} className="text-gray-600" />
            Mock Interview
          </button>

          <button
                onClick={() => {
                    toggleMenu();
                    navigate("/signup");
                }}
              className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3"
              >
            <FaBook size={20} className="text-gray-600" />
            Documentation
          </button>


          <button
                onClick={() => {
                    toggleMenu();
                    navigate("/notice");
                }}
              className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3"
              >
            <FaBell size={20} className="text-gray-600" />
            Notice Board
          </button>

          {/* mobile view signup button */}
          <Link
            to="/signup"
            onClick={toggleMenu}
            className="flex items-center justify-center bg-indigo-500 text-white py-2 px-5 rounded-lg text-sm font-medium"
          >
            Sign Up Free
          </Link>
          
        </div>
      </motion.div>
    </motion.nav>
  );
};
