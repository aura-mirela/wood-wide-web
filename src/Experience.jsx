import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'
import SceneEnvironment from './SceneEnvironment'
import Terrain from './3d-components/Terrain'
import { useBreakpoints } from './breakpoints/useBreakpoints'
import { getSceneTier } from './breakpoints/getSceneTier'

export default function Experience({ cameraFocus, onCameraFocus }) {

  const { isXs, isSm, isMd, isPortrait } = useBreakpoints()
  const tier = getSceneTier({ isXs, isSm, isMd, isPortrait })

  return (
    <Canvas
      dpr={tier.dpr}
      camera={tier.camera}
      shadows={tier.shadows}
    >
      <OrbitControls
        target={[-2, 1, -3.5]}
        minAzimuthAngle={0.13 - 0.2}
        maxAzimuthAngle={0.13 + 0.7}
        minPolarAngle={1.51}
        maxPolarAngle={1.51}
        minDistance={tier.minDistance}
        maxDistance={tier.maxDistance}
      />
      <SceneEnvironment />

      <directionalLight
        color="#ff4f25"
        intensity={0.2}
        position={[0.56, 0.02, -0.82]}
        castShadow={tier.shadows}
      />
      <Suspense fallback={null}>
        <Terrain
          segments={tier.segments}
          treeCount={tier.treeCount}
          mushroomCount={tier.mushroomCount}
          bumpMap={tier.bumpMap}
          cameraFocus={cameraFocus}
          onCameraFocus={onCameraFocus}
         />
      </Suspense>
    </Canvas>
  )
}
