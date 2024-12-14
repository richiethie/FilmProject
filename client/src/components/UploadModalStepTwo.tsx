import { useState } from 'react';
import { genres } from '../data/home';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Series } from '@/types/Series';

interface UploadModalStepTwoProps {
  title: string;
  description: string;
  thumbnail: File | null;
  thumbnailUrl: string | null;
  series: Series | null;
  seriesList: Series[] | null;
  isCreatingNewSeries: boolean;
  genre: string;
  setGenre: (genre: string) => void;
  setThumbnailUrl: (url: string) => void;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSeriesChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleNewSeriesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePrevious: () => void;
  handleNext: () => void;
}

const UploadModalStepTwo = (props: UploadModalStepTwoProps) => {
  const {
    title,
    description,
    thumbnail,
    thumbnailUrl,
    series,
    seriesList,
    isCreatingNewSeries,
    genre,
    setGenre,
    setThumbnailUrl,
    handleTitleChange,
    handleDescriptionChange,
    handleThumbnailChange,
    handleSeriesChange,
    handleNewSeriesChange,
    handlePrevious,
    handleNext,
  } = props;

  const [seriesOptions] = useState(seriesList); // Example series options

  const { token } = useAuth();

  // Handle thumbnail selection and upload it to S3
  const handleThumbnailSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedThumbnail = e.target.files[0];

      // First update the state with the selected file
      handleThumbnailChange(e);

      // Create a FormData to upload the thumbnail file
      const formData = new FormData();
      formData.append('thumbnail', selectedThumbnail);

      try {
        // Send the file to your backend for uploading to S3
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/films/upload-thumbnail-to-s3`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Add authentication token if required
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log(response.data.thumbnailUrl)

        // After successful upload, set the thumbnailUrl in the state
        const uploadedThumbnailUrl = response.data.thumbnailUrl;
        console.log('Thumbnail uploaded:', uploadedThumbnailUrl);
        if (uploadedThumbnailUrl) {
            setThumbnailUrl(uploadedThumbnailUrl);
          }

      } catch (error) {
        console.error('Error uploading thumbnail:', error);
      }
    }
  };

  return (
    <form className={`space-y-6 flex ${thumbnail ? 'justify-start' : 'justify-between'} items-start w-full h-full`}>
      <div className="w-full">
        {/* Title */}
        <div className="mt-4 border border-steelGray rounded-md focus:border-cornflowerBlue">
          <p className="text-sm text-steelGray mt-1 px-4">Film Title (required)</p>
          <input
            type="text"
            name="Title"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="w-full bg-charcoal py-2 px-4 rounded-md outline-none placeholder-gray-600"
            placeholder="Enter your film title"
            required
          />
        </div>

        {/* Description */}
        <div className="mt-4 border border-steelGray rounded-md focus:border-cornflowerBlue">
          <label htmlFor="description" className="block text-lg text-sm text-steelGray mb-2 px-4 mt-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="w-full bg-charcoal py-2 px-4 rounded-md placeholder-gray-600 outline-none"
            placeholder="Describe your film"
            rows={4}
          ></textarea>
        </div>

        {/* Upload Thumbnail */}
        <div className="mt-4 border border-steelGray rounded-md focus:border-cornflowerBlue">
          <label htmlFor="thumbnail" className="block text-lg text-sm text-steelGray mb-2 px-4 mt-1">
            Upload Thumbnail (required)
          </label>
          <div className="relative flex flex-col items-start bg-charcoal rounded-md px-4">
            {/* Custom "Choose File" Button */}
            <label
              htmlFor="thumbnailInput"
              className="bg-cornflowerBlue text-crispWhite py-2 px-4 rounded-md cursor-pointer hover:bg-steelGray transition mb-2"
            >
              Choose File
            </label>
            <input
              type="file"
              id="thumbnailInput"
              onChange={handleThumbnailSelection} // Call the new thumbnail handling function
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            {/* Display Selected Thumbnail Name */}
            {thumbnail && (
              <p className="text-sm text-steelGray mb-2">
                Selected Thumbnail: {thumbnail.name}
              </p>
            )}
          </div>
        </div>

        {/* Series Dropdown */}
        <div className="mt-4 border border-steelGray rounded-md pr-4">
          <label htmlFor="series" className="block text-sm text-steelGray mb-2 px-4 mt-1">
            Add to Series
          </label>
          <select
            id="series"
            value={series?.title}
            onChange={handleSeriesChange}
            className="w-full bg-charcoal py-2 px-4 rounded-md outline-none"
          >
            <option value="" disabled>
              Select a series
            </option>
            {seriesOptions?.map((series) => (
              <option key={series._id} value={series.title}>
                {series.title}
              </option>
            ))}
            <option value="new">Create a new series</option>
          </select>

          {isCreatingNewSeries && (
            <input
              type="text"
              value={series?.title}
              onChange={handleNewSeriesChange}
              className="w-full mt-2 bg-charcoal shadow-inner py-2 px-4 rounded-md outline-none placeholder-gray-600"
              placeholder="Enter new series name"
            />
          )}
        </div>

        {/* Genre */}
        <div className="mt-4 border border-steelGray rounded-md pr-4">
          <label htmlFor="genre" className="block text-sm text-steelGray mb-2 px-4 mt-1">
            Film Genre (required)
          </label>
          <select
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full bg-charcoal py-2 px-4 rounded-md outline-none"
            required
          >
            <option value="" disabled>
              Select a genre
            </option>
            {genres.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute bottom-5 right-5 flex gap-4">
          <button
            onClick={handlePrevious}
            className="bg-gray-600 text-crispWhite font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className={`font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition ${title && thumbnail && genre ? 'bg-cornflowerBlue text-charcoal hover:bg-opacity-90' : 'bg-steelGray text-charcoal cursor-not-allowed'}`}
            disabled={!title || !thumbnail || !genre}
          >
            Next
          </button>
        </div>
      </div>

      {/* Display thumbnail image below */}
      {thumbnailUrl && (
        <div className="w-[60%] overflow-hidden pl-6">
          <p className="text-sm text-steelGray mb-2 ml-1">Preview</p>
          <img
            src={thumbnailUrl}
            alt="Selected Thumbnail"
            className="aspect-w-16 aspect-h-9 object-cover rounded-lg shadow-lg w-full"
          />
          <div className="m-1">
            <h4>{title}</h4>
          </div>
        </div>
      )}
    </form>
  );
};

export default UploadModalStepTwo;
