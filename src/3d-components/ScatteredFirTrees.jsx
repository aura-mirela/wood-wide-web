import { useGLTF } from '@react-three/drei'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Matrix4, Object3D } from 'three'

const TREE_MODEL_URL = '/models/fir_tree.glb'
const ROOTED_FIR_SCALE = 1.2

// Function that creats an instance mesh for the tree part (part = trunk and foliage)
function InstancedTreePart({ geometry, material, localMatrix, placements, rootedFirIndices }) {
  const meshRef = useRef(null)

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) {
      return
    }

    const dummy = new Object3D()
    const composed = new Matrix4()
    const rooted = new Set(rootedFirIndices)

    placements.forEach((placement, index) => {
      const scale = placement.scale * (rooted.has(index) ? ROOTED_FIR_SCALE : 1)
      dummy.position.set(placement.x, placement.elevation, -placement.y)
      dummy.rotation.set(0, placement.rotationY, 0)
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      composed.multiplyMatrices(dummy.matrix, localMatrix)
      mesh.setMatrixAt(index, composed)
    })

    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [localMatrix, placements, rootedFirIndices])

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

export default function ScatteredFirTrees({ placements, rootedFirIndices = [] }) {
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
      rootedFirIndices={rootedFirIndices}
    />
  ))
}

useGLTF.preload(TREE_MODEL_URL)
