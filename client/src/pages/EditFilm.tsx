import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Film } from "@/types/Film";
import { genres } from "@/data/home";
import { useAuth } from "@/context/AuthContext";
import Loading from "./Loading";
import ClipLoader from "react-spinners/ClipLoader";
import { Alert } from "@/components/ui/alert"

const EditFilm = () => {
  const { filmId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await axios.get<Film>(`${import.meta.env.VITE_API_URL}/api/films/${filmId}`);
        setFilm(response.data);
        setThumbnailUrl(response.data.thumbnailUrl);
      } catch (err) {
        console.error(err);
        setError("Failed to load film data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilm();
  }, [filmId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilm((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleThumbnailSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedThumbnail = e.target.files[0];

      // Create a FormData to upload the thumbnail file
      const formData = new FormData();
      formData.append("thumbnail", selectedThumbnail);

      try {
        setLoadingButton(true);
        // Send the file to your backend for uploading to S3
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/films/upload-thumbnail-to-s3`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        // After successful upload, update the thumbnailUrl state
        const uploadedThumbnailUrl = response.data.thumbnailUrl;
        if (uploadedThumbnailUrl) {
          setThumbnailUrl(uploadedThumbnailUrl);
          setFilm((prev) => (prev ? { ...prev, thumbnailUrl: uploadedThumbnailUrl } : null));
        }
        setLoadingButton(false);
      } catch (error) {
        console.error("Error uploading thumbnail:", error);
        setAlert({ type: "error", message: "Failed to upload thumbnail. Please try again." });
      }
    }
  };

  const handleSave = async () => {
    if (!film) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/films/update/${filmId}`, film);
      setAlert({ type: "success", message: "Film updated successfully!" });
      navigate(-1); // Go back to the previous page
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Failed to save changes." });
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-charcoal min-h-screen flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-crispWhite mb-6">Edit Film</h1>
      {alert && (
        <Alert status={alert.type} className="mb-4">
          {alert.message}
        </Alert>
      )}
      {film && (
        <div className="bg-darkCharcoal shadow-lg rounded-lg p-6 w-full max-w-4xl text-crispWhite">
          <div className="h-full flex items-center justify-between bg-darkCharcoal rounded-xl py-4 mb-4">
            <div className="flex flex-col">
              <label className="font-semibold text-sm mb-1">Thumbnail</label>
              <div className="flex items-center">
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  className="w-72 rounded-lg object-cover mr-4"
                />
              </div>
            </div>
            {/* Custom file input button */}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailSelection}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="bg-cornflowerBlue text-white px-4 py-2 rounded-lg cursor-pointer flex items-center">
                Choose New Image {loadingButton && <ClipLoader className="ml-2" color="#efefef" size={15} />}
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={film.title}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-charcoal border border-gray-600 text-crispWhite"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={film.description || ""}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-charcoal border border-gray-600 text-crispWhite"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Genre</label>
            <select
              name="genre"
              value={film.genre}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-charcoal border border-gray-600 text-crispWhite"
            >
              {genres.map((genre, index) => (
                <option key={index} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Visibility <span className="text-xs text-steelGray">(Cancel to schedule a premiere)</span>
            </label>
            <select
              name="visibility"
              value={film.visibility}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-charcoal border border-gray-600 text-crispWhite"
            >
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
              <option value="public">Public</option>
            </select>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 mr-2 rounded bg-gray-600 hover:bg-gray-500 text-crispWhite"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-cornflowerBlue hover:bg-cornflowerBlue/90 text-crispWhite"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditFilm;
