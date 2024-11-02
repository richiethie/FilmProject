import React, { useState } from 'react';
import loginBg from '../assets/video/signup-bg.mp4'; // Ensure you have a login background video
import SignupHeader from '../components/SignupHeader';
import { Link } from 'react-router-dom';

interface FormData {
    email: string;
    password: string;
}

const Login = () => {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle login logic here (e.g., API call)
        console.log('Login Data:', formData);
    };

    return (
        <section className="flex flex-col h-screen py-20 bg-steelGray relative overflow-hidden">
            <video
                className="absolute top-0 left-0 object-cover w-full h-full"
                autoPlay
                loop
                muted
                playsInline
                src={loginBg}
            >
                Your browser does not support the video tag.
            </video>
            <SignupHeader />
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70" />
            <div className="flex-grow flex items-center justify-center relative z-10">
                <div className="max-w-md w-full bg-charcoal bg-opacity-75 rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-center text-cornflowerBlue mb-6">Log In</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-crispWhite" htmlFor="email">Email</label>
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
                            <label className="block text-sm font-medium text-crispWhite" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:border-cornflowerBlue focus:ring focus:ring-cornflowerBlue"
                            />
                        </div>
                        <div className="flex justify-center mt-8">
                            <button type="submit" className="w-[50%] bg-cornflowerBlue text-white py-2 rounded-md hover:bg-steelGray">
                                Log In
                            </button>
                        </div>
                    </form>
                    <p className="mt-4 text-center text-crispWhite">
                        Don't have an account? <Link to="/signup" className="text-cornflowerBlue hover:underline">Sign Up</Link>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Login;
