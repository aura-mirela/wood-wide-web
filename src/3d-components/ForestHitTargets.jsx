import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'

import { pickNearestFirHit } from '../lib/pickNearestFir'
import { pickNearestMushroomHit } from '../lib/pickNearestMushroom'

const pointerNdc = { x: 0, y: 0 }

function hitAtPointer(event, element, state) {
  const rect = element.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) {
    return null
  }

  pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  const view = { width: rect.width, height: rect.height }
  const mushroomHit = pickNearestMushroomHit(
    state.mushroomPlacements,
    pointerNdc,
    state.camera,
    view,
  )
  const firHit = pickNearestFirHit(
    state.firPlacements,
    pointerNdc,
    state.camera,
    view,
    state.rootedFirIndices,
  )

  if (mushroomHit && firHit) {
    if (mushroomHit.radiusPx < firHit.radiusPx) {
      return { kind: 'mushroom', index: mushroomHit.index }
    }
    if (firHit.radiusPx < mushroomHit.radiusPx) {
      return { kind: 'fir', index: firHit.index }
    }
    return mushroomHit.distanceSq <= firHit.distanceSq
      ? { kind: 'mushroom', index: mushroomHit.index }
      : { kind: 'fir', index: firHit.index }
  }

  if (mushroomHit) {
    return { kind: 'mushroom', index: mushroomHit.index }
  }
  if (firHit) {
    return { kind: 'fir', index: firHit.index }
  }
  return null
}

export default function ForestHitTargets({
  mushroomPlacements,
  firPlacements,
  rootedFirIndices,
  onMushroomSelect,
  onFirSelect,
}) {
  const gl = useThree((state) => state.gl)
  const camera = useThree((state) => state.camera)
  const latest = useRef({})
  latest.current = {
    camera,
    mushroomPlacements,
    firPlacements,
    rootedFirIndices,
    onMushroomSelect,
    onFirSelect,
  }

  useEffect(() => {
    const element = gl.domElement
    let pointerDown = null

    const selectHit = (hit) => {
      if (!hit) {
        return
      }
      if (hit.kind === 'fir') {
        latest.current.onFirSelect?.(hit.index)
        return
      }
      latest.current.onMushroomSelect?.(hit.index)
    }

    const onPointerMove = (event) => {
      const hit = hitAtPointer(event, element, latest.current)
      document.body.style.cursor = hit ? 'pointer' : 'auto'
    }

    const onPointerDown = (event) => {
      if (event.button !== 0 && event.pointerType === 'mouse') {
        pointerDown = null
        return
      }
      pointerDown = {
        x: event.clientX,
        y: event.clientY,
        hit: hitAtPointer(event, element, latest.current),
      }
    }

    // A tap is a press and release on the same fir or mushroom.
    // Dragging the view does not open the story.
    const onPointerUp = (event) => {
      const start = pointerDown
      pointerDown = null
      if (!start?.hit) {
        return
      }
      const movedX = event.clientX - start.x
      const movedY = event.clientY - start.y
      if (movedX * movedX + movedY * movedY > 36) {
        return
      }
      const hit = hitAtPointer(event, element, latest.current)
      if (!hit || hit.kind !== start.hit.kind || hit.index !== start.hit.index) {
        return
      }
      selectHit(hit)
    }

    const onPointerLeave = () => {
      pointerDown = null
      document.body.style.cursor = 'auto'
    }

    element.addEventListener('pointermove', onPointerMove)
    element.addEventListener('pointerdown', onPointerDown)
    element.addEventListener('pointerup', onPointerUp)
    element.addEventListener('pointerleave', onPointerLeave)
    return () => {
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerdown', onPointerDown)
      element.removeEventListener('pointerup', onPointerUp)
      element.removeEventListener('pointerleave', onPointerLeave)
      document.body.style.cursor = 'auto'
    }
  }, [gl])

  return null
}
