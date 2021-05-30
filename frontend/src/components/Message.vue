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
        <v-img
          v-if="!((grouped || noTime) && !lastGrouped)"
          :src="`${baseUrl}/avatars/${img}`"
        ></v-img>
      </v-avatar>
    </v-col>
    <v-col :class="`order-1 d-grid pa-0 w-100`">
      <v-hover v-if="!typing" v-slot="{ hover }">
        <v-card :class="`rounded-lg`" max-width="600px" width="100%">
          <div style="display: grid" class="ma-1">
            <template v-if="file && file._id">
              <div v-viewer="{ navbar: false, toolbar: false }">
                <img
                  v-if="(types[file.ext] || 'text').includes('image')"
                  :src="`${baseUrl}/documents/_${file._id}.${file.ext}`"
                  style="max-width: 100%; height: auto"
                />
              </div>

              <v-chip
                class="ma-1"
                @click.stop="downloadFile"
                :color="owner ? 'white' : 'secondary'"
                label
                small
                outlined
                v-if="file"
              >
                <v-icon left small>mdi-download</v-icon>
                {{ file.name }}
              </v-chip>
            </template>

            <v-card-text v-show="msgHTML" v-html="msgHTML"></v-card-text>
          </div>

          <v-card-actions
            v-if="owner || $store.getters.getDecodedToken.admin"
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
                  <v-list-item @click.stop="deleteMsg">
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
      <div class="typing" v-else>
        <div class="typing__dot"></div>
        <div class="typing__dot"></div>
        <div class="typing__dot"></div>
      </div>
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
import types from "@/utils/mimeExtensions.js";

import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";
import Vue from "vue";
Vue.use(Viewer);

export default {
  props: {
    id: String,
    text: String,
    autor: String,
    owner: Boolean,
    date: String | Number,
    grouped: Boolean,
    noTime: Boolean,
    lastGrouped: Boolean,
    img: String,
    file: Object,
    typing: { type: Boolean, default: false },
  },
  data() {
    return {
      tiempo: "",
      msgHTML: "",
      types,
			baseUrl: process.env.VUE_APP_BASE_URL
    };
  },
  methods: {
    deleteMsg() {
      axios({
        method: "delete",
        url: `${process.env.VUE_APP_API_URL}/delete_message`,
        data: {
          messageId: this.id,
        },
      }).catch((err) => {
        this.$root.$emit("snack", "Ha ocurrido un error");
      });
    },
    async downloadFile() {
      let {data} = await axios(`${baseUrl}/documents/_${this.file._id}.${this.file.ext}`);
      let a = document.createElement("a");
      a.href = URL.createObjectURL(
        new File([data], this.file.name, {
          type: types[this.file.ext] || "text/plain",
        })
      );
      a.download = this.file.name;
      a.click();
    },
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

.typing {
  width: 5em;
  height: 2em;
  position: relative;
  padding: 10px;
  margin-left: 5px;
  background: #e6e6e6;
  border-radius: 20px;
}

.typing__dot {
  float: left;
  width: 8px;
  height: 8px;
  margin: 0 4px;
  background: #8d8c91;
  border-radius: 50%;
  opacity: 0;
  animation: loadingFade 1s infinite;
}

.typing__dot:nth-child(1) {
  animation-delay: 0s;
}

.typing__dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing__dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes loadingFade {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
  }
}
</style>