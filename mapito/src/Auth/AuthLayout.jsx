import React from 'react';
import robot from "../assets/images/robot.png";
import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  return (
    <div className="w-screen min-h-screen flex justify-center items-center bg-white p-4">
      <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-2xl shadow-lg">
        <Link to="/login" className="flex items-center gap-3 mb-8 justify-center">
{/*           <h2 className="text-4xl font-bold text-indigo-700">Mapito</h2>
          <img src={robot} alt="robot Logo" className="w-[50px] h-[50px]" /> */}
        </Link>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
