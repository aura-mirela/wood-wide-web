function clamp01(value) {
  return Math.min(1, Math.max(0, value))
}

function sampleDataTexture(texture, u, v) {
  const { data, width, height } = texture.image
  const channels = data.length / (width * height)
  const x = Math.min(width - 1, Math.max(0, Math.floor(u * width)))
  const y = Math.min(height - 1, Math.max(0, Math.floor((1 - v) * height)))
  const index = (y * width + x) * channels

  return data[index] / 255
}

function sampleImageTexture(texture, u, v) {
  const image = texture.image

  if (!texture.userData.maskContext) {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height

    const context = canvas.getContext('2d', { willReadFrequently: true })
    context.drawImage(image, 0, 0)

    texture.userData.maskCanvas = canvas
    texture.userData.maskContext = context
  }

  const { width, height } = image
  const x = Math.min(width - 1, Math.max(0, Math.floor(u * width)))
  const y = Math.min(height - 1, Math.max(0, Math.floor((1 - v) * height)))
  const [red] = texture.userData.maskContext.getImageData(x, y, 1, 1).data

  return red / 255
}

export function sampleMask(texture, u, v) {
  if (!texture?.image) {
    return 1
  }

  const wrappedU = ((u % 1) + 1) % 1
  const wrappedV = ((v % 1) + 1) % 1

  if (texture.image.data) {
    return clamp01(sampleDataTexture(texture, wrappedU, wrappedV))
  }

  if (texture.image.width && texture.image.height) {
    return clamp01(sampleImageTexture(texture, wrappedU, wrappedV))
  }

  return 1
}
