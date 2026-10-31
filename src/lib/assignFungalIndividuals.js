// One record per fungal individual, from placements that already exist.
// maxDistance is the farthest ground gap still inside one individual.
// The caller picks it for this device. This file does not.
//
// A myceliumStrand joins two members of that individual.
// Each end is { kind: 'mushroom' | 'root', index }.
// A root index is the fir placement whose flare belongs to this individual.
// rootIndices lists those same firs. The flare is the fir's wood, not a second organism.
// Needed elements:
//  - mushroomPlacements
//  - indices of mushrooms that will form the fungal individual
//  - treePlacements (wich represent also the roots placements)
//  - maxDistance between parts of the fungal individual
//  - mycelium strands (between mushrooms and roots)

/** 
 * Max distance between parts of the fungal individual - configuraion and funcion
*/
// the smaller the max distance, the more fungal individuals are created
export const MYCELIUM_MAX_DISTANCE_BY_TIER = {
  xs: 2.2,
  sm: 1.9,
  md: 1.7,
  desktop: 1.0,
}

// Firs are scattered from a different mask, so the gap from a cap to the
// nearest trunk is larger than the gap between caps. Desktop mushroom groups
// stay at 1. A fir can still join the nearest of those caps out to this distance.
export const FIR_MAX_DISTANCE_BY_TIER = {
  xs: 2.2,
  sm: 1.9,
  md: 1.7,
  desktop: 1.5,
}

export function myceliumMaxDistanceForBreakpoints({ isXs, isSm, isMd }) {
  if (isXs) {
    return MYCELIUM_MAX_DISTANCE_BY_TIER.xs
  }

  if (isSm) {
    return MYCELIUM_MAX_DISTANCE_BY_TIER.sm
  }

  if (isMd) {
    return MYCELIUM_MAX_DISTANCE_BY_TIER.md
  }

  return MYCELIUM_MAX_DISTANCE_BY_TIER.desktop
}

export function firMaxDistanceForBreakpoints({ isXs, isSm, isMd }) {
  if (isXs) {
    return FIR_MAX_DISTANCE_BY_TIER.xs
  }

  if (isSm) {
    return FIR_MAX_DISTANCE_BY_TIER.sm
  }

  if (isMd) {
    return FIR_MAX_DISTANCE_BY_TIER.md
  }

  return FIR_MAX_DISTANCE_BY_TIER.desktop
}

/**
 * Helper function section
 */
// Calculate the distance between two points in the XY plane
function distanceXY(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

// Creates the strand object given the types (kinds) of the fungal individual parts
// and the distance between them
function strand(fromKind, fromIndex, toKind, toIndex, length) {
  return {
    from: { kind: fromKind, index: fromIndex },
    to: { kind: toKind, index: toIndex },
    length,
  }
}

/**
 * Collects the mushroom groups into individual groups based on the max distance
*/
function collectMushroomGroups(mushroomPlacements, maxDistance) {
  const individualIdByMushroom = new Array(mushroomPlacements.length).fill(-1)
  const mushroomIndexGroups = []

  for (let seed = 0; seed < mushroomPlacements.length; seed++) {
    if (individualIdByMushroom[seed] !== -1) {
      continue
    }

    const individualId = mushroomIndexGroups.length
    const mushroomIndices = []
    const queue = [seed]
    individualIdByMushroom[seed] = individualId

    while (queue.length > 0) {
      const current = queue.shift()
      mushroomIndices.push(current)

      for (let other = 0; other < mushroomPlacements.length; other++) {
        if (individualIdByMushroom[other] !== -1) {
          continue
        }

        const gap = distanceXY(mushroomPlacements[current], mushroomPlacements[other])

        if (gap <= maxDistance) {
          individualIdByMushroom[other] = individualId
          queue.push(other)
        }
      }
    }

    mushroomIndices.sort((a, b) => a - b)
    mushroomIndexGroups.push(mushroomIndices)
  }

  return { mushroomIndexGroups, individualIdByMushroom }
}

/**
 * Creates the mycelium strands for the given mushroom indices based on the max distance
 */
function mushroomStrands(mushroomPlacements, mushroomIndices, maxDistance) {
  const myceliumStrands = []

  for (let i = 0; i < mushroomIndices.length; i++) {
    for (let j = i + 1; j < mushroomIndices.length; j++) {
      const fromIndex = mushroomIndices[i]
      const toIndex = mushroomIndices[j]
      const length = distanceXY(
        mushroomPlacements[fromIndex],
        mushroomPlacements[toIndex],
      )

      if (length <= maxDistance) {
        myceliumStrands.push(strand('mushroom', fromIndex, 'mushroom', toIndex, length))
      }
    }
  }

  return myceliumStrands
}

/**
 * Assigns the fungal individuals to the tree placements based on the max distance
 * @param {*} mushroomPlacements 
 * @param {*} treePlacements 
 * @param {*} maxDistance gap that still joins two mushrooms
 * @param {*} firMaxDistance gap that still joins a fir to its nearest mushroom
 * @returns {Array<{
 *      id: number,
 *      mushroomIndices: Array<number>,
 *      treeIndices: Array<number>,
 *      rootIndices: Array<number>,
 *      myceliumStrands: Array<{from: {kind: string, index: number}, to: {kind: string, index: number}, length: number}>
 * }>}
 */
export function assignFungalIndividuals(
  mushroomPlacements,
  treePlacements,
  maxDistance,
  firMaxDistance = maxDistance,
) {
  if (
    mushroomPlacements.length === 0
    || !Number.isFinite(maxDistance)
    || maxDistance < 0
  ) {
    return []
  }

  const { mushroomIndexGroups, individualIdByMushroom } = collectMushroomGroups(
    mushroomPlacements,
    maxDistance,
  )

  const fungalIndividuals = mushroomIndexGroups.map((mushroomIndices, index) => ({
    id: index,
    mushroomIndices,
    treeIndices: [],
    rootIndices: [],
    myceliumStrands: mushroomStrands(mushroomPlacements, mushroomIndices, maxDistance),
  }))

  for (let treeIndex = 0; treeIndex < treePlacements.length; treeIndex++) {
    const fir = treePlacements[treeIndex]
    let closestMushroomToFirWithinMaxDistance = null

    for (let mushroomIndex = 0; mushroomIndex < mushroomPlacements.length; mushroomIndex++) {
      const mushroomFirDistance = distanceXY(mushroomPlacements[mushroomIndex], fir)

      if (mushroomFirDistance > firMaxDistance) {
        continue
      }

      if (
        closestMushroomToFirWithinMaxDistance === null
        || mushroomFirDistance < closestMushroomToFirWithinMaxDistance.mushroomFirDistance
        || (
          mushroomFirDistance === closestMushroomToFirWithinMaxDistance.mushroomFirDistance
          && mushroomIndex < closestMushroomToFirWithinMaxDistance.mushroomIndex
        )
      ) {
        closestMushroomToFirWithinMaxDistance = {
          mushroomIndex,
          mushroomFirDistance,
          individualId: individualIdByMushroom[mushroomIndex],
        }
      }
    }

    if (closestMushroomToFirWithinMaxDistance === null) {
      continue
    }

    const individual = fungalIndividuals[closestMushroomToFirWithinMaxDistance.individualId]
    individual.treeIndices.push(treeIndex)
    individual.rootIndices.push(treeIndex)
    individual.myceliumStrands.push(
      strand(
        'mushroom',
        closestMushroomToFirWithinMaxDistance.mushroomIndex,
        'root',
        treeIndex,
        closestMushroomToFirWithinMaxDistance.mushroomFirDistance,
      ),
    )
  }

  for (const individual of fungalIndividuals) {
    individual.treeIndices.sort((a, b) => a - b)
    individual.rootIndices.sort((a, b) => a - b)
  }

  return fungalIndividuals
}
