import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Input from '../utils/Input';
import { validateEmail, validatePassword } from '../utils/helper';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { UserContext } from '../utils/UserContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

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


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("fullName", user.fullName);
        localStorage.setItem("profilePic", user.profileImageUrl);
        updateUser(user);
        navigate("/home");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };


  const loginWithGoogle = () => {
    window.open("https://mapito.onrender.com/api/auth/google/callback", "_self");
  };

  return (
    <AuthLayout className="lg:flex lg:justify-center lg:items-center lg:min-h-screen">
      <div className='w-full max-w-md p-6 rounded-md bg-white'>
        <h3 className='text-3xl font-semibold text-black mb-4'>Welcome back!</h3>
        <p className='text-sm text-slate-700 mb-6'>
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

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="yourname@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 6 characters"
            type="password"
          />
          <p className='text-xs text-slate-800 mt-3'>
            Forgot Password?{" "}
            <Link className='font-medium text-indigo-700 underline' to="/password-reset">Reset password</Link>
          </p>

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>Login</button>

          <p className='text-xs text-slate-800 mt-3'>
            Don't have an account?{" "}
            <Link className='font-medium text-indigo-700 underline' to="/signup">Signup</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
