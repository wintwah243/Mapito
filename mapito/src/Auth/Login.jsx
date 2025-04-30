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
        navigate("/", { replace: true });
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
        navigate("/");
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
    window.open("http://localhost:8000/api/auth/google/callback", "_self");
  };

  return (
    <AuthLayout className="lg:flex lg:justify-center lg:items-center lg:min-h-screen">
      <div className='w-full max-w-md p-6 rounded-md bg-white'>
        <h3 className='text-3xl font-semibold text-black mb-4'>Welcome back!</h3>
        <p className='text-sm text-slate-700 mb-6'>
        Let AI create your perfect path forward – welcome to Mapito, your intelligent roadmap generator.
        </p>

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

        <button className='google-btn mt-4' onClick={loginWithGoogle}>Sign in with Google</button>
      </div>
    </AuthLayout>
  );
};

export default Login;