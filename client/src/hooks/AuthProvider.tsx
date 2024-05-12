import User from "@/types/User";
import axios from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null; 
  checkUser: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, 
  checkUser: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []); 

  const checkUser = async () => {
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
        setUser(res.user);
        navigate("/dashboard?tab=dash");
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }
  }

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
    }
  };

  return (
    <AuthContext.Provider value={{ user, checkUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};