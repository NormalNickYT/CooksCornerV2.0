import SpinnerLoader from "@/components/SpinnerLoader";
import User from "@/schemas/User";
import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  setIsAuthenticated: () => {},
  isAuthenticated: false,
  loading: true,
  logout: async () => {},
});

const useFetchUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/user", {
          withCredentials: true,
        });
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return { user, setUser, isAuthenticated, setIsAuthenticated, loading };
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser, isAuthenticated, setIsAuthenticated, loading } =
    useFetchUser();

  const logout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      const err = error as Error;
      console.log(err.message);
    }
  };

  if (loading) {
    return <SpinnerLoader />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        setIsAuthenticated,
        isAuthenticated,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
