import { useTexture } from '@react-three/drei'
import { useLayoutEffect } from 'react'
import {
  LinearSRGBColorSpace,
  RepeatWrapping,
  SRGBColorSpace,
} from 'three'

const TERRAIN_TEXTURES = [
  '/textures/terrain-textures/tree-roots/TCom_Ground_TreeRootsPine_1.5x1.5_1K_albedo.png',
  '/textures/terrain-textures/tree-roots/TCom_Ground_TreeRootsPine_1.5x1.5_1K_ao.png',
  '/textures/terrain-textures/tree-roots/TCom_Ground_TreeRootsPine_1.5x1.5_1K_height.png',
  '/textures/terrain-textures/tree-roots/TCom_Ground_TreeRootsPine_1.5x1.5_1K_normal.png',
  '/textures/terrain-textures/tree-roots/TCom_Ground_TreeRootsPine_1.5x1.5_1K_roughness.png',
]

function configureTerrainTexture(texture, colorSpace) {
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.colorSpace = colorSpace
  texture.needsUpdate = true
}

export default function TerrainPBRMaterial({ tiling , bumpMap: useBumpMap }) {
  const [albedo, ao, height, normal, roughness] = useTexture(
    TERRAIN_TEXTURES,
    ([albedoMap, aoMap, heightMap, normalMap, roughnessMap]) => {
      configureTerrainTexture(albedoMap, SRGBColorSpace)
      configureTerrainTexture(aoMap, LinearSRGBColorSpace)
      configureTerrainTexture(heightMap, LinearSRGBColorSpace)
      configureTerrainTexture(normalMap, LinearSRGBColorSpace)
      configureTerrainTexture(roughnessMap, LinearSRGBColorSpace)
    },
  )

  useLayoutEffect(() => {
    ;[albedo, ao, height, normal, roughness].forEach((texture) => {
      texture.repeat.set(tiling, tiling)
    })
  }, [albedo, ao, height, normal, roughness, tiling])

  return (
    <meshStandardMaterial
      map={albedo}
      aoMap={ao}
      aoMapIntensity={1}
      normalMap={normal}
      roughnessMap={roughness}
      roughness={1}
      metalness={0}
      bumpMap={useBumpMap ? height : undefined}
      bumpScale={useBumpMap ? 0.06 : undefined}
    />
  )
}
