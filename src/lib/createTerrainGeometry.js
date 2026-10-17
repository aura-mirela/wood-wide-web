import { PlaneGeometry } from 'three'
import { noise2D } from './noises/noise2D'

// Function to generate terrain elevation using fractal brownian motion
function fbm(x, y, frequency, amplitude) {
  let value = 0
  let amp = amplitude
  let sampleX = x * frequency
  let sampleY = y * frequency

  // Add noise at different frequencies and amplitudes
  for (let i = 0; i < 5; i++) {
    value += amp * noise2D(sampleX, sampleY)
    sampleX *= 2
    sampleY *= 2
    amp *= 0.5
  }

  return value
}

export const TERRAIN_SIZE = 20
export const TERRAIN_FREQUENCY = 0.1
export const TERRAIN_AMPLITUDE = 0.35

// Function to get terrain elevation at a given (x, y) coordinates
export function getTerrainElevation(
  x,
  y,
  frequency = TERRAIN_FREQUENCY,
  amplitude = TERRAIN_AMPLITUDE,
) {
  return fbm(x, y, frequency, amplitude)
}

// Create terrain geometry based on the FBM function above
export function createTerrainGeometry({
  size = TERRAIN_SIZE,
  segments,
  frequency = TERRAIN_FREQUENCY,
  amplitude = TERRAIN_AMPLITUDE,
} = {}) {
  const geometry = new PlaneGeometry(size, size, segments, segments)
  const positions = geometry.attributes.position


  for (let i = 0; i < positions.count; i++) {
    const elevation = fbm(
      positions.getX(i),
      positions.getY(i),
      frequency,
      amplitude,
    )

    positions.setZ(i, elevation)    
  }


  positions.needsUpdate = true
  geometry.computeVertexNormals()
  geometry.setAttribute('uv2', geometry.attributes.uv.clone())

  return geometry
}
