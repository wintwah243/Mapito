import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(); //context that can be shared across components

const UserProvider = ({ children }) => { //children refers to whatever components are nested inside this provider

    const [user, setUser] = useState(null);

    useEffect(() => {
        //check if there's a user in local storage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser)); //parse json into javascript object
        }
    }, []);

    //Function to update user data
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); //parse javascript obj into json
    };

    //Function to clear user data (e.g logout)
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
                clearUser
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
