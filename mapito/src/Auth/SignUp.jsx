import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Input from '../utils/Input';
import { validateEmail, validatePassword } from '../utils/helper';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { UserContext } from '../utils/UserContext';
import uploadImage from '../utils/updateImage';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [code, setCode] = useState(""); 
  const [step, setStep] = useState(1);
  const {updateUser} = useContext(UserContext);
  const [verifyToken, setVerifyToken] = useState("");
  const navigate = useNavigate();

  // Handle token in URL from Google OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
  
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("profilePic", res.data.picture || res.data.profileImageUrl);
      
      axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        console.log("OAuth user fetched:", res.data);
        updateUser(res.data); 
        navigate("/home", { replace: true });
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        navigate("/login", { replace: true });
      });
    }
  }, [navigate, updateUser]);
  
const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://mapito.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Save token and switch to verification step
      setVerifyToken(data.verifytoken); // new state
      setStep(2); // move to verification form
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };
 
  const loginWithGoogle = () => {
      window.open("https://mapito.onrender.com/api/auth/google", "_self");
    };

 // email confirmation
 const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://mapito.onrender.com/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          verifytoken: verifyToken, 
          code,  // OTP code from user                   
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Email verified successfully!");
      navigate("/login"); // go to login page if confirmation success
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
          <h3 className='text-[40px] font-semibold text-black'>Create an account</h3>
          <p className='text-xs text-slate-700 mt-[5px] mb-6'>
            Let AI create your perfect path forward – welcome to Mapito, your intelligent learning platform.
          </p>

       {/* Google Sign In */}
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:shadow-md transition duration-150 mb-6"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>

       {/* Separator */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-500 text-sm font-medium">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
       
         {step === 1 ? (
          <form onSubmit={handleSignUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                label="Full Name"
                placeholder="Your name"
                type="text"
              />
              <Input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                label="Email Address"
                placeholder="yourname@example.com"
                type="text"
              />
              <div className="col-span-2">
                <Input
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                  label="Password"
                  placeholder="Min 6 characters"
                  type="password"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
            <button type="submit" className="btn-primary">Register</button>
            <p className="text-[13px] text-slate-800 mt-3">
              Already have an account?{" "}
              <Link className="font-medium text-indigo-700 underline" to="/login">
                Login
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <Input
              value={code}
              onChange={({ target }) => setCode(target.value)}
              label="Verification Code"
              placeholder="Enter 6-digit code"
              type="text"
            />
            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
            <button type="submit" className="btn-primary">Verify</button>
          </form>
        )}
      </div>
    </AuthLayout>
  )
}

export default SignUp
