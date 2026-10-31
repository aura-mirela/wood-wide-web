/*
import { Line } from '@react-three/drei'
import { useMemo } from 'react'

import { getTerrainElevation } from '../lib/createTerrainGeometry'

const LINE_COLOR = '#ff7a2a'
const GROUND_LIFT = 0.045
const PATH_SAMPLES = 12

function groundPath(from, to) {
  const points = []

  for (let step = 0; step <= PATH_SAMPLES; step++) {
    const t = step / PATH_SAMPLES
    const x = from.x + (to.x - from.x) * t
    const y = from.y + (to.y - from.y) * t
    points.push([x, getTerrainElevation(x, y) + GROUND_LIFT, -y])
  }

  return points
}

function connectionsFromHub(hub, fungalIndividuals, mushroomPlacements, treePlacements) {
  const individual = fungalIndividuals.find((candidate) => candidate.id === hub.individualId)
  if (!individual) {
    return []
  }

  const from = mushroomPlacements[hub.mushroomIndex]
  const targets = [
    ...individual.mushroomIndices
      .filter((index) => index !== hub.mushroomIndex)
      .map((index) => mushroomPlacements[index]),
    ...individual.treeIndices.map((index) => treePlacements[index]),
  ]

  return targets.map((target) => groundPath(from, target))
}

export default function FungalLines({
  hubs,
  fungalIndividuals,
  mushroomPlacements,
  treePlacements,
}) {
  const paths = useMemo(
    () => hubs.flatMap((hub) => (
      connectionsFromHub(hub, fungalIndividuals, mushroomPlacements, treePlacements)
    )),
    [hubs, fungalIndividuals, mushroomPlacements, treePlacements],
  )

  return (
    <>
      {paths.map((points, index) => (
        <Line
          key={index}
          points={points}
          color={LINE_COLOR}
          lineWidth={2.5}
          raycast={null}
        />
      ))}
    </>
  )
}
*/
