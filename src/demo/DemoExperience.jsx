import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import TheBox from './TheBox'

export default function DemoExperience({isScaling, color}) {
  return (
    <Canvas>
      <TheBox isScaling={isScaling} color={color} />
      <OrbitControls />
    </Canvas>
  )
}