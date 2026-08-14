import {Reader} from "/shared/reader.js"

export class Model {
	static Flags = {
		"Skeleton"	: 1 << 0,
		"Color"		: 1 << 1,
		"Morphs"	: 1 << 2,
		"Weights"	: 1 << 3,
		"BigIndices": 1 << 4,
	}
	
	static Cache = {}
	Skeleton = []
	Meshes = []
	
	static async Load(file) {
		var cached = Model.Cache[file];
		if (cached !== undefined)
			return cached;
		var r = await Reader.From(file);
		//HEADER
		r.ReadBytes(4); //bmdl
		var flags = r.ReadByte();
		if ((flags & Model.Flags.Skeleton) != 0)
			throw new Error("skeleton loading isn't supported");
		var meshc = r.ReadByte();
		for (var i = 0; i < meshc; i++) {
			var mesh = {};
			mesh.Name = r.ReadString();
			console.log(mesh.Name);
			mesh.Material = r.ReadString();
			mesh.Indices = [];
			var indexc = r.ReadInt32();
			for (var j = 0; j < indexc; j++) {
				if ((flags & Model.Flags.BigIndicies) != 0)
					mesh.Indices[j] = r.ReadUInt32();
				else
					mesh.Indices[j] = r.ReadUInt16();
			}
			mesh.Vertices = [];
			var vertexc = r.ReadInt32();
			for (var j = 0; j < vertexc; j++) {
				var vertex = {};
				vertex.Position = {X : r.ReadHalf(), Y : r.ReadHalf(), Z : r.ReadHalf()};
				vertex.Normal = {X : r.ReadHalf(), Y : r.ReadHalf(), Z : r.ReadHalf()};
				var l = vertex.Normal.Length();
				if (l > 0) vertex.Normal /= l;
				vertex.TexCoord0 = {X : r.ReadHalf(), Y : r.ReadHalf()};
				if ((flags & Model.Flags.Color) != 0)
					vertex.Color = r.ReadInt32();
				if ((flags & Model.Flags.Weights) != 0) {
					vertex.Bones = [];
					var bonec = r.ReadByte();
					for (var k = 0; k < bonec; k++)
						vertex.Bones[k] = r.ReadUInt16();
					vertex.Weights = [];
					var weightc = vertex.Bones.Length;
					for (var k = 0; k < weightc; k++)
						vertex.Weights[k] = r.ReadHalf();
				}
			}
			if ((flags & Model.Flags.Morphs) != 0) {
				throw new Error("morph loading isn't supported");
			}
			m.Meshes[i] = mesh;
		}
		
		return Texture.Cache[file] = t;
	}
}