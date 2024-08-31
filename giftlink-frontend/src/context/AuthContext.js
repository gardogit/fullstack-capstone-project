import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const authToken = sessionStorage.getItem('auth-token');
    const storedUserName = sessionStorage.getItem('name');

    if (authToken) {
      setIsLoggedIn(true);
      setUserName(storedUserName || "");
    }
  }, []);

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, userName, setUserName }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside an AuthProvider");
  }
  return context;
};
