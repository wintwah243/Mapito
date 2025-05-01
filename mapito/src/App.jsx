import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Hero from './components/Hero';
import Intro from './components/Intro';
import LearnMore from './components/LearnMore';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Login from './Auth/Login';
import UserProvider from './utils/UserContext';
import SignUp from './Auth/SignUp';
import GoogleAuthCallback from './utils/GoogleAuthCallback';
import Quiz from './components/Quiz';
import Feature from './components/Feature';
import CodeCompiler from './components/CodeCompiler';
import PasswordReset from './Auth/PasswordReset';
import ForgotPassword from './Auth/ForgotPassword';
import UserInfo from './Auth/UserInfo';
import AboutUs from './components/AboutUs';

const Home = () => (
  <>
    <Navbar />
    <Intro />
    <Feature />
    <LearnMore />
    <Hero /> 
    <Footer />
  </>
);

const PublicHome = () => (
  <>
    <Navbar />
    <Intro /> 
    <Footer />
  </>
);

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PublicRoute><PublicHome /></PublicRoute>} />
          <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/google-auth" element={<GoogleAuthCallback />} />
          <Route path="/quiz" element={<RequireAuth><Quiz /></RequireAuth>} />
          <Route path="/code" element={<RequireAuth><CodeCompiler /></RequireAuth>} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/forgotpassword/:id/:token" element={<ForgotPassword />} />
          <Route path="/userinfo" element={<RequireAuth><UserInfo /></RequireAuth>} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

const RequireAuth = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default App;
