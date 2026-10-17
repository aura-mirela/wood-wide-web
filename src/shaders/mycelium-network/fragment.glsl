uniform vec3 uColor;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);
  float glow = exp(-dist * dist * 14.0);
  float core = exp(-dist * dist * 55.0);
  vec3 color = uColor * (0.55 * glow + 1.8 * core);
  gl_FragColor = vec4(color, 1.0);
}
