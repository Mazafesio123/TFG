<template>
	<div class="input">
      <v-text-field
        solo
        placeholder="Escribe aquí tu mensaje"
        hide-details
        v-model="message"
        @keydown.enter="sendMessage"
        full-width
				v-bind="$attrs"
        class="mx-1"
        @click:append="message.length > 0 ? sendMessage() : null"
        :append-icon="message.length > 0 ? 'mdi-send' : 'mdi-microphone'"
      >
      </v-text-field>
    </div>
</template>

<script>
export default {
	props: {
		ticketId: String
	},
	data() {
		return {
      message: "",
		}
	},
	methods: {
		sendMessage() {
      if (this.message == "") return;
      let data = {
        author: this.$store.getters.getDecodedToken.id,
        text: this.message,
        date: new Date().getTime(),
        ticket_id: this.ticketId,
      };
      this.$socket.emit("send-message", data);
      this.message = "";
    },
	}
}
</script>

<style>

</style>