import { useState, useEffect, useRef } from 'react';
import Footer from '../components/Footer';
import CategoryPills from '../components/CategoryPills';
import axios from 'axios';
import { categories } from '../data/home';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '@/context/MobileContext';
import { Film } from '../types/Film';
import { FaPlay } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom'; // Assuming you use react-router for navigation
import Vote from '../components/Vote';
import ProfileLink from '../components/ProfileLink';
import Comment from '../components/Comment';
import FeedHeader from '@/components/FeedHeader';
import { formatDistanceToNow } from 'date-fns';
import { HStack, Stack } from "@chakra-ui/react"
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@/components/ui/skeleton"
import { IoSearch } from 'react-icons/io5';
import { formatDuration } from '../utils/formatDuration';


const Feed = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [films, setFilms] = useState<Film[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeVideo, setActiveVideo] = useState<string | null>(null); // State for active video
    const [remainingTime, setRemainingTime] = useState<number | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    const { token } = useAuth();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchFeedFilms = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/films/feed`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFilms(response.data);
            } catch (err) {
                console.error('Error fetching feed films:', err);
                setError('Failed to load feed films.');
            } finally {
                setLoading(false);
            }
        };

        fetchFeedFilms();
    }, [token]);

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
        if (activeVideo && films.length > 0) {
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

    // Filter films based on the selected category (if applicable)
    const filteredFilms =
        selectedCategory === 'All'
            ? films
            : films.filter((film) => film.genre?.toLowerCase() === selectedCategory.toLowerCase());

    const skeletonCount = filteredFilms.length || 16;

    return (
        <div className="min-h-screen flex flex-col bg-charcoal text-crispWhite">
            {isMobile ? (
                <>
                    <FeedHeader /> 
                    <main className="flex-grow container py-4">
                        <CategoryPills
                            categories={categories} // Extend categories as needed
                            selectedCategory={selectedCategory}
                            onSelect={setSelectedCategory}
                        />
                        <section>
                            <h1 className="text-2xl font-bold mt-4 mx-2">Your Feed</h1>
                            {loading ? (
                                <div
                                    className='flex flex-col space-y-6 mt-4'
                                >
                                    {Array.from({ length: skeletonCount }).map((_, index) => (
                                        <Stack gap="6" key={index}>
                                            <Skeleton height="200px" />
                                            <HStack width="full">
                                                <SkeletonCircle size="10" />
                                                <SkeletonText noOfLines={2} />
                                            </HStack>
                                        </Stack>
                                    ))}
                                </div>
                            ) : error ? (
                                <div className='flex flex-col justify-center items-center mt-12'>
                                    <p>Nothing in your Feed yet!</p>
                                    <p>Find users to follow to populate your feed</p>
                                    <Link to="/login" className="flex items-center bg-cornflowerBlue hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2 mt-4">
                                        <IoSearch className='text-2xl'/>
                                        <span className='font-semibold ml-2'>Explore</span>
                                    </Link>
                                </div>
                            ) : filteredFilms.length === 0 ? (
                                <div className='flex flex-col justify-center items-center mt-12'>
                                    <p>Nothing in your Feed yet!</p>
                                    <p>Find users to follow to populate your feed</p>
                                    <Link to="/explore" className="flex items-center bg-cornflowerBlue hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2 mt-4">
                                        <IoSearch className='text-2xl'/>
                                        <span className='font-semibold ml-2'>Explore</span>
                                    </Link>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                                        maxWidth: '100%',
                                    }}
                                >
                                    {filteredFilms.map((film) => (
                                        <div 
                                            key={film._id} 
                                            className="bg-charcoal overflow-hidden mt-4 group" 
                                            data-id={film._id}
                                        
                                        >
                                            <div
                                                className="relative w-full pb-[60%] cursor-pointer video-container"
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
                                                        <h3 className="text-xl font-bold">{film.title}</h3>
                                                        <div className='text-sm'>
                                                            <ProfileLink username={film.uploadedBy.username} userId={film.uploadedBy._id} />
                                                        </div>
                                                        <p className="text-xs text-gray-400">{film.views || 0} views • {formatDistanceToNow(new Date(film.createdAt), { addSuffix: true })}</p>
                                                    </div>
                                                    <div className="flex space-x-2 items-center">
                                                        <Vote filmId={film._id} />
                                                        <Comment filmId={film._id} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </main>
                    <Footer />
                </>
            ) : (
                <>
                    <FeedHeader />
                    <main className="flex-grow container max-w-[95%] mx-auto px-4 py-8">
                        {/* Category Pills */}
                        <div className="flex justify-center mb-6">
                            <CategoryPills
                                categories={categories} // Extend categories as needed
                                selectedCategory={selectedCategory}
                                onSelect={setSelectedCategory}
                            />
                        </div>
        
                        {/* Feed Films Section */}
                        <section className="mb-12">
                            <h1 className="text-4xl font-bold mb-6">Your Feed</h1>
                            {loading ? (
                                <div
                                    className="grid gap-6"
                                    style={{
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                                        maxWidth: '100%',
                                    }}
                                >
                                    {Array.from({ length: skeletonCount }).map((_, index) => (
                                        <Stack gap="6" key={index}>
                                            <Skeleton className='rounded-lg' height="200px" />
                                            <HStack width="full">
                                                <SkeletonCircle size="10" />
                                                <SkeletonText noOfLines={2} />
                                            </HStack>
                                        </Stack>
                                    ))}
                                </div>
                            ) : error ? (
                                <p>{error}</p>
                            ) : filteredFilms.length === 0 ? (
                                <div className='flex flex-col justify-center items-center mt-24'>
                                    <p>Nothing in your Feed yet!</p>
                                    <p>Find users to follow to populate your feed</p>
                                    <Link to="/explore" className="flex items-center bg-cornflowerBlue hover:text-cornflowerBlue hover:bg-darkCharcoal rounded-lg p-2 mt-4">
                                        <IoSearch className='text-2xl'/>
                                        <span className='font-semibold ml-2'>Explore</span>
                                    </Link>
                                </div>
                            ) : (
                                <div
                                    className="grid gap-6"
                                    style={{
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                                        maxWidth: '100%',
                                    }}
                                >
                                    {filteredFilms.map((film) => (
                                        <div key={film._id} className="bg-charcoal rounded-lg overflow-hidden mt-8 group">
                                            <div
                                                className="relative w-full pb-[60%] cursor-pointer"
                                                onClick={() => navigate(`/films/${film._id}`)}
                                            >
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
                                                    <div className="flex space-x-2 items-center">
                                                        <Vote filmId={film._id} />
                                                        <Comment filmId={film._id} />
                                                        {/* <button className="text-crispWhite border border-steelGray px-3 py-2 rounded-full hover:text-cornflowerBlue">
                                                            <FiSend className="text-xl" />
                                                        </button> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </main>
                    <Footer />
                </>
            )}
        </div>
    );
};

export default Feed;
