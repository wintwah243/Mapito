import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import CharAvatar from "../utils/CharAvatar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Load initial user data
  useEffect(() => {
    const loadUserData = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || {});
      
      setIsAuthenticated(!!token);
      setUserName(user.fullName || "");
      setProfilePic(user.profileImageUrl || "");
    };

    loadUserData();

    // Listen for custom profile update events
    const handleProfileUpdate = () => {
      loadUserData();
    };

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
      className="w-full flex items-center justify-between py-4 px-6 md:px-12 bg-white fixed top-0 left-0 z-50 shadow"
    >
      {/* Logo */}
      <div className="text-2xl font-bold text-indigo-600 cursor-pointer">
        Mapito
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-8 text-gray-700 font-semibold">
        <Link to="/home" className="hover:text-indigo-600 transition-all duration-300">
          Home
        </Link>
        <Link to="/aboutus" className="hover:text-indigo-600 transition-all duration-300">
          About us
        </Link>
        <button
          onClick={() => {
            if (isAuthenticated) {
              navigate("/quiz");
            } else {
              navigate("/signup");
            }
          }}
          className="cursor-pointer hover:text-indigo-600 transition-all duration-300"
        >
          Quiz
        </button>
        <Link to="/code" className="hover:text-indigo-600 transition-all duration-300">
          Code
        </Link>
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
                onClick={() => navigate('/userinfo')}
                onError={() => setProfilePic("")}
              />
            ) : (
              <div 
                className="cursor-pointer"
                onClick={() => navigate('/userinfo')}
              >
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

      {/* Mobile Hamburger */}
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white flex flex-col items-center gap-6 py-6 shadow-md z-40">
          <Link to="/home" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600 font-semibold">
            Home
          </Link>
          <Link to="/aboutus" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600 font-semibold">
            About us
          </Link>
          <button
            onClick={() => {
              toggleMenu();
              if (isAuthenticated) {
                navigate("/quiz");
              } else {
                navigate("/signup");
              }
            }}
            className="text-gray-700 hover:text-indigo-600 font-semibold cursor-pointer"
          >
            Quiz
          </button>
          <Link to="/code" onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600 font-semibold">
            Code
          </Link>
          {isAuthenticated ? (
            <div className="flex flex-col items-center gap-3">
              {profilePic ? (
                <img 
                  src={`${profilePic}?${new Date().getTime()}`}
                  alt="Profile" 
                  className="w-12 h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all object-cover"
                  onClick={() => navigate('/userinfo')}
                  onError={() => setProfilePic("")}
                />
              ) : (
                <div 
                  className="cursor-pointer"
                  onClick={() => navigate('/userinfo')}
                >
                  <CharAvatar fullName={userName} width="w-12" height="h-12" />
                </div>
              )}
              <button
                onClick={() => {
                  toggleMenu();
                  handleLogout();
                }}
                className="bg-gray-900 hover:bg-gray-200 text-white py-2 px-5 rounded-full text-sm font-medium transition-all duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={toggleMenu}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-full text-sm font-medium transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </motion.nav>
  );
}
