<template>
	<v-card max-width="800px" width="100%">
		<v-sheet color="secondary" class="py-2" >
			<v-card-title class="white--text">Nuevo ticket</v-card-title>
		</v-sheet>
		<v-form class="pa-4" @submit.prevent="submitHandler">
			<v-text-field v-model="titulo" color="secondary" block filled label="Título" :rules="[rules.req]"></v-text-field>
			<v-card-actions>
				<v-spacer />
				<v-btn @click=" $emit('cancel') " text color="secondary">Cancelar</v-btn>
				<v-btn type="submit" text color="secondary">Crear</v-btn>
			</v-card-actions>
		</v-form>
	</v-card>
</template>

<script>
import { req } from "@/utils/validations.js";

export default {
	data() {
		return {
			titulo: "",
			rules: {req}
		}
	},
	methods: {
		async submitHandler() {
			await axios({
				method: "POST",
				url: `${process.env.VUE_APP_API_URL}/issue`,
				data: {
					title : this.titulo,
				}
			})
			this.$emit('reload')
			this.$emit('cancel')
		}
	}
}
</script>

<style>

</style>