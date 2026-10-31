import { useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { BufferAttribute, BufferGeometry } from 'three'
import starVertexShader from '../shaders/stars-shader/vertex.glsl'
import starFragmentShader from '../shaders/stars-shader/fragment.glsl'

const STAR_COUNT = 1000
// STAR_RADIUS - should be bigger than the terrain size (of 20x20)
const STAR_RADIUS = 30

function createStarGeometry(count, radius) {
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const height = Math.random()
    const angle = Math.sqrt(1 - height * height)
    const theta = Math.random() * Math.PI * 2
    const offset = i * 3

    positions[offset] = Math.cos(theta) * angle * radius
    positions[offset + 1] = height * radius
    positions[offset + 2] = Math.sin(theta) * angle * radius
    sizes[i] = 0.75 + Math.random() * 1.5
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('size', new BufferAttribute(sizes, 1))
  return geometry
}

export default function Stars({ count = STAR_COUNT, radius = STAR_RADIUS }) {
  const pixelRatio = useThree((state) => state.viewport.dpr)
  const geometry = useMemo(() => createStarGeometry(count, radius), [count, radius])

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <points geometry={geometry} raycast={null}>
      <shaderMaterial
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={{ uPixelRatio: { value: pixelRatio } }}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  )
}
