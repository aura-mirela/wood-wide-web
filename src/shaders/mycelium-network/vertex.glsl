uniform float uTime;
attribute float aSize;
attribute float aPhase;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float twinkle = 0.2 + 0.18 * sin(uTime * 1.7 + aPhase * 6.283185);
  float attenuation = 190.0 / max(1.0, -mvPosition.z);
  gl_PointSize = aSize * twinkle * attenuation;
  gl_Position = projectionMatrix * mvPosition;
}
