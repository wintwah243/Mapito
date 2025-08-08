import React from 'react'
import {
BrowserRouter as Router,
Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Hero from './components/Hero'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Login from './Auth/Login'
import UserProvider from './utils/UserContext'
import SignUp from './Auth/SignUp'
import GoogleAuthCallback from './utils/GoogleAuthCallback'
import Quiz from './components/Quiz'
import Feature from './components/Feature'
import CodeCompiler from './components/CodeCompiler'
import PasswordReset from './Auth/PasswordReset'
import ForgotPassword from './Auth/ForgotPassword'
import UserInfo from './Auth/UserInfo'
import AboutUs from './components/AboutUs'
import LandingPage from './Landing/LandingPage'
import LandingAboutus from './Landing/LandingAboutus'
import LandingNews from './Landing/LandingNews'
import TypingTest from './components/TypingTest'
import SummarizeNote from './components/SummarizeNote'
import Documentation from './components/Documentation'
import ScrollToTop from './utils/ScrollToTop'
import News from './components/News'
import LandingDocumentation from './Landing/LandingDocumentation'
import FAQ from './components/FAQ'
import CodingGames from './components/CodingGames'
import GuessOutputGame from './Games/GuessOutputGame'
import CodeOrderGame from './Games/CodeOrderGame'
import FindBugGame from './Games/FindBugGame'
import FillInTheBlanksGame from './Games/FillInTheBlanksGame'

const Home = () => (
<>
<Navbar />
<Hero />
<Feature />
<FAQ />
<Footer />
</>
);

const App = () => {
return (
<UserProvider>
  <Router>
  <ScrollToTop />
  <Routes>
    <Route path='/' element={<LandingPage />} />
    <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/google-auth" element={<GoogleAuthCallback />} />
    <Route path="/quiz" element={<Quiz />} />
    <Route path="/code" element={<CodeCompiler />} />
    <Route path='/aboutus' element={<AboutUs />} />
    <Route path="/password-reset" element={<PasswordReset />} />
    <Route path="/forgotpassword/:id/:token" element={<ForgotPassword />} />
    <Route path='userinfo' element={<UserInfo />} />
    <Route path="/landingaboutus" element={<LandingAboutus />}/>
    <Route path="/typing-test" element={<TypingTest />} />
    <Route path='/summarize' element={<SummarizeNote />} />
    <Route path='/documentation' element={<Documentation />} />
    <Route path='/notice' element={<News />} />
    <Route path='/landingnotice' element={<LandingNews />} />
    <Route path='/landingdocumentation' element={<LandingDocumentation />} />
    <Route path='/codinggame' element={<CodingGames />} />
    <Route path='/games/game1' element={<GuessOutputGame />} />
    <Route path='/games/game2' element={<CodeOrderGame />} />
    <Route path='/games/game3' element={<FindBugGame />} />
    <Route path='/games/game4' element={<FillInTheBlanksGame />} />
  </Routes>
</Router>
</UserProvider>
)
};

const RequireAuth = ({ children }) => {
const isAuthenticated = !!localStorage.getItem("token");

if (!isAuthenticated) {
return <Navigate to="/login" replace />;
}

return children;
};

export default App
