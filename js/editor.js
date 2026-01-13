import { getCodeFromURL } from "./utils.js";

export let editor;

export function initEditor() {
    return new Promise((resolve) => {
        require.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs" } });
        require(["vs/editor/editor.main"], function () {
            editor = monaco.editor.create(document.getElementById("editor"), {
                value: `print("Привет! Введите число:")\nx = int(input())\nprint(f"Вы ввели число {x}")`,
                language: "python",
                theme: "vs-dark",
                automaticLayout: true,
                fontSize: 14,
                minimap: { enabled: false },
            });

            const codeFromUrl = getCodeFromURL();
            if (codeFromUrl) {
                editor.setValue(codeFromUrl);
            }

            resolve();
        });
    });
}

export function getCode() {
    return editor.getValue();
}
