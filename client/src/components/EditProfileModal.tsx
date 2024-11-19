import { useState } from "react";
import { useAuth } from '../context/AuthContext';
import stockProfilePic from "../assets/img/profilePic/stock-profile-pic.webp"

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

interface EditProfileModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  handleEditProfile: () => void;
  updatedProfile: Partial<User>;
  setUpdatedProfile: (profile: Partial<User>) => void;
}

const EditProfileModal = (props: EditProfileModalProps) => {
  const { user, isOpen, onClose, handleEditProfile, updatedProfile, setUpdatedProfile } = props;

  const [profileImage, setProfileImage] = useState<File | null>(null);

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
      <div className="bg-charcoal p-8 rounded-lg shadow-lg max-w-5xl w-full">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

        {/* Profile Image Upload */}
        <div className="mb-4">
          <label className="block mb-2">Profile Picture:</label>
          <div className="flex items-center mb-4">
            <img
              src={updatedProfile.profilePhotoUrl || user?.profilePhotoUrl || stockProfilePic}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover mr-4"
            />
          </div>
          {/* Custom file input button */}
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

        {/* Username Field */}
        <label className="block mb-2">
          Username:
          <input
            type="text"
            value={updatedProfile.username || user?.username || ''}
            onChange={(e) =>
              setUpdatedProfile({ ...updatedProfile, username: e.target.value })
            }
            className="w-full p-2 border rounded text-black"
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
            className="w-full p-2 border rounded text-black"
          />
        </label>

        <button
          onClick={handleEditProfile}
          className="bg-cornflowerBlue text-white px-4 py-2 mt-4 rounded-lg"
        >
          Save Changes
        </button>

        <button
          onClick={onClose}
          className="text-gray-600 px-4 py-2 mt-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditProfileModal;
