import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '@/context/MobileContext';
import ProfileLink from '../components/ProfileLink';
import { Film } from '../types/Film';
import { Comment as CommentType } from '../types/Comment';
import { formatDistanceToNow, format } from 'date-fns';
import { FiMoreVertical, FiSend } from 'react-icons/fi';
import FollowButton from '../components/FollowButton';
import { User } from '@/types/User';
import stockProfilePic from "../assets/img/profilePic/stock-profile-pic.webp";
import Footer from '../components/Footer';
import FeedHeader from '@/components/FeedHeader';
import { IoBookmarkOutline } from "react-icons/io5";
import VoteWithBG from '@/components/VoteWithBG';
import { Series } from '@/types/Series';
import { FaPlay } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import FilmDetails from '@/components/mobile/FilmDetails';
import { Collapsible } from "@chakra-ui/react";
import { BiChevronUp } from 'react-icons/bi';
import Comment from '@/components/Comment';
import Vote from '@/components/Vote';
import VideoPlayer from '@/components/VideoPlayer';
import Loading from './Loading';

const Watch = () => {
    const { id } = useParams(); // Get the film ID from the route
    const [film, setFilm] = useState<Film | null>(null);
    const [otherFilms, setOtherFilms] = useState<Film[]>([]);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [newComment, setNewComment] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [openSeries, setOpenSeries] = useState<boolean>(false);
    const [series, setSeries] = useState<Series | null>(null);
    const [rows, setRows] = useState<number>(1);
    const [buttonVisibility, setButtonVisibility] = useState<boolean>(false);

    const hasIncremented = useRef(false);

    const { token, username, userId } = useAuth();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

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

        const fetchComments = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/comments/film/${id}`);
                setComments(response.data); // Comments should already have 'user._id' and 'user.username'
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        const fetchSeries = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/films/${id}/series`);
                if (response.data.message === 'This film is not part of a series') {
                    console.log('The film is standalone and not part of any series.');
                    setSeries(null); // Or any logic to handle standalone films
                    return;
                } else {
                    setSeries(response.data);
                }
            } catch (error) {
                console.error('')
            }

        };
    
        
        if (id) {
            fetchFilm();
            fetchComments();
            fetchSeries();
        }
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

    const getFirstWords = (text: string, maxWords: number = 8) => {
        const words = text.split(" ");
        return words.length > maxWords ? `${words.slice(0, maxWords).join(" ")} ...` : text;
    };

    const handleCommenting = () => {
        setRows(3);
        setButtonVisibility(true)
    };

    const handleCancelComment = () => {
        setNewComment("");
        setRows(1);
        setButtonVisibility(false);
    };

    const handleCommentTrigger = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
            );

            const loggedInUserData = response.data;
            setLoggedInUser(loggedInUserData);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
        setIsCommentsOpen(!isCommentsOpen);
    };

    if (loading) {
        return <Loading />;
    }

    if (!film) {
        return <div className="text-center text-lg text-crispWhite">Film not found.</div>;
    }

    return (
        <div className='flex flex-col'>
            {isMobile ? (
                <div className='bg-charcoal'>
                    <div className='sticky top-0 z-50'>
                        <FeedHeader />
                        <VideoPlayer filmUrl={film.filmUrl} thumbnailUrl={film.thumbnailUrl} />
                    </div>
                    <div className='flex flex-col w-full px-4'>
                        <h1 className="text-xl font-bold">{film.title}</h1>
                        <div className='flex items-center'>
                            <div className="flex text-steelGray text-sm rounded-lg items-center pr-1">
                                {film.views} {film.views === 1 ? 'view' : 'views'}
                            </div>
                            <p className='text-steelGray text-sm'>• {formatDistanceToNow(new Date(film.createdAt), { addSuffix: true })}</p>
                        </div>
                        <div className='flex justify-between my-2'>
                            <div className='flex items-center'>
                                <div className="w-10 h-10 mr-2">
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
                                    <p className='text-sm text-gray-400'>{user?.followersCount || user?.followers.length} followers </p>
                                </div>
                            </div>
                            <div className='h-4 ml-4'>
                                <FollowButton targetUserId={film.uploadedBy._id || ''} token={token || ''} />
                            </div>
                        </div>
                        <div className='flex justify-between mt-2'>
                            <VoteWithBG filmId={film._id} />
                            <button className="flex text-crispWhite hover:text-cornflowerBlue bg-darkCharcoal py-2 px-3 rounded-full items-center">
                                <FiSend className="text-xl" />
                                <p className='ml-2 text-sm'>Share</p>
                            </button>
                            <button className="flex text-crispWhite hover:text-cornflowerBlue bg-darkCharcoal py-2 px-3 rounded-full items-center">
                                <IoBookmarkOutline className="text-xl" />
                                <p className='ml-2 text-sm'>Save</p>
                            </button>
                            <button className="flex text-crispWhite hover:text-cornflowerBlue bg-darkCharcoal p-2 rounded-full items-center">
                                <FiMoreVertical className="text-2xl" />
                            </button>
                        </div>
                        {/* Film Details mobile collapsible */}
                        <FilmDetails film={film} />
                        {/* Film Series, if it is part of a series */}
                        {film.series && film.series.title && (
                            <div className="border-t border-steelGray pt-4">
                                <h3 className="text-md font-bold ml-1">{film.title} is part of a series</h3>
                                {openSeries ? (
                                    <div className='bg-darkCharcoal rounded-xl'>
                                        <button
                                        className="flex items-center mt-4 pt-4 px-4 text-crispWhite font-semibold rounded-lg hover:text-cornflowerBlue transition-all"
                                        onClick={() => setOpenSeries(false)}
                                        >
                                            <FaArrowLeftLong className='mr-2' />
                                        </button>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 p-4 z-1'>
                                            {/* Come back and fix to non frontend order resolve */}
                                            {series?.films.slice().reverse().map((film, index) => (
                                            <div
                                                key={index}
                                                className="rounded-lg overflow-hidden relative group"
                                                onClick={() => navigate(`/films/${film._id}`)}
                                            >
                                                <div className="relative w-full pb-[56.25%] cursor-pointer">
                                                    <img
                                                        src={film.thumbnailUrl}
                                                        alt={film.title}
                                                        className={`${
                                                        film.rank && 'border-4 border-cornflowerBlue'
                                                        } absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg`}
                                                    />
                                                </div>
                                                <div className="p-1">
                                                    <h3 className="text-md font-bold">{film.title}</h3>
                                                    <p className="text-sm text-gray-400">{film.description}</p>
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div onClick={() => setOpenSeries(true)} className='flex justify-between items-center gap-2 py-4 px-4 mb-4 mt-2 bg-darkCharcoal text-crispWhite transition-shadow duration-300 cursor-pointer hover:shadow-lg rounded-xl'>
                                        <div className='w-24 h-16 overflow-hidden rounded-md cursor-pointer group'>
                                            <img
                                                src={series?.films[0]?.thumbnailUrl}
                                                alt={series?.films[0]?.title || 'Film thumbnail'}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <p
                                                className="text-md font-semibold text-center truncate max-w-xs mr-2"
                                                title={series?.title}
                                            >
                                                {series?.title}
                                            </p>
                                            <p className="text-md bg-charcoal p-2 rounded-xl font-semibold text-center truncate max-w-xs">
                                                {series?.films.length} films
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Comments Section */}
                        <div className="w-full bg-charcoal border-t border-b border-steelGray py-4 overflow-hidden mb-4">
                            <Collapsible.Root className='w-full bg-darkCharcoal rounded-xl'>
                                {/* Comments Title */}
                                <Collapsible.Trigger  onClick={handleCommentTrigger} className='flex flex-col w-full' paddingY="2" paddingX="4">
                                    <div className='flex w-full justify-between items-center py-2'>
                                        <h3 className="text-md font-semibold mb-2 cursor-pointer">
                                            {comments.length} Comments
                                        </h3>
                                        {isCommentsOpen && (
                                            <button className='pl-4'>
                                                <BiChevronUp className='text-crispWhite text-2xl font-bold' />
                                            </button>
                                        )}
                                    </div>
                                    <div>
                                        {!isCommentsOpen && (
                                            <p className='text-steelGray text-sm pb-2'>
                                                {comments.length > 0 && comments[0]?.text 
                                                    ? getFirstWords(comments[0].text) 
                                                    : "No comments yet."}
                                            </p>
                                        )}
                                    </div>
                                </Collapsible.Trigger>
                                <Collapsible.Content className='overflow-y-auto max-h-96'>
                                    <div className="rounded-lg">
                                        {/* Comment Form */}
                                        <form onSubmit={handleCommentSubmit} className="mb-2 flex flex-col border-t border-b border-steelGray py-4">
                                            <div className='flex justify-between px-2'>
                                                <div className="w-10 h-10">
                                                    <img
                                                        src={loggedInUser?.profilePhotoUrl || stockProfilePic}
                                                        alt={`${loggedInUser?.username}'s profile`}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                </div>
                                                <textarea
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder="Add a comment..."
                                                    className="p-3 text-crispWhite w-[85%] text-xs border border-steelGray rounded-lg shadow-inner resize-none"
                                                    onClick={handleCommenting}
                                                    rows={rows}
                                                />
                                            </div>
                                            {buttonVisibility && (
                                                <div className='flex justify-end mt-2 mr-2'>
                                                    <button type='reset' onClick={handleCancelComment} className='text-white text-xs mr-2'>Cancel</button>
                                                    <button
                                                        type="submit"
                                                        className="py-2 px-2 bg-cornflowerBlue text-white text-xs rounded-xl hover:bg-blue-600 transition"
                                                    >
                                                        Add Comment
                                                    </button>
                                                </div>
                                            )}
                                        </form>
                                        {comments.length > 0 ? (
                                        comments.map((comment) => (
                                            <div key={comment._id} className="p-4 mt-0">
                                                <div className="flex items-center">
                                                    <p className="text-sm text-crispWhite font-semibold mr-2">
                                                        <ProfileLink username={comment.user.username} userId={comment.user._id} />
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                                    </p>
                                                </div>
                                                <p className="text-sm">{comment.text}</p>
                                            </div>
                                        ))
                                        ) : (
                                        <p className="text-gray-400 text-sm ml-2 my-4">Be the first to comment here.</p>
                                        )}
                                    </div>
                                </Collapsible.Content>
                            </Collapsible.Root>
                        </div>
                    </div>
                    {/* Other Films from that Genre */}
                    <div className="w-full">
                        <h3 className="text-lg font-semibold mb-4 ml-4">Explore other {film.genre} films</h3>
                        <div className="space-y-2">
                            {otherFilms.length > 0 ? (
                                otherFilms.map((otherFilm) => (
                                    <div key={otherFilm._id} className="bg-charcoal overflow-hidden mt-4 group">
                                        <div
                                            className="relative w-full pb-[60%] cursor-pointer"
                                            onClick={() => navigate(`/films/${otherFilm._id}`)}
                                        >
                                            <img
                                                src={otherFilm.thumbnailUrl}
                                                alt={otherFilm.title}
                                                className="absolute top-0 left-0 w-full h-full object-cover shadow-lg"
                                            />
                                        </div>
                                        <div className="flex-grow py-2">
                                            <div className="flex justify-between px-2 items-center">
                                                <div>
                                                    <h3 className="text-xl font-bold">{otherFilm.title}</h3>
                                                    <p className="text-sm text-gray-400"><ProfileLink username={otherFilm.uploadedBy.username} userId={otherFilm.uploadedBy._id} /> • {formatDistanceToNow(new Date(otherFilm.createdAt), { addSuffix: true })}</p>
                                                </div>
                                                <div className="flex space-x-2 items-center">
                                                    <Vote filmId={otherFilm._id} />
                                                    <Comment filmId={otherFilm._id} />
                                                    {/* <button className="text-crispWhite border border-steelGray px-3 py-1 rounded-full hover:text-cornflowerBlue">
                                                        <FiSend className="text-xl" />
                                                    </button> */}
                                                </div>
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
            ) : (
    // DESKTOP VIEW
                <>
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
                                    <div className='flex justify-center border-r border-crispWhite pr-4'>
                                        <div className="flex text-crispWhite bg-darkCharcoal p-2 rounded-lg items-center">
                                            {film.views} {film.views === 1 ? 'view' : 'views'}
                                        </div>
                                    </div>
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
                            <div className="bg-darkCharcoal rounded-lg p-6 shadow-inner shadow-secondary mt-4 mb-8">
                                <h2 className="text-2xl font-bold mb-4">Description</h2>
                                <p className="text-lg">{film.description || 'No description provided.'}</p>
                                <p className='text-md text-steelGray'>Uploaded on {format(new Date(film.createdAt), 'MMMM d, yyyy')}</p>
        
                                <h3 className="text-xl font-semibold mt-6 mb-2">Genre</h3>
                                <p className="text-lg">{film.genre || 'Not specified.'}</p>
        
                                <h3 className="text-xl font-semibold mt-6 mb-2">Duration</h3>
                                <p className="text-lg">{film.duration ? `${film.duration} minutes` : 'Not available.'}</p>
                            </div>
        
                            {/* Film Series, if it is part of a series */}
                            {film.series && film.series.title && (
                                <div className="border-t border-steelGray pt-8">
                                    <h3 className="text-lg font-bold">Check out the other films in this series</h3>
                                    {openSeries ? (
                                        <div className='bg-darkCharcoal rounded-xl'>
                                            <button
                                            className="flex items-center mt-4 pt-4 px-4 text-crispWhite font-semibold rounded-lg hover:text-cornflowerBlue transition-all"
                                            onClick={() => setOpenSeries(false)}
                                            >
                                                <FaArrowLeftLong className='mr-2' />
                                            </button>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 p-4'>
                                                {/* Come back and fix to non frontend order resolve */}
                                                {series?.films.slice().reverse().map((film, index) => (
                                                <div
                                                    key={index}
                                                    className="rounded-lg overflow-hidden relative group"
                                                    onClick={() => navigate(`/films/${film._id}`)}
                                                >
                                                    <div className="relative w-full pb-[56.25%] cursor-pointer">
                                                        <img
                                                            src={film.thumbnailUrl}
                                                            alt={film.title}
                                                            className={`${
                                                            film.rank && 'border-4 border-cornflowerBlue'
                                                            } absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg`}
                                                        />
                                                        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                            <FaPlay className="text-white text-4xl" />
                                                        </div>
                                                    </div>
                                                    <div className="p-1">
                                                        <h3 className="text-lg font-bold">{film.title}</h3>
                                                        <p className="text-sm text-gray-400">{film.description}</p>
                                                    </div>
                                                </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div onClick={() => setOpenSeries(true)} className='flex justify-between items-center gap-2 py-4 px-16 mb-8 mt-4 bg-darkCharcoal text-crispWhite transition-shadow duration-300 cursor-pointer hover:shadow-lg rounded-xl'>
                                            <div className='w-48 h-32 overflow-hidden rounded-md cursor-pointer group'>
                                                <img
                                                    src={series?.films[0]?.thumbnailUrl}
                                                    alt={series?.films[0]?.title || 'Film thumbnail'}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <p
                                                    className="text-lg font-semibold text-center truncate max-w-xs"
                                                    title={series?.title}
                                                >
                                                    {series?.title}
                                                </p>
                                                <p className="text-lg bg-charcoal p-2 rounded-xl font-semibold text-center truncate max-w-xs">
                                                    {series?.films.length} films
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* Comments Section */}
                            <div className="w-full mt-12 bg-charcoal border-t border-steelGray pt-8">
                                <h3 className="text-2xl font-semibold mb-6">{comments.length} Comments</h3>
        
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
                </>
            )}
            <Footer />
        </div>
    );
};

export default Watch;
