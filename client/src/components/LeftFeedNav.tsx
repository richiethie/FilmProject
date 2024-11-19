import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { GoHomeFill } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaUpload } from "react-icons/fa6";

const LeftFeedNav = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login after logout
    };

    return (
        <nav className="fixed top-0 left-0 h-full flex flex-col justify-between py-8 items-start w-64 bg-charcoal border-r border-r-steelGray p-4">
            <div>
                <Link to="/feed" className="top-10 mb-8 text-3xl font-bold">Film<span className="text-cornflowerBlue">Share</span></Link>
                <ul className="space-y-4 flex flex-col items-start mt-8">
                    <Link to="/feed" className="flex justify-center items-center hover:text-cornflowerBlue py-2">
                        <GoHomeFill className='text-3xl'/>
                        <li  className='text-xl font-semibold ml-4'>Home</li>
                    </Link>
                    <Link to="/explore" className="flex justify-center items-center hover:text-cornflowerBlue py-2">
                        <IoSearch className='text-3xl'/>
                        <li  className='text-xl font-semibold ml-4'>Explore</li>
                    </Link>
                    <Link to="/alerts" className="flex justify-center items-center hover:text-cornflowerBlue py-2">
                        <IoNotifications className='text-3xl'/>
                        <li  className='text-xl font-semibold ml-4'>Alerts</li>
                    </Link>
                    <Link to="/upload" className="flex justify-center items-center hover:text-cornflowerBlue py-2">
                        <FaUpload className='text-3xl'/>
                        <li  className='text-xl font-semibold ml-4'>Upload</li>
                    </Link>
                    <Link to="/profile" className="flex justify-center items-center hover:text-cornflowerBlue py-2">
                        <CgProfile className='text-3xl'/>
                        <li  className='text-xl font-semibold ml-4'>Profile</li>
                    </Link>
                    {/* Add more navigation items as needed */}
                </ul>
            </div>
            <button className="bg-cornflowerBlue text-charcoal font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition" onClick={handleLogout}>Logout</button>
        </nav>
    )
}

export default LeftFeedNav