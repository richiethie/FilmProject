import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import LeftFeedNav from '../components/LeftFeedNav';
import axios from 'axios';
import { IoMdTrendingUp } from 'react-icons/io';
import { FaPlay } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
import EditProfileModal from '../components/EditProfileModal';
import stockProfilePic from "../assets/img/profilePic/stock-profile-pic.webp";
import ProfileFilmModal from '../components/ProfileFilmModal';

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

interface User {
  username: string;
  email: string;
  profilePhotoUrl?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  followers: string[];
  following: string[];
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'suspended' | 'deleted';
  lastLogin?: Date;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  preferences?: {
    darkMode: boolean;
    notifications: boolean;
  };
  uploadedFilmsCount: number;
  createdAt: Date;
}

const Profile = () => {
  const [films, setFilms] = useState<Film[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<Partial<User>>({});
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const { userId, isAuthenticated, token } = useAuth();

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
      } catch (err) {
        setError('Error fetching films');
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
          <button
            onClick={() => setEditModalOpen(true)}
            className="bg-cornflowerBlue text-white px-4 py-2 rounded-lg"
          >
            Edit Profile
          </button>
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
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.isArray(films) && films.length > 0 ? (
                films.map((film, index) => (
                  <div
                    key={index}
                    className="bg-charcoal rounded-lg overflow-hidden relative group" // Add `group` class here
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
                      {/* Dark background effect */}
                      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {/* Play button */}
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
                        <p className="text-sm text-gray-400">{film.votes} votes</p>
                        {film.rank ? <p>RANK #{film.rank}</p> : <p>-</p>}
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

      {/* Film Modal */}
      <ProfileFilmModal 
        selectedFilm={selectedFilm}
        closeFilmModal={closeFilmModal}
      />

      <Footer />
    </div>
  );
};

export default Profile;
