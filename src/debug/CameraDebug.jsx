import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'

const AXIS = { min: -30, max: 30, step: 0.1 }

export default function CameraDebug() {
  const camera = useThree((state) => state.camera)
  const readout = useRef(null)
  const { x, y, z, lookX, lookY, lookZ, fov } = useControls('Camera debug', {
    x: { value: 0, ...AXIS },
    y: { value: 2, ...AXIS },
    z: { value: 8, ...AXIS },
    lookX: { value: 0, ...AXIS },
    lookY: { value: 0, ...AXIS },
    lookZ: { value: 0, ...AXIS },
    fov: { value: 45, min: 20, max: 75, step: 1 },
  })

  useEffect(() => {
    const label = document.createElement('p')
    label.style.cssText = [
      'position:fixed',
      'left:12px',
      'bottom:12px',
      'margin:0',
      'z-index:1000',
      'color:#fff',
      'font:14px ui-monospace, monospace',
    ].join(';')
    document.body.appendChild(label)
    readout.current = label

    return () => label.remove()
  }, [])

  useFrame(() => {
    camera.position.set(x, y, z)
    camera.lookAt(lookX, lookY, lookZ)
    if (camera.fov !== fov) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }

    if (readout.current) {
      const { rotation } = camera
      readout.current.textContent = `rotation [${rotation.x.toFixed(3)}, ${rotation.y.toFixed(3)}, ${rotation.z.toFixed(3)}]`
    }
  })

  return <axesHelper args={[10]} />
}
