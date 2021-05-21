<template>
	<div outlined fluid v-if="data" ref="container" class="chat pa-0">
		<v-sheet
			class="pa-1 d-flex align-center"
			style="z-index: 1; height: 56px"
			elevation="2"
		>
			<v-btn icon to="/tickets">
				<v-icon color="primary">mdi-arrow-left</v-icon>
			</v-btn>
			<h3 v-text="data.title"></h3>
			<v-spacer></v-spacer>

			<v-btn
				v-if="data.author == $store.getters.getUserId"
				icon
				@click="addUserModal = true"
			>
				<v-icon>mdi-account-multiple-plus</v-icon>
			</v-btn>

			<v-menu v-if="data.author == $store.getters.getUserId">
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon v-on="on" v-bind="attrs">
						<v-icon>mdi-cog</v-icon>
					</v-btn>
				</template>
				<v-list>
					<v-list-item @click="changeState = true">
						<v-list-item-title> Cambiar el estado </v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-sheet>

		<v-row ref="messages" class="messages px-4">
			<v-col
				ref="messages_container"
				cols="12"
				class="d-flex flex-column justify-end"
			>
				<div class="d-flex">
					<v-btn
						v-show="!finished"
						@click="getMessages(false)"
						text
						class="my-2 mx-auto"
						color="primary"
					>
						<v-icon left>mdi-reload</v-icon>
						Cargar más</v-btn
					>
				</div>
				<Message
					v-for="(message, index) in messages"
					:key="message._id"
					:text="message.text"
					:autor="message.author.username"
					:owner="message.author._id == userId"
					:date="message.date"
					:grouped="
						index > 0 &&
						messages[index - 1].author._id == message.author._id &&
						message.date - messages[index - 1].date < 3000
					"
					:noTime="
						index < messages.length - 1 &&
						messages[index + 1].author._id == message.author._id &&
						messages[index + 1].date - message.date < 3000
					"
					:lastGrouped="
						index == messages.length - 1 ||
						(index < messages.length - 1 &&
							messages[index + 1].date - message.date > 3000)
					"
					:img="message.author.img"
					:file="message.file"
				/>

				<div v-if="cerrado" class="pa-5 text-center">
					<v-icon x-large>mdi-lock</v-icon>
					<v-card-subtitle
						>Este ticket está cerrado, no se pueden enviar más
						mensajes</v-card-subtitle
					>
				</div>

				<div v-if="noMembers && !cerrado" class="pa-5 text-center">
					<v-icon x-large>mdi-account</v-icon>
					<v-card-subtitle>Estás tú solo este chat</v-card-subtitle>
					<v-btn text color="secondary" @click="addUserModal = true">
						invitar
					</v-btn>
				</div>

				<Message
					v-if="typing.length > 0"
					typing
					noTime
					lastGrouped
					:img="typing[0].img"
					:autor="`${typing
						.slice(0, 1)
						.map((u) => u.username)
						.join(', ')} ${typing.length > 2 ? ', ...' : ''}`"
				/>
			</v-col>
		</v-row>

		<message-input :ticketId="data._id" :disabled="cerrado || noMembers" />

		<v-dialog persistent v-model="changeState" max-width="900px">
			<v-card class="pa-4">
				<v-card-title>Selecciona el nuevo estado del ticket</v-card-title>
				<v-item-group v-model="newState">
					<v-row>
						<v-col>
							<v-item value="abierto" v-slot="{ active, toggle }">
								<v-card
									@click="toggle"
									outlined
									:style="`border-color: ${
										active ? $vuetify.theme.themes.light.secondary : ''
									}`"
									class="pa-4"
								>
									<v-avatar
										:color="getTicketStatus('abierto').color"
										size="30"
										class="rounded-l-xl rounded-b-xl rounded-tr-0 float-right"
									></v-avatar>
									<v-card-title>Abierto</v-card-title>
									<v-card-text
										>Los miembros podrán seguir enviando mensajes.</v-card-text
									>
								</v-card>
							</v-item>
						</v-col>
						<v-col>
							<v-item value="cerrado" v-slot="{ active, toggle }">
								<v-card
									@click="toggle"
									outlined
									:style="`border-color: ${
										active ? $vuetify.theme.themes.light.secondary : ''
									}`"
									class="pa-4"
								>
									<v-avatar
										:color="getTicketStatus('cerrado').color"
										size="30"
										class="rounded-l-xl rounded-b-xl rounded-tr-0 float-right"
									></v-avatar>
									<v-card-title>Cerrado</v-card-title>
									<v-card-text
										>Los miembros no podrán seguir enviando
										mensajes.</v-card-text
									>
								</v-card>
							</v-item>
						</v-col>
					</v-row>
				</v-item-group>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn @click="changeState = false" text color="primary"
						>Cerrar</v-btn
					>
					<v-btn @click="sendChangeState" text color="primary">Aceptar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="addUserModal" max-width="600px" persistent>
			<add-user
				@close="addUserModal = false"
				@reload="$emit('reload')"
				:ticketId="data._id"
				v-if="addUserModal"
				:key="addUserModal"
			/>
		</v-dialog>
	</div>
</template>

<script>
import Message from "@/components/Message.vue";
import { getUserStatusColor, getTicketStatus } from "@/utils/index";

export default {
	components: {
		Message,
		MessageInput: () => import("@/components/MessageInput.vue"),
		AddUser: () => import("@/components/AddUser.vue"),
	},
	data() {
		return {
			userId: this.$store.getters.getUserId,
			userName: this.$store.getters.getUserName,
			data: null,
			messages: [],
			changeState: false,
			addUserModal: false,
			newState: null,
			currentPage: 1,
			finished: false,
			allUsers: [],
			typing: [],
		};
	},
	computed: {
		cerrado() {
			return this.data.state == "cerrado";
		},
		noMembers() {
			return this.data.user.length <= 1;
		},
	},
	methods: {
		getUserStatusColor,
		getTicketStatus,
		async sendChangeState() {
			await axios({
				url: `${process.env.VUE_APP_API_URL}/change_state`,
				method: "POST",
				data: {
					ticketId: this.data._id,
					state: this.newState,
				},
			});
			this.changeState = false;
			this.data.state = this.newState;
			this.$emit("changeState", {
				ticketId: this.data._id,
				state: this.newState,
			});
		},
		async getMessages(scroll = true) {
			let { data: messages } = await axios({
				method: "GET",
				url: `${process.env.VUE_APP_API_URL}/messages`,
				params: {
					id: this.$route.params.id,
					page: this.currentPage,
				},
			});
			this.messages = [...messages.messages, ...this.messages];
			this.finished = messages.done;
			console.log(this.messages)

			if (scroll) {
				this.$nextTick(() => {
					let objDiv = this.$refs.messages;
					objDiv.scrollTop = objDiv.scrollHeight;
				});
			}

			this.currentPage++;
		},
	},
	async mounted() {
		let { data } = await axios({
			method: "GET",
			url: `${process.env.VUE_APP_API_URL}/issue?id=${this.$route.params.id}`,
		});

		data.user = data.user.sort((a, b) =>
			a._id == data.author ? -1 : b._id == data.author ? 1 : 0
		);
		this.data = data;

		this.getMessages();

		this.$nextTick(() => {
			let objDiv = this.$refs.messages;
			objDiv.scrollTop = objDiv.scrollHeight;
		});
		this.$socket.emit("join-room", this.$route.params.id);
	},
	sockets: {
		"send-message": function (data) {
			this.messages.push(data);
			this.$nextTick(() => {
				let objDiv = this.$refs.messages;
				objDiv.scrollTop = objDiv.scrollHeight;
			});
		},
		typing: function ({ typing, user }) {
			if (typing) {
				this.typing.push(user);
			} else {
				this.typing.splice(
					this.typing.findIndex((u) => u.id == user.id),
					1
				);
			}

			this.$nextTick(() => {
				let objDiv = this.$refs.messages;
				objDiv.scrollTop = objDiv.scrollHeight;
			});
		},
	},
	watch: {
		data: {
			handler(val) {
				this.$nextTick(() => {
					let objDiv = this.$refs.messages;
					objDiv.scrollTop = objDiv.scrollHeight;
				});
			},
			deep: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.chat {
	display: grid;
	grid-template-rows: 0fr 1fr 0fr;
	max-height: 100%;
	// background-color: #fff;
}
.members {
	background: transparent !important;
}
.messages {
	overflow-y: auto;
	height: 100%;
	max-height: 100%;
	padding-right: 0px;
	display: flex;
	flex-direction: column-reverse
}
.members-actions {
	display: grid;
	grid-template-rows: 1fr 0fr;
}
</style>