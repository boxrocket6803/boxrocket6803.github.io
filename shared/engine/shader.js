import * as Graphics from "/shared/engine/graphics.js"

export async function Load(file) { //TODO cache
	var file = await fetch(file).then(r => r.text());
	return Graphics.Device.createShaderModule({code: file})
}