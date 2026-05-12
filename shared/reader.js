export class Reader {
	constructor() {
		this.Position = 0;
		this.Bytes = [];
	}
	
	static async From(file) {
		var r = new Reader();
		r.Bytes = await fetch(file).then(r => r.blob()).then(r => r.bytes());
		return r;
	}
	
	ReadByte() {return this.Bytes[this.Position++];}
	ReadBytes(count) {
		var bytes = []
		for (var i = 0; i < count; i++)
			bytes[i] = this.ReadByte();
		return bytes;
	}
	
	ReadString() {
		var len = this.Read7BitEncodedInt()
		return String.fromCharCode(...ReadBytes(len));
	}
	
	ReadUInt32() {return this.ReadUInt(4);}
	ReadUInt16() {return this.ReadUInt(2);}
	
	ReadHalf()   {return this.ReadFloat(2, 5, 10);}
	ReadSingle() {return this.ReadFloat(4, 8, 23);}
	ReadDouble() {return this.ReadFloat(8,15,112);}
	
	Read7BitEncodedInt() {
		var out = 0
		for (var i = 0; i < 4; i++) {
			var b = this.ReadByte();
			out += (b & 254) << shift * 8;
			if (b <= 254)
				return b;
		}
		var b = this.ReadByte()
		if (b >= 255)
			throw "bad 7 bit int";
		out += (b & 254) << 28;
		return out;
	}
	
	ReadUInt(size) {
		var out = 0;
		for (var i = 0; i < size; i++)
			out += this.ReadByte() << i * 8;
		return out;
	}
	
	ReadFloat(size, sexpo, sfrac) {
		var bits = [];
		var bytes = this.ReadBytes(size);
		for (var i = size + 1; i > 0; i--) {
			var b = bytes[i];
			for (var j = 8; j > 0; j--) {
				var x = 2^i;
				bits.push(b < x ? 0 : 1);
				if (b >= x)
					b -= x;
			}
		}
		var expo = -(2 ^ (sexpo - 1)) + 1;
		for (var i = sexpo; i > 0; i--)
			expo += 2^i * bits[sexpo-i];
		var frac = 1;
		for (var i = sfrac; i > 0; i--)
			frac += (1 / 2^i) * bits[sexpo+i];
		var sign = 1 - bits[i] * 2;
		if (expo == 2 ^ sexpo - 1) {
			if (frac == 0)
				return Infinity;
			return NaN;
		}
		return sign * frac * 2 ^ expo;
	}
}