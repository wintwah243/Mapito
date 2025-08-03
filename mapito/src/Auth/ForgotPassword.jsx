import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';
import Input from '../utils/Input';

const ForgotPassword = () => {
  //we use useParams() becos id and token are a part of route in backend
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
      //sends a GET request to the backend with a user ID and token to handle password reset verification
      const res = await fetch(`https://mapito.onrender.com/api/auth/forgotpassword/${id}/${token}`, {
        //it is GET method but header is needed because forgotpassword route has authentication
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      //parse json into javascript object
      const data = await res.json();

      if (data.status === 200 || data.status === 201) { //check if success
        setIsValidToken(true);
      } else {
        toast.error(data.message || "Invalid reset link"); 
        navigate('/login'); //if not success, go back to login
      }
    } catch (err) {
      toast.error("Failed to verify reset link");
      navigate('/login');
    }
  };

  // Handle password submission
  const sendpassword = async (e) => {
    e.preventDefault(); //reload page
    setIsLoading(true); //indicate that the password submission is in progress
    //Resets any previous error and message states to an empty string
    setError("");
    setMessage("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setIsLoading(false);  //isLoading state back to false becos the password submission is complete
      return setError("Passwords don't match");
    }

    // Validate password length
    if (password.length < 6) {
      setIsLoading(false);  //isLoading state back to false becos the password submission is complete
      return setError("Password must be at least 6 characters");
    }

    try {
      //send a POST request to the backend with id and token
      const res = await fetch(`http://localhost:8000/api/auth/${id}/${token}`, {
        //header is needed becos of POST method
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        //we need this for security, to send structured data and to communicate clearly with server
        body: JSON.stringify({ password }) //parse object into json
      });

      //parse json into javascript object
      const data = await res.json();

      //check if success
      if (data.status === 200 || data.status === 201) {
        setMessage("Password successfully updated");
        toast.success("Password updated successfully!");
        setTimeout(() => navigate('/login'), 2000); //after 2 seconds, go back to login
      } else {
        //if not success, show error
        throw new Error(data.message || "Failed to update password");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false); //after any operation(success or fail), set loading to false
    }
  };

  //useEffect will run again when one(id or token) of the dependencies change
  useEffect(() => {
    userValid();
  }, [id, token]); //dependency array

  if (!isValidToken) {  //check if token is vefified or not
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
            onChange={(e) => setPassword(e.target.value)} //this is to handle input field changes
            label="New password"
            placeholder="At least 6 characters"
            type="password"
            disabled={isLoading} //disable input field while a process is loading


          />

          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} //this is to handle input field changes
            label="Confirm new password"
            placeholder="Re-enter your password"
            type="password"
            disabled={isLoading} //disable input field while a process is loading


          />

          <button 
            type='submit' 
            //if its loading, make the button's UI fade
            className={`btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading} //disable button while a process is loading
          >
            {isLoading ? 'Updating...' : 'Create Password'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
