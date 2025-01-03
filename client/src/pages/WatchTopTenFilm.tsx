import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProfileLink from '../components/ProfileLink';
import { Film } from '../types/Film';
import { Comment } from '../types/Comment';
import { formatDistanceToNow, format } from 'date-fns';
import { FiSend } from 'react-icons/fi';
import FollowButton from '../components/FollowButton';
import { User } from '@/types/User';
import stockProfilePic from "../assets/img/profilePic/stock-profile-pic.webp";
import Footer from '../components/Footer';
import FeedHeader from '@/components/FeedHeader';
import { IoBookmarkOutline } from "react-icons/io5";
import VoteWithBG from '@/components/VoteWithBG';

const WatchTopTenFilm = () => {
    const { id } = useParams(); // Get the film ID from the route
    const [film, setFilm] = useState<Film | null>(null);
    const [otherFilms, setOtherFilms] = useState<Film[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [user, setUser] = useState<User | null>(null);
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
        const fetchFilmData = async () => {
            if (!film?.genre || !film?.uploadedBy?._id) {
                console.warn("Film genre or uploader data is missing");
                return;
            }

            const apiBaseUrl = import.meta.env.VITE_API_URL;

            try {
                const [otherFilmsResponse, userResponse] = await Promise.all([
                    axios.get(`${apiBaseUrl}/api/films/genre/${film.genre}`),
                    axios.get(`${apiBaseUrl}/api/users/${film.uploadedBy._id}`)
                ]);

                setOtherFilms(otherFilmsResponse.data);
                setUser(userResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchFilmData();
    }, [film, setOtherFilms, setUser]);

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
        <div className='flex flex-col'>
            <FeedHeader />
            <div className="min-h-screen bg-charcoal text-crispWhite p-8 flex justify-center">
                {/* Film Details Section */}
                <div className="flex-grow max-w-7xl">
                    {/* Film Player */}
                    <div className="relative aspect-w-16 aspect-h-9 mb-2">
                        <video
                            src={film.filmUrl}
                            controls
                            className="w-full h-full object-cover rounded-lg shadow-lg"
                        ></video>
                    </div>
                    <div className='flex flex-col w-full'>
                        <h1 className="text-2xl font-bold">{film.title}</h1>
                        <div className='flex justify-between items-center w-full my-2'>
                            <div className='flex justify-center'>
                                <div className="w-12 h-12 mr-6">
                                    <img
                                        src={user?.profilePhotoUrl || stockProfilePic}
                                        alt={`${user?.username}'s profile`}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-md text-gray-400">
                                        <ProfileLink username={film.uploadedBy.username} userId={film.uploadedBy._id}/>
                                    </p>
                                    <p className='text-sm text-gray-400'>{user?.followersCount || user?.followers.length} followers - {formatDistanceToNow(new Date(film.createdAt), { addSuffix: true })}</p>
                                </div>
                                <div className='h-4 ml-4 mt-1'>
                                    <FollowButton targetUserId={film.uploadedBy._id || ''} token={token || ''} />
                                </div>
                            </div>
                            <div className='flex space-x-4'>
                                <VoteWithBG filmId={film._id} />
                                <button className="flex text-crispWhite hover:text-cornflowerBlue bg-darkCharcoal p-2 rounded-lg items-center">
                                    <FiSend className="text-2xl" />
                                    <p className='ml-2'>Share</p>
                                </button>
                                <button className="flex text-crispWhite hover:text-cornflowerBlue bg-darkCharcoal p-2 rounded-lg items-center">
                                    <IoBookmarkOutline className="text-2xl" />
                                    <p className='ml-2'>Save</p>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Film Details */}
                    <div className="bg-darkCharcoal rounded-lg p-6 shadow-inner shadow-secondary mt-4">
                        <h2 className="text-2xl font-bold mb-4">Description</h2>
                        <p className="text-lg">{film.description || 'No description provided.'}</p>
                        <p className='text-md text-steelGray'>Uploaded on {format(new Date(film.createdAt), 'MMMM d, yyyy')}</p>

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
                        <div className="space-y-4 bg-charcoal rounded-lg">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment._id} className="p-4 border-b border-steelGray">
                                        <div className='flex items-center'>
                                            <p className="text-sm text-crispWhite font-semibold mr-2"><ProfileLink username={comment.user.username} userId={comment.user._id}/></p>
                                            <p className="text-sm text-gray-400" onClick={() => console.log(comment.createdAt)}>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p>
                                        </div>
                                        <p className="text-lg mt-2">{comment.text}</p>
                                        
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">No comments yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Section */}
                {/* Switch to films from this genre instead of that user */}
                <div className="max-w-xl ml-8">
                    <h3 className="text-2xl font-semibold mb-4">Explore other {film.genre} films</h3>
                    <div className="space-y-2">
                        {otherFilms.length > 0 ? (
                            otherFilms.map((otherFilm) => (
                                <div
                                    key={otherFilm._id}
                                    className="bg-charcoal border-b border-steelGray hover:border-cornflowerBlue p-4 shadow-secondary cursor-pointer flex items-center gap-4"
                                    onClick={() => (window.location.href = `/films/${otherFilm._id}`)}
                                >
                                    {/* Thumbnail */}
                                    <div className="relative w-32 h-20 rounded-lg overflow-hidden shadow-md">
                                        <img
                                            src={otherFilm.thumbnailUrl}
                                            alt={otherFilm.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Film Details */}
                                    <div>
                                        <h4 className="text-lg font-bold">{otherFilm.title}</h4>
                                        <p className="text-sm text-gray-400">
                                            {otherFilm.description?.substring(0, 50) || 'No description provided.'}...
                                        </p>
                                        <div className='text-sm'>
                                            <ProfileLink username={otherFilm.uploadedBy.username} userId={otherFilm.uploadedBy._id}/>
                                        </div>
                                        <div>
                                            <p className='text-steelGray text-xs'>{otherFilm.votes.length} {otherFilm.votes.length == 1 ? "vote" : "votes"} • {formatDistanceToNow(new Date(otherFilm.createdAt), { addSuffix: true })}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">No other films available.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default WatchTopTenFilm;
