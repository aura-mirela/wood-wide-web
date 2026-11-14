import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export default function TheBox({isScaling, color}) {

    const boxRef = useRef()

    useFrame((state, delta) => {

      if (!isScaling) {
        return
      }      
      const increase = Math.abs(Math.sin(state.clock.elapsedTime * 0.5))
      boxRef.current.scale.x = 1 + increase
      boxRef.current.scale.y = 1 + increase
    })

  return (
    <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]} ref={boxRef}>
      <boxGeometry />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}