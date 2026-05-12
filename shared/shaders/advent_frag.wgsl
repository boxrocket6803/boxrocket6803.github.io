@fragment
fn main(@location(0) Texcoord: vec2f) -> @location(0) vec4f {
  return vec4(Texcoord, 0.0, 1.0);
}