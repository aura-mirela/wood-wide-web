import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'
import Moon, { MOON_POSITION } from './3d-components/Moon'
import Stars from './3d-components/Stars'
import SceneControls from './SceneControls'
import Terrain from './3d-components/Terrain'
import { useBreakpoints } from './breakpoints/useBreakpoints'
import { getSceneTier } from './breakpoints/getSceneTier'

const MOON_LIGHT_DISTANCE = 5

function lightPositionFromMoon(moonPosition, distance) {
  const [x, y, z] = moonPosition
  const horizontal = Math.hypot(x, z) || 1
  const scale = distance / horizontal
  return [x * scale, y, z * scale]
}

const moonLightPosition = lightPositionFromMoon(MOON_POSITION, MOON_LIGHT_DISTANCE)

export default function Experience({ cameraFocus, onCameraFocus }) {

  const { isXs, isSm, isMd, isPortrait } = useBreakpoints()
  const tier = getSceneTier({ isXs, isSm, isMd, isPortrait })

  return (
    <Canvas
      dpr={tier.dpr}
      camera={tier.camera}
      shadows={tier.shadows}
    >
      <SceneControls lightPosition={moonLightPosition} castShadow={tier.shadows} />
      <OrbitControls
        target={[-2, 1, -3.5]}
        minAzimuthAngle={0.13 - 0.2}
        maxAzimuthAngle={0.13 + 0.7}
        minPolarAngle={1.51}
        maxPolarAngle={1.51}
        minDistance={tier.minDistance}
        maxDistance={tier.maxDistance}
      />

      <Stars />
      <Suspense fallback={null}>
        <Moon />
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
