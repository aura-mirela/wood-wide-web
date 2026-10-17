import { useFrame } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AdditiveBlending, Color, ShaderMaterial } from 'three'

import { useBreakpoints } from '../breakpoints/useBreakpoints'
import { getTerrainElevation } from '../lib/createTerrainGeometry'
import {
  buildMyceliumParticleAttributes,
  buildNeighborStar,
  collectExpandableMushroomIndices,
} from '../lib/buildMyceliumConnections'
import fragmentShader from '../shaders/mycelium-network/fragment.glsl'
import vertexShader from '../shaders/mycelium-network/vertex.glsl'

// Neighbor-radius cap by scene tier. Each new mushroom tap links the
// clicked mushroom to up to 5 neighbors within this distance.
const MYCELIUM_MAX_DISTANCE_BY_TIER = {
  xs: 3.2,
  sm: 2.9,
  md: 2.7,
  desktop: 3.5,
}

function getTierKey({ isXs, isSm, isMd }) {
  if (isXs) {
    return 'xs'
  }

  if (isSm) {
    return 'sm'
  }

  if (isMd) {
    return 'md'
  }

  return 'desktop'
}

function collectOccupiedNodes(clickedMushroomsIndices, myceliumStrands) {
  const occupied = new Set(clickedMushroomsIndices)

  for (const strand of myceliumStrands) {
    occupied.add(strand.from)
    occupied.add(strand.to)
  }

  return occupied
}

export default function MyceliumNetwork({
  placements,
  clickedMushroomIndex,
  onExpandableChange,
}) {
  const { isXs, isSm, isMd } = useBreakpoints()
  const maxDistanceBetweenMushrooms = MYCELIUM_MAX_DISTANCE_BY_TIER[getTierKey({ isXs, isSm, isMd })]
  const [clickedMushroomsIndices, setClickedMushroomsIndices] = useState([])
  const [myceliumStrands, setMyceliumStrands] = useState([])
  const clickedMushroomsIndicesRef = useRef(clickedMushroomsIndices)
  const myceliumStrandsRef = useRef(myceliumStrands)

  useEffect(() => {
    clickedMushroomsIndicesRef.current = clickedMushroomsIndices
  }, [clickedMushroomsIndices])

  useEffect(() => {
    myceliumStrandsRef.current = myceliumStrands
  }, [myceliumStrands])

  useEffect(() => {
    if (clickedMushroomIndex == null || clickedMushroomsIndicesRef.current.includes(clickedMushroomIndex)) {
      return
    }

    const occupied = collectOccupiedNodes(
      clickedMushroomsIndicesRef.current,
      myceliumStrandsRef.current,
    )
    const star = buildNeighborStar(
      placements,
      clickedMushroomIndex,
      maxDistanceBetweenMushrooms,
      occupied,
    )

    const nextClicked = [...clickedMushroomsIndicesRef.current, clickedMushroomIndex]
    clickedMushroomsIndicesRef.current = nextClicked
    setClickedMushroomsIndices(nextClicked)

    if (star.myceliumStrands.length > 0) {
      const nextStrands = [...myceliumStrandsRef.current, ...star.myceliumStrands]
      myceliumStrandsRef.current = nextStrands
      setMyceliumStrands(nextStrands)
    }
  }, [maxDistanceBetweenMushrooms, clickedMushroomIndex, placements])

  const expandableMushroomsIndices = useMemo(() => {
    const occupied = collectOccupiedNodes(clickedMushroomsIndices, myceliumStrands)
    return collectExpandableMushroomIndices(
      placements,
      maxDistanceBetweenMushrooms,
      occupied,
      clickedMushroomsIndices,
    )
  }, [clickedMushroomsIndices, myceliumStrands, maxDistanceBetweenMushrooms, placements])

  useLayoutEffect(() => {
    onExpandableChange?.(expandableMushroomsIndices)
  }, [expandableMushroomsIndices, onExpandableChange])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new Color('#ffc56a') },
    }),
    [],
  )

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        toneMapped: false,
      }),
    [uniforms],
  )

  const attributes = useMemo(
    () =>
      buildMyceliumParticleAttributes(placements, myceliumStrands, {
        getElevation: getTerrainElevation,
        nodeIndices: [],
      }),
    [myceliumStrands, placements],
  )

  useEffect(() => () => material.dispose(), [material])

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
  })

  if (placements.length === 0 || attributes.positions.length === 0) {
    return null
  }

  return (
    <points frustumCulled={false} material={material} raycast={null}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[attributes.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[attributes.sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          args={[attributes.phases, 1]}
        />
      </bufferGeometry>
    </points>
  )
}
