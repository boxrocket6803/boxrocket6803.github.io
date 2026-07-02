struct DimBuffer {X : f32, Y : f32};
@group(0) @binding(0) var<uniform> Dimensions: DimBuffer;

const pos = array<vec2f, 6>(
	vec2f(0, 1), vec2f(0, 0), vec2f(1, 0),
	vec2f(0, 1), vec2f(1, 0), vec2f(1, 1)
);

struct VertexOutput {
	@builtin(position) PositionPs : vec4f,
	@location(0) PositionWs : vec3f,
}

@vertex
fn main(@builtin(vertex_index) VertexIndex : u32) -> VertexOutput {
	var out : VertexOutput;
	
	var fidx = f32(VertexIndex);
	var pos = pos[VertexIndex % 6];
	pos += vec2f(floor(fidx / 6) % Dimensions.X, 0);
	pos += vec2f(0, floor(fidx / (6 * Dimensions.X)));
	pos *= 2 / vec2f(Dimensions.X, Dimensions.Y);
	pos -= 1;
	
	out.PositionPs = vec4f(pos, 0.0, 1.0);
	out.PositionWs = vec3f((fidx % 6) / 6.0);
	
	return out;
}