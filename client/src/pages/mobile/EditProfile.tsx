import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import stockProfilePic from "../../assets/img/profilePic/profile-astronaut.jpg"
import { User } from "../../types/User";
import { Film } from "../../types/Film";
import { Button } from "@/components/ui/button"
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu"
import { IoMdTrendingUp } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import axios from "axios";


const EditProfile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [featuredFilm, setFeaturedFilm] = useState<Film | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [updatedProfile, setUpdatedProfile] = useState<Partial<User>>({});
    const [noFilms, setNoFilms] = useState(false);
    const [films, setFilms] = useState<Film[] | null>(null);
    const [loading, setLoading] = useState(true);

    const { token, loggedInUserId } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
              const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${loggedInUserId}`, {
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
              const filmsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/films/user/${loggedInUserId}`, {
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
    }, [])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
        setProfileImage(event.target.files[0]);
        handleUploadProfileImage(event.target.files[0]);
        }
    };

    const handleUploadProfileImage = async (file: File) => {
        try {
        const formData = new FormData();
        formData.append('profilePicture', file); // Attach the file with the field name 'profilePicture'
    
        // Make the POST request to upload the image
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/upload-profile-picture-to-s3`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    
        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Failed to upload profile image');
        }
    
        // Parse the response (assuming the server returns the uploaded image URL)
        const data = await response.json();
    
        // Update the profile with the new image URL
        setUpdatedProfile({ ...updatedProfile, profilePhotoUrl: data.profilePictureUrl }); // Assuming 'fileUrl' is returned
        console.log("Successful profile picture uploaded: ", data.profilePictureUrl)
        } catch (error) {
        console.error('Error uploading profile image:', error);
        // Optionally display an error message to the user
        }
    };

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
            `${import.meta.env.VITE_API_URL}/api/users/${loggedInUserId}`,
            updatedProfile,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser(response.data);
          navigate(`/profile/${loggedInUserId}`)
        } catch (err) {
          console.error('Error updating profile:', err);
          setError('Error updating profile');
        }
      };
  

    return (
        <div className="flex bg-charcoal px-4 w-full min-h-screen">
            <div className="w-full h-full">
                <h2 className="text-2xl font-bold my-4">Edit Profile</h2>

                {/* Profile Image Upload */}
                <div className="mb-4 flex flex-col w-full h-full">
                    <div className="h-full flex items-center justify-between bg-darkCharcoal rounded-xl py-4 px-8 mb-4">
                        <div className="flex items-center">
                            <div className="flex items-center flex-shrink-0">
                                <img
                                src={updatedProfile.profilePhotoUrl || user?.profilePhotoUrl || stockProfilePic}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover mr-2"
                                />
                            </div>
                        </div>
                        {/* Custom file input button */}
                        <div className="flex justify-center items-end">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="bg-cornflowerBlue text-white text-center text-xs px-2 py-2 rounded-lg cursor-pointer">
                                Choose Image
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center justify-between bg-darkCharcoal rounded-xl py-4 px-4 mb-4">
                        <div>
                        {(featuredFilm != null) ? (
                            <div>
                            <label className="block mb-2">Featured Preview:</label>
                            <div className="relative w-full pb-[45.25%] cursor-pointer">
                                <img
                                src={featuredFilm?.thumbnailUrl}
                                alt={featuredFilm?.title}
                                className={`${
                                    featuredFilm?.rank && 'border-4 border-cornflowerBlue'
                                } absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg`}
                                />
                                {featuredFilm?.rank && (
                                <div className="absolute top-3 left-4 text-cornflowerBlue">
                                    <IoMdTrendingUp className="text-3xl" />
                                </div>
                                )}
                                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <FaPlay className="text-white text-4xl" />
                                </div>
                            </div>
                            <p className="mt-1">{featuredFilm.title}</p>
                            <p className="text-steelGray text-xs">
                                {featuredFilm.description
                                ? featuredFilm.description.length > 32
                                    ? `${featuredFilm.description.slice(0, 32)}...`
                                    : featuredFilm.description
                                : ''}
                            </p>
                            </div>
                        ) : (
                            <div>
                                <label className="block mb-2">No Featured Film:</label>
                                <div className="relative w-full pb-[55.25%] cursor-pointer bg-charcoal my-2 rounded-lg"></div>
                                <div className="bg-charcoal h-4 w-[60%] my-2 rounded-lg"></div>
                                <div className="bg-charcoal h-4 w-[80%] my-2 rounded-lg"></div>
                            </div>
                        )}
                        </div>
                        <MenuRoot>
                        <MenuTrigger asChild>
                            <Button className="bg-cornflowerBlue text-white text-xs px-3 py-1 ml-2 rounded-lg cursor-pointer">
                                Set Featured Film
                            </Button>
                        </MenuTrigger>
                        <MenuContent>
                            {films?.map((film, index) => (
                            <MenuItem id={film._id} value={index.toString()} onClick={() => setFeaturedFilm(film)}>{film.title}</MenuItem>
                            ))}
                        </MenuContent>
                        </MenuRoot>
                    </div>
                </div>

                {/* Username Field */}
                <label className="block mb-2 mt-8">
                Username:
                <input
                    type="text"
                    value={updatedProfile.username || user?.username || ''}
                    onChange={(e) =>
                    setUpdatedProfile({ ...updatedProfile, username: e.target.value })
                    }
                    className="w-full p-2  rounded text-crispWhite"
                />
                </label>

                {/* Bio Field */}
                <label className="block mb-2">
                Bio:
                <textarea
                    value={updatedProfile.bio || user?.bio || ''}
                    onChange={(e) =>
                    setUpdatedProfile({ ...updatedProfile, bio: e.target.value })
                    }
                    className="w-full p-2  rounded text-crispWhite"
                />
                </label>
                <div className="flex  justify-end items-center mt-4">
                    <button
                        onClick={handleEditProfile}
                        className="bg-cornflowerBlue text-white text-xs px-4 py-2 rounded-lg"
                    >
                        Save Changes
                    </button>

                    <button
                        className="text-gray-600 text-xs px-4 py-2"
                        onClick={() => navigate(`/profile/${loggedInUserId}`)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
