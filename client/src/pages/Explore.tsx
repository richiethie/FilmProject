import { useState, useEffect, useRef } from 'react';
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
import { Tabs } from '@chakra-ui/react';
import Loading from './Loading';
import { formatDuration } from '../utils/formatDuration';

const Explore = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState<'films' | 'users' | 'series'>('films');
    const [films, setFilms] = useState<Film[]>([]);
    const [filteredFilms, setFilteredFilms] = useState<Film[] | null>(null);
    const [users, setUsers] = useState<User[] | null>(null);
    const [filteredUsers, setFilteredUsers] = useState<User[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeVideo, setActiveVideo] = useState<string | null>(null); // State for active video
    const [remainingTime, setRemainingTime] = useState<number | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    const { token } = useAuth();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        let isScrolling = false;
    
        const options = {
            root: null,
            threshold: 0.95, // Adjust the threshold as needed
        };
    
        const handleIntersect = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                const id = entry.target.getAttribute('data-id');
                
                // Only select videos that are fully visible at the top of the viewport
                if (id && entry.isIntersecting && entry.boundingClientRect.top >= 0 && !isScrolling) {
                    setActiveVideo(id); // Set the video as active if it’s at the top and visible
                }
            });
        };
        
    
        const initObserver = () => {
            observerRef.current = new IntersectionObserver(handleIntersect, options);
            const videoContainers = document.querySelectorAll('[data-id]');
            videoContainers.forEach((el) => observerRef.current!.observe(el));
        };
    
        const handleScroll = () => {
            isScrolling = true;
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
            scrollTimeout.current = setTimeout(() => {
                isScrolling = false; // Reset the scrolling flag after debounce
                if (observerRef.current) {
                    observerRef.current.disconnect(); // Disconnect old observer
                    const videoContainers = document.querySelectorAll('[data-id]');
                    videoContainers.forEach((el) => observerRef.current!.observe(el)); // Re-observe
                }
            }, 700); // Debounce delay
        };
    
        window.addEventListener('scroll', handleScroll);
    
        initObserver(); // Initialize observer on component mount
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (observerRef.current) observerRef.current.disconnect();
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, []); // Empty dependency array to run only on mount

    useEffect(() => {
        if (activeVideo && films?.length > 0) {
            const video = document.querySelector(`video[src="${films.find(f => f._id === activeVideo)?.filmUrl}"]`) as HTMLVideoElement;

            if (video) {
                video.currentTime = 0; // Reset video time on each new video

                const handleTimeUpdate = () => {
                    setRemainingTime(Math.floor(video.duration - video.currentTime));
                };

                video.addEventListener('timeupdate', handleTimeUpdate);
                video.play().catch(console.error); // Auto play video if active

                return () => {
                    video.removeEventListener('timeupdate', handleTimeUpdate);
                    video.pause(); // Pause the video when leaving the view
                };
            }
        }
    }, [activeVideo, films]);

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
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL}/api/films`)
            .then((response) => {
                setFilms(response.data);
                setFilteredFilms(response.data);
            })
            .catch((error) => console.error('Error fetching films:', error))
            .finally(() => setLoading(false));
    }, []);

    // Fetch Users from the backend
    useEffect(() => {
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
    }, []);

    // Filter results whenever searchQuery, selectedCategory, or viewMode changes
    useEffect(() => {
        filterFilms();
    }, [searchQuery, selectedCategory, viewMode, films]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-charcoal text-crispWhite">
            <FeedHeader />
            <main className={`flex-grow container ${isMobile ? ("w-full") : ("max-w-[95%]")} mx-auto py-2`}>
                {/* Toggle View Mode */}
                <Tabs.Root lazyMount unmountOnExit defaultValue="films">
                    <Tabs.List className={`mb-2 ${!isMobile && ("flex justify-center")}`}>
                        <Tabs.Trigger className='p-4' value="films">Films</Tabs.Trigger>
                        <Tabs.Trigger className='p-4' value="users">Users</Tabs.Trigger>
                        <Tabs.Trigger className='p-4' value="series">Series</Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value='films'>
                        <>
                            <div className='flex justify-center'>
                                <CategoryPills categories={categories} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
                            </div>
                            <TopTenFilms />
                            <h1 className={`font-bold mb-6 ${isMobile ? ("ml-2 text-xl") : ("text-4xl")}`}>Your Feed</h1>
                            <div 
                                className={`${!isMobile && ("grid gap-6")}`}
                                style={{
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                                    maxWidth: '100%',
                                }}
                            >
                                {filteredFilms?.map((film, index) => (
                                    <div key={index} >
                                        {isMobile ? (
                                            <div 
                                                key={film._id} 
                                                className="bg-charcoal overflow-hidden mt-4 group"
                                                data-id={film._id}
                                            >
                                                <div
                                                    className="relative w-full pb-[60%] cursor-pointer"
                                                    onClick={() => navigate(`/films/${film._id}`)}
                                                >
                                                    {activeVideo === film._id ? (
                                                        <video
                                                            src={film.filmUrl}
                                                            muted
                                                            loop
                                                            className="absolute top-0 left-0 w-full h-full object-cover video"
                                                            autoPlay={activeVideo === film._id}
                                                            playsInline
                                                        />
                                                    ) : (
                                                        <img
                                                            src={film.thumbnailUrl}
                                                            alt={film.title}
                                                            className="absolute top-0 left-0 w-full h-full object-cover shadow-lg"
                                                        />
                                                    )}
                                                    {activeVideo === film._id && remainingTime !== null ? (
                                                        <div className="duration-overlay absolute bottom-1 right-1 bg-black bg-opacity-60 px-1 rounded-lg">
                                                            <span className="text-white text-xs">{formatDuration(remainingTime)}</span>
                                                        </div>
                                                    ): (
                                                        <div className="duration-overlay absolute bottom-1 right-1 bg-black bg-opacity-60 px-1 rounded-lg">
                                                            <span className="text-white text-xs">{formatDuration(film.duration)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-grow py-2">
                                                    <div className="flex justify-between px-2 items-center">
                                                        <div>
                                                            <h3 className="text-lg font-bold">{film.title}</h3>
                                                            <div className='text-sm'>
                                                                <ProfileLink username={film.uploadedBy.username} userId={film.uploadedBy._id} />
                                                            </div>
                                                            <p className="text-xs text-gray-400">{film.views} views • {formatDistanceToNow(new Date(film.createdAt), { addSuffix: true })}</p>
                                                        </div>
                                                        <div className="flex space-x-2 items-center">
                                                            <Vote filmId={film._id} />
                                                            <Comment filmId={film._id} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (

                                            <div key={film._id} className="bg-charcoal rounded-lg overflow-hidden mt-8 group">
                                                <div className="relative w-full pb-[60%] cursor-pointer" onClick={() => navigate(`/films/${film._id}`)}>
                                                    {activeVideo === film._id ? (
                                                        <video
                                                            src={film.filmUrl}
                                                            muted
                                                            loop
                                                            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg video"
                                                            autoPlay={activeVideo === film._id}
                                                            playsInline
                                                            onMouseLeave={() => setActiveVideo('')}
                                                        />
                                                    ) : (
                                                        <img
                                                            src={film.thumbnailUrl}
                                                            alt={film.title}
                                                            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg"
                                                            onMouseEnter={() => setActiveVideo(film._id)}
                                                        />
                                                    )}
                                                    {activeVideo === film._id && remainingTime !== null ? (
                                                        <div className="duration-overlay absolute bottom-1 right-1 bg-black bg-opacity-60 px-1 rounded-lg">
                                                            <span className="text-white text-xs">{formatDuration(remainingTime)}</span>
                                                        </div>
                                                    ): (
                                                        <div className="duration-overlay absolute bottom-1 right-1 bg-black bg-opacity-60 px-1 rounded-lg">
                                                            <span className="text-white text-xs">{formatDuration(film.duration)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-grow py-2">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <h3 className="text-xl font-bold">{film.title}</h3>
                                                            <ProfileLink username={film.uploadedBy.username} userId={film.uploadedBy._id} />
                                                            <p className="text-xs text-gray-400">{film.views || 0} views • {formatDistanceToNow(new Date(film.createdAt), { addSuffix: true })}</p>
                                                        </div>
                                                        <div className="flex space-x-4 items-center">
                                                            <Vote filmId={film._id} />
                                                            <Comment filmId={film._id}/>
                                                            {/* <button className="text-crispWhite hover:text-cornflowerBlue">
                                                                <FiSend className="text-2xl" />
                                                            </button> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    </Tabs.Content>

                    <Tabs.Content value='users'>
                        <div className={`${!isMobile && ("flex flex-col justify-center items-center w-full")}`}>
                            <div className={`${!isMobile && ("w-[672px] mx-auto")}`}>
                                <h1 className={`font-bold mb-6 ${isMobile ? ("ml-2 text-xl") : ("text-2xl")}`}>Recommended Users</h1>
                                <div className="grid gap-6 grid-cols-1">
                                    {filteredUsers?.map((user, index) => (
                                        <div key={user._id} className={`bg-charcoal rounded-lg overflow-hidden ${user.topCreator === false ? ("py-4 px-4") : ("px-2")}`}>
                                            {user.topCreator === true ? (
                                                <div className='bg-darkCharcoal px-2 py-2 rounded-lg'>
                                                    <div className="flex justify-between items-center">
                                                        <div className='flex items-center'>
                                                            <img src={user.profilePhotoUrl || Astronaut} alt={user.username} className="w-16 h-16 rounded-full border border-fireOrange object-cover mr-4" />
                                                            <div className='mb-2 text-xl'>
                                                                <div className='text-sm'>
                                                                    <ProfileLink username={user.username} userId={user._id} />
                                                                </div>
                                                                <p className="text-xs text-gray-400">{user.followersCount} followers • {user.uploadedFilmsCount} films</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className='text-xs text-center mt-2 mb-4  p-2 rounded-lg'>{user.bio || "This user may not have a bio, but they are still a top creator"}</p>
                                                    </div>
                                                    <div className='flex justify-center items-center my-2'>
                                                        <FollowButton targetUserId={user._id || ''} token={token || ''} />
                                                        <button className='bg-darkFireOrange px-3 py-1 ml-8 rounded-lg text-sm'>Achievements</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex justify-between items-center">
                                                    <div className='flex items-center'>
                                                        <img src={user.profilePhotoUrl || Astronaut} alt={user.username} className="w-12 h-12 rounded-full object-cover mr-4" />
                                                        <div className='mb-2 text-xl'>
                                                            <div className='text-sm'>
                                                                <ProfileLink username={user.username} userId={user._id} />
                                                            </div>
                                                            <p className="text-xs text-gray-400">{user.followersCount} followers • {user.uploadedFilmsCount} films</p>
                                                        </div>
                                                    </div>
                                                    <div className='ml-4'>
                                                        <FollowButton targetUserId={user._id || ''} token={token || ''} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Tabs.Content>
                    <Tabs.Content value='series'>
                        <div>
                            <p className='text-center'>Nothing here yet</p>
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </main>
            <Footer />
        </div>
    );
};

export default Explore;
