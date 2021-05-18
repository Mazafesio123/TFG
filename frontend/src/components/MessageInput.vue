<template>
	<div class="input">
		<v-card class="mx-2" v-if="files.files.length > 0">
			<v-sheet class="pa-1" color="primary"></v-sheet>
			<div style="display: grid; grid-template-columns: 1fr 0fr">
				<div class="d-flex" style="overflow-x: auto">
					<template v-for="(f, i) in files.sources">
						<component
							:is=" f.name ? 'v-card' : 'img' "
							:key="i"
							:src="f"
							style="width: auto; height: 100%; max-height: 200px;"
							class="ma-1 pa-1 white--text"
							color="secondary"
							v-text="f.name"
							contain
						/>
					</template>
				</div>
				<div class="px-4 align-self-center">
					<v-btn small fab color="primary" @click="files.files = new Array()">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</div>
			</div>
		</v-card>

		<v-text-field
			solo
			placeholder="Escribe aquí tu mensaje"
			hide-details
			v-model="message"
			@keydown.enter="sendMessage"
			full-width
			v-bind="$attrs"
			class="mx-1"
		>
			<template v-slot:append>
				<v-btn icon v-if="message == '' && files.files.length == 0">
					<v-icon color="primary">mdi-microphone</v-icon>
				</v-btn>
				<v-btn
					icon
					v-if="message == '' && files.files.length == 0"
					@click="openFileInput"
				>
					<v-icon color="primary">mdi-paperclip</v-icon>
				</v-btn>
				<v-btn
					icon
					v-if="message || files.files.length > 0"
					@click="sendMessage"
				>
					<v-icon color="primary">mdi-send</v-icon>
				</v-btn>
			</template>
		</v-text-field>

		<v-file-input
			class="d-none"
			ref="fileInput"
			multiple
			v-model="files.files"
		/>
	</div>
</template>

<script>
export default {
	props: {
		ticketId: String,
	},
	data() {
		return {
			message: "",
			files: {
				files: [],
				sources: [],
			},
			typing: false,
		};
	},
	methods: {
		openFileInput() {
			this.$refs.fileInput.$el.querySelector("input").click();
		},
		sendMessage() {
			if (this.message == "" && this.files.files.length == 0) return;
			const author = this.$store.getters.getDecodedToken.id;

			let files = this.files.files.map((f) => {
				return {
					name: f.name,
					file: f,
					ext: f.name.split(".")[f.name.split(".").length - 1],
				};
			});

			files.forEach((file, index) => {
				const data = {
					author,
					text: index == files.length - 1 ? this.message : "",
					date: new Date().getTime(),
					ticket_id: this.ticketId,
					file,
				};
				this.$socket.emit("send-message", data);
			});

			if (files.length == 0) {
				const data = {
					author,
					text: this.message,
					date: new Date().getTime(),
					ticket_id: this.ticketId,
				};
				this.$socket.emit("send-message", data);
			}

			this.message = "";
			this.files.files = new Array();
		},
	},
	watch: {
		"files.files"(val) {
			this.files.sources = val
				.map((f) => f.type.includes("image") ? URL.createObjectURL(f) : f);
		},
		message(val) {
			if (!!val != this.typing) {
				this.typing = !!val;
				let { username, id, img } = this.$store.getters.getDecodedToken;
				this.$socket.emit("typing", !!val, { username, id, img });
			}
		},
	},
};
</script>

<style>
</style>