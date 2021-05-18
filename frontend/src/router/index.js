import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

Vue.use(VueRouter);

const routes = [
	{
		path: "/tickets",
		name: "Home",
		component: () => import("@/views/Chats.vue"),
		children: [
			{
				path: "/ticket/:id",
				name: "Ticket",
				component: () => import("@/views/Chat.vue"),
			},
		],
		meta: {
			requiresLogin: true,
		},
	},
	{
		path: "/login",
		name: "Login",
		component: () => import("@/views/Login.vue"),
		beforeEnter: (to, from, next) => {
			if (store.getters.isLoggedIn) next({ name: "Home" });
			else next();
		},
	},
	{
		path: "/logout",
		name: "Logout",
		// component: () => import("@/views/Login.vue"),
		beforeEnter: async (to, from, next) => {
			await store.dispatch("logout");
			next({ name: "Login" });
		},
	},
	{
		path: "/join",
		name: "Join",
		beforeEnter: async (to, from, next) => {
			let id = to.query.id;
			await axios({
				url: `${process.env.VUE_APP_API_URL}/join`,
				method: "POST",
				data: {
					ticketId: id,
				},
			});
			next({ name: "Ticket", query: { id: id } });
		},
		meta: {
			requiresLogin: true,
		},
	},
	{
		path: "*",
		redirect: "/tickets",
	},
];

import jwt_decode from "jwt-decode";
const validateToken = () => {
	let { iat } = jwt_decode(store.getters.getToken);
	return iat > new Date().getTime();
};

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

router.beforeEach((to, from, next) => {
	if (to.matched.some((record) => record.meta.requiresLogin)) {
		if (!store.getters.isLoggedIn || !validateToken()) {
			store.dispatch("logout");
			next({
				name: "Login",
				query: { redirect: to.fullPath },
			});
		} else {
			next();
		}
	} else {
		next();
	}
});

export default router;
