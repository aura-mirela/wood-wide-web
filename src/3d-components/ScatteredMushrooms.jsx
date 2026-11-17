import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Matrix4, Object3D } from 'three'

const MUSHROOM_MODEL_URL = '/models/fly_agaric_mushroom.glb'
const MUSHROOM_BASE_SCALE = 0.0035
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

export default function ScatteredMushrooms({
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
    </>
  )
}

useGLTF.preload(MUSHROOM_MODEL_URL)
