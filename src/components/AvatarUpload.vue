<template>
  <div>
    <v-card>
      <v-card-title>
        Last opp bilde
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
                placeholder="Velg et profilbilde"
                prepend-icon="mdi-camera"
                label="Profilbilde"
                @click:clear="clear"
                @change="on_file_change"
                :rules=rules
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
              v-if="file != null"
              :small="$vuetify.breakpoint.xsOnly"
              color="primary"
              @click="upload_image()"
              right
              :loading="loading"
            >
              Last opp
            </v-btn>

          </v-col>
        </v-row>
        <cropper
          classname="cropper"
          :src="preview_url"
          :stencil-props="{ aspectRatio: 1/1 }"
          :stencil-component="$options.components.CircleStencil"
          ref="cropper"
        ></cropper>
      </v-card-text>

    </v-card>

  </div>
</template>

<script>
import api from '../services/api.js'
import { CircleStencil, Cropper } from 'vue-advanced-cropper'  /* eslint-disable vue/no-unused-components */

export default {
  name: 'AvatarUpload',
  data () {
    return {
      rules: [
        value => !value || value.size < 2000000 || 'Bildet må være mindre enn 2 MB!',
      ],
      loading: false,
      file: null
    }
  },
  components: {
    Cropper, CircleStencil
  },
  methods: {
    on_file_change (file) {
      if (this.$refs.upload_form.validate()) {
        file ? this.file = file : this.file = null
      }
    },
    clear () {
      this.file = null
      this.loading = false
    },
    close () {
        this.$store.dispatch('update_avatar_random')
        this.$refs.upload_form.reset()
        this.$emit('update:avatar_dialog', false)
        this.clear()
    },
    upload_image () {
      if (this.file != null) {
        this.loading = true
        let formData = new FormData()
        const { canvas } = this.$refs.cropper.getResult()
        canvas.toBlob(blob => {
          formData.append('avatar', blob)
          api.post('/upload/avatar', formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
            .then(() => {
              setTimeout(() => {
                this.close()              }, 5000);
            })
        })
      }
    }
  },
  computed: {
    preview_url () {
      if (this.file != null) {
        return URL.createObjectURL(this.file)
      }
      return null
    }
  },
}

</script>