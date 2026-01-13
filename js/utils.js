// utils.js - вспомогательные функции для кодирования и декодирования, работы с URL и файлами

export function encodeCode(code) {
    return btoa(unescape(encodeURIComponent(code)));
}

export function decodeCode(encoded) {
    try {
        return decodeURIComponent(escape(atob(encoded)));
    } catch {
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
