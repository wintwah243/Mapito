import React, { useState } from 'react';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';
import Input from '../utils/Input';
import axiosInstance from '../utils/axiosInstance';
import { BASE_URL } from '../utils/apiPaths';
import { useNavigate } from 'react-router-dom';

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const sendLink = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (!email) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post(
        `${BASE_URL}/api/auth/sendpasswordlink`, 
        { email }, 
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (res.status === 200 || res.status === 201) {
        setMessage("Password reset link has been sent successfully to your email.");
        toast.success("Password reset link sent!");
        setTimeout(() => {
          navigate('/login');
        }, 9000);
      } else {
        throw new Error(res.data.message || "Failed to send reset link");
      }

    } catch (err) {
      console.error('Password reset error:', err);
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError('Please enter a valid email');
            break;
          case 404:
            setError('No account found with this email');
            break;
          case 500:
            setError('Server error - please try again later');
            break;
          default:
            setError('Failed to send reset link');
        }
      } else {
        setError('Network error - please check your connection');
      }
      toast.error(error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-[50px] font-semibold text-black'>Enter Your Email</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Enter your email below, and we'll send you a link to reset your password.
        </p>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}

        <form onSubmit={sendLink}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="yourname@example.com"
            type="email"
            disabled={isLoading}
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button 
            type='submit' 
            className={`btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default PasswordReset;
