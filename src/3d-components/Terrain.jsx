import { useTexture } from '@react-three/drei'
import { useEffect, useMemo, useState } from 'react'

import { useBreakpoints } from '../breakpoints/useBreakpoints'
import {
  assignFungalIndividuals,
  myceliumMaxDistanceForBreakpoints,
} from '../lib/assignFungalIndividuals'
import { createTerrainGeometry } from '../lib/createTerrainGeometry'
import { scatterObjectsOnTerrain } from '../lib/scatterObjectsOnTerrain'
import TerrainPBRMaterial from '../materials/TerrainPBRMaterial'
import ScatteredFirTrees from './ScatteredFirTrees'
import ScatteredMushrooms from './ScatteredMushrooms'
import ScatteredRootFlares from './ScatteredRootFlares'

export const TERRAIN_TILING = 13.33
export const TREE_SCATTER_MASK_URL = '/textures/scatter-maps/firs-scatter-map.png'
export const MUSHROOM_SCATTER_MASK_URL = '/textures/scatter-maps/mushrooms-scatter-map.png'

export default function Terrain({
  tiling = TERRAIN_TILING,
  segments,
  treeCount,
  mushroomCount,
  bumpMap
}) {
  const { isXs, isSm, isMd } = useBreakpoints()
  const myceliumMaxDistance = myceliumMaxDistanceForBreakpoints({ isXs, isSm, isMd })
  
  const [treeScatterMask, mushroomScatterMask] = useTexture([
    TREE_SCATTER_MASK_URL,
    MUSHROOM_SCATTER_MASK_URL,
  ])
  const geometry = useMemo(() => createTerrainGeometry({ segments }), [segments])
  const [treeSeed] = useState(() => Math.floor(Math.random() * 2147483646) + 1)
  const [mushroomSeed] = useState(() => Math.floor(Math.random() * 2147483646) + 1)

  const treePlacements = useMemo(
    () => scatterObjectsOnTerrain({
      count: treeCount,
      maskTexture: treeScatterMask,
      seed: treeSeed,
    }),
    [treeCount, treeScatterMask, treeSeed],
  )

  const mushroomPlacements = useMemo(
    () => scatterObjectsOnTerrain({
      count: mushroomCount,
      maskTexture: mushroomScatterMask,
      seed: mushroomSeed,
    }),
    [mushroomCount, mushroomScatterMask, mushroomSeed],
  )

  const fungalIndividuals = useMemo(
    () => assignFungalIndividuals(
      mushroomPlacements,
      treePlacements,
      myceliumMaxDistance,
    ),
    [mushroomPlacements, treePlacements, myceliumMaxDistance],
  )

  const rootIndices = useMemo(
    () => fungalIndividuals.flatMap((individual) => individual.rootIndices),
    [fungalIndividuals],
  )

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <>
      <mesh
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        raycast={null}
      >
        <TerrainPBRMaterial
         tiling={tiling}
         bumpMap={bumpMap}
        />
      </mesh>
      <ScatteredFirTrees placements={treePlacements} />
      <ScatteredRootFlares placements={treePlacements} rootIndices={rootIndices} />
      <ScatteredMushrooms placements={mushroomPlacements} />
    </>
  )
}
