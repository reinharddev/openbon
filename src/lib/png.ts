const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/** Reads width/height from the IHDR chunk. Returns null when the bytes are not a PNG. */
export function readPngSize(bytes: Uint8Array): { width: number; height: number } | null {
	if (bytes.length < 24) return null;
	for (let i = 0; i < PNG_SIGNATURE.length; i++) {
		if (bytes[i] !== PNG_SIGNATURE[i]) return null;
	}
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	if (view.getUint32(12) !== 0x49484452) return null; // "IHDR"
	return { width: view.getUint32(16), height: view.getUint32(20) };
}
