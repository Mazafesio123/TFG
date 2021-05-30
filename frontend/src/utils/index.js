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

export function getFile(route) {
	return new Promise(async (resolve, reject) => {
		await axios({
			method: "GET",
			url: `${process.env.VUE_APP_API_URL}/get_file`,
			responseType: "blob",
			params: {
				path: route,
			},
		})
			.then(({ data }) => {
				resolve(data);
			})
			.catch((err) => {
				reject(err);
			});
	});
}
