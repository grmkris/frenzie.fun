// A utility function to convert a hex string to the format required by your Ed25519Provider, if necessary.
// This is just an example and might not be needed if your provider accepts hex strings directly.
export function fromHexString(hexString: Buffer | string) {
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.toString().substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}
