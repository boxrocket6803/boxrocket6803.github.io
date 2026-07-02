import {Graphics} from "/shared/engine/graphics.js"

export class Buffer {
	constructor(name, spec, buffer) {
		this.Name = name;
		this.Specification = spec;
		this.Buffer = buffer;
	}
	
	static Size(type) {
		if (type === "Float32")
			return 4;
		throw "unkown type `"+type+"` in Buffer.Size";
	}
	static Convert(property, value) {
		if (property.Type === undefined)
			return value;
		var b = new ArrayBuffer(property.Size);
		if (property.Type === "Float32")
			new Float32Array(b)[0] = value;
		else
			throw "unkown type `"+type+"` in Buffer.Convert";
		return b;
	}
	
	static Create(name, spec) {
		var size = 0;
		for (var i in spec) {
			var p = spec[i];
			if (p.Size === undefined)
				p.Size = Buffer.Size(p.Type);
			size += p.Size;
		}
		var b = Graphics.Device.createBuffer({
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			size: size,
		});
		return new Buffer(name, spec, b);
	}
	
	Write(values) { //TODO batch uploads
		var offset = 0;
		for (var i in this.Specification) {
			var p = this.Specification[i];
			var value = values[p.Key];
			if (value === undefined)
				continue;
			Graphics.Device.queue.writeBuffer(this.Buffer, offset, Buffer.Convert(p, value), 0, p.Size);
			offset += p.Size;
		}
	}
	
	Bind() {return this.Buffer;}
}