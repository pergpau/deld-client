<template>
  <div>
    <v-card>
      <v-card-title>
        Bilder
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col
            cols=12
            class="pa-0"
            dense
          >
            <v-form ref="upload_form">
              <v-file-input
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Velg ett eller flere bilder"
                prepend-icon="mdi-camera"
                label="Nye bilder"
                multiple
                @change="on_file_change"
                @click:clear="clear"
                ref="files"
              >
                <template v-slot:selection="{ text }">
                  <v-chip
                    small
                    label
                    color="primary"
                  >
                    {{ text }}
                  </v-chip>
                </template>
              </v-file-input>
            </v-form>
          </v-col>
          <v-col
            cols=12
            align="center"
            class="mb-5"
          >
           <v-btn
           class="mr-2"
              :small="$vuetify.breakpoint.xsOnly"
              color="accent"
              @click="close()"
              right
            >
              Avbryt
            </v-btn>
            <v-btn
              v-if="updates"
              :small="$vuetify.breakpoint.xsOnly"
              color="primary"
              @click="save()"
              right
            >
              Lagre
            </v-btn>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col
            v-for="(image_id,i) in current_images"
            :key=i
            cols=12
            sm=6
            md=3
          >
            <v-img
              :src="$store.getters.image_url(item.item_id, image_id, '450x300')"
              max-height="300px"
              max-widht="200px"
              contain
            >
              <v-btn
                class="mt-6"
                fab
                dark
                x-small
                absolute
                top
                right
                color="accent"
                @click="remove_current_image(i)"
              >
                <v-icon dark>mdi-delete</v-icon>
              </v-btn>
            </v-img>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col
            v-for="(image,i) in upload_files"
            :key=i
            cols=12
            sm=6
            md=3
          >
            <v-img
              :src="preview_urls[i]"
              max-height="300px"
              max-widht="200px"
              contain
            >
              <v-btn
                class="mt-6"
                fab
                dark
                x-small
                absolute
                top
                right
                color="accent"
                @click="remove_new_image(i)"
              >
                <v-icon dark>mdi-delete</v-icon>
              </v-btn>
            </v-img>
          </v-col>
        </v-row>

      </v-card-text>

    </v-card>

  </div>
</template>

<script>
/* import api from '../services/api.js' */

export default {
  name: 'ImageUpload',
  data () {
    return {
      /*  rules: [
         value => !value || value.size < 20000000 || 'Avatar size should be less than 2 MB!',
       ], */
      upload_files: [],
      current_images: [],
      delete_images: [],
      updates: false
    }
  },
  props: {
    item: Object
  },
  methods: {
    on_file_change (new_files) {
      this.upload_files = []
      if (new_files) {
        new_files.forEach(file => {
          this.upload_files.push(file)
        })
        this.updates = true
      }
    },
    clear () {
      this.upload_files = []
    },
    close () {
      this.$emit('update:image_dialog', false)
      this.$refs.upload_form.reset()
      this.updates = false
      this.delete_images = []
      this.clear()
    },
    save () {
      this.$emit('set-files', this.upload_files, this.delete_images)
      this.close()
    },
    remove_current_image (index) {
      this.delete_images.push(this.current_images[index])
      this.current_images.splice(index, 1)
      this.updates = true
    },
    remove_new_image (index) {
      this.upload_files.splice(index, 1)
      this.$refs.files.initialValue.splice(index, 1)
    },
    refresh_images () {
      if (this.item.item_id) {
        const item_id = this.item.item_id
        this.$api.get('items/' + item_id + '/images')
          .then(result => {
            this.current_images = result.data
          })
      }
    }
  },
  computed: {
    preview_urls () {
      let urls = []
      this.upload_files.forEach(file => {
        urls.push(URL.createObjectURL(file))
      })
      return urls
    }
  },
  mounted () {
    this.refresh_images()
  }
}

</script>