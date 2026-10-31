attribute float size;
uniform float uPixelRatio;

void main() {
  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;

  // the line below is needed (especially -modelViewPosition.z)
  // so that the stars will shrink with the distance - to have perspective
  gl_PointSize = size * uPixelRatio * (140.0 / -modelViewPosition.z);
}
