let worker = createWorker();
const output = document.getElementById("output");

require.config({
	paths: {
		vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs",
	},
});

require(["vs/editor/editor.main"], () => {
	// Python language already registered in Monaco
	const editor = monaco.editor.create(document.getElementById("editor"), {
		value: `print("Hello from Python")\n\nfor i in range(3):\n    print(i)`,
		language: "python",
		theme: "vs-dark",
		automaticLayout: true,
		fontSize: 14,
		minimap: { enabled: false },
	});

	// ---- Basic IntelliSense / LSP-lite ----
	monaco.languages.registerCompletionItemProvider("python", {
		provideCompletionItems: () => ({
			suggestions: [
				{
					label: "print",
					kind: monaco.languages.CompletionItemKind.Function,
					insertText: "print(${1:value})",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Prints the given object to stdout",
				},
				{
					label: "range",
					kind: monaco.languages.CompletionItemKind.Function,
					insertText: "range(${1:stop})",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				},
			],
		}),
	});

	// Run
	document.getElementById("run").onclick = () => {
		output.textContent = "Running...\n";
		worker.postMessage({
			type: "run",
			code: editor.getValue(),
		});
	};

	// Stop
	document.getElementById("stop").onclick = () => {
		worker.terminate();
		worker = createWorker();
		output.textContent += "\n⛔ Execution stopped";
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
