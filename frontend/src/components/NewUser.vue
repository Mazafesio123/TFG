<template>
  <v-card max-width="800px" width="100%">
    <v-sheet color="secondary" class="py-2">
      <v-card-title class="white--text">Nuevo usuario</v-card-title>
    </v-sheet>
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
        @change="() => (crop = img != null ? true : null)"
        color="secondary"
        label="Foto de perfil"
        accept="image/*"
      />

      <div v-show="croppedImage">
        <v-img contain max-width="200" class="mx-auto" :src="croppedImage"
          ><v-btn
            @click.stop="croppedImage = null"
            fab
            color="secondary"
            dark
            :elevation="0"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-img
        >
      </div>

      <v-checkbox
        label="Administrador"
        v-model="admin"
        color="secondary"
      ></v-checkbox>

      <v-dialog class="mx-0" width="unset" persistent v-model="crop">
        <v-card max-width="700" width="100%" class="pa-2 overflow-hidden">
          <cropper
            ref="cropperComponent"
            class="cropper"
            :src="cropImg"
            stencil-component="circle-stencil"
            :stencil-props="{ aspectRatio: 1 }"
          ></cropper>
          <v-card-actions class="mt-1">
            <v-spacer></v-spacer>
            <v-btn color="secondary" text @click="crop = false">Cancelar</v-btn>
            <v-btn color="secondary" text @click.stop="cropF">Aceptar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
import { Cropper } from "vue-advanced-cropper";
import Hermite_class from "hermite-resize";
import "vue-advanced-cropper/dist/style.css";

export default {
  components: {
    Cropper,
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
  computed: {
    cropImg() {
      if (this.img == null) return;
      return URL.createObjectURL(this.img);
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
    async addUser() {
      if (!this.$refs.form.validate()) return;

      let file = await fetch(this.img).then((res) => res.blob());

      let formData = new FormData();
      formData.append("username", this.username);
      formData.append("email", this.email);
      formData.append("img", file);
      formData.append("admin", this.admin);

      axios({
        method: "POST",
        url: `${process.env.VUE_APP_API_URL}/register`,
        data: {
          username: this.username,
          email: this.email,
          img: file,
          admin: this.admin,
        },
      })
        .then((res) => {
          console.log(res);
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