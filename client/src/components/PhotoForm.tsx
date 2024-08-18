import React, { useState } from "react"
import { generateLithophanePhoto } from "../api/ApiCall"
import {
  LithophanePhotoParams,
  defaultLithophanePhotoParams,
  minMaxLithophanePhoto,
} from "../interfaces/LithophanePhotoParams"
import PhotoUploader from "./PhotoUploader"

interface PhotoFormProps {
  setStlUrl: (url: string | null) => void
}

const PhotoForm: React.FC<PhotoFormProps> = ({ setStlUrl }) => {
  const [params, setParams] = useState<LithophanePhotoParams>(
    defaultLithophanePhotoParams
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showOptions, setShowOptions] = useState<boolean>(false)

  const handleInputChange = (
    key: keyof LithophanePhotoParams,
    value: number
  ) => {
    setParams((prevParams: LithophanePhotoParams) => ({
      ...prevParams,
      [key]: value,
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
    <form onSubmit={handleSubmit} className="h-full flex flex-col gap-4 border">
      <div className="flex-grow">
        <PhotoUploader onImageDataChange={handleImageDataChange} />

        <button
          className="default-button"
          type="button"
          onClick={() => setShowOptions(!showOptions)}
        >
          {showOptions ? "Hide Options" : "Show Options"}
        </button>

        {showOptions && (
          <div className="max-h-80 overflow-y-auto p-4 border-t border-gray-300">
            {Object.keys(params).map((key) => {
              if (key !== "imageData") {
                const min =
                  minMaxLithophanePhoto[
                    key as keyof typeof minMaxLithophanePhoto
                  ]?.min || 0
                const max =
                  minMaxLithophanePhoto[
                    key as keyof typeof minMaxLithophanePhoto
                  ]?.max || 100
                const value = params[
                  key as keyof LithophanePhotoParams
                ] as number

                return (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:items-center mb-4"
                  >
                    <label className="sm:w-1/3 sm:text-right pr-2">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <div className="flex flex-col sm:w-2/3 items-center">
                      <input
                        type="number"
                        min={min}
                        max={max}
                        value={value}
                        onChange={(e) =>
                          handleInputChange(
                            key as keyof LithophanePhotoParams,
                            parseFloat(e.target.value)
                          )
                        }
                        className="mb-2 w-full"
                      />
                      <input
                        type="range"
                        min={min}
                        max={max}
                        value={value}
                        onChange={(e) =>
                          handleInputChange(
                            key as keyof LithophanePhotoParams,
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                )
              }
              return null
            })}
          </div>
        )}
      </div>
      <button type="submit" disabled={loading} className="default-button">
        {loading ? "Generating..." : "Generate Lithophane"}
      </button>

      {error && (
        <div>
          <p>Error generating lithophane: {error}</p>
        </div>
      )}
    </form>
  )
}

export default PhotoForm
