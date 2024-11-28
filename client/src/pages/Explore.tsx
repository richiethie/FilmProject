import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaRegComment, FaPlay } from 'react-icons/fa';
import { FiSend } from "react-icons/fi";
import Footer from '../components/Footer';
import CategoryPills from '../components/CategoryPills';
import LeftFeedNav from '../components/LeftFeedNav';
import FollowButton from '../components/FollowButton';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import ProfileLink from '../components/ProfileLink';
import Vote from '../components/Vote';
import { categories } from '../data/home';
import { Film } from '../types/Film';
import { User } from '../types/User';
import Comment from '../components/Comment';

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
                        <CategoryPills categories={categories} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
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
                                {filteredFilms?.map((film) => (
                                    <div key={film._id} className="bg-charcoal rounded-lg overflow-hidden mt-8">
                                        <div className="relative group cursor-pointer" onClick={() => navigate(`/films/${film._id}`)}>
                                            <img
                                                src={film.thumbnailUrl}
                                                alt={film.title}
                                                className="aspect-w-16 aspect-h-9 w-full object-cover rounded-lg shadow-lg"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                                <button className="text-crispWhite text-4xl">
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
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-4xl font-bold mb-6">Recommended Users</h1>
                            <div className="grid gap-6 grid-cols-1">
                                {filteredUsers?.map((user, index) => (
                                    <div key={index} className="bg-charcoal rounded-lg overflow-hidden p-4">
                                        <div className="flex items-center">
                                            <img src={user.profilePhotoUrl} alt={user.username} className="w-12 h-12 rounded-full object-cover mr-4" />
                                            <div className='mb-2 text-xl'>
                                                <ProfileLink username={user.username} userId={user._id} />
                                                <p className="text-sm text-gray-400">{user.bio}</p>
                                            </div>
                                        </div>
                                        <FollowButton targetUserId={user._id || ''} token={token || ''} />
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
