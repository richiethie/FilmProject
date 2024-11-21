import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaRegComment, FaPlay } from 'react-icons/fa';
import { FiSend } from "react-icons/fi";
import { BiUpvote, BiSolidUpvote } from "react-icons/bi";
import Footer from '../components/Footer';
import CategoryPills from '../components/CategoryPills';
import LeftFeedNav from '../components/LeftFeedNav';
import FollowButton from '../components/FollowButton';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

interface Film {
    _id: string;
    title: string;
    description?: string;
    thumbnailUrl: string;
    filmUrl: string;
    genre?: string;
    series?: string;
    duration?: number;
    rank: number | null;
    visibility: 'private' | 'unlisted' | 'public';
    votes: number;
    uploadedBy: { username: string; email: string; _id: string };
    createdAt: Date;
}
  
interface User {
    _id: string;
    username: string;
    email: string;
    profilePhotoUrl?: string;
    bio?: string;
    followersCount: number;
    followingCount: number;
    followers: string[];
    following: string[];
    role: 'user' | 'admin' | 'moderator';
    status: 'active' | 'suspended' | 'deleted';
    lastLogin?: Date;
    socialLinks?: {
        twitter?: string;
        instagram?: string;
        linkedin?: string;
    };
    preferences?: {
        darkMode: boolean;
        notifications: boolean;
    };
    uploadedFilmsCount: number;
    createdAt: Date;
}

const Explore = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [pressed, setPressed] = useState(false);
    const [viewMode, setViewMode] = useState<'films' | 'users'>('films');
    const [films, setFilms] = useState<Film[] | null>(null);
    const [users, setUsers] = useState<User[] | null>(null);
    const [loading, setLoading] = useState(false);

    const { userId, token } = useAuth();
    const navigate = useNavigate();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Fetch Films from the backend
    useEffect(() => {
        if (viewMode === 'films') {
            //navigate('/explore/films')
            setLoading(true);
            axios.get(`${import.meta.env.VITE_API_URL}/api/films`) // Replace with your films API endpoint
                .then((response) => {
                    console.log(response.data)
                    setFilms(response.data); // Adjust response structure if necessary
                })
                .catch((error) => console.error('Error fetching films:', error))
                .finally(() => setLoading(false));
        }
    }, [viewMode]);

    // Fetch Users from the backend
    useEffect(() => {
        if (viewMode === 'users') {
            //navigate('/explore/users')
            setLoading(true);
            axios.get(`${import.meta.env.VITE_API_URL}/api/users`,{
                headers: { Authorization: `Bearer ${token}` },
            }) // Replace with your users API endpoint
                .then((response) => {
                    setUsers(response.data); // Adjust response structure if necessary
                })
                .catch((error) => console.error('Error fetching users:', error))
                .finally(() => setLoading(false));
        }
    }, [viewMode]);

    return (
        <div className="min-h-screen flex flex-col bg-charcoal text-crispWhite">
            <LeftFeedNav />
            <main className="flex-grow container max-w-[60%] mx-auto px-4 py-8">
                {/* INPUT */}
                <div className="flex justify-center items-center mb-6">
                    <div className="flex flex-grow items-center bg-charcoal max-w-[600px] h-12">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="rounded-l-md bg-charcoal border border-steelGray shadow-inner shadow-secondary py-2 px-4 text-lg w-full focus:border-cornflowerBlue outline-none h-[100%]"
                        />
                        <button className="py-2 px-4 rounded-r-md border border-steelGray hover:border-cornflowerBlue border-l-0 flex-shrink-0 bg-charcoal h-[100%]">
                            <FaSearch className="text-steelGray text-lg" />
                        </button>
                    </div>
                </div>

                {/* Toggle View Mode */}
                <div className="flex justify-center mb-4">
                    <button
                        onClick={() => setViewMode('films')}
                        className={`px-4 py-2 rounded-l-md ${viewMode === 'films' ? 'bg-cornflowerBlue text-white' : 'bg-charcoal border border-steelGray hover:border-cornflowerBlue'}`}
                    >
                        Films
                    </button>
                    <button
                        onClick={() => setViewMode('users')}
                        className={`px-4 py-2 rounded-r-md ${viewMode === 'users' ? 'bg-cornflowerBlue text-white' : 'bg-charcoal border border-steelGray hover:border-cornflowerBlue'}`}
                    >
                        Users
                    </button>
                </div>

                {/* Category Pills */}
                {viewMode === 'films' && (
                    <div className='flex justify-center'>
                        <CategoryPills categories={['All', 'Drama', 'Comedy', 'Action']} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
                    </div>
                )}

                {/* Content Section */}
                <section className="mb-12 mt-8">
                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : viewMode === 'films' ? (
                        <>
                            <h1 className="text-4xl font-bold mb-6">Your Feed</h1>
                            <div className="grid gap-6 grid-cols-1">
                                {films?.map((film, index) => (
                                    <div key={index} className="bg-charcoal rounded-lg overflow-hidden mt-8">
                                        <div className="relative group cursor-pointer" onClick={() => navigate(`/films/${film._id}`)}>
                                            <img
                                                src={film.thumbnailUrl}
                                                alt={film.title}
                                                className="aspect-w-16 aspect-h-9 w-full object-cover rounded-lg shadow-lg"
                                            />
                                            {/* Play button */}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                                <button
                                                    className="text-crispWhite text-4xl"
                                                >
                                                    <FaPlay />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex-grow p-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-xl font-bold">{film.title}</h3>
                                                    <p className="text-sm text-gray-400">by {film.uploadedBy?.username}</p>
                                                </div>
                                                <div className="flex space-x-4">
                                                    <button onClick={() => setPressed(!pressed)} className="text-crispWhite hover:text-cornflowerBlue">
                                                        {pressed ? <BiSolidUpvote className='text-3xl text-cornflowerBlue' /> : <BiUpvote className='text-3xl' />}
                                                    </button>
                                                    <button className="text-crispWhite hover:text-cornflowerBlue">
                                                        <FaRegComment className='text-2xl' />
                                                    </button>
                                                    <button className="text-crispWhite hover:text-cornflowerBlue">
                                                        <FiSend className='text-2xl' />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-4xl font-bold mb-6">Recommended Users</h1>
                            <div className="grid gap-6 grid-cols-1">
                                {users?.slice(0, 10).map((user, index) => (
                                    <div key={index} className="bg-charcoal rounded-lg overflow-hidden p-4">
                                        <div className="flex items-center">
                                            <img src={user.profilePhotoUrl} alt={user.username} className="w-12 h-12 rounded-full object-cover mr-4" />
                                            <div className='mb-2'>
                                                <h3 className="text-xl font-bold">{user.username}</h3>
                                                <p className="text-sm text-gray-400">{user.bio}</p>
                                            </div>
                                        </div>
                                        <FollowButton 
                                            targetUserId={user._id || ''}  
                                            token={token || ''}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Explore;
