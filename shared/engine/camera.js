import {Buffer} from "/shared/engine/buffer.js"

export class Camera {
	static Buffer;
	
	static async Init(fov) {
		Camera.Buffer = Buffer.Create("Camera", [
			//{Key : "View", Type : "Mat4x4"},
			//{Key : "Proj", Type : "Mat4x4"},
			//{Key : "InvView", Type : "Mat4x4"},
			//{Key : "InvProj", Type : "Mat4x4"},
			//{Key : "Position", Type : "Vec3f"},
			//{Key : "Forward", Type : "Vec3f"},
		]);
	}
}