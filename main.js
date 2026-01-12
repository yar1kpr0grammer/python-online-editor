let worker = createWorker();
const output = document.getElementById("output");

document.getElementById("run").onclick = () => {
	output.textContent = "Running...\n";
	worker.postMessage({
		type: "run",
		code: document.getElementById("editor").value,
	});
};

document.getElementById("stop").onclick = () => {
	worker.terminate();
	worker = createWorker();
	output.textContent += "\n⛔ Execution stopped";
};

function createWorker() {
	const w = new Worker("worker.js");
	w.onmessage = (e) => {
		if (e.data.stdout) output.textContent += e.data.stdout;
		if (e.data.error) output.textContent += "\n❌ " + e.data.error;
	};
	return w;
}
