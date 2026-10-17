import {
  TERRAIN_SIZE,
  getTerrainElevation,
} from './createTerrainGeometry'
import { sampleMask } from './sampleMask'

function createSeededRandom(seed) {
  let state = seed % 2147483647
  if (state <= 0) state += 2147483646

  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

export function scatterObjectsOnTerrain({
  count = 80,
  size = TERRAIN_SIZE,
  seed = Math.floor(Math.random() * 2147483646) + 1,
  maskTexture,
  minScale = 0.3,
  maxScale = 0.8,
} = {}) {
  const random = createSeededRandom(seed)
  const halfSize = size / 2
  const placements = []
  const attempts = Math.max(count * 6, count)

  for (let i = 0; i < attempts && placements.length < count; i++) {
    const x = (random() - 0.5) * size
    const y = (random() - 0.5) * size
    const u = (x + halfSize) / size
    const v = (y + halfSize) / size
    const keepPlacementCandidateChance = sampleMask(maskTexture, u, v)

    if (random() > keepPlacementCandidateChance) {
      continue
    }

    placements.push({
      x,
      y,
      elevation: getTerrainElevation(x, y),
      rotationY: random() * Math.PI * 2,
      scale: minScale + random() * (maxScale - minScale),
    })
  }

  return placements
}
