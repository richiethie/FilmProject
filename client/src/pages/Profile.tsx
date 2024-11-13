import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import LeftFeedNav from '../components/LeftFeedNav';
import axios from 'axios'; // Add axios for HTTP requests
import { IoMdTrendingUp } from 'react-icons/io';
import { useAuth } from '../context/AuthContext';

interface Film {
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
    uploadedBy: string;
    createdAt: Date;
}

const Profile = () => {
    const [films, setFilms] = useState<Film[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { userId, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!userId) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }

        axios.get(`${import.meta.env.VITE_API_URL}/api/films/user/${userId}`)
            .then(response => {
                console.log('API Response:', response.data);
                // Ensure the response data is an array
                if (Array.isArray(response.data)) {
                    setFilms(response.data);
                } else {
                    setError('Invalid response format');
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching films:', error);
                setError('Error fetching films');
                setLoading(false);
            });
    }, [userId]);

    // Ensure films is an array before calling .some
    const hasRankedFilms = Array.isArray(films) && films.some(film => film.rank !== undefined);

    return (
        <div className="min-h-screen flex flex-col bg-charcoal text-crispWhite">
            <LeftFeedNav />
            <main className="flex-grow container max-w-[90%] sm:max-w-[80%] md:max-w-[60%] mx-auto px-4 py-8">
                {/* My Posts Section */}
                <section>
                    <h2 className="text-2xl font-bold mb-4">My Posts</h2>
                    {loading ? (
                        <p>Loading films...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Make sure films is an array before mapping */}
                            {Array.isArray(films) && films.length > 0 ? (
                                films.map((film, index) => (
                                    <div key={index} className="bg-charcoal rounded-lg overflow-hidden">
                                        <div className="relative w-full pb-[56.25%]"> {/* 16:9 aspect ratio */}
                                            <img
                                                src={film.thumbnailUrl}
                                                alt={film.title}
                                                className={`${film.rank && 'border-4 border-cornflowerBlue'} absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg`}
                                            />
                                            {film.rank && (
                                                <div className="absolute top-3 left-4 text-cornflowerBlue">
                                                    <IoMdTrendingUp className="text-3xl" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <h3 className="text-xl font-bold">{film.title}</h3>
                                                <p className="text-sm text-gray-400">by {film.uploadedBy}</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <p className="text-sm text-gray-400">{film.votes} votes</p>
                                                {film.rank ? <p className="text-cornflowerBlue">RANK #{film.rank}</p> : <p>-</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No films available</p>
                            )}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
