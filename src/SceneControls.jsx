import { useControls } from 'leva'

export default function SceneControls({ lightPosition, castShadow }) {
  const fog = useControls('fog', {
    color: '#1c3668',
    density: { value: 0.075, min: 0, max: 0.15, step: 0.001 },
  })

  const ambientLight = useControls('ambientLight', {
    color: '#1a335c'
  })

  const directionalLight = useControls('directionalLight', {
    color: '#edf2fc',
    intensity: { value: 1.2, min: 0.0, max: 2.5, step: 0.01 },
  })

  return (
    <>
      <fogExp2
        attach="fog"
        color={fog.color}
        density={fog.density}
      />
      <ambientLight
        color={ambientLight.color}
        intensity={ambientLight.intensity}
      />
      <directionalLight
        color={directionalLight.color}
        intensity={directionalLight.intensity}
        position={lightPosition}
        castShadow={castShadow}
      />
    </>
  )
}
