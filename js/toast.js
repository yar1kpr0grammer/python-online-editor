export function createToast(title, description, timeout = 3000) {
	const messages = document.getElementById("messages");

	const message = document.createElement("div");
	message.classList.add("message");

	const header = document.createElement("h1");
	header.innerText = title;

	const text = document.createElement("p");
	text.innerText = description;

	message.appendChild(header);
	message.appendChild(text);
	messages.appendChild(message);

	// скрыть через timeout
	setTimeout(() => {
		message.classList.add("hide");
	}, timeout);

	// удалить после анимации
	message.addEventListener("animationend", () => {
		if (message.classList.contains("hide")) {
			message.remove();
		}
	});
}
