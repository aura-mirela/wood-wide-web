import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Matrix4, Object3D } from 'three'

import { TERRAIN_SIZE } from '../lib/createTerrainGeometry'
import { pickNearestMushroomIndex } from '../lib/pickNearestMushroom'

const MUSHROOM_MODEL_URL = '/models/fly_agaric_mushroom.glb'
const MUSHROOM_BASE_SCALE = 0.0035
const MUSHROOM_PICK_MAX_DISTANCE_PX = 40
const BREATH_AMPLITUDE = 0.4
const BREATH_SPEED = 2.5
const RESTING_MUSHROOM_INCREASE_FACTOR = 1

function InstancedMushroomPart({
  geometry,
  material,
  localMatrix,
  placements,
  restingMushroomIndices,
}) {
  const meshRef = useRef(null)
  const dummy = useMemo(() => new Object3D(), [])
  const composed = useMemo(() => new Matrix4(), [])
  const boundsReadyRef = useRef(false)

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) {
      return
    }

    const time = state.clock.elapsedTime

    placements.forEach((placement, index) => {
      const breath = restingMushroomIndices.has(index)
        ? 1 + BREATH_AMPLITUDE * RESTING_MUSHROOM_INCREASE_FACTOR
        : 1 +
          BREATH_AMPLITUDE *
            (0.5 + 0.5 * Math.sin(time * BREATH_SPEED + index * 1.73))

      dummy.position.set(placement.x, placement.elevation, -placement.y)
      dummy.rotation.set(0, placement.rotationY, 0)
      dummy.scale.setScalar(placement.scale * MUSHROOM_BASE_SCALE * breath)
      dummy.updateMatrix()
      composed.multiplyMatrices(dummy.matrix, localMatrix)
      mesh.setMatrixAt(index, composed)
    })

    mesh.instanceMatrix.needsUpdate = true

    if (!boundsReadyRef.current) {
      mesh.computeBoundingSphere()
      boundsReadyRef.current = true
    }
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, placements.length]}
      castShadow
      receiveShadow
      raycast={null}
    />
  )
}

function MushroomHitTargets({ placements, onSelect }) {
  const { camera, size } = useThree()

  const selectAtPointer = (event) => {
    event.stopPropagation()
    return pickNearestMushroomIndex(
      placements,
      event.pointer,
      camera,
      size,
      MUSHROOM_PICK_MAX_DISTANCE_PX,
    )
  }

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.02, 0]}
      onClick={(event) => {
        const index = selectAtPointer(event)
        if (index != null) {
          onSelect(index)
        }
      }}
      onPointerMove={(event) => {
        const index = selectAtPointer(event)
        document.body.style.cursor = index != null ? 'pointer' : 'auto'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <planeGeometry args={[TERRAIN_SIZE, TERRAIN_SIZE]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

export default function ScatteredMushrooms({
  onSelect,
  placements,
  restingMushroomIndices,
}) {
  const { scene } = useGLTF(MUSHROOM_MODEL_URL)

  const parts = useMemo(() => {
    const meshes = []

    scene.updateMatrixWorld(true)
    scene.traverse((child) => {
      if (!child.isMesh) {
        return
      }

      meshes.push({
        geometry: child.geometry,
        material: child.material,
        localMatrix: child.matrixWorld.clone(),
      })
    })

    return meshes
  }, [scene])

  if (placements.length === 0) {
    return null
  }

  return (
    <>
      {parts.map((part, index) => (
        <InstancedMushroomPart
          key={index}
          geometry={part.geometry}
          material={part.material}
          localMatrix={part.localMatrix}
          placements={placements}
          restingMushroomIndices={restingMushroomIndices}
        />
      ))}
      {onSelect && <MushroomHitTargets placements={placements} onSelect={onSelect} />}
    </>
  )
}

useGLTF.preload(MUSHROOM_MODEL_URL)
