import React, { useState } from "react"
import { generateLithophanePhoto } from "../api/ApiCall"
import {
  LithophaneParams,
  defaultLithophaneParams,
} from "../interfaces/LithophaneParams"
import PhotoUploader from "./PhotoUploader"
import OptionsDropdown from "./OptionsDropdown"

interface PhotoFormProps {
  setStlUrl: (url: string | null) => void
}

const PhotoForm: React.FC<PhotoFormProps> = ({ setStlUrl }) => {
  const [params, setParams] = useState<LithophaneParams>(
    defaultLithophaneParams
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showOptions, setShowOptions] = useState<boolean>(false)

  const handleImageDataChange = (imageData: string) => {
    setParams((prevParams: LithophaneParams) => ({
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
    <form onSubmit={handleSubmit} className="h-full flex flex-col gap-4">
      <div className="flex-grow flex flex-col gap-4">
        <PhotoUploader onImageDataChange={handleImageDataChange} />

        <button
          className="default-button"
          type="button"
          onClick={() => setShowOptions(!showOptions)}
        >
          {showOptions ? "Hide Options" : "Show Options"}
        </button>

        {showOptions && (
          <OptionsDropdown type="photo" params={params} setParams={setParams} />
        )}
      </div>

      {params.imageData ? (
        <button type="submit" disabled={loading} className="default-button">
          {loading ? "Generating..." : "Generate Lithophane"}
        </button>
      ) : (
        <button className="disabled-button" disabled>
          Generate Lithophane
        </button>
      )}

      {error && (
        <div>
          <p>Error generating lithophane: {error}</p>
        </div>
      )}
    </form>
  )
}

export default PhotoForm
