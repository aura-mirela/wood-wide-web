const tiers = {
  xs: {
    dpr: [1, 1.25],
    camera: { position: [0, 2, 12], fov: 50 },
    minDistance: 12,
    maxDistance: 16,
    segments: 64,
    treeCount: 24,
    mushroomCount: 40,
    bumpMap: false,
    shadows: false,
  },
  sm: {
    dpr: [1, 1.5],
    camera: { position: [0, 2, 12], fov: 50 },
    minDistance: 12,
    maxDistance: 16,
    segments: 96,
    treeCount: 40,
    mushroomCount: 80,
    bumpMap: false,
    shadows: false,
  },
  md: {
    dpr: [1, 1.75],
    camera: { position: [0, 2, 12], fov: 50 },
    minDistance: 12,
    maxDistance: 16,
    segments: 128,
    treeCount: 56,
    mushroomCount: 110,
    bumpMap: false,
    shadows: false,
  },
  desktop: {
    dpr: [1, 2],
    camera: { position: [0, 2, 12], fov: 50 },
    minDistance: 12,
    maxDistance: 16,
    segments: 256,
    treeCount: 80,
    mushroomCount: 200,
    bumpMap: true,
    shadows: true,
  },
}

export function getSceneTier({ isXs, isSm, isMd }) {
  if (isXs) {
    return tiers.xs
  }

  if (isSm) {
    return tiers.sm
  }

  if (isMd) {
    return tiers.md
  }

  return tiers.desktop
}
