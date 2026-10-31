uniform float uTime;
varying vec2 vUv;

void main() {
  float dist = length(vUv - vec2(0.5)) * 2.0;
  float pulse = 0.35 + 0.2 * sin(uTime * 1.5);
  float glow = pow(smoothstep(0.7, 0.1, dist), 2.0) * pulse;
  vec3 color = vec3(0.2, 0.75, 1.0);

  gl_FragColor = vec4(color, glow);
  #include <colorspace_fragment>
}
