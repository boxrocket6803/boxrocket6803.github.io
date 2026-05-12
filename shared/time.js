export function Bytes() {
	var b = new ArrayBuffer(4);
	new Float32Array(b)[0] = window.performance.now() / 1000;
	return b;
}