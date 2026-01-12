let worker = createWorker();
const output = document.getElementById("output");

function encodeCode(code) {
	return encodeURIComponent(btoa(unescape(encodeURIComponent(code))));
}

function decodeCode(encoded) {
	try {
		return decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
	} catch {
		return "";
	}
}

require.config({
	paths: {
		vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs",
	},
});

require(["vs/editor/editor.main"], () => {
	const editor = monaco.editor.create(document.getElementById("editor"), {
		value: `print("Hello world")\nfor i in range(5):\n  print(i)`,
		language: "python",
		theme: "vs-dark",
		automaticLayout: true,
		fontSize: 14,
		minimap: { enabled: false },
	});

	// Загрузка кода из URL
	const urlParams = new URLSearchParams(window.location.search);
	const codeFromUrl = urlParams.get("code");
	if (codeFromUrl) {
		const decoded = decodeCode(codeFromUrl);
		if (decoded) {
			editor.setValue(decoded);
		}
	}

	// Валидация: проверка двоеточия
	function validatePythonCode(code) {
		const diagnostics = [];
		const lines = code.split("\n");
		lines.forEach((line, i) => {
			if (/^\s*(for|if|while|def|class).+[^:]$/.test(line)) {
				diagnostics.push({
					startLineNumber: i + 1,
					startColumn: 1,
					endLineNumber: i + 1,
					endColumn: line.length + 1,
					message: "Missing colon ':' at end of statement",
					severity: monaco.MarkerSeverity.Error,
				});
			}
		});
		return diagnostics;
	}

	editor.onDidChangeModelContent(() => {
		const code = editor.getValue();
		const markers = validatePythonCode(code);
		monaco.editor.setModelMarkers(editor.getModel(), "python", markers);
	});

	// Автодополнение
	monaco.languages.registerCompletionItemProvider("python", {
		provideCompletionItems: () => {
			return {
				suggestions: [
					{
						label: "print",
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: "print(${1:value})",
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: "Print output to console",
					},
					{
						label: "for",
						kind: monaco.languages.CompletionItemKind.Keyword,
						insertText: "for ${1:var} in ${2:iterable}:\n\t$0",
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: "For loop",
					},
					{
						label: "if",
						kind: monaco.languages.CompletionItemKind.Keyword,
						insertText: "if ${1:condition}:\n\t$0",
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: "If statement",
					},
				],
			};
		},
	});

	// Кнопка Run
	document.getElementById("run").onclick = () => {
		output.textContent = "Running...\n";
		worker.postMessage({
			type: "run",
			code: editor.getValue(),
		});
	};

	// Кнопка Stop
	document.getElementById("stop").onclick = () => {
		worker.terminate();
		worker = createWorker();
		output.textContent += "\n⛔ Execution stopped";
	};

	// Кнопка Share
	document.getElementById("share").onclick = () => {
		const code = editor.getValue();
		const encoded = encodeCode(code);
		const shareUrl = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
		navigator.clipboard.writeText(shareUrl).then(() => {
			alert("Ссылка скопирована в буфер:\n" + shareUrl);
		});
	};

	// Кнопка Download
	document.getElementById("download").onclick = () => {
		const code = editor.getValue();
		const blob = new Blob([code], { type: "text/x-python" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = "code.py";
		document.body.appendChild(a);
		a.click();
		a.remove();

		URL.revokeObjectURL(url);
	};
});

function createWorker() {
	const w = new Worker("worker.js");
	w.onmessage = (e) => {
		if (e.data.stdout) output.textContent += e.data.stdout;
		if (e.data.error) output.textContent += "\n❌ " + e.data.error;
	};
	return w;
}
