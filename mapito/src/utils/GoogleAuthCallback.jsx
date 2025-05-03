import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import axiosInstance from './axiosInstance';
import { API_PATHS } from './apiPaths';
import { UserContext } from './UserContext';
import { motion } from 'framer-motion';

const GoogleAuthCallback = () => {
    const navigate = useNavigate();
    const { updateUser } = useContext(UserContext);

    useEffect(() => {
        // Get token from URL params
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token); // Save the token to localStorage

            axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    const { fullName, picture } = res.data;

                    // Save data to localStorage
                    localStorage.setItem("fullName", fullName); 
                    localStorage.setItem("profilePic", picture); 

                    updateUser(res.data); 
                    navigate("/home", { replace: true });
                })
                .catch((err) => {
                    console.error("Error fetching user info:", err);
                    navigate("/login", { replace: true }); 
                });
        }
    }, [navigate, updateUser]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
            />

      {/* customized loading effect while loading for google login */}
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-lg font-medium text-gray-700"
            >
                Signing you in...
            </motion.p>
        </div>
    );
};

export default GoogleAuthCallback;
