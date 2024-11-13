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
    const savedUserId = localStorage.getItem('userId');
    return savedUserId || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user._id); // Ensure correct userId is stored
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    }
  }, [user]);

  const login = (userData: { user: User; token: string }) => {
    if (!userData || !userData.user || !userData.user._id) {
      console.error('Invalid user data passed to login');
      return;
    }

    const userId = userData.user._id;

    setUser(userData.user);
    setUserId(userId);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userId', userId);
  };

  const logout = () => {
    setUser(null);
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ user, userId, login, logout, isAuthenticated: !!user }}>
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
