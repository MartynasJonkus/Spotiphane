import React, { useState } from "react"
import { generateLithophanePhoto } from "../api/ApiCall"
import {
  LithophanePhotoParams,
  defaultLithophanePhotoParams,
} from "../interfaces/LithophanePhotoParams"
import PhotoUploader from "./PhotoUploader"

interface PhotoFormProps {
  stlUrl: string | null
  setStlUrl: (url: string | null) => void
}

const PhotoForm: React.FC<PhotoFormProps> = ({ stlUrl, setStlUrl }) => {
  const [params, setParams] = useState<LithophanePhotoParams>(
    defaultLithophanePhotoParams
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showOptions, setShowOptions] = useState<boolean>(false)

  const handleInputChange = (
    key: keyof LithophanePhotoParams,
    value: string | number
  ) => {
    setParams((prevParams: LithophanePhotoParams) => ({
      ...prevParams,
      [key]: parseFloat(value as string),
    }))
  }

  const handleImageDataChange = (imageData: string) => {
    setParams((prevParams: LithophanePhotoParams) => ({
      ...prevParams,
      imageData: imageData,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setStlUrl(null)

    try {
      const url = await generateLithophanePhoto(params)
      setStlUrl(url)
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <PhotoUploader onImageDataChange={handleImageDataChange} />

      <button type="button" onClick={() => setShowOptions(!showOptions)}>
        {showOptions ? "Hide Options" : "Show Options"}
      </button>

      {showOptions && (
        <div className="grid lg:grid-cols-2 gap-x-4 gap-y-2">
          {Object.keys(params).map((key) => {
            if (key !== "imageData") {
              return (
                <div
                  key={key}
                  className="flex flex-col sm:flex-row sm:items-center"
                >
                  <label className="sm:w-1/3 sm:text-right pr-2">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </label>
                  <input
                    type="number"
                    value={params[key as keyof LithophanePhotoParams] as number}
                    onChange={(e) =>
                      handleInputChange(
                        key as keyof LithophanePhotoParams,
                        parseFloat(e.target.value)
                      )
                    }
                    className="sm:w-2/3"
                  />
                </div>
              )
            }
            return null
          })}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="border rounded-md bg-gray-600 border-gray-700 p-2"
      >
        {loading ? "Generating..." : "Generate Lithophane"}
      </button>

      {error && (
        <div>
          <p>Error generating lithophane: {error}</p>
        </div>
      )}

      {stlUrl && (
        <a href={stlUrl} download="lithophane.stl">
          <button>Download STL</button>
        </a>
      )}
    </form>
  )
}

export default PhotoForm
