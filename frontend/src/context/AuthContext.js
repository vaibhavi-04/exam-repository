
import React, { createContext, useState, useEffect } from 'react';
import  {jwtDecode}  from "jwt-decode";

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Add user state


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        setIsLoggedIn(true);
        const decoded = jwtDecode(token);
        console.log('decoded token: ', decoded);
        setUser(decoded);
    }
}, []);

// Additional effect to confirm when user is set
useEffect(() => {
    console.log('User state after token decode:', user);
}, [user]);

  

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null); // Clear user on logout
    console.log('user logged out!!')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout, user }}> {/* Provide user in context */}
      {children}
    </AuthContext.Provider>
  );
};


