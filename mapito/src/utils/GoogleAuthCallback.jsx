import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import axiosInstance from './axiosInstance';
import { API_PATHS } from './apiPaths';
import { UserContext } from './UserContext';
import { motion } from 'framer-motion';

const GoogleAuthCallback = () => {
    const navigate = useNavigate();
    const { updateUser } = useContext(UserContext);
    const [error, setError] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
            console.error("No token found in URL");
            setError("Authentication failed. No token received.");
            navigate("/login", { replace: true });
            return;
        }

        const authenticateUser = async () => {
            try {
                // Store token first
                localStorage.setItem("token", token);

                // Fetch user info
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.data) {
                    throw new Error("No user data received");
                }

                const { fullName, picture } = response.data;

                // Store user data
                localStorage.setItem("fullName", fullName);
                localStorage.setItem("profilePic", picture);

                // Update context
                updateUser(response.data);

                // Redirect to home
                navigate("/home", { replace: true });

            } catch (err) {
                console.error("Authentication error:", err);
                setError(err.message || "Failed to authenticate");
                
                // Clear invalid token
                localStorage.removeItem("token");
                
                // Redirect to login with error state
                navigate("/login", { 
                    replace: true,
                    state: { error: err.message } 
                });
            }
        };

        authenticateUser();
    }, [navigate, updateUser]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            {error ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-center p-4"
                >
                    {error}
                    <p className="mt-2 text-sm">Redirecting to login...</p>
                </motion.div>
            ) : (
                <>
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
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 text-lg font-medium text-gray-700"
                    >
                        Signing you in...
                    </motion.p>
                </>
            )}
        </div>
    );
};

export default GoogleAuthCallback;
