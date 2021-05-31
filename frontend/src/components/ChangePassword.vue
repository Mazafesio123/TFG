<template>
  <v-card>
    <v-toolbar color="primary" :elevation="0">
      <v-toolbar-title class="white--text">
        Cambio de contraseña
      </v-toolbar-title>
    </v-toolbar>

    <v-form @submit.prevent="changePass" ref="form" class="pa-4">
      <v-alert type="error" dense v-show="error"
        >Los datos no son correctos</v-alert
      >
      <v-alert type="info" dense text
        >Tienes que cambiar la contraseña la primera vez que inicias
        sesión</v-alert
      >
      <v-text-field
        label="Contraseña actual"
        type="password"
        outlined
        dense
        hide-details="auto"
        class="my-2"
        v-model="password"
        :rules="[rules.req]"
      />
      <v-text-field
        label="Nueva contraseña"
        type="password"
        outlined
        dense
        hide-details="auto"
        class="my-2"
        v-model="newPassword"
        :rules="[rules.req]"
      />
      <v-text-field
        label="Confirmar nueva contraseña"
        type="password"
        outlined
        dense
        hide-details="auto"
        class="my-2"
        v-model="newPassword2"
        :rules="[
          rules.req,
          () => newPassword == newPassword2 || 'Las contraseñas no coinciden',
        ]"
      />
      <v-btn color="primary" type="submit" block>CAMBIAR CONTRASEÑA</v-btn>
    </v-form>
  </v-card>
</template>

<script>
export default {
  props: {
    usuario: String,
  },
  data() {
    return {
      password: "",
      newPassword: "",
      newPassword2: "",
      rules: { req: (v) => !!v || "Este campo es obligatorio" },
      error: false,
    };
  },
  methods: {
    changePass() {
      if (!this.$refs.form.validate()) return;
      axios({
        method: "POST",
        url: `${process.env.VUE_APP_API_URL}/change_password`,
        data: {
          username: this.usuario,
          password: this.password,
          newPassword: this.newPassword,
        },
      })
        .then((res) => {
          this.$store.dispatch("iniciarSesion", res.data).then((res) => {
            this.$router.push({ name: "Home" });
						this.$root.$emit('snack', 'Se ha cambiado la contraseña con éxito')
          });
          this.error = false;
        })
        .catch((err) => {
          console.error(err);
          this.error = true;
        });
    },
  },
};
</script>

<style>
</style>