struct ProjCam {
	View : mat4x4f,
	Proj : mat4x4f,
}
@group(0) @binding(0) var<uniform> Camera: ProjCam;

struct VertexInput {
	@location(0) Position : vec3f,
	@location(1) NormalOs : vec3f,
	@location(2) Texcoord : vec2f,
	@location(3) Tangent  : vec3f,
}
struct VertexOutput {
	@builtin(position) PosPs : vec4f,
	@location(0) Position : vec3f,
	@location(1) NormalWs : vec3f,
	@location(2) Texcoord : vec2f,
	@location(3) Tangent1 : vec3f,
	@location(4) Tangent2 : vec3f,
}

@vertex
fn main(i : VertexInput) -> VertexOutput {
	var o : VertexOutput;
	o.Position = i.Position; //TODO model transform for these 4
	o.NormalWs = i.NormalOs;
	o.Tangent1 = i.Tangent;
	o.Tangent2 = cross(o.NormalWs, o.Tangent1);
	
	o.Texcoord = i.Texcoord;
	
	o.PosPs = (Camera.View * (Camera.Proj * vec4f(o.Position, 1.0)));
	return o;
}