export class Graphics {
	static Rendering = false;
	
	static async Init(canvas) {
		var device = await (await navigator.gpu?.requestAdapter())?.requestDevice();;
		var context = canvas.getContext('webgpu');
		context.configure({device, format: navigator.gpu.getPreferredCanvasFormat()});
		Graphics.Canvas = canvas;
		Graphics.Device = device;
		Graphics.Context = context;
	}
	
	static Resize() {
		Graphics.Canvas.width = window.innerWidth;
		Graphics.Canvas.height = window.innerHeight;
		return {x : Graphics.Canvas.width, y : Graphics.Canvas.height}
	}
	
	static Pass = {
		Open: function(color, target) {
			if (color === undefined) color = [0, 0, 0, 1];
			if (target === undefined) target = Graphics.Context.getCurrentTexture().createView();
			
			if (!Graphics.Rendering)
				Graphics.CommandList = Graphics.Device.createCommandEncoder();
			Graphics.RenderPass = Graphics.CommandList.beginRenderPass({
				colorAttachments: [{
					view: target,
					clearValue: color,
					loadOp: 'clear',
					storeOp: 'store'
				}],
			});
			Graphics.Rendering = true;
		},
		Draw: function(count) {
			Graphics.RenderPass.draw(count);
		},
		Close: function() {
			Graphics.RenderPass.end();
			Graphics.RenderPass = null;
		}
	};
	
	static Render() {
		if (Graphics.Submit !== undefined) {
			Graphics.Submit();
			requestAnimationFrame(Graphics.Render);
		}
		if (!Graphics.Rendering)
			return;
		Graphics.Device.queue.submit([Graphics.CommandList.finish()]);
		Graphics.Rendering = false;
	}
}