const pos = array<vec4f, 6>(
	vec4f(-1, 1, 0, 0),
	vec4f(-1,-1, 0, 1),
	vec4f( 1,-1, 1, 1),
	vec4f(-1, 1, 0, 0),
	vec4f( 1,-1, 1, 1),
	vec4f( 1, 1, 1, 0)
);

struct VertexOutput {
	@builtin(position) Position : vec4f,
	@location(0) Texcoord : vec2f,
}

@vertex
fn main(@builtin(vertex_index) VertexIndex : u32) -> VertexOutput {
	var vert = pos[VertexIndex];
	var out : VertexOutput;
	out.Position = vec4f(vert.xy, 0.0, 1.0);
	out.Texcoord = vert.zw;
	return out;
}