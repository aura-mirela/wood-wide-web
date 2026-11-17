import { Vector3 } from 'three'

const mushroomPoint = new Vector3()

export function pickNearestMushroomHit(
  placements,
  pointerNdc,
  camera,
  { width, height },
  maxDistancePx = 40,
  heightOffset = 0.18,
) {
  if (placements.length === 0 || width <= 0 || height <= 0) {
    return null
  }

  const pointerX = (pointerNdc.x * 0.5 + 0.5) * width
  const pointerY = (-pointerNdc.y * 0.5 + 0.5) * height
  let bestIndex = -1
  let closestSquaredPixelDistance = maxDistancePx * maxDistancePx

  for (let i = 0; i < placements.length; i++) {
    const placement = placements[i]
    mushroomPoint.set(placement.x, placement.elevation + heightOffset, -placement.y)
    mushroomPoint.project(camera)

    if (mushroomPoint.z < -1 || mushroomPoint.z > 1) {
      continue
    }

    const mushroomCanvasPixelX = (mushroomPoint.x * 0.5 + 0.5) * width
    const mushroomCanvasPixelY = (-mushroomPoint.y * 0.5 + 0.5) * height
    const pixelOffsetX = mushroomCanvasPixelX - pointerX
    const pixelOffsetY = mushroomCanvasPixelY - pointerY
    const squaredPixelDistance = pixelOffsetX * pixelOffsetX + pixelOffsetY * pixelOffsetY

    if (squaredPixelDistance <= closestSquaredPixelDistance) {
      closestSquaredPixelDistance = squaredPixelDistance
      bestIndex = i
    }
  }

  if (bestIndex === -1) {
    return null
  }

  return {
    index: bestIndex,
    distanceSq: closestSquaredPixelDistance,
    radiusPx: maxDistancePx,
  }
}

export function pickNearestMushroomIndex(
  placements,
  pointerNdc,
  camera,
  size,
  maxDistancePx = 40,
  heightOffset = 0.18,
) {
  return pickNearestMushroomHit(
    placements,
    pointerNdc,
    camera,
    size,
    maxDistancePx,
    heightOffset,
  )?.index ?? null
}
