<template>
  <v-row
    :class="`${owner ? 'owner' : 'no-owner'} ${!grouped ? 'my-3' : 'my-0'} ${
      noTime ? 'mb-0' : ''
    } flex-grow-0`"
  >
    <v-col
      cols="auto"
      :class="`${
        owner ? 'order-2' : 'order-1'
      } py-0 d-flex flex-column-reverse`"
    >
      <v-avatar class="mb-5">
        <v-img v-if="!((grouped || noTime) && !lastGrouped)" :src="img"></v-img>
      </v-avatar>
    </v-col>
    <v-col :class="`order-1 d-grid pa-0 w-100`">
      <v-hover v-slot="{ hover }">
        <v-card :class="`rounded-lg`" max-width="600px" width="100%">
          <v-card-text v-html="msgHTML"></v-card-text>
          <v-card-actions
            class="pa-1 float-left align-self-start"
            :style="`${hover ? 'opacity: 1' : 'opacity: 0'}`"
          >
            <v-menu>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="pa-0" icon v-on="on" v-bind="attrs"
                  ><v-icon :color="`${owner ? 'white' : ''}`"
                    >mdi-chevron-down</v-icon
                  ></v-btn
                >
              </template>
              <v-list dense>
                <v-list-item-group>
                  <v-list-item>
                    <v-list-item-icon
                      ><v-icon>mdi-delete</v-icon></v-list-item-icon
                    >
                    <v-list-item-content> Borrar </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
      </v-hover>
      <small
        v-if="(!grouped && !noTime) || lastGrouped"
        class="text-rigth text-no-wrap"
        v-text="[autor, tiempo].filter((item) => !!item).join(' - ')"
      ></small>
    </v-col>
  </v-row>
</template>

<script>
import Autolinker from "autolinker";

export default {
  props: {
    text: String,
    autor: String,
    owner: Boolean,
    date: String | Number,
    grouped: Boolean,
    noTime: Boolean,
    lastGrouped: Boolean,
    img: String,
  },
  data() {
    return {
      tiempo: "",
      msgHTML: "",
    };
  },
  methods: {
    timeSince(date) {
      date = new Date(date).getTime();
      if (new Date().getTime() - date < 1000) return "";
      var seconds = Math.floor((new Date() - date) / 1000);

      var interval = seconds / 31536000;

      if (interval > 1) {
        return `Hace ${Math.floor(interval)} años`;
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return `Hace ${Math.floor(interval)} meses`;
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return `Hace ${Math.floor(interval)} días`;
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return `Hace ${Math.floor(interval)} h`;
      }
      interval = seconds / 60;
      if (interval > 1) {
        return `Hace ${Math.floor(interval)} min`;
      }
      return `Hace ${Math.floor(seconds + 1)} seg`;
    },
  },
  mounted() {
    this.msgHTML = Autolinker.link(this.text);

    if (this.noTime) return;
    this.tiempo = this.timeSince(this.date);
    setInterval(() => {
      this.tiempo = this.timeSince(this.date);
    }, 5000);
  },
};
</script>

<style lang="scss">
.d-grid {
  display: grid;
}

.no-owner {
  max-width: 600px;
  margin-right: auto;
  display: flex;
  justify-content: start;
  .v-card {
    display: inline-flex;
    a {
      color: inherit !important;
    }
  }
}
.owner {
  // text-align: end;
  max-width: 600px;
  margin-left: auto;
  display: flex;
  justify-content: end;
  small {
    text-align: end;
  }
  .v-card {
    background: var(--v-primary-lighten2) !important;
    color: white !important;
    display: inline-flex;
    .v-card__text {
      color: inherit !important;
    }
    a {
      color: inherit !important;
    }
  }
}
.opacity-0 {
  opacity: 0;
}
</style>