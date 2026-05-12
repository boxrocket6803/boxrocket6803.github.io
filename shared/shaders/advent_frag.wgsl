struct Uniform {
	Time : f32,
}
@group(0) @binding(0) var<uniform> Data: Uniform;
@group(0) @binding(1) var SL: sampler;

@group(0) @binding(2) var Color: texture_2d<f32>;
@group(0) @binding(3) var Mask: texture_2d<f32>;

fn Rain(tile: vec2f) -> f32 {
	var uv = tile;
	uv.y *= 2;
	var id = fract(sin(dot(floor(uv), vec2(12.9898, 78.233)))*(43758.5453+Data.Time*0.2));
	id += Data.Time * 1.3;
	id = fract(id);
	id = clamp(id * 5,0,1);
	id = pow(sin(id * 3.1415), 0.2);
	var dot = pow(length(fract(uv) - 0.5) * 2, 0.5);
	return clamp(id - dot,0,1);
}

fn Water(uv: vec2f, water: f32, rain: f32) -> vec2f {
	var ruv = uv;
	
	//water
	ruv.x += sin(ruv.y * 600 + Data.Time * 5) * 0.007 * water;
	ruv.x -= sin(ruv.y * 200 + Data.Time * 2) * 0.007 * water;
	ruv.y -= sin(ruv.x * 200 - Data.Time * 2) * 0.005 * water;
	if (textureSample(Mask, SL, ruv).r < water) {return uv;}
	
	//rain
	ruv.y -= Rain(uv * 60) * 0.1 * water * rain;
	ruv.y -= Rain(uv * 80) * 0.07 * water * rain;
	ruv.y -= Rain(uv * 120) * 0.05 * water * rain;
	ruv.y += 0.005 * water * rain;
	
	//round
	ruv -= uv;
	ruv = round(ruv * vec2(608,392)) / vec2(608,392);
	ruv += uv;
	return ruv;
}

@fragment
fn main(@location(0) Texcoord: vec2f) -> @location(0) vec4f {
	var mask = textureSample(Mask, SL, Texcoord);
	
	//UV FX
	var wuv = Water(Texcoord, mask.r, mask.g);
	var color = textureSample(Color, SL, wuv).rgb;
	color *= 1 + (Texcoord - wuv).g * 10 * mask.r * mask.r * mask.r;
	color += color * color * color * 2;
	
	color += color * color;
	color *= 1.2;
	
	//FADE
	var fade = saturate(Texcoord.x * 1.5 * (Texcoord.y + 1));
	fade = mix(fade, pow(fade, 3), mask.g);
	fade *= mix(1 - Texcoord.x, 1, saturate(mask.g - 0.4));
	fade = pow(saturate(fade * 2), 0.8);
	color = mix(vec3(20, 19, 18) / 255.0, color, fade);
	
	return vec4f(color, 1);
}