<template>
	<v-card>
		<v-toolbar color="secondary">
			<v-toolbar-title class="white--text">Nuevo usuario</v-toolbar-title>
		</v-toolbar>
		<v-form ref="form" class="pa-4">
			<v-row>
				<v-col cols="12" md="">
					<v-text-field
						color="secondary"
						filled
						label="Nombre de usuario"
						v-model="username"
						:rules="[rules.req]"
					></v-text-field>
				</v-col>
				<v-col cols="12" md="">
					<v-text-field
						color="secondary"
						filled
						label="Correo electrónico"
						v-model="email"
						:rules="[rules.req, rules.email]"
					></v-text-field>
				</v-col>
			</v-row>

			<v-file-input
				v-model="img"
				@change="
					() => {
						crop = img != null ? true : null;
						croppedImage = img;
					}
				"
				color="secondary"
				label="Foto de perfil"
				accept="image/*"
				:disabled="!!img"
			/>

			<img-cropper
				v-if="img"
				:key="img.name"
				v-model="croppedImage"
				@cancel="img = null"
			/>

			<v-checkbox
				label="Administrador"
				v-model="admin"
				color="secondary"
			></v-checkbox>

			<v-card-actions>
				<v-spacer />
				<v-btn color="secondary" text @click.stop="$emit('cancel')"
					>Cancelar</v-btn
				>
				<v-btn color="secondary" text @click.stop="addUser">Aceptar</v-btn>
			</v-card-actions>
		</v-form>
	</v-card>
</template>

<script>
import { req, email } from "@/utils/validations.js";
import "vue-advanced-cropper/dist/style.css";

export default {
	components: {
		ImgCropper: () => import("@/components/ImgCropper.vue"),
	},
	data() {
		return {
			crop: false,
			img: null,
			croppedImage: null,
			username: "",
			email: "",
			admin: false,
			rules: { req, email },
		};
	},
	methods: {
		async addUser() {
			if (!this.$refs.form.validate()) return;

			if (this.croppedImage) {
				var file = await fetch(this.croppedImage).then((res) => res.blob());
			}

			let formData = new FormData();
			formData.append("username", this.username);
			formData.append("email", this.email);
			if (file) formData.append("img", file, "avatar.png");
			formData.append("admin", this.admin);

			axios({
				method: "POST",
				url: `${process.env.VUE_APP_API_URL}/register`,
				data: formData,
			})
				.then((res) => {
					this.$emit("cancel");
				})
				.catch((err) => {
					console.error(err);
				});
		},
	},
};
</script>

<style>
</style>