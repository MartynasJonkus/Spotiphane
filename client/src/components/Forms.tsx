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
    <div className="w-full h-full flex flex-col gap-5">
      <h1 className="font-bold text-3xl text-center">Songphane Generator</h1>
      <div className="flex">
        <button
          className={`flex-1 py-2 transition-colors duration-300 ease-in-out  ${
            activeTab === "spotify"
              ? "relative after:content-[''] after:absolute after:w-full after:h-1 after:bg-blue-500 after:left-0 after:bottom-0"
              : ""
          } hover:bg-gray-700`}
          onClick={() => setActiveTab("spotify")}
        >
          Spotify
        </button>
        <button
          className={`flex-1 py-2 transition-colors duration-300 ease-in-out  ${
            activeTab === "photo"
              ? "relative after:content-[''] after:absolute after:w-full after:h-1 after:bg-blue-500 after:left-0 after:bottom-0"
              : ""
          } hover:bg-gray-700`}
          onClick={() => setActiveTab("photo")}
        >
          Photo
        </button>
      </div>
      <div className="sm:flex-grow">
        {activeTab === "spotify" ? (
          <SpotifyForm setStlUrl={setStlUrl} />
        ) : (
          <PhotoForm setStlUrl={setStlUrl} />
        )}
      </div>
      <div className="flex justify-end">
        {stlUrl ? (
          <a href={stlUrl} download="lithophane.stl">
            <button className="default-button">Download STL</button>
          </a>
        ) : (
          <button className="disabled-button" disabled>
            Download STL
          </button>
        )}
      </div>
    </div>
  )
}

export default Forms
