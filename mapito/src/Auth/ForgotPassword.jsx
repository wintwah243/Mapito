import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';
import Input from '../utils/Input';

const ForgotPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  // Verify token validity
  const userValid = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/auth/forgotpassword/${id}/${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (data.status === 200 || data.status === 201) {
        setIsValidToken(true);
      } else {
        toast.error(data.message || "Invalid reset link");
        navigate('/login');
      }
    } catch (err) {
      toast.error("Failed to verify reset link");
      navigate('/login');
    }
  };

  // Handle password submission
  const sendpassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setIsLoading(false);
      return setError("Passwords don't match");
    }

    // Validate password length
    if (password.length < 6) {
      setIsLoading(false);
      return setError("Password must be at least 6 characters");
    }

    try {
      const res = await fetch(`http://localhost:8000/api/auth/${id}/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (data.status === 200 || data.status === 201) {
        setMessage("Password successfully updated");
        toast.success("Password updated successfully!");
        setTimeout(() => navigate('/login'), 2000);
      } else {
        throw new Error(data.message || "Failed to update password");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    userValid();
  }, [id, token]);

  if (!isValidToken) {
    return (
      <AuthLayout>
        <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
          <h3 className='text-[40px] font-semibold text-black'>Verifying link...</h3>
          <p className='text-xs text-slate-700 mt-[5px] mb-6'>
            Please wait while we verify your password reset link.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-[40px] font-semibold text-black'>Create new password</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please enter your new password below to reset your account.
        </p>

        <form onSubmit={sendpassword}>
          {message && <p className="text-green-600 font-bold mb-4">{message}</p>}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="New password"
            placeholder="At least 6 characters"
            type="password"
            disabled={isLoading}
          />

          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            label="Confirm new password"
            placeholder="Re-enter your password"
            type="password"
            disabled={isLoading}
          />

          <button 
            type='submit' 
            className={`btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Create Password'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;