// run.js — ПРАВИЛЬНЫЙ запуск Brython 3.13+

import { getCode, initEditor } from "./editor.js";
import { encodeCode, copyToClipboard, downloadFile } from "./utils.js";

let currentScript = null;

export async function main() {
    await initEditor();

    const outputDiv = document.getElementById("output");
    const runBtn = document.getElementById("run");
    const stopBtn = document.getElementById("stop");
    const shareBtn = document.getElementById("share");
    const downloadBtn = document.getElementById("download");
    const filenameInput = document.getElementById("filename");

    function clearOutput() {
        outputDiv.textContent = "";
    }

    function writeOutput(data) {
        outputDiv.textContent += String(data);
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }

    function hookStdout() {
        const sys = __BRYTHON__.builtins.__import__("sys");
        sys.stdout.write = writeOutput;
        sys.stderr.write = writeOutput;
    }

    function runPython(code) {
        // Удаляем предыдущий Python-скрипт
        if (currentScript) {
            currentScript.remove();
        }

        const script = document.createElement("script");
        script.type = "text/python";
        script.id = "__main__";
        script.textContent = code;

        document.body.appendChild(script);
        currentScript = script;

        hookStdout();

        // 🔑 ЕДИНСТВЕННЫЙ корректный запуск в Brython 3.13+
        brython();
    }

    runBtn.onclick = () => {
        clearOutput();
        runBtn.disabled = true;
        stopBtn.disabled = false;

        try {
            runPython(getCode());
        } catch (e) {
            writeOutput("\nОшибка: " + e);
        } finally {
            runBtn.disabled = false;
            stopBtn.disabled = true;
        }
    };

    stopBtn.onclick = () => {
        if (currentScript) {
            currentScript.remove();
            currentScript = null;
            writeOutput("\n⛔ Выполнение остановлено.");
        }
        runBtn.disabled = false;
        stopBtn.disabled = true;
    };

    shareBtn.onclick = async () => {
        const encoded = encodeCode(getCode());
        const url = `${location.origin}${location.pathname}?code=${encoded}`;
        await copyToClipboard(url);
        alert("Ссылка скопирована");
    };

    downloadBtn.onclick = () => {
        downloadFile(
            getCode(),
            filenameInput.value.trim() || "code.py"
        );
    };
}

main();
