export const Device = await (await navigator.gpu?.requestAdapter())?.requestDevice();
export var Context;

export async function Init(canvas) {
	var device = Device; //context.configure doesn't work with capital d, not sure why
	var context = canvas.getContext('webgpu');
	context.configure({device, format: navigator.gpu.getPreferredCanvasFormat()});
	Context = context;
}