import {Graphics} from "/shared/engine/graphics.js"

export class Sampler {
	static Cache = {}
	
	static Create(address, filter) {
		if (filter === undefined) filter = 'linear';
		
		var key = address+"+"+filter;
		var cached = Sampler.Cache[key];
		if (cached !== undefined)
			return cached;
		if (address === 'clamp')
			address = 'clamp-to-edge';
		var sampler = Graphics.Device.createSampler({
			addressModeU: address, addressModeV: address,
			magFilter: filter, minFilter: filter,
		});
		return Sampler.Cache[key] = sampler;
	}
}