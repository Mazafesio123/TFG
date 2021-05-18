<template>
  <div class="pa-3 flex-grow-1">
    <div>
      <span class="subtitle-1 mb-1" v-text="chat.title"></span>
    </div>

    <v-badge
      style="float: right"
      color="secondary"
      v-show="unreadMessages"
      :content="unreadMessages"
    />

    <div class="mt-1 d-flex">
      <v-chip outlined :color="getTicketStatus(chat.state).color" label>
        <v-icon small left v-text="getTicketStatus(chat.state).icon" />
        {{ chat.state }}
      </v-chip>
      <v-sheet max-width="180px">
        <v-slide-group class="ml-1" show-arrows>
          <v-slide-item
            v-for="(user, i) in chat.user.filter(
              (u) => u._id != $store.getters.getUserId
            )"
            :key="i"
          >
            <v-avatar size="30" :class="`${i > 0 ? 'ml-n4' : ''}`">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-img
                    v-on="on"
                    v-bind="attrs"
                    :src="user.img"
                    :class="`${user.online ? '' : 'filter'}`"
                  ></v-img>
                </template>
                {{ user.username }}
              </v-tooltip>
            </v-avatar>
          </v-slide-item>
        </v-slide-group>
      </v-sheet>
    </div>
  </div>
</template>

<script>
import { getTicketStatus } from "@/utils/index.js";

export default {
  props: {
    chat: {
      type: Object,
      required: true,
    },
    active: Boolean,
    unreadMessages: Number,
  },
  methods: {
    getTicketStatus,
  },
};
</script>

<style lang="scss" scoped>
.filter {
  filter: grayscale(1);
}
</style>