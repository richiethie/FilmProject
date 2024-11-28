import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import LeftFeedNav from '../components/LeftFeedNav';
import axios from 'axios';
import { IoMdTrendingUp } from 'react-icons/io';
import { FaPlay } from "react-icons/fa";
import { MdDoNotDisturb } from "react-icons/md";
import { useAuth } from '../context/AuthContext';
import EditProfileModal from '../components/EditProfileModal';
import stockProfilePic from "../assets/img/profilePic/stock-profile-pic.webp";
import ProfileFilmModal from '../components/ProfileFilmModal';
import { User } from '../types/User';
import { Film } from '../types/Film';
import FollowButton from '../components/FollowButton';


const Profile = () => {
  const [films, setFilms] = useState<Film[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noFilms, setNoFilms] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<Partial<User>>({});
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const { token, loggedInUserId } = useAuth();
  const { userId } = useParams();

  useEffect(() => {
    if (!userId) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);
      } catch (err) {
        setError('Error fetching user data');
        console.error(err);
      }
    };

    const fetchUserFilms = async () => {
      try {
        const filmsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/films/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFilms(filmsResponse.data);
        setNoFilms(filmsResponse.data.length === 0);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          // Narrow the type to AxiosError
          if (err.response?.status === 404) {
            setFilms([]);
            setNoFilms(true);
          } else {
            setError('Error fetching films');
          }
        } else {
          // Handle non-Axios errors
          setError('An unexpected error occurred');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchUserFilms();
  }, [userId, token]);

  const handleEditProfile = async () => {
    try {
      const formData = new FormData();
      if (updatedProfile.username) {
        formData.append('username', updatedProfile.username);
      }
      if (updatedProfile.bio) {
        formData.append('bio', updatedProfile.bio);
      }
      if (updatedProfile.profilePhotoUrl) {
        formData.append('profilePhotoUrl', updatedProfile.profilePhotoUrl);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
        updatedProfile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
      setEditModalOpen(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error updating profile');
    }
  };

  const openFilmModal = (film: Film) => {
    setSelectedFilm(film);
  };

  const closeFilmModal = () => {
    setSelectedFilm(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-charcoal text-crispWhite">
      <LeftFeedNav />
      <main className="flex-grow container max-w-[90%] sm:max-w-[80%] md:max-w-[60%] mx-auto px-4 py-8">
        {/* User Info Section */}
        <section className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-24 h-24 mr-6">
              <img
                src={user?.profilePhotoUrl || stockProfilePic}
                alt={`${user?.username}'s profile`}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.username || 'Username'}</h1>
              <p className="text-sm text-gray-400">{user?.bio || 'No bio available'}</p>
              <div className="flex gap-4 mt-2">
                <p>
                  <span className="font-bold">{films?.length || 0}</span> Films
                </p>
                <p>
                  <span className="font-bold">{user?.followersCount || 0}</span> Followers
                </p>
                <p>
                  <span className="font-bold">{user?.followingCount || 0}</span> Following
                </p>
              </div>
            </div>
          </div>
          {loggedInUserId === userId ? (
            <button
              onClick={() => setEditModalOpen(true)}
              className="bg-cornflowerBlue text-white px-4 py-2 rounded-lg h-10 min-w-max whitespace-nowrap"
            >
              Edit Profile
            </button>
          ) : (
            <FollowButton targetUserId={userId || ''} token={token || ''}/>
          )}
        </section>


        {/* Edit Modal */}
        {isEditModalOpen && (
          <EditProfileModal 
            user={user} 
            isOpen={isEditModalOpen} 
            onClose={() => setEditModalOpen(false)} 
            handleEditProfile={handleEditProfile} 
            updatedProfile={updatedProfile} 
            setUpdatedProfile={setUpdatedProfile} 
          />
        )}

        {/* My Posts Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">My Posts</h2>
          {loading ? (
            <p>Loading films...</p>
          ) : error ? (
            <p>{error}</p>
          ) : noFilms ? (
            <div className='flex flex-col items-center justify-center mt-16'>
              <MdDoNotDisturb className='text-5xl text-steelGray mb-4'/>
              <p className='text-steelGray font-bold'>No films available</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {films?.map((film, index) => (
                <div
                  key={index}
                  className="bg-charcoal rounded-lg overflow-hidden relative group"
                  onClick={() => openFilmModal(film)}
                >
                  <div className="relative w-full pb-[56.25%] cursor-pointer">
                    <img
                      src={film.thumbnailUrl}
                      alt={film.title}
                      className={`${
                        film.rank && 'border-4 border-cornflowerBlue'
                      } absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg`}
                    />
                    {film.rank && (
                      <div className="absolute top-3 left-4 text-cornflowerBlue">
                        <IoMdTrendingUp className="text-3xl" />
                      </div>
                    )}
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaPlay className="text-4xl text-white" />
                    </div>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">{film.title}</h3>
                      <p className="text-sm text-gray-400">by {film.uploadedBy?.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{film.votes.length} votes</p>
                      {film.rank ? <p>RANK #{film.rank}</p> : <p>-</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <ProfileFilmModal 
        selectedFilm={selectedFilm}
        closeFilmModal={closeFilmModal}
      />

      <Footer />
    </div>
  );
};

export default Profile;
