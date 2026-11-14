import { useEffect, useLayoutEffect, useRef } from 'react'
import { useControls } from 'leva'

import { sceneTierNames } from './breakpoints/getSceneTier'
import { TERRAIN_SIZE } from './lib/createTerrainGeometry'

// The ground is 20 across and the moon sits off to one side, so the
// default ±5 shadow box misses almost every scattered mushroom.
const SHADOW_EXTENT = TERRAIN_SIZE * 0.8
const SHADOW_MAP_SIZE = 2048

export default function SceneControls({
  mainColor,
  onMainColorChange,
  tierName,
  onTierChange,
  lightPosition,
  castShadow,
}) {
  const lightRef = useRef(null)
  const tierRef = useRef(tierName)
  const { 'main-color': pickedColor } = useControls(
    { 'main-color': mainColor },
    { persist: false },
  )
  const { tier: pickedTier } = useControls(
    {
      tier: {
        value: tierName,
        options: sceneTierNames,
      },
    },
    { persist: false },
  )

  useEffect(() => {
    if (pickedTier === tierRef.current) {
      return
    }
    tierRef.current = pickedTier
    onTierChange(pickedTier)
  }, [pickedTier, onTierChange])

  useEffect(() => {
    onMainColorChange(pickedColor)
  }, [pickedColor, onMainColorChange])

  useLayoutEffect(() => {
    const light = lightRef.current
    if (!light) {
      return
    }

    const camera = light.shadow.camera
    camera.left = -SHADOW_EXTENT
    camera.right = SHADOW_EXTENT
    camera.top = SHADOW_EXTENT
    camera.bottom = -SHADOW_EXTENT
    camera.near = 0.5
    camera.far = 50
    camera.updateProjectionMatrix()
  }, [castShadow])

  const fog = useControls('fog', {
    density: { value: 0.075, min: 0, max: 0.15, step: 0.001 },
  })

  const ambientLight = useControls('ambientLight', {
    color: '#1a335c'
  })

  const directionalLight = useControls('directionalLight', {
    color: '#edf2fc',
    intensity: { value: 1.2, min: 0.0, max: 2.5, step: 0.01 },
  })

  return (
    <>
      <fogExp2
        attach="fog"
        color={pickedColor}
        density={fog.density}
      />
      <ambientLight
        color={ambientLight.color}
        intensity={ambientLight.intensity}
      />
      <directionalLight
        ref={lightRef}
        color={directionalLight.color}
        intensity={directionalLight.intensity}
        position={lightPosition}
        castShadow={castShadow}
        shadow-mapSize={[SHADOW_MAP_SIZE, SHADOW_MAP_SIZE]}
        shadow-bias={-0.00015}
        shadow-normalBias={0.03}
        shadow-autoUpdate
      />
    </>
  )
}
