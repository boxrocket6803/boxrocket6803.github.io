import {Graphics} from "/shared/engine/graphics.js"

export class Program {
	constructor(buffers, pipeline, bind) {
		this.Buffers = buffers;
		this.RenderPipeline = pipeline;
		this.BindGroup = bind;
	}
	
	static async Create(pipeline, bind) {
		//default layout
		if (pipeline.layout === undefined)
			pipeline.layout = 'auto';
		//expand vertex shader
		if (pipeline.vert !== undefined)
			pipeline.vertex = pipeline.vert;
		delete pipeline.vert;
		if (pipeline.vertex.constructor.name === 'GPUShaderModule')
			pipeline.vertex = {module: pipeline.vertex};
		//expand fragment shader
		if (pipeline.frag !== undefined)
			pipeline.fragment = pipeline.frag;
		delete pipeline.frag;
		if (pipeline.fragment.constructor.name === 'GPUShaderModule')
			pipeline.fragment = {module: pipeline.fragment};
		if (pipeline.fragment.targets === undefined)
			pipeline.fragment.targets = [{format: navigator.gpu.getPreferredCanvasFormat()}];
		//default primitive options
		if (pipeline.primitive === undefined)
			pipeline.primitive = {topology: 'triangle-list'};
		
		var buffers = {}
		for (var i in bind) {
			var entry = bind[i];
			var type = entry.constructor.name;
			if (entry.constructor.name === "Buffer") {
				buffers[entry.Name] = entry;
				entry = entry.Bind();
			} else if (type === "Texture")
				entry = entry.Bind();
			bind[i] = {binding: i, resource: entry};
		}
		
		var p = Graphics.Device.createRenderPipeline(pipeline);
		var b = Graphics.Device.createBindGroup({
			layout: p.getBindGroupLayout(0),
			entries: bind,
		});
		return new Program(buffers, p, b);
	}
	
	Bind() {
		Graphics.RenderPass.setPipeline(this.RenderPipeline);
		Graphics.RenderPass.setBindGroup(0, this.BindGroup);
	}
	
	Draw(count) {
		this.Bind();
		Graphics.Pass.Draw(count);
	}
}