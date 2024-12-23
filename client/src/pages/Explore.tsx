import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaPlay } from 'react-icons/fa';
import { FiSend } from "react-icons/fi";
import Footer from '../components/Footer';
import CategoryPills from '../components/CategoryPills';
import FollowButton from '../components/FollowButton';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import ProfileLink from '../components/ProfileLink';
import Vote from '../components/Vote';
import { categories } from '../data/home';
import { Film } from '../types/Film';
import { User } from '../types/User';
import Comment from '../components/Comment';
import TopTenFilms from '../components/TopTenFilms';
import FeedHeader from '@/components/FeedHeader';
import { useIsMobile } from '@/context/MobileContext';
import { formatDistanceToNow } from 'date-fns';
import Astronaut from '../assets/img/profilePic/profile-astronaut.jpg'

const Explore = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState<'films' | 'users'>('films');
    const [films, setFilms] = useState<Film[] | null>(null);
    const [filteredFilms, setFilteredFilms] = useState<Film[] | null>(null);
    const [users, setUsers] = useState<User[] | null>(null);
    const [filteredUsers, setFilteredUsers] = useState<User[] | null>(null);
    const [loading, setLoading] = useState(false);

    const { token } = useAuth();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Filter films based on search and category
    const filterFilms = () => {
        if (films) {
            const filtered = films.filter(film => {
                const matchesSearch = film.title.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = selectedCategory === 'All' || film.genre?.toLowerCase() === selectedCategory.toLowerCase();
                return matchesSearch && matchesCategory;
            });
            setFilteredFilms(filtered);
        }
    };

    // Fetch Films from the backend
    useEffect(() => {
        if (viewMode === 'films') {
            setLoading(true);
            axios.get(`${import.meta.env.VITE_API_URL}/api/films`)
                .then((response) => {
                    setFilms(response.data);
                    setFilteredFilms(response.data);
                })
                .catch((error) => console.error('Error fetching films:', error))
                .finally(() => setLoading(false));
        }
    }, [viewMode]);

    // Fetch Users from the backend
    useEffect(() => {
        if (viewMode === 'users') {
            setLoading(true);
            axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => {
                    setUsers(response.data);
                    setFilteredUsers(response.data);
                })
                .catch((error) => console.error('Error fetching users:', error))
                .finally(() => setLoading(false));
        }
    }, [viewMode]);

    // Filter results whenever searchQuery, selectedCategory, or viewMode changes
    useEffect(() => {
        filterFilms();
    }, [searchQuery, selectedCategory, viewMode, films]);

    return (
        <div className="min-h-screen flex flex-col bg-charcoal text-crispWhite">
            <FeedHeader />
            <main className={`flex-grow container ${isMobile ? ("w-full") : ("max-w-[80%]")} mx-auto py-2`}>
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
                        <CategoryPills categories={categories} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
                    </div>
                )}

                

                {/* Content Section */}
                <section className="mb-12 mt-8">
                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : viewMode === 'films' ? (
                        <>
                            <TopTenFilms />
                            <h1 className={`font-bold mb-6 ${isMobile ? ("ml-2 text-xl") : ("text-4xl")}`}>Your Feed</h1>
                            <div 
                                className={`${!isMobile && ("grid gap-6")}`}
                                style={{
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                                    maxWidth: '100%',
                                }}
                            >
                                {filteredFilms?.map((film) => (
                                    <>
                                        {isMobile ? (
                                            <div key={film._id} className="bg-charcoal overflow-hidden mt-4 group">
                                                <div
                                                    className="relative w-full pb-[60%] cursor-pointer"
                                                    onClick={() => navigate(`/films/${film._id}`)}
                                                >
                                                    <img
                                                        src={film.thumbnailUrl}
                                                        alt={film.title}
                                                        className="absolute top-0 left-0 w-full h-full object-cover shadow-lg"
                                                    />
                                                </div>
                                                <div className="flex-grow py-2">
                                                    <div className="flex justify-between px-2 items-center">
                                                        <div>
                                                            <h3 className="text-lg font-bold">{film.title}</h3>
                                                            <p className="text-xs text-gray-400"><ProfileLink username={film.uploadedBy.username} userId={film.uploadedBy._id} /> • {formatDistanceToNow(new Date(film.createdAt), { addSuffix: true })}</p>
                                                        </div>
                                                        <div className="flex space-x-2 items-center">
                                                            <Vote filmId={film._id} />
                                                            <Comment filmId={film._id} />
                                                            {/* <button className="text-crispWhite border border-steelGray px-3 py-1 rounded-full hover:text-cornflowerBlue">
                                                                <FiSend className="text-xl" />
                                                            </button> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (

                                            <div key={film._id} className="bg-charcoal rounded-lg overflow-hidden mt-8 group">
                                                <div className="relative w-full pb-[60%] cursor-pointer" onClick={() => navigate(`/films/${film._id}`)}>
                                                    <img
                                                        src={film.thumbnailUrl}
                                                        alt={film.title}
                                                        className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg"
                                                    />
                                                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                        <FaPlay className="text-crispWhite text-4xl"/>
                                                    </div>
                                                </div>
                                                <div className="flex-grow p-4">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <h3 className="text-xl font-bold">{film.title}</h3>
                                                            <p className="text-sm text-gray-400">by <ProfileLink username={film.uploadedBy.username} userId={film.uploadedBy._id} /></p>
                                                        </div>
                                                        <div className="flex space-x-4 items-center">
                                                            <Vote filmId={film._id} />
                                                            <Comment filmId={film._id}/>
                                                            <button className="text-crispWhite hover:text-cornflowerBlue">
                                                                <FiSend className="text-2xl" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div>
                            <h1 className={`font-bold mb-6 ${isMobile ? ("ml-2 text-xl") : ("text-4xl")}`}>Recommended Users</h1>
                            <div className="grid gap-6 grid-cols-1">
                                {filteredUsers?.map((user, index) => (
                                    <div key={user._id} className="bg-charcoal rounded-lg overflow-hidden py-4 px-4">
                                        <div className="flex justify-between items-center">
                                            <div className='flex'>
                                                <img src={user.profilePhotoUrl || Astronaut} alt={user.username} className="w-12 h-12 rounded-full object-cover mr-4" />
                                                <div className='mb-2 text-xl'>
                                                    <div className='text-sm'>
                                                    <ProfileLink username={user.username} userId={user._id} />
                                                    </div>
                                                    {user.bio && (
                                                    <p className="text-xs text-gray-400">{user.followersCount} followers • {user.uploadedFilmsCount} films</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='ml-4'>
                                                <FollowButton targetUserId={user._id || ''} token={token || ''} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Explore;
