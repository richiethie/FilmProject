import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Default import for jwt-decode
import { useNavigate } from 'react-router-dom'; // React Router v6 for navigation
import { User } from '../types/User';

interface AuthContextType {
  user: User | null;
  userId: string | null;
  loggedInUserId: string | null;
  username: string | null;
  token: string | null; // Token is nullable
  login: (userData: { user: User; token: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(() => {
    return localStorage.getItem('userId');
  });

  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem('userId');
  });

  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem('username')
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const navigate = useNavigate(); // Use navigate from React Router v6 for redirection

  // Function to check if the token is expired
  const isTokenExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token); // Use jwt_decode directly
      if (decoded && decoded.exp) {
        const currentTime = Date.now() / 1000; // Current time in seconds
        return decoded.exp < currentTime; // Check if the token has expired
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    return true; // Default to expired if decoding fails
  };

  // Effect to handle token expiration and store changes
  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
      navigate('/login'); // Redirect to login page if the token has expired
    } else if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user._id);
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
    }
  }, [user, token, navigate]);

  const login = (userData: { user: User; token: string }) => {
    if (!userData || !userData.user || !userData.user._id) {
      console.error('Invalid user data passed to login');
      return;
    }

    setUser(userData.user);
    setUserId(userData.user._id);
    setLoggedInUserId(userData.user._id);
    setUsername(userData.user.username);
    setToken(userData.token);

    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('username', userData.user.username);
    localStorage.setItem('userId', userData.user._id);
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setUser(null);
    setUserId(null);
    setUsername(null);
    setLoggedInUserId(null);
    setToken(null);

    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, userId, loggedInUserId, username, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
