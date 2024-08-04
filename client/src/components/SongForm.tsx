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

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setStlUrl(null)

    try {
      const url = await generateLithophane(songLink)
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

      <input
        className="border rounded-md bg-white border-gray-700 p-2 text-black"
        type="text"
        placeholder="Paste Spotify song link here"
        value={songLink}
        onChange={(e) => setSongLink(e.target.value)}
      />

      <button
        onClick={handleSubmit}
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
          <button className="border rounded-md bg-gray-600 border-gray-700 p-2">
            Download STL
          </button>
        </a>
      )}
    </div>
  )
}

export default SongForm
