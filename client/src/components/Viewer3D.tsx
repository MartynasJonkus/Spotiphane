import React, { Suspense, useRef, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useProgress, Html } from "@react-three/drei"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import * as THREE from "three"
import { useLoader } from "@react-three/fiber"

interface Viewer3DProps {
  stlUrl: string | null
}

const Loader = () => {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

const Model = ({ url }: { url: string }) => {
  const geometry = useLoader(STLLoader, url) as THREE.BufferGeometry

  const center = new THREE.Box3().setFromObject(new THREE.Mesh(geometry))
  const modelCenter = center.getCenter(new THREE.Vector3())

  return (
    <mesh
      geometry={geometry}
      position={[modelCenter.x, 0, -modelCenter.y]}
      rotation={[Math.PI / 2, Math.PI, 0]} // Rotate 180 degrees around the X-axis
    >
      <meshStandardMaterial color="white" />
    </mesh>
  )
}

const SceneHelpers = () => {
  const gridHelperRef = useRef<THREE.GridHelper>(null)
  const axesHelperRef = useRef<THREE.AxesHelper>(null)

  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.position.set(0, 0, 0)
    }
    if (axesHelperRef.current) {
      axesHelperRef.current.position.set(0, 0, 0)
    }
  }, [])

  return (
    <>
      <gridHelper ref={gridHelperRef} args={[200, 200]} />
      <axesHelper ref={axesHelperRef} args={[10]} />
    </>
  )
}

const Viewer3D: React.FC<Viewer3DProps> = ({ stlUrl }) => {
  return (
    <div className="w-full h-full border">
      <Canvas
        camera={{ position: [0, 40, 100], fov: 75 }}
        style={{ background: "#333" }}
        frameloop="demand"
      >
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1}
          color="white"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight
          position={[10, -10, 10]}
          intensity={0.5}
          color="white"
        />

        <spotLight
          position={[15, 15, 15]}
          angle={Math.PI / 4}
          penumbra={1}
          intensity={1}
          color="white"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
        />
        <spotLight
          position={[-15, -15, -15]}
          angle={Math.PI / 4}
          penumbra={1}
          intensity={0.5}
          color="white"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
        />

        <SceneHelpers />

        {stlUrl && (
          <Suspense fallback={<Loader />}>
            <Model url={stlUrl} />
          </Suspense>
        )}

        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default Viewer3D
