import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProfileLink from '../components/ProfileLink';
import { Film } from '../types/Film';
import { Comment } from '../types/Comment';

const Watch = () => {
    const { id } = useParams(); // Get the film ID from the route
    const [film, setFilm] = useState<Film | null>(null);
    const [otherFilms, setOtherFilms] = useState<Film[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const { token, username } = useAuth();

    // Fetch the current film data
    useEffect(() => {
        const fetchFilm = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/films/${id}`);
                setFilm(response.data);
            } catch (error) {
                console.error('Error fetching film:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFilm();
    }, [id]);

    // Fetch other films from the same creator
    useEffect(() => {
        if (film?.uploadedBy._id) {
            const fetchOtherFilms = async () => {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_URL}/api/films/user/${film.uploadedBy._id}`
                    );
                    setOtherFilms(response.data);
                } catch (error) {
                    console.error('Error fetching other films:', error);
                }
            };

            fetchOtherFilms();
        }
    }, [film]);

    // Fetch comments for the current film
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/comments/film/${id}`);
                setComments(response.data); // Comments should already have 'user._id' and 'user.username'
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
    
        fetchComments();
    }, [id]);

    // Handle adding a new comment
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return; // Prevent empty comments
    
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/comments/film/${id}`,
                { text: newComment },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            const newCommentData = response.data;
    
            // Manually add the username if it's missing
            const populatedComment = {
                ...newCommentData,
                user: {
                    ...newCommentData.user,
                    username: username, // Replace with actual username from your context
                },
            };
    
            // Update the comments state
            setComments((prev) => [populatedComment, ...prev]);
    
            setNewComment(''); // Reset the input
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (loading) {
        return <div className="text-center text-lg text-crispWhite">Loading...</div>;
    }

    if (!film) {
        return <div className="text-center text-lg text-crispWhite">Film not found.</div>;
    }

    return (
        <div className="min-h-screen bg-charcoal text-crispWhite p-8 flex justify-center">
            {/* Film Details Section */}
            <div className="flex-grow max-w-4xl">
                <h1 className="text-4xl font-bold mb-4">{film.title}</h1>
                <p className="text-sm text-gray-400 mb-6">
                    Uploaded by <ProfileLink username={film.uploadedBy.username} userId={film.uploadedBy._id}/> on{' '}
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
                {/* Comments Section */}
                <div className="w-full mt-12 bg-charcoal border-t border-steelGray pt-8">
                    <h3 className="text-2xl font-semibold mb-6">Comments</h3>

                    {/* Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="mb-6">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full p-4 bg-charcoal text-crispWhite border border-steelGray rounded-lg shadow-inner resize-none"
                            rows={4}
                        />
                        <button
                            type="submit"
                            className="mt-4 py-2 px-6 bg-cornflowerBlue text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Add Comment
                        </button>
                    </form>

                    {/* Display Comments */}
                    <div className="space-y-4">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment._id} className="bg-charcoal p-4 border border-steelGray rounded-lg shadow-inner">
                                    <p className="text-sm text-gray-400" onClick={() => console.log(comment.createdAt)}>{new Date(comment.createdAt).toLocaleString()}</p>
                                    <p className="text-lg">{comment.text}</p>
                                    <p className="text-sm text-crispWhite font-semibold mt-2">- <ProfileLink username={comment.user.username} userId={comment.user._id}/></p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">No comments yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar Section */}
            <div className="w-80 ml-8">
                <h3 className="text-2xl font-semibold mb-4">Other Films from {film.uploadedBy.username}</h3>
                <div className="space-y-4">
                    {otherFilms.length > 0 ? (
                        otherFilms.map((otherFilm) => (
                            <div
                                key={otherFilm._id}
                                className="bg-charcoal border border-steelGray hover:border-cornflowerBlue rounded-lg p-4 shadow-secondary cursor-pointer flex items-center gap-4"
                                onClick={() => (window.location.href = `/films/${otherFilm._id}`)}
                            >
                                {/* Thumbnail */}
                                <div className="relative w-32 h-20 rounded-lg overflow-hidden shadow-md">
                                    <img
                                        src={otherFilm.thumbnailUrl}
                                        alt={otherFilm.title}
                                        className="absolute inset-0 w-full h-full object-fill"
                                    />
                                </div>

                                {/* Film Details */}
                                <div>
                                    <h4 className="text-lg font-bold">{otherFilm.title}</h4>
                                    <p className="text-sm text-gray-400">
                                        {otherFilm.description?.substring(0, 50) || 'No description provided.'}...
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No other films available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Watch;
