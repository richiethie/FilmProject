import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import CategoryPills from '../components/CategoryPills';
import axios from 'axios';
import { categories } from '../data/home';
import { useAuth } from '../context/AuthContext';
import { Film } from '../types/Film';
import { FaPlay } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router for navigation
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

const Feed = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [films, setFilms] = useState<Film[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { token } = useAuth();
    const navigate = useNavigate();

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

    // Filter films based on the selected category (if applicable)
    const filteredFilms =
        selectedCategory === 'All'
            ? films
            : films.filter((film) => film.genre?.toLowerCase() === selectedCategory.toLowerCase());

    const skeletonCount = filteredFilms.length || 16;

    return (
        <div className="min-h-screen flex flex-col bg-charcoal text-crispWhite">
            <FeedHeader />
            <main className="flex-grow container max-w-[80%] mx-auto px-4 py-8">
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
                        <p>No films found.</p>
                    ) : (
                        <div
                            className="grid gap-6"
                            style={{
                                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                                maxWidth: '100%',
                            }}
                        >
                            {filteredFilms.map((film) => (
                                <div key={film._id} className="bg-charcoal rounded-lg overflow-hidden mt-8 group">
                                    <div
                                        className="relative w-full pb-[60%] cursor-pointer"
                                        onClick={() => navigate(`/films/${film._id}`)}
                                    >
                                        <img
                                            src={film.thumbnailUrl}
                                            alt={film.title}
                                            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg"
                                        />
                                        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <FaPlay className="text-crispWhite text-4xl" />
                                        </div>
                                    </div>
                                    <div className="flex-grow py-2">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-xl font-bold">{film.title}</h3>
                                                <p className="text-sm text-gray-400"><ProfileLink username={film.uploadedBy.username} userId={film.uploadedBy._id} /> • {formatDistanceToNow(new Date(film.createdAt), { addSuffix: true })}</p>
                                            </div>
                                            <div className="flex space-x-4 items-center">
                                                <Vote filmId={film._id} />
                                                <Comment filmId={film._id} />
                                                <button className="text-crispWhite hover:text-cornflowerBlue">
                                                    <FiSend className="text-2xl" />
                                                </button>
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
        </div>
    );
};

export default Feed;
