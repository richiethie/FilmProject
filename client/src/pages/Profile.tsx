import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import axios from 'axios';
import { IoMdTrendingUp } from 'react-icons/io';
import { FaArrowLeftLong } from "react-icons/fa6"
import { FaPlay } from "react-icons/fa";
import { MdDoNotDisturb } from "react-icons/md";
import { useAuth } from '../context/AuthContext';
import EditProfileModal from '../components/EditProfileModal';
import stockProfilePic from "../assets/img/profilePic/stock-profile-pic.webp";
import ProfileFilmModal from '../components/ProfileFilmModal';
import { User } from '../types/User';
import { Film } from '../types/Film';
import FollowButton from '../components/FollowButton';
import FeedHeader from '@/components/FeedHeader';
import { Tabs } from '@chakra-ui/react';
import { HStack, Stack } from "@chakra-ui/react"
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@/components/ui/skeleton"
import { Series } from '@/types/Series';




const Profile = () => {
  const [films, setFilms] = useState<Film[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noFilms, setNoFilms] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<Partial<User>>({});
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [seriesList, setSeriesList] = useState<Series[] | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);

  const { token, loggedInUserId } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();

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

  const fetchUserSeries = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/series/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        console.log('User series:', response.data);
        setSeriesList(response.data);
    } catch (err) {
        if (axios.isAxiosError(err)) {
            // Handle Axios specific error (optional, if you're using Axios)
            console.error('Error fetching user series:', err.response?.data?.message || 'Server error');
        } else {
            // Handle general unknown error
            console.error('Unknown error fetching user series:', err);
        }
    }
  };

  const openFilmModal = (film: Film) => {
    setSelectedFilm(film);
  };

  const closeFilmModal = () => {
    setSelectedFilm(null);
  };

  const skeletonCount = films?.length || 9;

  return (
    <div className="min-h-screen flex flex-col bg-charcoal text-crispWhite">
      <FeedHeader />
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
            films={films}
            isOpen={isEditModalOpen} 
            onClose={() => setEditModalOpen(false)} 
            handleEditProfile={handleEditProfile} 
            updatedProfile={updatedProfile} 
            setUpdatedProfile={setUpdatedProfile} 
          />
        )}

        {/* My Posts Section */}
        {/* Tabs Section */}
        <Tabs.Root lazyMount unmountOnExit defaultValue="home">
          <Tabs.List>
            <Tabs.Trigger className='p-4' value="home">Home</Tabs.Trigger>
            <Tabs.Trigger className='p-4' value="series" onClick={fetchUserSeries}>Series</Tabs.Trigger>
            <Tabs.Trigger className='p-4' value="premiere">Premiere</Tabs.Trigger>
          </Tabs.List>
          {/* Home Tab */}
          <Tabs.Content value='home'>
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
            )}
          </Tabs.Content>

          {/* Series Tab */}
          <Tabs.Content value="series">
        <div className="text-center">
          {selectedSeries ? (
            /* Render films from the selected series */
            <div>
              <button
                className="flex items-center mt-6 py-2 px-4 bg-charcoal text-crispWhite font-semibold rounded-lg hover:bg-darkCharcoal transition-all"
                onClick={() => setSelectedSeries(null)}
              >
                <FaArrowLeftLong className='mr-2' />
                Back to Series
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                {selectedSeries.films.map((film, index) => (
                  <div
                    key={index}
                    className="bg-charcoal rounded-lg overflow-hidden relative group"
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
                      {film.rank && (
                        <div className="absolute top-3 left-4 text-cornflowerBlue">
                          <IoMdTrendingUp className="text-3xl" />
                        </div>
                      )}
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
            /* Render the list of series */
            seriesList?.map((series, index) => (
              <div
                key={index}
                className="flex justify-between items-center gap-2 py-4 px-16 my-8 bg-darkCharcoal text-crispWhite transition-shadow duration-300 cursor-pointer hover:shadow-lg rounded-xl"
                onClick={() => setSelectedSeries(series)}
              >
                <div className="w-48 h-32 overflow-hidden rounded-md cursor-pointer group">
                  <img
                    src={series.films[0]?.thumbnailUrl}
                    alt={series.films[0]?.title || 'Film thumbnail'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <p
                    className="text-lg font-semibold text-center truncate max-w-xs"
                    title={series.title}
                  >
                    {series.title}
                  </p>
                  <p className="text-lg bg-charcoal p-2 rounded-xl font-semibold text-center truncate max-w-xs">
                    {series.films.length} films
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Tabs.Content>

          {/* Premieres Tab */}
          <Tabs.Content value="premiere">
            <div className="text-center">
              <p className="text-gray-400">No premieres scheduled yet. Stay tuned!</p>
            </div>
          </Tabs.Content>
        </Tabs.Root>
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
