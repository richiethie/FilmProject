import { FaUpload } from "react-icons/fa";
import { useState } from "react";
import axios from "axios"; // Import axios to interact with your backend API
import { useAuth } from '../context/AuthContext';

interface UploadModalStepOneProps {
  file: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNext: () => void; // To trigger next step when ready
  setFilmUrl: (url: string) => void; // A setter to store the URL temporarily
}

const UploadModalStepOne = ({ file, handleFileChange, handleNext, setFilmUrl }: UploadModalStepOneProps) => {
  const { token, userId } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Function to handle file upload to backend or S3
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file); // Only upload the video file
    formData.append("title", file.name);
    formData.append("thumbnailUrl", "");
    formData.append("filmUrl", "");
    formData.append("uploadedBy", userId || '');

    try {
        setUploading(true);
        setUploadProgress(0);

        // Sending the file to the backend API
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/films/upload-to-s3`, formData, {
            headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`,
            },
            onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
                setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            }
            },
        });

        //   console.log(response.data)

        // Extract the uploaded film URL from the response
        const { fileUrl: uploadedFilmUrl } = response.data;
        console.log(uploadedFilmUrl)
        setFilmUrl(uploadedFilmUrl); // Temporarily store the URL in the parent component's state

        setUploading(false);
    } catch (error) {
        console.error("Error uploading file:", error);
        setUploading(false);
    }
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e); // Store file in parent state
      uploadFile(e.target.files[0]); // Trigger the file upload
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full">
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="flex items-center justify-center h-40 w-40 p-8 bg-steelGray rounded-full">
          <FaUpload className="h-full w-full" />
        </div>
        <p className="text-crispWhite font-semibold">Upload your films here</p>
        <p className="text-steelGray pb-4">
          Your films will be private until you publish them.
        </p>
        <div className="relative flex flex-col items-center bg-charcoal rounded-md p-2">
          <label htmlFor="fileInput" className="bg-cornflowerBlue text-crispWhite py-2 px-4 rounded-md cursor-pointer hover:bg-cornflowerBlue-dark transition">
            Choose File
          </label>
          <input
            type="file"
            id="fileInput"
            onChange={handleFileSelection}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            required
            accept="video/mp4,video/mkv"
          />
          {file && <p className="mt-2 text-sm text-steelGray">Selected File: {file.name}</p>}
          {uploading && (
            <div className="w-full bg-gray-300 rounded-full mt-4 h-2">
              <div className="bg-cornflowerBlue h-2 rounded-full" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleNext}
        className={`${file && !uploading ? "bg-cornflowerBlue" : "bg-gray-600"} absolute bottom-5 right-5 text-charcoal font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition`}
        disabled={!file || uploading}
      >
        {uploading ? "Uploading..." : "Next"}
      </button>
    </div>
  );
};

export default UploadModalStepOne;
