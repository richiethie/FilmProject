import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';
import { FiUpload } from "react-icons/fi";
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types/User';
import axios from 'axios';
import stockProfilePic from "../assets/img/profilePic/stock-profile-pic.webp";
import { GoHomeFill } from 'react-icons/go';
import { IoNotifications, IoSearch, IoNotificationsOutline, IoTrendingUp, IoPulseSharp, IoSettingsSharp, IoBookmark } from 'react-icons/io5';
import { PiFilmSlate } from "react-icons/pi";
import { MdOutlineTheaterComedy } from "react-icons/md";
import { FaFaceLaughBeam, FaWandMagicSparkles } from "react-icons/fa6";
import { RiGhost2Line } from "react-icons/ri";
import { BsHearts } from "react-icons/bs";

const FeedHeader = () => {
    const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selected, setSelected] = useState<boolean>(false);

    const { logout, userId } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login after logout
    };

    const toggleDrawer = () => setDrawerOpen((prev) => !prev);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (!userId) {
                console.warn('No user ID found in auth context');
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/users/${userId}`
                );
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        fetchCurrentUser();
    }, [userId]);

    return (
        <header className="sticky top-0 z-10 bg-charcoal px-4 py-2">
            <div className="flex items-center justify-between">
                {/* Left: Drawer Icon */}
                <div className='flex items-center'>
                    <button
                        aria-label="Open Drawer"
                        onClick={toggleDrawer}
                        className="text-white text-2xl p-2"
                    >
                        <FaBars />
                    </button>
                    <Link to="/feed" className="text-2xl font-bold ml-4">Film<span className="text-cornflowerBlue">Share</span></Link>
                </div>

                {/* Drawer Content */}
                {isDrawerOpen && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-20 flex">
                        <aside className="bg-charcoal w-64 p-4 overflow-y-scroll">
                            <div className='flex items-center mb-4 p-2'>
                                <button
                                    aria-label="Close Drawer"
                                    onClick={toggleDrawer}
                                    className="text-white text-xl"
                                >
                                    <FaBars />
                                </button>
                                <Link to="/feed" className="text-2xl font-bold ml-4">Film<span className="text-cornflowerBlue">Share</span></Link>
                            </div>
                            <nav className='py-2'>
                                <ul className='space-y-4 border-b border-steelGray pb-4'>
                                    <Link to="/feed" onClick={() => setSelected(!selected)} className={`flex items-center hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2 ${selected ? "bg-darkCharcoal" : "bg-charcoal"}`}>
                                        <GoHomeFill className='text-2xl'/>
                                        <li  className='font-semibold ml-4'>Home</li>
                                    </Link>
                                    <Link to="/explore" onClick={() => setSelected(!selected)} className="flex items-center hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2">
                                        <IoSearch className='text-2xl'/>
                                        <li  className='font-semibold ml-4'>Explore</li>
                                    </Link>
                                    <Link to="/alerts" onClick={() => setSelected(!selected)} className="flex items-center hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2">
                                        <IoNotifications className='text-2xl'/>
                                        <li  className='font-semibold ml-4'>Alerts</li>
                                    </Link>
                                    <Link to="/upload" onClick={() => setSelected(!selected)} className="flex items-center hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2">
                                        <FiUpload className='text-2xl'/>
                                        <li  className='font-semibold ml-4'>Upload</li>
                                    </Link>
                                </ul>
                                <ul className='space-y-4 border-b border-steelGray pb-4 mt-4'>
                                    <li className='text-xl font-semibold ml-2'>Trending</li>
                                    <Link to="/explore" onClick={() => setSelected(!selected)} className="flex items-center hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2">
                                        <IoTrendingUp className='text-2xl'/>
                                        <li  className='font-semibold ml-4'>Top 10 Films</li>
                                    </Link>
                                    <Link to="/explore" onClick={() => setSelected(!selected)} className="flex items-center hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2">
                                        <PiFilmSlate className='text-2xl'/>
                                        <li  className='font-semibold ml-4'>Top 10 Action</li>
                                    </Link>
                                    <Link to="/explore" onClick={() => setSelected(!selected)} className="flex items-center hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2">
                                        <FaFaceLaughBeam className='text-2xl'/>
                                        <li  className='font-semibold ml-4'>Top 10 Comedy</li>
                                    </Link>
                                    <Link to="/explore" onClick={() => setSelected(!selected)} className="flex items-center hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2">
                                        <MdOutlineTheaterComedy className='text-2xl'/>
                                        <li  className='font-semibold ml-4'>Top 10 Drama</li>
                                    </Link>
                                    <Link to="/explore" onClick={() => setSelected(!selected)} className="flex items-center hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2">
                                        <FaWandMagicSparkles className='text-2xl'/>
                                        <li  className='font-semibold ml-4'>Top 10 Fantasy</li>
                                    </Link>
                                    <Link to="/explore" onClick={() => setSelected(!selected)} className="flex items-center hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2">
                                        <RiGhost2Line className='text-2xl'/>
                                        <li  className='font-semibold ml-4'>Top 10 Horror</li>
                                    </Link>
                                    <Link to="/explore" onClick={() => setSelected(!selected)} className="flex items-center hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2">
                                        <IoSearch className='text-2xl'/>
                                        <li  className='font-semibold ml-4'>Top 10 Mystery</li>
                                    </Link>
                                    <Link to="/explore" onClick={() => setSelected(!selected)} className="flex items-center hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2">
                                        <BsHearts className='text-2xl'/>
                                        <li  className='font-semibold ml-4'>Top 10 Romance</li>
                                    </Link>
                                    <Link to="/explore" onClick={() => setSelected(!selected)} className="flex items-center hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2">
                                        <IoPulseSharp className='text-2xl'/>
                                        <li  className='font-semibold ml-4'>Top 10 Thriller</li>
                                    </Link>
                                </ul>
                                <ul className='space-y-4 border-b border-steelGray pb-4 mt-4'>
                                    <li className='text-xl font-semibold ml-2'>For You</li>
                                    <Link to={`/profile/${userId}`} onClick={() => setSelected(!selected)} className="flex items-center hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2">
                                        <img
                                            src={currentUser?.profilePhotoUrl || stockProfilePic}
                                            alt={`${currentUser?.username}'s profile`}
                                            className="w-8 h-8 rounded-full object-cover border border-transparent hover:border-cornflowerBlue cursor-pointer"
                                        />
                                        <li  className='font-semibold ml-4'>Profile</li>
                                    </Link>
                                    <Link to="/saved" onClick={() => setSelected(!selected)} className="flex items-center hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2">
                                        <IoBookmark className='text-2xl'/>
                                        <li  className='font-semibold ml-4'>Saved</li>
                                    </Link>
                                    <Link to="/settings" onClick={() => setSelected(!selected)} className="flex items-center hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2">
                                        <IoSettingsSharp className='text-2xl'/>
                                        <li  className='font-semibold ml-4'>Settings</li>
                                    </Link>

                                </ul>
                            </nav>
                            <button className="my-4 bg-cornflowerBlue text-charcoal font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition" onClick={handleLogout}>Logout</button>
                        </aside>
                        <div
                            className="flex-1"
                            onClick={toggleDrawer} // Close drawer when clicking outside
                        />
                    </div>
                )}

                {/* Center: Search Bar */}
                <Input
                    placeholder="Search"
                    size="md"
                    bg="charcoal"
                    color="white"
                    _placeholder={{ color: 'gray.300' }}
                    borderWidth="1px"
                    borderRadius="md"
                    w="40%"
                    className='border-steelGray px-4'
                />

                {/* Right: Profile Picture and Upload Icon */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/upload"
                        aria-label="Upload"
                        className="text-white text-2xl p-2 hover:text-cornflowerBlue"
                    >
                        <FiUpload />
                    </Link>
                    <Link
                        to="/alerts"
                        aria-label="Alerts"
                        className="text-white text-2xl p-2 hover:text-cornflowerBlue"
                    >
                        <IoNotificationsOutline />
                    </Link>
                    <Link
                        to={`/profile/${userId}`}
                        aria-label="Profile"
                    >
                        <img
                            src={currentUser?.profilePhotoUrl || stockProfilePic}
                            alt={`${currentUser?.username}'s profile`}
                            className="w-8 h-8 rounded-full object-cover border border-transparent hover:border-cornflowerBlue cursor-pointer"
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default FeedHeader;
