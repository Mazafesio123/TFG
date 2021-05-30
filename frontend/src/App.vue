<template>
  <v-app>
    <v-main style="max-height: 100vh; background: #f1f1f1">
      <v-container fluid style="height: 100%" class="py-0">
        <router-view></router-view>
      </v-container>
      <v-snackbar v-model="snack" timeout="4000" color="primary">{{
        msg
      }}</v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      msg: "",
      snack: false,
    };
  },
  mounted() {
    this.$root.$on("snack", (msg) => {
      this.snack = true;
      this.msg = msg;
    });
  },
};
</script>

<style lang="scss">
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #e0e0e0;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb {
  background: var(--v-primary-base);
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--v-primary-darken1);
}
</style>