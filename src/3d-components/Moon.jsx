import { useTexture } from '@react-three/drei'
import { SRGBColorSpace } from 'three'
import Glow from './Glow'

const MOON_TEXTURE_URL = '/textures/moon-texture/2k_moon-edited.jpg'
const MOON_RADIUS = 1.7
export const MOON_POSITION = [-9, 11, -27]

export default function Moon() {
  const texture = useTexture(MOON_TEXTURE_URL, (map) => {
    map.colorSpace = SRGBColorSpace
  })

  return (
    <>
      <Glow />
      <mesh
        position={MOON_POSITION}
        rotation={[0, -Math.PI / 2, 0]}
        raycast={null}
      >
        <sphereGeometry args={[MOON_RADIUS, 64, 64]} />
        <meshBasicMaterial map={texture} toneMapped={false} fog={false} />
      </mesh>
    </>
  )
}
