function hash01(n) {
  const value = Math.sin(n * 127.1) * 43758.5453
  return value - Math.floor(value)
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function quadraticBezier(a, control, b, t) {
  const ab = lerp(a, control, t)
  const cb = lerp(control, b, t)
  return lerp(ab, cb, t)
}

export const MYCELIUM_MAX_NEIGHBORS = 5

function distanceXY(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function buildNeighborStar(
  placements,
  originIndex,
  maxDistanceBetweenMushrooms,
  occupiedNodes = [],
  maxNeighbors = MYCELIUM_MAX_NEIGHBORS,
) {
  const myceliumStrands = []
  const nodeIndices = []

  if (
    originIndex == null ||
    originIndex < 0 ||
    originIndex >= placements.length
  ) {
    return { myceliumStrands, nodeIndices }
  }

  nodeIndices.push(originIndex)

  if (placements.length < 2 || maxDistanceBetweenMushrooms <= 0 || maxNeighbors <= 0) {
    return { myceliumStrands, nodeIndices }
  }

  const occupied = new Set(occupiedNodes)
  const originInNetwork = occupied.has(originIndex)
  const origin = placements[originIndex]
  const candidates = []

  for (let i = 0; i < placements.length; i++) {
    if (i === originIndex) {
      continue
    }

    // Already-networked mushrooms only grow outward to mushrooms
    // that are not yet in the web. A new origin can attach to
    // nearby mushrooms whether or not they are already connected.
    if (originInNetwork && occupied.has(i)) {
      continue
    }

    const length = distanceXY(origin, placements[i])

    if (length <= maxDistanceBetweenMushrooms) {
      candidates.push({ index: i, length })
    }
  }

  candidates.sort((a, b) => a.length - b.length || a.index - b.index)

  for (const candidate of candidates.slice(0, maxNeighbors)) {
    myceliumStrands.push({
      from: originIndex,
      to: candidate.index,
      length: candidate.length,
    })
    nodeIndices.push(candidate.index)
  }

  return { myceliumStrands, nodeIndices }
}

export function collectExpandableMushroomIndices(
  placements,
  maxDistanceBetweenMushrooms,
  occupiedNodes = [],
  clickedMushroomsIndices = [],
) {
  const occupied = occupiedNodes instanceof Set ? occupiedNodes : new Set(occupiedNodes)
  const clicked = new Set(clickedMushroomsIndices)
  const indices = []

  if (placements.length < 2 || maxDistanceBetweenMushrooms <= 0) {
    return indices
  }

  for (let originIndex = 0; originIndex < placements.length; originIndex++) {
    if (clicked.has(originIndex)) {
      continue
    }

    const originInNetwork = occupied.has(originIndex)
    const origin = placements[originIndex]

    for (let i = 0; i < placements.length; i++) {
      if (i === originIndex) {
        continue
      }

      if (originInNetwork && occupied.has(i)) {
        continue
      }

      if (distanceXY(origin, placements[i]) <= maxDistanceBetweenMushrooms) {
        indices.push(originIndex)
        break
      }
    }
  }

  return indices
}

export function buildMyceliumParticleAttributes(
  placements,
  myceliumStrands,
  {
    heightOffset = 0.06,
    particleSpacing = 0.14,
    curveAmount = 0.3,
    maxParticles = 18000,
    getElevation = () => 0,
    nodeIndices,
  } = {},
) {
  const visibleNodes = nodeIndices ?? placements.map((_, index) => index)
  const nodeCount = visibleNodes.length
  let estimatedEdgeParticles = 0

  for (const strand of myceliumStrands) {
    estimatedEdgeParticles += Math.max(2, Math.floor(strand.length / particleSpacing))
  }

  const spacingScale =
    estimatedEdgeParticles > maxParticles - nodeCount
      ? estimatedEdgeParticles / Math.max(1, maxParticles - nodeCount)
      : 1
  const spacing = particleSpacing * spacingScale

  const positions = []
  const sizes = []
  const phases = []

  for (const i of visibleNodes) {
    const placement = placements[i]
    positions.push(placement.x, placement.elevation + heightOffset, -placement.y)
    sizes.push(3.1)
    phases.push(hash01(i + 0.37))
  }

  for (const strand of myceliumStrands) {
    const a = placements[strand.from]
    const b = placements[strand.to]
    const dx = b.x - a.x
    const dy = b.y - a.y
    const length = strand.length || Math.hypot(dx, dy)

    if (length < 0.0001) {
      continue
    }

    const nx = -dy / length
    const ny = dx / length
    const bend =
      (hash01(strand.from * 13.7 + strand.to * 9.1) - 0.5) * length * curveAmount
    const controlX = (a.x + b.x) * 0.5 + nx * bend
    const controlY = (a.y + b.y) * 0.5 + ny * bend
    const count = Math.max(3, Math.floor(length / spacing))

    for (let k = 1; k < count; k++) {
      const t = Math.min(
        0.98,
        Math.max(0.02, (k + (hash01(strand.from + k * 9.4) - 0.5) * 0.7) / count),
      )
      const spread = 0.04 + (1 - Math.abs(t - 0.5) * 1.2) * 0.12
      const jitter =
        (hash01(strand.from * 31.3 + strand.to * 17.9 + k * 4.7) - 0.5) * spread
      const x = quadraticBezier(a.x, controlX, b.x, t) + nx * jitter
      const y = quadraticBezier(a.y, controlY, b.y, t) + ny * jitter
      const elevation = getElevation(x, y) + heightOffset

      positions.push(x, elevation, -y)
      sizes.push(0.45 + hash01(t + strand.from * 0.13) * 1.35)
      phases.push(hash01(strand.from + strand.to * 0.17 + k * 0.41))
    }
  }

  return {
    positions: new Float32Array(positions),
    sizes: new Float32Array(sizes),
    phases: new Float32Array(phases),
  }
}
