import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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
    uploadedBy: { username: string; email: string; _id: string };
    createdAt: Date;
}

const Watch = () => {
    const { id } = useParams(); // Get the film ID from the route
    const [film, setFilm] = useState<Film | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch film data from the backend
    useEffect(() => {
        const fetchFilm = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/films/${id}`);
                setFilm(response.data); // Assume the API returns the film object
            } catch (error) {
                console.error('Error fetching film:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFilm();
    }, [id]);

    if (loading) {
        return <div className="text-center text-lg text-crispWhite">Loading...</div>;
    }

    if (!film) {
        return <div className="text-center text-lg text-crispWhite">Film not found.</div>;
    }

    return (
        <div className="min-h-screen bg-charcoal text-crispWhite p-8">
            {/* Film Header */}
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">{film.title}</h1>
                <p className="text-sm text-gray-400 mb-6">
                    Uploaded by <span className="font-semibold">{film.uploadedBy.username}</span> on{' '}
                    {new Date(film.createdAt).toLocaleDateString()}
                </p>

                {/* Film Player */}
                <div className="relative aspect-w-16 aspect-h-9 mb-8">
                    <video
                        src={film.filmUrl}
                        controls
                        className="w-full h-full object-cover rounded-lg shadow-lg"
                    ></video>
                </div>

                {/* Film Details */}
                <div className="bg-charcoal border border-steelGray rounded-lg p-6 shadow-inner shadow-secondary">
                    <h2 className="text-2xl font-bold mb-4">Description</h2>
                    <p className="text-lg">{film.description || 'No description provided.'}</p>

                    <h3 className="text-xl font-semibold mt-6 mb-2">Genre</h3>
                    <p className="text-lg">{film.genre || 'Not specified.'}</p>

                    <h3 className="text-xl font-semibold mt-6 mb-2">Duration</h3>
                    <p className="text-lg">{film.duration ? `${film.duration} minutes` : 'Not available.'}</p>
                </div>
            </div>
        </div>
    );
};

export default Watch;
