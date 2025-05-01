import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import axiosInstance from './axiosInstance';
import { API_PATHS } from './apiPaths';
import { UserContext } from './UserContext';

const GoogleAuthCallback = () => {
    const navigate = useNavigate();
    const { updateUser } = useContext(UserContext);

    useEffect(() => {
        // Get token from URL params
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token); 

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
        <div>Loading...</div>
    );
};

export default GoogleAuthCallback;
