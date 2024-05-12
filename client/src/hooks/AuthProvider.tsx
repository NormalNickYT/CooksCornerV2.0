import User from "@/types/User";
import axios from "axios";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null; 
  setUser: React.Dispatch<React.SetStateAction<User | null>>; 
}

const AuthContext = createContext<AuthContextType>({
  user: null, 
  setUser: () => {}, 
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const checkLoginState = () => {
    axios.get("http://localhost:5000/auth/login/success", {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if (response.status === 200) return response.data;
      throw new Error("Authentication has failed!");
    })
    .then((resObject) => {
      setUser(resObject.user);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  useEffect(() => {
    checkLoginState(); 
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};