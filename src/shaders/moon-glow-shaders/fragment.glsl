uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
  float dist = length(vUv - vec2(0.5)) * 2.0;
  float glow = pow(smoothstep(0.7, 0.1, dist), 2.0) * 0.75;
  vec3 color = uColor;

  gl_FragColor = vec4(color, glow);
  #include <colorspace_fragment>
}
