import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  _id: string;
  email: string;
  username: string;
  createdAt: string;
  [key: string]: any; // For additional properties like passwordHash, etc.
}

interface AuthContextType {
  user: User | null;
  userId: string | null;
  token: string | null; // Update to make token nullable
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

  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem('userId');
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  useEffect(() => {
    if (user && token) {
      console.log(token)
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user._id);
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
    }
  }, [user, token]);

  const login = (userData: { user: User; token: string }) => {
    if (!userData || !userData.user || !userData.user._id) {
      console.error('Invalid user data passed to login');
      return;
    }

    setUser(userData.user);
    setUserId(userData.user._id);
    setToken(userData.token);

    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('userId', userData.user._id);
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setUser(null);
    setUserId(null);
    setToken(null);

    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, userId, token, login, logout, isAuthenticated: !!user }}>
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
