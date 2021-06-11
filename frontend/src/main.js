import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";
import VueClipboard from "vue-clipboard2";

import axiosModule from "redaxios";
window.axios = axiosModule.create({
	headers: {
		Authorization: store.getters.getToken,
	},
});

Vue.use(VueClipboard);

Vue.config.productionTip = false;

VueClipboard.config.autoSetContainer = true; // add this line

const logged = store.getters.isLoggedIn;

if (logged) {
	Vue.use(
		new VueSocketIO({
			debug: process.env.NODE_ENV == 'development',
			connection: SocketIO(process.env.VUE_APP_BASE_URL, {
				widthCredentials: true,
				transports: ["websocket"],
				query: logged ? "userId=" + store.getters.getUserId : null,
			}),
			vuex: {
				store,
				actionPrefix: "SOCKET_",
				mutationPrefix: "SOCKET_",
			},
			options: { widthCredentials: true }, //Optional options
		})
	);
}

new Vue({
	router,
	store,
	vuetify,
	render: (h) => h(App),
}).$mount("#app");
