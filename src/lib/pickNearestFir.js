import { Vector3 } from 'three'

import { ROOTED_FIR_SCALE } from '../3d-components/ScatteredFirTrees'

// Height and radius of the fir model after its node transforms, before placement.scale.
const FIR_MODEL_HEIGHT = 4.393
const FIR_MODEL_RADIUS = 1.221
const FIR_PICK_MIN_RADIUS_PX = 40

// Trunk stays narrow. The crown is the wide part of the silhouette.
const FIR_SAMPLES = [
  { fraction: 0.15, radiusScale: 0.2 },
  { fraction: 0.5, radiusScale: 0.75 },
  { fraction: 0.82, radiusScale: 1 },
]

const firPoint = new Vector3()
const firEdgePoint = new Vector3()

function projectToPixels(point, camera, width, height) {
  point.project(camera)
  if (point.z < -1 || point.z > 1) {
    return null
  }

  return {
    x: (point.x * 0.5 + 0.5) * width,
    y: (-point.y * 0.5 + 0.5) * height,
  }
}

export function pickNearestFirHit(
  placements,
  pointerNdc,
  camera,
  { width, height },
  rootedFirIndices = [],
) {
  if (placements.length === 0 || width <= 0 || height <= 0) {
    return null
  }

  const rooted = rootedFirIndices instanceof Set
    ? rootedFirIndices
    : new Set(rootedFirIndices)
  const pointerX = (pointerNdc.x * 0.5 + 0.5) * width
  const pointerY = (-pointerNdc.y * 0.5 + 0.5) * height
  let bestIndex = -1
  let bestDistanceSq = Infinity
  let bestRadiusPx = FIR_PICK_MIN_RADIUS_PX

  for (let i = 0; i < placements.length; i++) {
    const placement = placements[i]
    const scale = placement.scale * (rooted.has(i) ? ROOTED_FIR_SCALE : 1)
    const treeHeight = FIR_MODEL_HEIGHT * scale
    const treeRadius = FIR_MODEL_RADIUS * scale

    for (let sampleIndex = 0; sampleIndex < FIR_SAMPLES.length; sampleIndex++) {
      const sample = FIR_SAMPLES[sampleIndex]
      const sampleHeight = treeHeight * sample.fraction
      firPoint.set(placement.x, placement.elevation + sampleHeight, -placement.y)
      const center = projectToPixels(firPoint, camera, width, height)
      if (!center) {
        continue
      }

      const worldRadius = treeRadius * sample.radiusScale
      firEdgePoint.set(
        placement.x + worldRadius,
        placement.elevation + sampleHeight,
        -placement.y,
      )
      const edge = projectToPixels(firEdgePoint, camera, width, height)
      const projectedRadius = edge
        ? Math.hypot(edge.x - center.x, edge.y - center.y)
        : 0
      const radiusPx = Math.max(FIR_PICK_MIN_RADIUS_PX, projectedRadius)
      const pixelOffsetX = center.x - pointerX
      const pixelOffsetY = center.y - pointerY
      const distanceSq = pixelOffsetX * pixelOffsetX + pixelOffsetY * pixelOffsetY

      if (distanceSq <= radiusPx * radiusPx && distanceSq < bestDistanceSq) {
        bestDistanceSq = distanceSq
        bestRadiusPx = radiusPx
        bestIndex = i
      }
    }
  }

  if (bestIndex === -1) {
    return null
  }

  return {
    index: bestIndex,
    distanceSq: bestDistanceSq,
    radiusPx: bestRadiusPx,
  }
}
