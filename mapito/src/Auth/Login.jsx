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

        {/* GitHub Sign In */}
        <button
          onClick={() => window.location.href = 'https://mapito.onrender.com/api/auth/github'}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 border border-gray-900 rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-gray-800 hover:shadow-lg transition duration-150"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.11.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 17.07 3.633 16.7 3.633 16.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.304-5.466-1.334-5.466-5.933 0-1.31.468-2.38 1.235-3.22-.124-.304-.535-1.527.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.02.004 2.045.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.65.244 2.873.12 3.176.77.84 1.232 1.91 1.232 3.22 0 4.61-2.807 5.625-5.48 5.922.43.37.823 1.096.823 2.21 0 1.595-.015 2.877-.015 3.267 0 .32.216.694.824.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"
            />
          </svg>
          Sign in with GitHub
        </button>

        {/* Separator */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-500 text-sm font-medium">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

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
