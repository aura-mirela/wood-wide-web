void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;

  float alpha = smoothstep(0.5, 0.08, dist);
  gl_FragColor = vec4(1.0, 0.96, 0.88, alpha);
  #include <colorspace_fragment>
}
