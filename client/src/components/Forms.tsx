import React, { useState } from "react"
import SpotifyForm from "./SpotifyForm"
import PhotoForm from "./PhotoForm"

interface FormProps {
  stlUrl: string | null
  setStlUrl: (url: string | null) => void
}

const Forms: React.FC<FormProps> = ({ stlUrl, setStlUrl }) => {
  const [activeTab, setActiveTab] = useState<"spotify" | "photo">("spotify")

  return (
    <div className="w-full flex flex-col mx-auto space-y-5 px-5">
      <h1 className="font-bold text-3xl text-center">Songphane Generator</h1>
      <div className="flex space-x-4 justify-center">
        <button
          className={`${
            activeTab === "spotify" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveTab("spotify")}
        >
          Spotify
        </button>
        <button
          className={`${
            activeTab === "photo" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveTab("photo")}
        >
          Photo
        </button>
      </div>
      {activeTab === "spotify" ? (
        <SpotifyForm stlUrl={stlUrl} setStlUrl={setStlUrl} />
      ) : (
        <PhotoForm stlUrl={stlUrl} setStlUrl={setStlUrl} />
      )}
    </div>
  )
}

export default Forms
