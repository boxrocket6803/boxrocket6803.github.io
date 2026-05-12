import * as Graphics from "/shared/engine/graphics.js"
import {Reader} from "/shared/reader.js"

export class Texture {
	static Format = [
		'rgba8888',
		'rgb888',
		'g8',
		'g32'
	]
	
	static GetChannelCount(format) {
		switch (format) {
			case 'rgba8888':
				return 4;
			case 'rgb888':
				return 3;
		}
		return 1;
	}
	
	static async Load(file) { //TODO cache
		var r = await Reader.From(file);
		var t = new Texture();
		//HEADER
		r.ReadBytes(4); //btex
		t.Type = Texture.Format[r.ReadByte()];
		t.Width = r.ReadUInt16();
		t.Height = r.ReadUInt16();
		t.Depth = r.ReadUInt16();
		//PIXELS
		var d = new ImageData(t.Width, t.Height);
		var w = 0;
		var clen = Texture.GetChannelCount(t.Type);
		var c = [];
		var run = 0;
		for (var y = 0; y < t.Height; y++) {
			for (var x = 0; x < t.Width; x++) {
				if (run <= 0) {
					for (var ch = 0; ch < clen; ch++)
						c[ch] = t.Type == 'g32' ? r.ReadUInt32() : r.ReadByte();
					run = r.ReadByte() + 1;
				}
				for (var ch = 0; ch < 4; ch++)
					d.data[w++] = ch < clen ? c[ch] : (ch < 4 ? 0 : 1);
				run--;
			}
		}
		t.Data = Graphics.Device.createTexture({
			size: [t.Width, t.Height, 1],
			format: 'rgba8unorm',
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
		});
		Graphics.Device.queue.copyExternalImageToTexture({source: d}, {texture: t.Data}, [t.Width, t.Height]);
		return t;
	}
	
	Bind() {return this.Data.createView();}
}