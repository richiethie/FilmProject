import { useState } from "react";
import { useAuth } from '../context/AuthContext';
import stockProfilePic from "../assets/img/profilePic/stock-profile-pic.webp"
import { User } from "../types/User";
import { Film } from "../types/Film";
import { Button } from "@/components/ui/button"
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu"
import { HStack, Stack } from "@chakra-ui/react"
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@/components/ui/skeleton"
import { IoMdTrendingUp } from "react-icons/io";
import { FaPlay } from "react-icons/fa";


interface EditProfileModalProps {
  user: User | null;
  films: Film[] | null;
  isOpen: boolean;
  onClose: () => void;
  handleEditProfile: () => void;
  updatedProfile: Partial<User>;
  setUpdatedProfile: (profile: Partial<User>) => void;
}

const EditProfileModal = (props: EditProfileModalProps) => {
  const { user, films, isOpen, onClose, handleEditProfile, updatedProfile, setUpdatedProfile } = props;

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [featuredFilm, setFeaturedFilm] = useState<Film | null>(null);

  const { token } = useAuth();

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
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-charcoal p-20 rounded-lg shadow-lg max-w-5xl w-full">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

        {/* Profile Image Upload */}
        <div className="mb-4 flex flex-col w-full h-full">
          <div className="h-full flex items-center justify-between bg-darkCharcoal rounded-xl py-4 px-10 mb-4">
            <div className="flex items-center">
              <div className="flex items-center">
                <img
                  src={updatedProfile.profilePhotoUrl || user?.profilePhotoUrl || stockProfilePic}
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover mr-4"
                />
              </div>
              <label className="font-semibold text-2xl">{user?.username}</label>
            </div>
            {/* Custom file input button */}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="bg-cornflowerBlue text-white px-4 py-2 rounded-lg cursor-pointer">
                Choose New Image
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between bg-darkCharcoal rounded-xl py-4 px-10 mb-4">
            <div className="w-[50%]">
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
                  <p className="text-steelGray">
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
                  <div className="relative w-full pb-[45.25%] cursor-pointer bg-charcoal my-2 rounded-lg"></div>
                  <div className="bg-charcoal h-8 w-[50%] my-2 rounded-lg"></div>
                  <div className="bg-charcoal h-8 w-[50%] my-2 rounded-lg"></div>
                </div>
              )}
            </div>
            <MenuRoot>
              <MenuTrigger asChild>
                <Button className="bg-cornflowerBlue text-white px-4 py-2 rounded-lg cursor-pointer">
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
        <div className="flex justify-end items-center mt-4">
          <button
            onClick={handleEditProfile}
            className="bg-cornflowerBlue text-white px-4 py-2 rounded-lg"
          >
            Save Changes
          </button>

          <button
            onClick={onClose}
            className="text-gray-600 px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
