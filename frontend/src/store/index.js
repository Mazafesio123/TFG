import Vue from "vue";
import Vuex from "vuex";
import jwt_decode from "jwt-decode";
import axiosModule from "redaxios";
import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		token: localStorage.getItem("token") || null,
	},
	getters: {
		getToken: (state) => state.token,
		getDecodedToken: (state) => jwt_decode(state.token),
		isLoggedIn: (state) => !!state.token,
		getUserId: (state, { isLoggedIn }) =>
			isLoggedIn ? jwt_decode(state.token).id : null,
		getUserName: (state, { isLoggedIn }) =>
			isLoggedIn ? jwt_decode(state.token).username : null,
		isAdmin: (state, { isLoggedIn }) =>
			isLoggedIn ? jwt_decode(state.token).admin : false,
	},
	mutations: {
		login(state, token) {
			return new Promise((resolve) => {
				localStorage.setItem("token", token);
				state.token = token;
				resolve();
			});
		},
		logout(state) {
			return new Promise(async (resolve) => {
				(state.token = null), localStorage.removeItem("token");
				resolve();
			});
		},
	},
	actions: {
		iniciarSesion({ commit, getters }, token) {
			return new Promise(async (resolve, reject) => {
				await commit("login", token);
				window.axios = axiosModule.create({
					headers: {
						Authorization: token,
					},
				});

				Vue.use(
					new VueSocketIO({
						debug: process.env.NODE_ENV == "development",
						connection: SocketIO(process.env.VUE_APP_BASE_URL, {
							widthCredentials: true,
							transports: ["websocket"],
							query: "userId=" + jwt_decode(token).id,
						}),
						options: { widthCredentials: true }, //Optional options
					})
				);

				resolve(token);
			});
		},
		login({ commit, getters, dispatch }, credentials) {
			return new Promise(async (resolve, reject) => {
				axios({
					method: "POST",
					url: `${process.env.VUE_APP_API_URL}/login`,
					data: credentials,
				})
					.then(async (res) => {
						if (jwt_decode(res.data).defaultPassword) {
							reject({
								changePassword: true,
							});
							return;
						}

						dispatch("iniciarSesion", res.data)
							.then((res) => resolve(res))
							.catch((err) => reject(err));
					})
					.catch((err) => {
						console.error(err);
						reject(err);
					});
			});
		},
		logout({ commit, getters }) {
			return new Promise(async (resolve) => {
				await axios({
					url: `${process.env.VUE_APP_API_URL}/login`,
					method: "delete",
					data: { id: getters.getUserId },
				});
				await commit("logout");
				resolve();
			});
		},
	},
	modules: {},
});
