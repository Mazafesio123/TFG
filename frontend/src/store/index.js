import Vue from "vue";
import Vuex from "vuex";
import jwt_decode from "jwt-decode";
import axiosModule from "redaxios";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		token: localStorage.getItem("token") || null,
	},
	getters: {
		getToken: (state) => state.token,
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
		login({ commit, getters }, credentials) {
			return new Promise(async (resolve, reject) => {
				axios({
					method: "POST",
					url: `${process.env.VUE_APP_API_URL}/login`,
					data: credentials,
				})
					.then(async (res) => {
						await commit("login", res.data);
						window.axios = axiosModule.create({
							headers: {
								Authorization: res.data,
							},
						});
						resolve(res.data);
					})
					.catch(() => {
						reject();
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
