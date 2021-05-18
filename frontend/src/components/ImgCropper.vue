<template>
	<div>
		<div
			style="max-width: 200px; display: grid; grid-template-rows: 0"
			class="mx-auto"
		>
			<v-btn
				@click.stop="croppedImage = null"
				fab
				color="secondary"
				dark
				:elevation="0"
			>
				<v-icon>mdi-close</v-icon>
			</v-btn>
			<img style="width: 100%; height: auto" :src="croppedSrc" alt="" />
		</div>

		<v-dialog class="mx-0" width="unset" persistent v-model="crop">
			<v-card max-width="700" width="100%" class="pa-2 overflow-hidden">
				<cropper
					ref="cropperComponent"
					class="cropper"
					:src="croppedSrc"
					stencil-component="circle-stencil"
					:stencil-props="{ aspectRatio: 1 }"
				></cropper>
				<v-card-actions class="mt-1">
					<v-spacer></v-spacer>
					<v-btn
						color="secondary"
						text
						@click="
							crop = false;
							croppedImage = null;
						"
						>Cancelar</v-btn
					>
					<v-btn color="secondary" text @click.stop="cropF">Aceptar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import Hermite_class from "hermite-resize";
import { Cropper } from "vue-advanced-cropper";

export default {
	components: {
		Cropper,
	},
	props: ["value"],
	data() {
		return {
			crop: true,
		};
	},
	computed: {
		croppedImage: {
			get() {
				return this.value;
			},
			set(val) {
				if (val == null) this.$emit("cancel");
				this.$emit("input", val);
			},
		},
		croppedSrc() {
			if (this.croppedImage.name) return URL.createObjectURL(this.croppedImage);
			else return this.croppedImage;
		},
	},
	methods: {
		cropF() {
			const HERMITE = new Hermite_class();
			const { canvas } = this.$refs.cropperComponent.getResult();
			let resizeCanvas = document.createElement("canvas");
			resizeCanvas.height = canvas.height;
			resizeCanvas.width = canvas.width;
			let resizeCtx = resizeCanvas.getContext("2d");
			resizeCtx.drawImage(canvas, 0, 0);
			resizeCtx.globalCompositeOperation = "destination-in";
			resizeCtx.beginPath();
			resizeCtx.arc(
				resizeCanvas.width / 2,
				resizeCanvas.height / 2,
				resizeCanvas.height / 2,
				0,
				Math.PI * 2
			);
			resizeCtx.closePath();
			resizeCtx.fill();
			HERMITE.resample_single(resizeCanvas, 350, 350, true);
			this.croppedImage = resizeCanvas.toDataURL("image/png");
			this.crop = false;
		},
	},
};
</script>

<style>
</style>