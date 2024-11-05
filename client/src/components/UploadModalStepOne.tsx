import { FaUpload } from "react-icons/fa"

interface UploadModalStepOneProps {
    file: File | null;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleNext: () => void;
}

const UploadModalStepOne = (props: UploadModalStepOneProps) => {
    const { file, handleFileChange, handleNext } = props
    return (
        // Step 1: File Upload
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
                {/* Custom "Choose File" Button */}
                <label
                    htmlFor="fileInput"
                    className="bg-cornflowerBlue text-crispWhite py-2 px-4 rounded-md cursor-pointer hover:bg-cornflowerBlue-dark transition"
                >
                    Choose File
                </label>
                <input
                    type="file"
                    id="fileInput"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                />
                {/* Display Selected File Name */}
                {file && (
                    <p className="mt-2 text-sm text-steelGray">
                        Selected File: {file.name}
                    </p>
                )}
            </div>
        </div>

        <button
            onClick={handleNext}
            className={`${
                file ? "bg-cornflowerBlue" : "bg-gray-600"
            } absolute bottom-5 right-5 text-charcoal font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition`}
            disabled={!file}
        >
            Next
        </button>
    </div>
    )
}

export default UploadModalStepOne