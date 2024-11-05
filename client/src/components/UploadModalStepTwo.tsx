import { useState } from 'react';
import { genres } from '../data/home';

interface UploadModalStepTwoProps {
    title: string;
    description: string;
    thumbnail: File | null;
    thumbnailUrl: string | null;
    series: string;
    isCreatingNewSeries: boolean;
    genre: string;
    setGenre: (genre: string) => void;
    handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSeriesChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleNewSeriesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handlePrevious: () => void;
    handleNext: () => void;
}

const UploadModalStepTwo = (props: UploadModalStepTwoProps) => {
    const {title, description, thumbnail, thumbnailUrl, series, isCreatingNewSeries, genre, setGenre, handleTitleChange, handleDescriptionChange, handleThumbnailChange, handleSeriesChange, handleNewSeriesChange, handleSubmit, handlePrevious, handleNext } = props

    const [seriesOptions] = useState(['Series 1', 'Series 2', 'Series 3']); // Example series options
    return (
        // Step 2: Set Title, Description, and Thumbnail
        <form onSubmit={handleSubmit} className={`space-y-6 flex ${thumbnail ? "justify-start" : "justify-between"} items-start w-full h-full`}>
            <div className='w-full'>
                {/* Title */}
                <div className='mt-4 border border-steelGray rounded-md focus:border-cornflowerBlue'>
                    <p className="text-sm text-steelGray mt-1 px-4">Film Title (required)</p>
                    <input
                        type="text"
                        name='Title'
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                        className="w-full bg-charcoal py-2 px-4 rounded-md outline-none placeholder-gray-600"
                        placeholder="Enter your film title"
                        required
                    />
                </div>
                {/* Description */}
                <div className='mt-4 border border-steelGray rounded-md focus:border-cornflowerBlue'>
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
                <div className='mt-4 border border-steelGray rounded-md focus:border-cornflowerBlue'>
                    <label htmlFor="thumbnail" className="block text-lg text-sm text-steelGray mb-2 px-4 mt-1">
                        Upload Thumbnail (required)
                    </label>
                    <div className="relative flex flex-col items-start bg-charcoal rounded-md px-4 ">
                        {/* Custom "Choose File" Button */}
                        <label
                            htmlFor="thumbnailInput" // Changed id to thumbnailInput
                            className="bg-cornflowerBlue text-crispWhite py-2 px-4 rounded-md cursor-pointer hover:bg-steelGray transition mb-2"
                        >
                            Choose File
                        </label>
                        <input
                            type="file"
                            id="thumbnailInput" // Changed id to thumbnailInput
                            onChange={handleThumbnailChange} // Update thumbnail state
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
                        value={series}
                        onChange={handleSeriesChange}
                        className="w-full bg-charcoal py-2 px-4 rounded-md outline-none"
                    >
                        <option value="" disabled>
                            Select a series
                        </option>
                        {seriesOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                        <option value="new">Create a new series</option>
                    </select>

                    {isCreatingNewSeries && (
                        <input
                            type="text"
                            value={series}
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
                            Select a series
                        </option>
                        {genres.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Navigation Buttons */}
                <div className='absolute bottom-5 right-5 flex gap-4'>
                    <button
                        onClick={handlePrevious}
                        className="bg-gray-600 text-crispWhite font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        className={`font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition ${title && thumbnail && genre ? "bg-cornflowerBlue text-charcoal hover:bg-opacity-90" : "bg-steelGray text-charcoal cursor-not-allowed"}`}
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
                    <div className='m-1'>
                        <h4 className=''>{title}</h4>
                    </div>
                </div>
            )}
        </form>
    )
}

export default UploadModalStepTwo