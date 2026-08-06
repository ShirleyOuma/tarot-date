// Generates a random UUID (v4). Uses the native crypto.randomUUID() when
// available (fast path, works in production over HTTPS), and falls back to
// crypto.getRandomValues() otherwise — needed because randomUUID() only works
// in "secure contexts" (HTTPS or localhost), which excludes testing over
// a local network IP like http://192.168.x.x, e.g. from a phone during dev.
export function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID()
    }

    const bytes = crypto.getRandomValues(new Uint8Array(16))
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80

    const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0'))
    return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`
}