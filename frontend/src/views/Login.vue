<template>
  <v-container fluid>
    <v-card max-width="400" class="mx-auto">
      <v-toolbar color="primary" :elevation="0">
        <v-toolbar-title class="white--text">
        INICIO DE SESIÓN
        </v-toolbar-title>
      </v-toolbar>
      <v-form @submit.prevent="login" ref="loginForm" class="pa-4">
        <v-alert type="error" dense v-show="error"
          >Los datos no son correctos</v-alert
        >
        <v-text-field
          label="Correo electrónico"
          outlined
          dense
          hide-details="auto"
          class="my-2"
          v-model="username"
          :rules="[rules.req]"
        >
        </v-text-field>
        <v-text-field
          label="Contraseña"
          type="password"
          outlined
          dense
          hide-details="auto"
          class="my-2"
          v-model="password"
          :rules="[rules.req]"
        >
        </v-text-field>
        <v-btn color="primary" type="submit" block>INICIAR SESIÓN</v-btn>
      </v-form>
    </v-card>

    <v-dialog persistent max-width="500" width="100%" :key="defaultPassword" :value="defaultPassword">
      <change-password :usuario="username" />
    </v-dialog>

  </v-container>
</template>

<script>
export default {
  components: {
    ChangePassword: () => import('@/components/ChangePassword.vue')
  },
  data() {
    return {
      username: '',
      password: '',
      rules: { req: (v) => !!v || "Este campo es obligatorio" },
      error: false,
      defaultPassword: false
    };
  },
  methods: {
    login() {
      if (!this.$refs.loginForm.validate()) return;
      this.$store
        .dispatch("login", {
          username: this.username,
          password: this.password,
        })
        .then(() => this.$router.push({ name: "Home" }))
        .catch((err) => {
          if (err && err.changePassword) {
            this.defaultPassword = true;
          } else {
            this.error = true;
          this.password = "";
          this.$refs.login.resetValidation();
          }
        });
    },
  },
};
</script>

<style>
</style>