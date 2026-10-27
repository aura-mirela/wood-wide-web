import { useGLTF } from '@react-three/drei'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Matrix4, Object3D } from 'three'

const ROOT_MODEL_URL = '/models/fir_trunk._spruce_trunk.glb'

// The scan is as wide as the whole fir and sits off the origin.
// Scale it down, then slide the top center onto the trunk axis at the soil.
const ROOT_SCALE = 0.4
const ROOT_LIFT = 0.03
const ROOT_CORRECTION = new Matrix4().makeTranslation(0.374, 0.085, -0.014)

function InstancedRootPart({
  geometry,
  material,
  localMatrix,
  placements,
  rootIndices,
}) {
  const meshRef = useRef(null)

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) {
      return
    }

    const dummy = new Object3D()
    const corrected = new Matrix4()
    const composed = new Matrix4()

    corrected.multiplyMatrices(ROOT_CORRECTION, localMatrix)

    rootIndices.forEach((treeIndex, instanceId) => {
      const placement = placements[treeIndex]
      dummy.position.set(placement.x, placement.elevation + ROOT_LIFT, -placement.y)
      dummy.rotation.set(0, placement.rotationY, 0)
      dummy.scale.setScalar(placement.scale * ROOT_SCALE)
      dummy.updateMatrix()
      composed.multiplyMatrices(dummy.matrix, corrected)
      mesh.setMatrixAt(instanceId, composed)
    })

    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [localMatrix, placements, rootIndices])

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, rootIndices.length]}
      raycast={null}
    />
  )
}

export default function ScatteredRootFlares({ placements, rootIndices }) {
  const { scene } = useGLTF(ROOT_MODEL_URL)

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

  if (placements.length === 0 || rootIndices.length === 0) {
    return null
  }

  return parts.map((part, index) => (
    <InstancedRootPart
      key={index}
      geometry={part.geometry}
      material={part.material}
      localMatrix={part.localMatrix}
      placements={placements}
      rootIndices={rootIndices}
    />
  ))
}

useGLTF.preload(ROOT_MODEL_URL)
