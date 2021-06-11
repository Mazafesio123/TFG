<template>
	<v-row style="height: 100%">
		<v-col cols="auto" class="px-0">
			<v-navigation-drawer
				width="300"
				class="pa-2"
				:mini-variant.sync="mini"
				permanent
				app
			>
				<v-list-item no-gutters class="px-0">
					<v-btn large icon @click.stop="mini = !mini">
						<v-icon
							color="primary"
							v-text="mini ? 'mdi-chevron-right' : 'mdi-chevron-left'"
						></v-icon>
					</v-btn>
					<v-text-field
						v-show="!mini"
						class="ml-1"
						solo
						prepend-inner-icon="mdi-magnify"
						placeholder="Búsqueda..."
						v-model="search"
						:loading="filtering"
						hide-details
					></v-text-field>
				</v-list-item>

				<v-list-item no-gutters class="px-0">
					<v-btn @click="newTicket = true" icon large
						><v-icon color="primary">mdi-plus</v-icon></v-btn
					>
					<v-spacer></v-spacer>
					<v-switch v-model="closed" label="Mostrar cerrados"></v-switch>
				</v-list-item>

				<v-list v-show="!mini" dense v-if="filteredChats.length > 0">
					<v-subheader>CHATS</v-subheader>
					<v-list-item-group v-model="currentChat" color="primary">
						<v-list-item
							v-for="chat in filteredChats"
							:key="chat._id"
							:to="`/ticket/${chat._id}`"
							active-class="secondary--text"
						>
							<chat-resume :chat="chat"></chat-resume>
						</v-list-item>
					</v-list-item-group>
				</v-list>
				<template v-else>
					<v-divider class="mb-3"></v-divider>
					<div v-show="!mini" class="text-center">
						<span>No hay chats que coincidan con la búsqueda</span>
					</div>
				</template>


				<template v-slot:append>
					<div class="d-flex">
						<v-btn @click.stop="drawer = true" icon>
							<v-avatar size="30">
								<v-img
									:src="`${baseUrl}/avatars/${$store.getters.getDecodedToken.img}`"
								></v-img>
							</v-avatar>
						</v-btn>
						<v-spacer></v-spacer>
						<v-btn class="mx-2" to="/logout" color="error" icon>
							<v-icon>mdi-logout</v-icon></v-btn
						>
					</div>
				</template>
			</v-navigation-drawer>
		</v-col>

		<v-col style="height: 100%" class="px-0 pb-0">
			<router-view
				v-if="$route.name == 'Ticket'"
				:key="$route.fullPath"
				transition="slide-y-reverse-transition"
				style="height: 100%"
				@changeState="changeState"
				@reload="getChats"
			></router-view>
			<div v-else class="notChatSelected">
				<div>
					<v-icon x-large>mdi-forum</v-icon><br />
					<v-card-subtitle>Selecciona algún chat</v-card-subtitle>
				</div>
			</div>
		</v-col>

		<profile-drawer :key="drawer" @close="drawer = false" v-model="drawer"></profile-drawer>

		<v-dialog max-width="800" v-model="newTicket">
			<new-ticket
				:key="Math.random()"
				@cancel="newTicket = false"
				@reload="getChats"
			/>
		</v-dialog>
	</v-row>
</template>

<script>
import ChatResume from "@/components/ChatResume.vue";
import NewUser from "@/components/NewUser.vue";

export default {
	components: {
		ChatResume,
		NewUser,
		ProfileDrawer: () => import("@/components/ProfileDrawer.vue"),
		NewTicket: () => import("@/components/NewTicket.vue"),
	},
	data() {
		return {
			currentChats: [],
			currentChat: null,
			search: "",
			filtering: false,
			closed: true,
			mini: !!this.$route.name == "Tickets",

			newTicket: false,
			newUser: false,
			drawer: false,

			baseUrl: process.env.VUE_APP_BASE_URL
		};
	},
	computed: {
		filteredChats() {
			this.filtering = true;

			if (this.search == "" || this.search == null) {
				this.filtering = false;
				return this.currentChats
					.filter(({ state }) => state != "cerrado" || this.closed)
					.sort((a, b) => a.data > b.date);
			}

			let filter = this.search.toLowerCase();
			let temp = this.currentChats
				.filter(({ state }) => state != "cerrado" || this.closed)
				.filter(
					(chat) =>
						chat.title.toLowerCase().includes(filter) ||
						chat.user.some((user) =>
							user.username.toLowerCase().includes(filter)
						)
				);

			this.filtering = false;
			return temp.sort((a, b) => a.data > b.date);
		},
	},
	methods: {
		getChats() {
			axios({
				method: "GET",
				url: `${process.env.VUE_APP_API_URL}/issues`,
			}).then(({ data }) => {
				this.currentChats = data;
			});
		},
		changeState({ ticketId, state }) {
			this.currentChats.find((c) => String(c._id) == ticketId).state = state;
		},
	},
	mounted() {
		this.getChats();
	},
	sockets: {
		userChangeState: function (data) {
			this.currentChats.forEach((chat) => {
				let u = chat.user.find((user) => user._id == data.userId);
				u.online = data.online;
			});
		},
	},
};
</script>

<style lang="scss">
.notChatSelected {
	display: grid;
	place-items: center;
	height: 100%;
	text-align: center;
	.v-icon {
		font-size: 80px !important;
	}
}
</style>