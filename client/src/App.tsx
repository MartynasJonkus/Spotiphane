import React, { useState } from "react"
import Forms from "./components/Forms"
import Viewer3D from "./components/Viewer3D"

const App: React.FC = () => {
  const [stlUrl, setStlUrl] = useState<string | null>(null)

  return (
    <main className="h-screen grid xl:grid-cols-2 bg-gray-800 text-gray-300 p-10">
      <Forms stlUrl={stlUrl} setStlUrl={setStlUrl} />
      <Viewer3D stlUrl={stlUrl} />
    </main>
  )
}

export default App
