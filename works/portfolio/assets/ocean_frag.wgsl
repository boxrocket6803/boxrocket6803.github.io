@fragment
fn main(@location(0) PositionWs: vec3f) -> @location(0) vec4f {
	return vec4f(PositionWs, 1);
}