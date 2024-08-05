// SongForm.tsx
import React, { useState } from "react"
import { generateLithophane } from "./ApiCall"

interface SongFormProps {
  stlUrl: string | null
  setStlUrl: (url: string | null) => void
}

const SongForm: React.FC<SongFormProps> = ({ stlUrl, setStlUrl }) => {
  const [songLink, setSongLink] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showOptions, setShowOptions] = useState<boolean>(false)

  const [frameWidth, setFrameWidth] = useState<number>(10)
  const [minThickness, setMinThickness] = useState<number>(0.6)
  const [maxThickness, setMaxThickness] = useState<number>(3.0)
  const [maxWidth, setMaxWidth] = useState<number>(100.0)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setStlUrl(null)

    try {
      const url = await generateLithophane({
        songLink,
        frameWidth,
        minThickness,
        maxThickness,
        maxWidth,
      })
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
    <div className="w-1/2 flex flex-col mx-auto space-y-5 px-5 border">
      <h1 className="font-bold text-3xl text-center">Songphane generator</h1>
      <ol className="list-decimal list-inside">
        <li>Copy a song/album/playlist link from Spotify</li>
        <li>Paste it here</li>
        <li>Select parameters (if none specified, default values are used)</li>
        <li>Download the 3D model!</li>
      </ol>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          className="border rounded-md bg-white border-gray-700 p-2 text-black"
          type="text"
          placeholder="Paste Spotify song link here"
          value={songLink}
          onChange={(e) => setSongLink(e.target.value)}
        />

        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="border rounded-md bg-gray-600 border-gray-700 p-2"
        >
          {showOptions ? "Hide Options" : "Show Options"}
        </button>

        {showOptions && (
          <div className="flex flex-col space-y-4">
            <label>
              Frame Width:
              <input
                type="number"
                value={frameWidth}
                onChange={(e) => setFrameWidth(parseFloat(e.target.value))}
                className="border rounded-md p-2 ml-2"
              />
            </label>
            <label>
              Min Thickness:
              <input
                type="number"
                value={minThickness}
                onChange={(e) => setMinThickness(parseFloat(e.target.value))}
                className="border rounded-md p-2 ml-2"
              />
            </label>
            <label>
              Max Thickness:
              <input
                type="number"
                value={maxThickness}
                onChange={(e) => setMaxThickness(parseFloat(e.target.value))}
                className="border rounded-md p-2 ml-2"
              />
            </label>
            <label>
              Max Width:
              <input
                type="number"
                value={maxWidth}
                onChange={(e) => setMaxWidth(parseFloat(e.target.value))}
                className="border rounded-md p-2 ml-2"
              />
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="border rounded-md bg-gray-600 border-gray-700 p-2"
        >
          {loading ? "Generating..." : "Generate Lithophane"}
        </button>
      </form>

      {/* <input
        className="border rounded-md bg-white border-gray-700 p-2 text-black"
        type="text"
        placeholder="Paste Spotify song link here"
        value={songLink}
        onChange={(e) => setSongLink(e.target.value)}
      />

      <div className="flex space-x-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="border rounded-md bg-gray-600 border-gray-700 p-2"
        >
          {loading ? "Generating..." : "Generate Lithophane"}
        </button>

        <button
          onClick={() => setShowOptions(!showOptions)}
          className="border rounded-md bg-gray-600 border-gray-700 p-2"
        >
          {showOptions ? "Hide Options" : "Show Options"}
        </button>
      </div> */}

      {error && (
        <div>
          <p>Error generating lithophane: {error}</p>
        </div>
      )}

      {stlUrl && (
        <a href={stlUrl} download="lithophane.stl">
          <button className="border rounded-md bg-gray-600 border-gray-700 p-2">
            Download STL
          </button>
        </a>
      )}
    </div>
  )
}

export default SongForm
