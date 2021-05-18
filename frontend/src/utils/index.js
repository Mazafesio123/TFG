export function getUserStatusColor(state) {
	// state = state.toLowerCase() || "";
	switch (state) {
		case "online":
			return "success";
		case "offline":
			return "error";
		default:
			return "#aaa";
	}
}

export function getTicketStatus(state) {
	// state = state.toLowerCase() || "";
	switch (state) {
		case "abierto":
			return { color: "primary", icon: "mdi-lock-open-variant" };
		case "cerrado":
			return { color: "error", icon: "mdi-lock" };
		default:
			return { color: "error", icon: "" };
	}
}
