import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signupBg from '../assets/video/signup-bg.mp4';
import SignupHeader from '../components/SignupHeader';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { PasswordInput } from "@/components/ui/password-input"

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null); // State for error messages
  const [loading, setLoading] = useState<boolean>(false); // For loading state
  const navigate = useNavigate();
  const { login } = useAuth(); // Access login function

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'confirmPassword') {
      // Reset error when user starts typing in confirm password
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return; // Prevent form submission
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'An error occurred. Please try again.');
      } else {
        // Log in the user after signup
        login(data); // Call login with the received user data
        navigate('/feed'); // Redirect to feed
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col h-screen py-20 bg-steelGray relative overflow-hidden">
      <video
        className="absolute top-0 left-0 object-cover w-full h-full"
        autoPlay
        loop
        muted
        playsInline
        src={signupBg}
      >
        Your browser does not support the video tag.
      </video>
      <SignupHeader />
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70" />
      <div className="flex-grow flex items-center justify-center relative z-10">
        <div className="max-w-md w-full bg-charcoal bg-opacity-75 rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-cornflowerBlue mb-6">
            Create an Account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-crispWhite" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-cornflowerBlue focus:ring focus:ring-cornflowerBlue"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-crispWhite" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-cornflowerBlue focus:ring focus:ring-cornflowerBlue"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-crispWhite" htmlFor="password">
                Password
              </label>
              <PasswordInput
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-cornflowerBlue focus:ring focus:ring-cornflowerBlue"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-crispWhite" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <PasswordInput
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-cornflowerBlue focus:ring focus:ring-cornflowerBlue"
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="w-[50%] bg-cornflowerBlue text-white py-2 rounded-md hover:bg-steelGray"
                disabled={loading} // Disable the button during loading
              >
                {loading ? 'Creating...' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;
