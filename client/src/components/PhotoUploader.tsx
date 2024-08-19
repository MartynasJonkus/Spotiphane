import React, { useState } from "react"

const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface PhotoUploaderProps {
  onImageDataChange: (imageData: string) => void
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onImageDataChange }) => {
  const [image, setImage] = useState<string | ArrayBuffer | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.")
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        alert("File size exceeds the maximum limit of 10MB.");
        return;
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImage(result)
        onImageDataChange(result)
      }
      reader.readAsDataURL(file)
      setFileName(file.name)
    }
  }

  return (
    <div className="relative rounded-lg bg-gray-100 w-full h-[10rem] mx-auto text-center">
      <div className="relative w-full h-full">
        <div className="relative w-full h-full flex items-center justify-center">
          {image ? (
            <img
              src={image as string}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          ) : (
            <p className="text-gray-600 text-lg">No photo uploaded</p>
          )}
        </div>
        {image ? (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-200 p-2 rounded-b-lg flex items-center justify-between">
            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 text-blue-500 bg-gray-300 border border-gray-400 rounded cursor-pointer hover:bg-gray-400"
            >
              Change Photo
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-gray-800 text-sm">{fileName}</p>
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-200 p-2 rounded-b-lg flex items-center justify-between">
            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 text-blue-500 bg-gray-300 border border-gray-400 rounded cursor-pointer hover:bg-gray-400"
            >
              Upload Photo
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  )
}

export default PhotoUploader
