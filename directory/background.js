import * as Graphics from "/shared/engine/graphics.js"
import * as Shader from "/shared/engine/shader.js"
import {Texture} from "/shared/engine/texture.js"
import * as Time from "/shared/time.js"

Graphics.Init(document.querySelector('canvas'));

const pipeline = Graphics.Device.createRenderPipeline({
    layout: 'auto',
    vertex: {
        module: await Shader.Load('shared/shaders/advent_vert.wgsl'),
    },
    fragment: {
        module: await Shader.Load('shared/shaders/advent_frag.wgsl'),
        targets: [
            {format: navigator.gpu.getPreferredCanvasFormat()},
        ],
    },
    primitive: {topology: 'triangle-list'},
});

const UniformBuffer = Graphics.Device.createBuffer({
	usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
	size: 4,
});

const bind = Graphics.Device.createBindGroup({
	layout: pipeline.getBindGroupLayout(0),
	entries: [
		{binding: 0, resource: UniformBuffer},
		{binding: 1, resource: Graphics.Device.createSampler({
			addressModeU: "clamp-to-edge", addressModeV: "clamp-to-edge",
			magFilter: 'linear', minFilter: 'linear',
		})},
		{binding: 2, resource: Graphics.Device.createSampler({
			addressModeU: "repeat", addressModeV: "repeat",
			magFilter: 'linear', minFilter: 'linear',
		})},
		{binding: 3, resource: (await Texture.Load('directory/assets/menu_0_0.btex')).Bind()},
		{binding: 4, resource: (await Texture.Load('directory/assets/menu_0_0_mask.btex')).Bind()},
		{binding: 5, resource: (await Texture.Load('shared/assets/fx_rain.btex')).Bind()},
		{binding: 6, resource: (await Texture.Load('shared/assets/fx_noise.btex')).Bind()},
	],
});

function Draw() {
    const cmd = Graphics.Device.createCommandEncoder();
    const pass = cmd.beginRenderPass({
        colorAttachments: [
            {
                view: Graphics.Context.getCurrentTexture().createView(),
                clearValue: [0.125, 0.125, 0.125, 1],
                loadOp: 'clear',
                storeOp: 'store',
            },
        ],
    });
    pass.setPipeline(pipeline);
	pass.setBindGroup(0, bind);
    pass.draw(6);
    pass.end();
	Graphics.Device.queue.writeBuffer(UniformBuffer, 0, Time.Bytes(), 0, 4);
    Graphics.Device.queue.submit([cmd.finish()]);
    requestAnimationFrame(Draw);
}
requestAnimationFrame(Draw);
