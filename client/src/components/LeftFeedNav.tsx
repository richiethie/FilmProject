import { Link } from 'react-router-dom';
import { GoHomeFill } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaUpload } from "react-icons/fa6";

const LeftFeedNav = () => {

    return (
        <nav className="fixed top-0 left-0 h-full flex flex-col justify-start py-8 items-start w-64 bg-charcoal border-r border-r-steelGray p-4">
            <Link to="/feed" className="top-10 mb-8 text-3xl font-bold">Film<span className="text-cornflowerBlue">Share</span></Link>
            <ul className="space-y-4 flex flex-col items-start">
                <li className="flex justify-center items-center hover:text-cornflowerBlue py-2">
                    <GoHomeFill className='text-3xl'/>
                    <Link to="/feed" className='text-xl font-semibold ml-4'>Home</Link>
                </li>
                <li className="flex justify-center items-center hover:text-cornflowerBlue py-2">
                    <IoSearch className='text-3xl'/>
                    <Link to="/explore" className='text-xl font-semibold ml-4'>Explore</Link>
                </li>
                <li className="flex justify-center items-center hover:text-cornflowerBlue py-2">
                    <IoNotifications className='text-3xl'/>
                    <Link to="/alerts" className='text-xl font-semibold ml-4'>Alerts</Link>
                </li>
                <li className="flex justify-center items-center hover:text-cornflowerBlue py-2">
                    <FaUpload className='text-3xl'/>
                    <Link to="/upload" className='text-xl font-semibold ml-4'>Upload</Link>
                </li>
                <li className="flex justify-center items-center hover:text-cornflowerBlue py-2">
                    <CgProfile className='text-3xl'/>
                    <Link to="/profile" className='text-xl font-semibold ml-4'>Profile</Link>
                </li>
                {/* Add more navigation items as needed */}
            </ul>
        </nav>
    )
}

export default LeftFeedNav