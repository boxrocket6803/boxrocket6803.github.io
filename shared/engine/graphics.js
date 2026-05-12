export const Device = await (await navigator.gpu?.requestAdapter())?.requestDevice();
export var Canvas;
export var Context;

export async function Init(canvas) {
	Canvas = canvas;
	Canvas.width = Canvas.clientWidth * window.devicePixelRatio;
	Canvas.height = Canvas.clientHeight * window.devicePixelRatio;
	
	var device = Device; //context.configure doesn't work with capital d, not sure why
	var context = Canvas.getContext('webgpu');
	context.configure({device, format: navigator.gpu.getPreferredCanvasFormat()});
	Context = context;
}