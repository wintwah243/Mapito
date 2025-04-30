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
  const {updateUser} = useContext(UserContext);
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
        updateUser(res.data); // or res.data.user if needed
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        navigate("/login", { replace: true });
      });
    }
  }, [navigate, updateUser]);
  

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    let profileImageUrl = "";
    
    if (!fullName) {
      setError("Please enter your name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }
  
    setError("");
  
    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
  
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl
      });
  
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("fullName", user.fullName);
        localStorage.setItem("profilePic", user.profileImageUrl);
        updateUser(user);
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }
  

    const loginWithGoogle = () => {
      window.open("http://localhost:8000/api/auth/google/callback", "_self");
    };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
          <h3 className='text-[40px] font-semibold text-black'>Create an account</h3>
          <p className='text-xs text-slate-700 mt-[5px] mb-6'>Let AI create your perfect path forward – welcome to Mapito, your intelligent roadmap generator.</p>

          <form onSubmit={handleSignUp}>
            
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input
                    value={fullName}
                    onChange={({target}) => setFullName(target.value)}
                    label="Full Name"
                    placeholder="Your name"
                    type="text"
                 />
                 <Input
                    value={email}
                    onChange={({target}) => setEmail(target.value)}
                    label="Email Address"
                    placeholder="yourname@example.com"
                    type="text"
                 />

                 <div className='col-span-2'>
                 <Input
                    value={password}
                    onChange={({target}) => setPassword(target.value)}
                    label="Password"
                    placeholder="Min 6 characters"
                    type="password"
                  />
                  </div>
              </div>
              {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
             <button type='submit' className='btn-primary'>Signup</button>
             <p className='text-[13px] text-slate-800 mt-3'>
                Already have an account?{" "}
                <Link className='font-medium text-indigo-700 underline' to="/login">Login</Link>
             </p>
          </form>
          <button className='google-btn' onClick={loginWithGoogle}>Sign in with Google</button>
      </div>
    </AuthLayout>
  )
}

export default SignUp
