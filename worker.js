importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js");

let pyodideReady = loadPyodide({
	stdout: (msg) => postMessage({ stdout: msg + "\n" }),
	stderr: (msg) => postMessage({ error: msg }),
});

onmessage = async (e) => {
	if (e.data.type !== "run") return;

	const pyodide = await pyodideReady;

	try {
		await pyodide.runPythonAsync(e.data.code);
	} catch (err) {
		postMessage({ error: err.toString() });
	}
};
