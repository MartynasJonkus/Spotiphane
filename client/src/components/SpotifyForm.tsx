import React, { useState } from "react"
import { generateLithophane } from "../api/ApiCall"
import {
  LithophaneParams,
  defaultLithophaneParams,
} from "../interfaces/LithophaneParams"
import OptionsDropdown from "./OptionsDropdown"

interface SpotifyFormProps {
  setStlUrl: (url: string | null) => void
}

const SpotifyForm: React.FC<SpotifyFormProps> = ({ setStlUrl }) => {
  const [params, setParams] = useState<LithophaneParams>(
    defaultLithophaneParams
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showOptions, setShowOptions] = useState<boolean>(false)

  const handleOtherChange = (
    key: keyof LithophaneParams,
    value: string | boolean
  ) => {
    setParams((prevParams: LithophaneParams) => ({
      ...prevParams,
      [key]:
        key === "songLink" ? (value as string) : typeof value === "boolean",
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setStlUrl(null)

    try {
      const url = await generateLithophane(params)
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
        <div className="flex flex-col w-full">
          <input
            type="text"
            placeholder="Paste Spotify song link here"
            value={params.songLink}
            onChange={(e) => handleOtherChange("songLink", e.target.value)}
            className="flex-grow"
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={params.needsCode}
              onChange={(e) => handleOtherChange("needsCode", e.target.checked)}
              className="mr-2"
            />
            Add the Spotify code to the bottom of the image
          </label>
        </div>

        <button
          className="default-button"
          type="button"
          onClick={() => setShowOptions(!showOptions)}
        >
          {showOptions ? "Hide Options" : "Show Options"}
        </button>
        {showOptions && (
          <OptionsDropdown
            type="spotify"
            params={params}
            setParams={setParams}
          />
        )}
      </div>

      {params.songLink ? (
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

export default SpotifyForm
