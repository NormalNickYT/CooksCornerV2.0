import User from "@/types/User";
import axios from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null; 
  loggedIn: boolean;
  checkLoginState: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, 
  loggedIn: false,
  checkLoginState: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  const checkLoginState = async () => {
    try { 
      const response = await fetch("http://localhost:5000/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }); 
      const res = await response.json();
      if (res.success) {
        setLoggedIn(true);
        user && setUser(user);
      } 
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    checkLoginState();
  }, [checkLoginState]); 

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        setUser(null);
        navigate("/login");
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(err);
      setUser(null); 
    }
  };

  return (
    <AuthContext.Provider value={{ user, checkLoginState, logout, loggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};