import { useTexture } from '@react-three/drei'
import { useEffect, useMemo, useState } from 'react'

import { createTerrainGeometry } from '../lib/createTerrainGeometry'
import { scatterObjectsOnTerrain } from '../lib/scatterObjectsOnTerrain'
import TerrainPBRMaterial from '../materials/TerrainPBRMaterial'
import MyceliumNetwork from './MyceliumNetwork'
import ScatteredFirTrees from './ScatteredFirTrees'
import ScatteredMushrooms from './ScatteredMushrooms'

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
  const [treeScatterMask, mushroomScatterMask] = useTexture([
    TREE_SCATTER_MASK_URL,
    MUSHROOM_SCATTER_MASK_URL,
  ])
  const geometry = useMemo(() => createTerrainGeometry({ segments }), [segments])
  const [treeSeed] = useState(() => Math.floor(Math.random() * 2147483646) + 1)
  const [mushroomSeed] = useState(() => Math.floor(Math.random() * 2147483646) + 1)
  const [clickedMushroomIndex, setClickedMushroomIndex] = useState(null)
  const [expandableMushroomsIndices, setExpandableMushroomsIndices] = useState([])

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
      <ScatteredMushrooms
        placements={mushroomPlacements}
        expandableMushroomsIndices={expandableMushroomsIndices}
        onSelect={setClickedMushroomIndex}
      />
      <MyceliumNetwork
        placements={mushroomPlacements}
        clickedMushroomIndex={clickedMushroomIndex}
        onExpandableChange={setExpandableMushroomsIndices}
      />
    </>
  )
}
