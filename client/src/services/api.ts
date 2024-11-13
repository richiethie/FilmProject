import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Define the API base URL
const api = axios.create({
  baseURL: apiUrl || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example TypeScript interface for API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: boolean;
}

// Example login function
export const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;  // Will be caught in the Login component
    }
  };

// Example signup function
export const signup = async (userData: { name: string; email: string; password: string }): Promise<ApiResponse<{ token: string }>> => {
  try {
    const response: AxiosResponse<ApiResponse<{ token: string }>> = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;  // Re-throw the error to handle it later in the component
  }
};

// Example function to get user profile
export const getUserProfile = async (token: string): Promise<ApiResponse<{ name: string; email: string }>> => {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response: AxiosResponse<ApiResponse<{ name: string; email: string }>> = await api.get('/user/profile', config);
  return response.data;
};

export default api;
