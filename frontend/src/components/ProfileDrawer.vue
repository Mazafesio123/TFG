<template>
	<v-navigation-drawer v-model="active" app right temporary width="512">
		<v-card-title>Perfil</v-card-title>
		<div>
			<v-img
				:src="`${baseUrl}/avatars/${$store.getters.getDecodedToken.img}`"
				contain
				style="max-width: 200px"
				class="mx-auto mt-4"
			>
				<v-btn @click="openFileInput" fab color="secondary" :elevation="1">
					<v-icon>mdi-pencil</v-icon>
				</v-btn>
			</v-img>

			<v-file-input
				v-model="img"
				@change="
					() => {
						crop = img != null ? true : null;
						croppedImage = img;
					}
				"
				class="d-none"
				label="Foto de perfil"
				accept="image/*"
				:disabled="!!img"
				ref="fileInput"
			/>

			<img-cropper
				v-if="img"
				:key="img.name"
				v-model="croppedImage"
				@cancel="img = null"
			/>

			<v-text-field
				outlined
				v-model="nombre"
				class="mx-4 mt-2"
				label="Nombre de usuario"
				:rules="[(v) => !!v || 'Este campo es obligatorio']"
			/>

			<div class="d-flex mx-4">
				<v-spacer />
				<v-btn color="secondary" @click="saveProfile">
					<v-icon left>mdi-content-save</v-icon>
					Guardar cambios
				</v-btn>
			</div>
		</div>

		<v-dialog max-width="800px" width="100%" v-model="newUser" persistent>
			<new-user @cancel="newUser = false" />
		</v-dialog>

		<template v-slot:append>
			<div class="ma-4">
				<v-btn
					@click="newUser = true"
					class="my-1"
					color="secondary"
					outlined
					block
				>
					<v-icon left>mdi-account-plus</v-icon>
					Crear cuenta de usuario
				</v-btn>
				<v-btn to="/logout" class="my-1" color="error" outlined block>
					<v-icon left>mdi-logout</v-icon>
					Cerrar sesión
				</v-btn>
			</div>
		</template>
	</v-navigation-drawer>
</template>

<script>
export default {
	components: {
		NewUser: () => import("@/components/NewUser.vue"),
		ImgCropper: () => import("@/components/ImgCropper.vue"),
	},
	props: {
		value: Boolean,
	},
	data() {
		return {
			nombre: this.$store.getters.getDecodedToken.username,
			newUser: false,

			crop: null,
			img: null,
			croppedImage: null,

			baseUrl: process.env.VUE_APP_BASE_URL
		};
	},
	computed: {
		active: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit("input", val);
			},
		},
	},
	methods: {
		openFileInput() {
			this.$refs.fileInput.$el.querySelector("input").click();
		},
		async saveProfile() {
			if (this.croppedImage) {
				var file = await fetch(this.croppedImage).then((res) => res.blob());
			}

			let formData = new FormData();
			formData.append("name", this.nombre);
			if (file) formData.append("img", file, "avatar.png");

			axios({
				method: "POST",
				url: `${process.env.VUE_APP_API_URL}/save_profile`,
				data: formData,
			}).then(res => {
				this.$store.dispatch('logout').then(() => this.$router.push('/login'))
			});
		},
	},
};
</script>

<style>
</style>