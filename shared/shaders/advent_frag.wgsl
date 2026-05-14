struct Uniform {
	Time : f32,
}
@group(0) @binding(0) var<uniform> Data: Uniform;
@group(0) @binding(1) var SLC: sampler;
@group(0) @binding(2) var SLR: sampler;

@group(0) @binding(3) var Color: texture_2d<f32>;
@group(0) @binding(4) var Mask: texture_2d<f32>;
@group(0) @binding(5) var Rain: texture_2d<f32>;
@group(0) @binding(6) var Noise: texture_2d<f32>;

fn Rotate(uv: vec2f, degrees: f32, org: vec2f) -> vec2f {
	var deg = degrees / 57.2958;
	var cosAngle = cos(deg);
	var sinAngle = sin(deg);
	var out = uv - org;
	return vec2f(cosAngle * out.x + sinAngle * out.y, cosAngle * out.y - sinAngle * out.x) + org;
}

fn RainImpacts(tile: vec2f) -> f32 {
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
	
	//WATER
	ruv.x += sin(ruv.y * 600 + Data.Time * 5) * 0.007 * water;
	ruv.x -= sin(ruv.y * 200 + Data.Time * 2) * 0.007 * water;
	ruv.y -= sin(ruv.x * 200 - Data.Time * 2) * 0.005 * water;
	
	if (textureSample(Mask, SLC, ruv).r < water) {return uv;}
	
	//RAIN
	ruv.y -= RainImpacts(uv * 60) * 0.1 * water * rain;
	ruv.y -= RainImpacts(uv * 80) * 0.07 * water * rain;
	ruv.y -= RainImpacts(uv * 120) * 0.05 * water * rain;
	ruv.y += 0.005 * water * rain;
	
	ruv -= uv;
	ruv = round(ruv * vec2(608,392)) / vec2(608,392);
	ruv += uv;
	return ruv;
}

@fragment
fn main(@location(0) Texcoord: vec2f) -> @location(0) vec4f {
	var mask = textureSample(Mask, SLC, Texcoord);
	
	//UV FX
	var wuv = Water(Texcoord, mask.r, mask.g);
	var color = textureSample(Color, SLC, wuv).rgb;
	color *= 1 + (Texcoord - wuv).g * 10 * mask.r * mask.r * mask.r;
	color += color * color * color * 2;
	
	color += color * color;
	color *= 1.2;
	
	//RAIN
	var rot = -10.0;
	var bdir = -Rotate(vec2(0,1), -rot, vec2(-0.1));
	var mdir = -Rotate(vec2f(0,1), -rot, vec2f(1));
	
	var blur = vec3f(0);
	for (var i = -15.0; i <= 15.0; i += 1.0) {
		blur += textureSample(Color, SLC, clamp(Texcoord + bdir * 0.005 * i, vec2(0), vec2(1))).rgb * (1.0 - abs(i * 0.06));
	}
	blur /= 8;
	
	var maskuv = Rotate(Texcoord, rot, vec2f(0.5));
	maskuv += mdir * vec2f(sin(maskuv.x * 50 + Data.Time * 0.3) * sin(Data.Time * 0.15) * 0.1);
	maskuv.x += sin(Data.Time * 0.6 + 0.7) * 0.1;
	var rmask = 0.0;
	rmask += mix(0, textureSample(Rain, SLR, maskuv + mdir * Data.Time * vec2f(6)).b, clamp(mask.g * 5, 0, 1) * mask.g);
	rmask += mix(0, textureSample(Rain, SLR, maskuv * vec2f(1.5) + mdir * Data.Time * vec2f(5)).b, clamp(mask.g * 5, 0, 1) * mask.g);
	rmask += mix(0, textureSample(Rain, SLR, maskuv * vec2f(1.5) + mdir * Data.Time * vec2f(2)).g, clamp(mask.g-0.5, 0, 1));
	color = mix(color.rgb, blur, rmask);
	
	//FOG
	var fog = textureSample(Noise, SLR, Texcoord * 0.1 + mdir * Data.Time * 0.1).r;
	fog *= textureSample(Noise, SLR, Texcoord * 0.5 + bdir * Data.Time * 0.3).r;
	fog *= textureSample(Noise, SLR, Texcoord * vec2f(0.6, 0.2) + bdir * Data.Time * 0.05).r;
	fog *= fog;
	fog = min(fog, 0.5);
	color += vec3(fog) * mask.g * mask.g * 0.2;
	
	//FADE
	var fade = saturate(Texcoord.x * 1.5 * (Texcoord.y + 1));
	fade = mix(fade, pow(fade, 3), mask.g);
	fade *= mix(1 - Texcoord.x, 1, saturate(mask.g - 0.4));
	fade = pow(saturate(fade * 2), 0.8);
	var fadein = saturate(Data.Time * 0.3);
	fadein *= fadein;
	fade *= fadein;
	color = mix(vec3(color.g), color, fadein);
	color = mix(vec3(20, 19, 18) / 255.0, color, fade);
	
	return vec4f(color, 1);
}