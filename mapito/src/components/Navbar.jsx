import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import CharAvatar from "../utils/CharAvatar";
import { FaHome, FaInfoCircle, FaClipboardList, FaCode, FaKeyboard, FaStickyNote, FaUserFriends, FaBook, FaBell  } from 'react-icons/fa';
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const loadUserData = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setIsAuthenticated(!!token);
      setUserName(user.fullName || "");
      setProfilePic(user.profileImageUrl || "");
    };
    
    loadUserData();
    
    const handleProfileUpdate = () => loadUserData();
    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserName("");
    setProfilePic("");
    navigate("/");
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

const NavDropdownItem = ({ to, isAuthenticated, text, icon }) => (
  <button
    onClick={() => navigate(isAuthenticated ? to : "/signup")}
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
      {/* Header - projectname */}
      <div className="text-2xl font-bold text-gray-900 cursor-pointer">Mapito</div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8 text-gray-700 font-semibold">
        <Link to="/home" className="hover:text-indigo-600 transition-all duration-300 py-2 cursor-pointer">Home</Link>
        <Link to="/aboutus" className="hover:text-indigo-600 transition-all duration-300 py-2 cursor-pointer">About us</Link>

        {/* dropdown for various features */}
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
                isAuthenticated={isAuthenticated}
                text="Quizzes"
                icon={<FaClipboardList className="w-5 h-5" />}
              />
              <NavDropdownItem
                to="/code"
                isAuthenticated={isAuthenticated}
                text="Problems"
                icon={<FaCode className="w-5 h-5" />}
              />
              <NavDropdownItem
                to="/typing-test"
                isAuthenticated={isAuthenticated}
                text="TypeTest"
                icon={<FaKeyboard className="w-5 h-5" />}
              />
              <NavDropdownItem
                to="/summarize"
                isAuthenticated={isAuthenticated}
                text="QuickNotes"
                icon={<FaStickyNote className="w-5 h-5" />}
              />
              <NavDropdownItem
                to="/mock-interview"
                isAuthenticated={isAuthenticated}
                text="Mock Interview"
                icon={<FaUserFriends className="w-5 h-5" />}
              />
            </div>
          )}
        </div>

         <Link 
           to="/documentation" 
           className="hover:text-indigo-600 transition-all duration-300 py-2 cursor-pointer">
           Documentations
         </Link>

         <Link 
           to="/notice" 
           className="hover:text-indigo-600 transition-all duration-300 py-2 cursor-pointer">
           Notice Board
         </Link>

      </div>

      {/* for user profile pic on desktop view */}
      <div className="hidden md:flex items-center gap-4">
        {isAuthenticated ? (
          <>
            {profilePic ? (
              <img
                src={`${profilePic}?${new Date().getTime()}`}
                alt="Profile"
                className="w-12 h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all object-cover"
                onClick={() => navigate("/userinfo")}
                onError={() => setProfilePic("")}
              />
            ) : (
              <div className="cursor-pointer" onClick={() => navigate("/userinfo")}>
                <CharAvatar fullName={userName} width="w-12" height="h-12" />
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-indigo-200 text-white py-2 px-5 rounded-lg text-sm font-medium transition-all duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-indigo-500 hover:bg-indigo-200 text-white py-2 px-5 rounded-lg text-sm font-medium transition-all duration-300"
          >
            Login
          </Link>
        )}
      </div>

      {/* for Mobile view */}
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
          <span className="text-2xl font-bold text-black">Mapito</span>
          <button onClick={toggleMenu}>
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <Link to="/home" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3">
            <FaHome size={20} className="text-gray-600" />
            Home
          </Link>

          <Link to="/aboutus" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3">
            <FaInfoCircle size={20} className="text-gray-600" />
            About us
          </Link>

          <button
            onClick={() => {
              toggleMenu();
              isAuthenticated ? navigate("/quiz") : navigate("/signup");
            }}
            className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3"
          >
            <FaClipboardList size={20} className="text-gray-600" />
            Quizzes
          </button>

          <button
            onClick={() => {
              toggleMenu();
              isAuthenticated ? navigate("/code") : navigate("/signup");
            }}
            className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3"
          >
            <FaCode size={20} className="text-gray-600" />
            Problems
          </button>

          <button
            onClick={() => {
              toggleMenu();
              isAuthenticated ? navigate("/typing-test") : navigate("/signup");
            }}
            className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3"
          >
            <FaKeyboard size={20} className="text-gray-600" />
            Typing test
          </button>

          <button
            onClick={() => {
              toggleMenu();
              isAuthenticated ? navigate("/summarize") : navigate("/signup");
            }}
            className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3"
          >
            <FaStickyNote size={20} className="text-gray-600" />
            QuickNotes
          </button>

          <button
            onClick={() => {
              toggleMenu();
              isAuthenticated ? navigate("/mock-interview") : navigate("/signup");
            }}
            className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3"
          >
            <FaUserFriends size={20} className="text-gray-600" />
            Mock Interview
          </button>

           <button
            onClick={() => {
              toggleMenu();
              isAuthenticated ? navigate("/documentation") : navigate("/signup");
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
          
          {isAuthenticated ? (
            <>
              <div onClick={() => { navigate("/userinfo"); toggleMenu(); }} className="flex items-center gap-5 cursor-pointer">
                {profilePic ? (
                  <img
                    src={`${profilePic}?${new Date().getTime()}`}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover hover:ring-2 hover:ring-blue-500 transition-all"
                  />
                ) : (
                  <CharAvatar fullName={userName} width="w-12" height="h-12" />
                )}
                <p className="text-gray-700 hover:text-indigo-600 font-semibold flex items-center gap-3">Accout info</p>
              </div>
              <button
                onClick={() => {
                  toggleMenu();
                  handleLogout();
                }}
                className="bg-blue-600 text-white hover:bg-gray-200 py-2 px-5 rounded-lg text-sm font-medium cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={toggleMenu}
              className="bg-blue-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-full text-sm font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </motion.div>

    </motion.nav>
  );
};
