<template>
  <v-container fluid>
    <v-card max-width="400" class="pa-4 mx-auto">
      <v-form @submit.prevent="login" ref="login">
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
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      username: 'ivan@zirconite.es',
      password: '1234',
      rules: { req: (v) => !!v || "Este campo es obligatorio" },
      error: false,
    };
  },
  methods: {
    login() {
      if (!this.username || !this.password) return;
      this.$store
        .dispatch("login", {
          username: this.username,
          password: this.password,
        })
        .then(() => this.$router.push({ name: "Home" }))
        .catch(() => {
          this.error = true;
          this.password = "";
          this.$refs.login.resetValidation();
        });
    },
  },
};
</script>

<style>
</style>