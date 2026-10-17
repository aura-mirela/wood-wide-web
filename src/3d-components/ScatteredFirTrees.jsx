import { useGLTF } from '@react-three/drei'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Matrix4, Object3D } from 'three'

const TREE_MODEL_URL = '/models/fir_tree.glb'

// Function that creats an instance mesh for the tree part (part = trunk and foliage)
function InstancedTreePart({ geometry, material, localMatrix, placements }) {
  const meshRef = useRef(null)

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) {
      return
    }

    const dummy = new Object3D()
    const composed = new Matrix4()

    placements.forEach((placement, index) => {
      dummy.position.set(placement.x, placement.elevation, -placement.y)
      dummy.rotation.set(0, placement.rotationY, 0)
      dummy.scale.setScalar(placement.scale)
      dummy.updateMatrix()
      composed.multiplyMatrices(dummy.matrix, localMatrix)
      mesh.setMatrixAt(index, composed)
    })

    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [localMatrix, placements])

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

export default function ScatteredFirTrees({ placements }) {
  const { scene } = useGLTF(TREE_MODEL_URL)

  // creates an array of plain records (geometry, material, localMatrix), one per mesh in the GLB and caches it
  // Eg. : [{geometry: trunk, material: trunk, localMatrix: trunkMatrix}, {geometry: foliage, material: foliage, localMatrix: foliageMatrix}]
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

  // creates an array of instance meshes for each tree part
  // Eg. :  <InstancedTreePart geometry={trunk} material={trunk} … placements={placements} />,
  // <InstancedTreePart geometry={foliage} material={foliage} … placements={placements} />
  return parts.map((part, index) => (
    <InstancedTreePart
      key={index}
      geometry={part.geometry}
      material={part.material}
      localMatrix={part.localMatrix}
      placements={placements}
    />
  ))
}

useGLTF.preload(TREE_MODEL_URL)
