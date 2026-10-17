const C = {
  x: 0.211324865405187,
  y: 0.366025403784439,
  z: -0.577350269189626,
  w: 0.024390243902439,
}

function mod289(value) {
  return value - Math.floor(value * (1 / 289)) * 289
}

function permute(value) {
  return mod289(((value * 34) + 10) * value)
}

function fract(value) {
  return value - Math.floor(value)
}

export function noise2D(x, y) {
  const cellX = Math.floor(x + (x + y) * C.y)
  const cellY = Math.floor(y + (x + y) * C.y)

  const originX = x - cellX + (cellX + cellY) * C.x
  const originY = y - cellY + (cellX + cellY) * C.x

  const cornerX = originX > originY ? 1 : 0
  const cornerY = originX > originY ? 0 : 1

  const offsetAX = originX + C.x - cornerX
  const offsetAY = originY + C.x - cornerY
  const offsetBX = originX + C.z
  const offsetBY = originY + C.z

  const wrappedCellX = mod289(cellX)
  const wrappedCellY = mod289(cellY)

  const permutationX = permute(permute(wrappedCellY) + wrappedCellX)
  const permutationY = permute(permute(wrappedCellY + cornerY) + wrappedCellX + cornerX)
  const permutationZ = permute(permute(wrappedCellY + 1) + wrappedCellX + 1)

  let weightX = Math.max(0.5 - (originX * originX + originY * originY), 0)
  let weightY = Math.max(0.5 - (offsetAX * offsetAX + offsetAY * offsetAY), 0)
  let weightZ = Math.max(0.5 - (offsetBX * offsetBX + offsetBY * offsetBY), 0)

  weightX *= weightX
  weightY *= weightY
  weightZ *= weightZ
  weightX *= weightX
  weightY *= weightY
  weightZ *= weightZ

  const gradientX = 2 * fract(permutationX * C.w) - 1
  const gradientY = 2 * fract(permutationY * C.w) - 1
  const gradientZ = 2 * fract(permutationZ * C.w) - 1

  const heightX = Math.abs(gradientX) - 0.5
  const heightY = Math.abs(gradientY) - 0.5
  const heightZ = Math.abs(gradientZ) - 0.5

  const offsetX = gradientX - Math.floor(gradientX + 0.5)
  const offsetY = gradientY - Math.floor(gradientY + 0.5)
  const offsetZ = gradientZ - Math.floor(gradientZ + 0.5)

  weightX *= 1.79284291400159 - 0.85373472095314 * (offsetX * offsetX + heightX * heightX)
  weightY *= 1.79284291400159 - 0.85373472095314 * (offsetY * offsetY + heightY * heightY)
  weightZ *= 1.79284291400159 - 0.85373472095314 * (offsetZ * offsetZ + heightZ * heightZ)

  const contributionX = offsetX * originX + heightX * originY
  const contributionY = offsetY * offsetAX + heightY * offsetAY
  const contributionZ = offsetZ * offsetBX + heightZ * offsetBY

  return 130 * (
    weightX * contributionX
    + weightY * contributionY
    + weightZ * contributionZ
  )
}
