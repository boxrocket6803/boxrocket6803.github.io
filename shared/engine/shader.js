import {Graphics} from "/shared/engine/graphics.js"

export class Shader {
	static Cache = {}
	
	static async Load(file) {
		var cached = Shader.Cache[file];
		if (cached !== undefined)
			return cached;
		var file = await fetch(file).then(r => r.text());
		var module = Graphics.Device.createShaderModule({code: file})
		return Shader.Cache[file] = module;
	}
}