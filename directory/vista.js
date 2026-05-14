import {Graphics} from "/shared/engine/graphics.js"
import {Program} from "/shared/engine/program.js"
import {Buffer} from "/shared/engine/buffer.js"
import {Shader} from "/shared/engine/shader.js"
import {Sampler} from "/shared/engine/sampler.js"
import {Texture} from "/shared/engine/texture.js"

await Graphics.Init(document.querySelector('canvas'));

const Advent = await Program.Create({
	vert: await Shader.Load('shared/shaders/advent_vert.wgsl'),
	frag: await Shader.Load('shared/shaders/advent_frag.wgsl'),
}, [
	Buffer.Create("Control", [
		{Key : "Time", Type : "Float32"},
	]),
	Sampler.Create('clamp'),
	Sampler.Create('repeat'),
	await Texture.Load('directory/assets/vista.btex'),
	await Texture.Load('directory/assets/vista_mask.btex'),
	await Texture.Load('shared/assets/fx_rain.btex'),
	await Texture.Load('shared/assets/fx_noise.btex'),
]);

Graphics.Submit = function() {
	Graphics.Pass.Open();
	Advent.Buffers.Control.Write({Time: window.performance.now() / 1000});
	Advent.Draw(6);
	Graphics.Pass.Close();
};
Graphics.Render();