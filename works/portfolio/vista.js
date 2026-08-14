import {Graphics} from "/shared/engine/graphics.js"
import {Program} from "/shared/engine/program.js"
import {Buffer} from "/shared/engine/buffer.js"
import {Shader} from "/shared/engine/shader.js"
import {Sampler} from "/shared/engine/sampler.js"
import {Texture} from "/shared/engine/texture.js"
import {Camera} from "/shared/engine/camera.js"
import {Model} from "/shared/engine/model.js"
import {TimeSince} from "/shared/time.js"

await Graphics.Init(document.querySelector('canvas'));
await Camera.Init(90);
const Error = await Model.Load('portfolio/assets/error.bmdl');
const Ocean = await Program.Create({
	vert: await Shader.Load('portfolio/assets/ocean_vert.wgsl'),
	frag: await Shader.Load('portfolio/assets/ocean_frag.wgsl'),
}, [
	Camera.Buffer,
	Buffer.Create("Dimensions", [
		{Key : "X", Type : "Float32"},
		{Key : "Y", Type : "Float32"},
	]),
]);

const Time = new TimeSince();
Graphics.Submit = function() {
	var size = Graphics.Resize();
	var grid = {X : Math.round(size.x / 4.0), Y : Math.round(size.y / 4.0)};
	
	Graphics.Pass.Open();
	Ocean.Buffers.Dimensions.Write(grid);
	//Ocean.Draw(6 * grid.X * grid.Y);
	Graphics.Pass.Close();
};
Graphics.Render();