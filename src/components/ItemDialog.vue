<template>
  <div>
    <v-dialog
      v-model="item_dialog"
      max-width="600px"
      @click:outside="close()"
    >
      <v-card
        class="mx-auto"
        max-width="600"
      >

        <div
          v-if="this.images != null"
          class="image-container"
        >
          <v-img
            v-if="this.images.length === 0"
            :src="$store.getters.noimage_url('600x400')"
            aspect-ratio="1.5"
            contain
            
          ></v-img>
          <v-img
            class="crop-width-only"
            v-if="this.images.length === 1"
            :src="$store.getters.image_url(item.item_id, this.images[0], '600x400')"
            aspect-ratio="1.5"
            contain
          ></v-img>

          <v-carousel
            v-else
            hide-delimiters
            height="auto"
          >
            <v-carousel-item
              v-for="(image_id,i) in this.images"
              :key="i"
            >
              <v-img
                :src="$store.getters.image_url(item.item_id, image_id, '600x400')"
                aspect-ratio="1.5"
                contain
              ></v-img>
            </v-carousel-item>
          </v-carousel>
        </div>
        <div v-else>
          <v-img
            src="@/assets/images/progress_indicator.gif"
            aspect-ratio="1.5"
            contain
          ></v-img>
        </div>
        <v-row class="ma-0">
          <v-col
            cols="auto"
            class="pa-0"
          >
            <v-card-title class="pb-0 text-caption">
              {{ item.title }}
            </v-card-title>
            <v-card-subtitle class="pb-0 pt-3">{{ $store.getters.category_name(item.category_id) }}</v-card-subtitle>
          </v-col>
          <v-spacer></v-spacer>
          <v-col
            cols="auto"
            v-if="item.on_loan"
            class="pt-4"
            align="center"
            justify="center"
          >

            <v-chip
              color="red"
              dark
            >Utlånt</v-chip>
            <v-row
              class="ma-0 pa-0 pb-0 caption"
              justify="center"
            >
              <div v-if="$store.getters.loans_by_id.includes(item.item_id)">til deg</div>
              <div v-else-if="item.loaned_to_name">
                til {{ item.loaned_to_name}}
              </div>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="ma-0 mt-3">
          <v-col
            cols="12"
            class="pa-0"
          >
            <v-card-text class="pt-0">
              {{ item.description}}
            </v-card-text>
          </v-col>
        </v-row>
        <v-card-actions>

          <div v-if="$store.getters.user_id !== item.owner">
            <v-avatar
              size="36px"
              class="ma-2"
            >
              <img
                :src="$store.getters.person_avatar_url(item.owner,'36x36')"
                @error="$event.target.src = $store.getters.noavatar_url('36x36')"
              >
            </v-avatar>
            <span class="caption"> {{ item.first_name }} </span>
          </div>
          <v-spacer></v-spacer>

          <v-dialog
            v-model="delete_dialog"
            v-if="$store.getters.user_id == item.owner"
            persistent
            max-width="290"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                color="accent"
                dark
                v-on="on"
                :small="$vuetify.breakpoint.xsOnly"
              >Slett</v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">Sikker?</v-card-title>
              <v-card-text>Hvis du klikker på "slett" forsvinner denne fra systemet for godt.</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  @click="delete_dialog = false"
                  dark
                  :small="$vuetify.breakpoint.xsOnly"
                >Avbryt</v-btn>
                <v-btn
                  color="accent"
                  @click="delete_dialog = false; delete_item()"
                  dark
                  :small="$vuetify.breakpoint.xsOnly"
                >Slett</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn
            v-if="$store.getters.user_id == item.owner"
            color="orange"
            @click="edit_item"
            dark
            :small="$vuetify.breakpoint.xsOnly"
          >Rediger</v-btn>
          <v-btn
            color="primary"
            @click="close"
            :small="$vuetify.breakpoint.xsOnly"
          >Lukk</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  name: 'ItemDialog',
  data () {
    return {
      delete_dialog: false,
      images: null,
      loading: false
    }
  },
  props: {
    item: {
      default: null
    },
    type: String,
    item_dialog: {
      default: false
    }
  },
  watch: {
    item_dialog: function () {
      this.refresh_images()
    }
  },
  methods: {
    close () {
      this.images = null
      this.$emit('update:item_dialog', false)
    },
    edit_item () {
      this.$emit('update:item_dialog', false)
      this.$emit('edit_item')
    },
    delete_item () {
      this.$emit('update:item_dialog', false)
      this.$emit('delete_item')
    },
    refresh_images () {
      if (this.item_dialog === true) {
        const item_id = this.item.item_id
        this.loading = true
        this.$api.get('items/' + item_id + '/images')
          .then(result => {
            this.images = result.data
            this.loading = false
          })
      }
    }
  },
  mounted () {
    this.refresh_images()
  }
}

</script>

<style>
/* .image-container {
  width: auto;
  height: auto;
  text-align: center;
  overflow: hidden;
  
}
.crop-width-only {
  width: 100%;
  height: auto;
  object-fit: cover;
} */
</style>