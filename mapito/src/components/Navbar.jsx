import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import CharAvatar from "../utils/CharAvatar";
import { FaHome, FaInfoCircle, FaClipboardList, FaCode, FaKeyboard } from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();

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
    navigate("/login");
  };

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
        <Link to="/home" className="hover:text-indigo-600 transition-all duration-300">Home</Link>

        <Link to="/aboutus" className="hover:text-indigo-600 transition-all duration-300">About us</Link>
        <button
          onClick={() => {
            if (isAuthenticated) navigate("/quiz");
            else navigate("/signup");
          }}
          className="cursor-pointer hover:text-indigo-600 transition-all duration-300"
        >
          Quizzes
        </button>

        <button
          onClick={() => {
            if (isAuthenticated) navigate("/code");
            else navigate("/signup");
          }}
          className="cursor-pointer hover:text-indigo-600 transition-all duration-300"
        >
          Problems
        </button>

        <button
          onClick={() => {
            if (isAuthenticated) navigate("/typing-test");
            else navigate("/signup");
          }}
          className="cursor-pointer hover:text-indigo-600 transition-all duration-300"
        >
          Typing test
        </button>

      </div>

      {/* Desktop Button + Avatar */}
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
              className="bg-gray-900 hover:bg-gray-200 text-white py-2 px-5 rounded-full text-sm font-medium transition-all duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-full text-sm font-medium transition-all duration-300"
          >
            Login
          </Link>
        )}
      </div>

      {/* for Mobile */}
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
          
          {isAuthenticated ? (
            <>
              <div onClick={() => { navigate("/userinfo"); toggleMenu(); }} className="cursor-pointer">
                {profilePic ? (
                  <img
                    src={`${profilePic}?${new Date().getTime()}`}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover hover:ring-2 hover:ring-blue-500 transition-all"
                  />
                ) : (
                  <CharAvatar fullName={userName} width="w-12" height="h-12" />
                )}
              </div>
              <button
                onClick={() => {
                  toggleMenu();
                  handleLogout();
                }}
                className="bg-gray-900 text-white hover:bg-gray-200 py-2 px-5 rounded-full text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={toggleMenu}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-full text-sm font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </motion.div>

    </motion.nav>
  );
}
