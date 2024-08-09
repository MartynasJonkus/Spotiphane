import React, { useState } from "react"
import { generateLithophane } from "./ApiCall"
import {
  LithophaneParams,
  defaultLithophaneParams,
} from "../interfaces/LithophaneParams"

interface SongFormProps {
  stlUrl: string | null
  setStlUrl: (url: string | null) => void
}

const SongForm: React.FC<SongFormProps> = ({ stlUrl, setStlUrl }) => {
  const [params, setParams] = useState<LithophaneParams>(
    defaultLithophaneParams
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showOptions, setShowOptions] = useState<boolean>(false)

  const handleInputChange = (
    key: keyof LithophaneParams,
    value: string | number | boolean
  ) => {
    setParams((prevParams: LithophaneParams) => ({
      ...prevParams,
      [key]:
        key === "songLink"
          ? (value as string)
          : typeof value === "boolean"
            ? value
            : parseFloat(value as string),
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
    <div className="w-full flex flex-col mx-auto space-y-5 px-5">
      <h1 className="font-bold text-3xl text-center">Songphane Generator</h1>
      <ol className="list-decimal list-inside">
        <li>Copy a song/album/playlist link from Spotify</li>
        <li>Paste it here</li>
        <li>Select parameters (if none specified, default values are used)</li>
        <li>Download the 3D model!</li>
      </ol>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Paste Spotify song link here"
          value={params.songLink}
          onChange={(e) => handleInputChange("songLink", e.target.value)}
        />

        <div>
          <label>Add the Spotify code to the bottom of the image </label>
          <input
            type="checkbox"
            checked={params.needsCode}
            onChange={(e) => handleInputChange("needsCode", e.target.checked)}
          />
        </div>

        <button type="button" onClick={() => setShowOptions(!showOptions)}>
          {showOptions ? "Hide Options" : "Show Options"}
        </button>

        <div className="grid lg:grid-cols-2 gap-x-4 gap-y-2">
          {showOptions && (
            <>
              {Object.keys(params).map((key) => {
                if (key !== "songLink" && key !== "needsCode") {
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
                        value={params[key as keyof LithophaneParams] as number}
                        onChange={(e) =>
                          handleInputChange(
                            key as keyof LithophaneParams,
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
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="border rounded-md bg-gray-600 border-gray-700 p-2"
        >
          {loading ? "Generating..." : "Generate Lithophane"}
        </button>
      </form>

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
    </div>
  )
}

export default SongForm
