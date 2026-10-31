import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { AdditiveBlending, DoubleSide } from 'three'
import moonGlowVertexShader from '../shaders/moon-glow-shaders/vertex.glsl'
import moonGlowFragmentShader from '../shaders/moon-glow-shaders/fragment.glsl'
import { MOON_POSITION } from './Moon'

const MOON_GLOW_SIZE = 12

export default function Glow() {
  const glowRef = useRef(null)
  const materialRef = useRef(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
    glowRef.current?.lookAt(state.camera.position)
  })

  return (
    <mesh ref={glowRef} position={MOON_POSITION} renderOrder={-1} raycast={null}>
      <planeGeometry args={[MOON_GLOW_SIZE, MOON_GLOW_SIZE]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={moonGlowVertexShader}
        fragmentShader={moonGlowFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={DoubleSide}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  )
}
