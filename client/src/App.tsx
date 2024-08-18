import React, { useState } from "react"
import Forms from "./components/Forms"
import Viewer3D from "./components/Viewer3D"

const App: React.FC = () => {
  const [stlUrl, setStlUrl] = useState<string | null>(null)

  return (
    <main className="flex flex-col xl:flex-row bg-gray-800 text-gray-300">
      <div className="h-screen xl:w-1/3 p-5 xl:pr-0">
        <Forms stlUrl={stlUrl} setStlUrl={setStlUrl} />
      </div>
      <div className="h-screen xl:w-2/3 p-5">
        <Viewer3D stlUrl={stlUrl} />
      </div>
    </main>
  )
}

export default App
