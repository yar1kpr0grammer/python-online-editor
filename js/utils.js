// utils.js - вспомогательные функции для кодирования и декодирования, работы с URL и файлами

export function encodeCode(code) {
	// Кодируем строку в Uint8Array, затем в base64
	const uint8array = new TextEncoder().encode(code);
	const base64String = btoa(String.fromCharCode(...uint8array));
	return base64String
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

export function decodeCode(encoded) {
	try {
		encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
		while (encoded.length % 4) {
			encoded += "=";
		}
		const binaryString = atob(encoded);
		// Преобразуем binaryString в Uint8Array
		const uint8array = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
		// Декодируем Uint8Array обратно в строку UTF-8
		return new TextDecoder().decode(uint8array);
	} catch (e) {
		console.error("Decode error:", e);
		return "";
	}
}



export function getCodeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    return code ? decodeCode(code) : null;
}

export function copyToClipboard(text) {
    return navigator.clipboard.writeText(text);
}

export function downloadFile(content, filename, mimeType = "text/x-python") {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
