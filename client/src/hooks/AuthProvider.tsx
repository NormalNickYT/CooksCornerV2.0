import User from "@/types/User";
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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  setIsAuthenticated: () => {},
  isAuthenticated: false,
  loading: true,
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

  return (
    <AuthContext.Provider
      value={{ user, setUser, setIsAuthenticated, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
