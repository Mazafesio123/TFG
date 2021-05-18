<template>
	<v-card>
		<v-toolbar color="secondary">
			<v-btn icon @click="$emit('close')" color="white"><v-icon>mdi-close</v-icon></v-btn>
			<v-toolbar-title class="white--text">Añadir usuario</v-toolbar-title>
		</v-toolbar>
		<div class="pa-4">
		<v-autocomplete
			multiple
			chips
			filled
			:items="allUsers"
			item-value="_id"
			label="Selecciona a los usuario que quieras añadir"
			v-model="selected"
		>
			<template v-slot:selection="{ attrs, item, parent, selected }">
				<v-chip
					v-if="item === Object(item)"
					v-bind="attrs"
					:input-value="selected._id"
					label
					color="secondary"
				>
					{{ item.username }}
					<v-icon right small @click="parent.selectItem(item)">
						mdi-close
					</v-icon>
				</v-chip>
			</template>

			<template v-slot:item="{ item, attrs, on }">
				<v-list-item
					#default="{ active }"
					v-on="on"
					v-bind="attrs"
					@click.stop
					color="secondary"
				>
					<v-list-item-action>
						<v-checkbox :input-value="active" />
					</v-list-item-action>
					<v-list-item-avatar>
						<v-avatar size="30">
							<v-img :src="`http://localhost:3000/avatars/${item.img}`" :class="`${item.online ? '' : 'filter'}`"></v-img>
						</v-avatar>
					</v-list-item-avatar>
					<v-list-item-content>
						<span v-text="item.username" />
						<strong v-text="item.email" />
					</v-list-item-content>
					<v-list-item-icon v-show="item.admin">
						<v-icon>mdi-crown</v-icon>
					</v-list-item-icon>
				</v-list-item>
			</template>
		</v-autocomplete>

		<div class="d-flex align-center mt-n4 mb-4">
			<v-btn text color="secondary" @click="join"
				>Enviar<v-icon right ref="copyBtn" v-text="'mdi-send'"
			/></v-btn>
		</div>

		<v-card-subtitle>O envía este enlace</v-card-subtitle>

		<div class="d-flex align-center">
			<v-btn
				text
				color="secondary"
				v-clipboard:copy="joinLink"
				v-clipboard:success="coppied"
				>{{ joinLink }}<v-icon right ref="copyBtn" v-text="coppiedIcon"></v-icon
			></v-btn>
		</div>
		</div>
	</v-card>
</template>

<script>
export default {
	props: ["ticketId"],
	data() {
		return {
			coppiedIcon: "mdi-content-copy",
			joinLink: `http://localhost:8080/join?id=${this.ticketId}`,
			allUsers: [],
			selected: [],
		};
	},
	async mounted() {
		let { data: users } = await axios({
			method: "GET",
			url: `${process.env.VUE_APP_API_URL}/users`,
			params: { ticketId: this.ticketId },
		});
		console.log(users);
		this.allUsers = users;
	},
	methods: {
		coppied() {
			let temp = this.coppiedIcon;
			this.coppiedIcon = "mdi-check";
			setTimeout(() => {
				this.coppiedIcon = temp;
			}, 1200);
		},
		join() {
			axios({
				method: "POST",
				url: `${process.env.VUE_APP_API_URL}/join`,
				data: { ticketId: this.ticketId, users: this.selected },
			})
				.then((res) => {
					this.$emit("reload");
					this.$emit("close");
				})
				.catch((err) => {
					console.error(err);
				});
		},
	},
};
</script>

<style>
.filter {
  filter: grayscale(1);
}
</style>