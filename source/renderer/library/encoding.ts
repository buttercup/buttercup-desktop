export function arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = "";
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
        binary = `${binary}${String.fromCharCode(buffer[i])}`;
    }
    return window.btoa(binary);
}
