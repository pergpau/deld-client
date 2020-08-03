<template>
  <div>
    <v-dialog
      v-model="edit_dialog"
      max-width="600px"
      v-if="local_item"
      @click:outside="$emit('update:edit_dialog', false)"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ form_title }}</span>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
          >

            <v-select
              :items="item_types"
              v-model="local_item.item_type"
              label="Hovedkategori"
              outlined
            ></v-select>

            <v-select
              :items="filtered_categories"
              v-model="local_item.category_id"
              :rules="category_rules"
              label="Kategori"
              item-value='id'
              item-text='text'
              outlined
            ></v-select>
            <v-text-field
              text
              label="Tittel"
              v-model="local_item.title"
              outlined
              :rules="title_rules"
            >
            </v-text-field>

            <v-text-field
              v-if="local_item.item_type == 'book'"
              text
              label="Forfatter"
              v-model="local_item.author"
              outlined
            >
            </v-text-field>
            <div
              class="text-center"
              v-if="local_item.item_type == 'book'"
            >
              Rating: {{local_item.rating}}
              <v-rating
                class="pb-5"
                v-model="local_item.rating"
                color="yellow darken-3"
                background-color="grey darken-1"
                empty-icon="$ratingFull"
                half-increments
              >{{local_item.rating}}</v-rating>

            </div>
            <v-textarea
              text
              label="Beskrivelse"
              v-model="local_item.description"
              outlined
            >
            </v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="image_dialog"
            max-width="600px"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                @click="image_dialog_key += 1"
                color="primary"
                :small="$vuetify.breakpoint.xsOnly"
              > Bilder</v-btn>
            </template>
            <image-upload
              :image_dialog.sync="image_dialog"
              :key="image_dialog_key"
              :item="item"
              @set-files="set_files"
            ></image-upload>
          </v-dialog>
          <v-btn
            color="red"
            dark
            @click.stop="close()"
            :small="$vuetify.breakpoint.xsOnly"
          >Avbryt</v-btn>
          <v-btn
            color="green"
            :dark="valid"
            @click="save()"
            :small="$vuetify.breakpoint.xsOnly"
            :loading="loading"
            :disabled="!valid"
          >Lagre</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ImageUpload from './ImageUpload.vue'
import api from '../services/api.js'

export default {
  name: 'EditDialog',
  data () {
    return {
      local_item: JSON.parse(JSON.stringify(this.item)),
      categories: [],
      item_types: [
        { text: 'Ting', value: 'thing', id: 1 },
        { text: 'Bok', value: 'book', id: 2 },
        { text: 'Kunnskap', value: 'skill', id: 3 }
      ],
      image_dialog: false,
      upload_files: [],
      delete_files: [],
      loading: false,
      image_dialog_key: 0,
      valid: false,
      category_rules: [
        v => !!v || 'Du må velge en kategori'
      ],
      title_rules: [
        v => !!v || 'Du må skrive en tittel'
      ],
    }
  },
  components: {
    'image-upload': ImageUpload
  },
  props: {
    item: Object,
    value: Boolean,
    form_title: String,
    edit_dialog: {
      default: false
    },
    current_index: Number,

  },
  methods: {
    async save () {
      if (this.$refs.form.validate()) {
        if (this.current_index > -1) {
          this.$store.dispatch('update_item', { old: this.item, new: this.local_item })
          this.upload_images(this.item.item_id)
            .then(() => {
              this.delete_images(this.item.item_id)
              if (this.upload_files.length > 0 || this.delete_files.length > 0) {
                this.loading = true
                setTimeout(() => {
                  this.close()
                }, 3000);
              } else {
                this.close()
              }
            })

        } else {
          await this.$store.dispatch('push_new_item', this.local_item)
            .then(res => {
              const item_id = res.data.item_id
              this.upload_images(item_id)
                .then(() => {
                  if (this.upload_files.length > 0) {
                    this.loading = true
                    setTimeout(() => {
                      this.close()                    }, 3000);
                  } else {
                    this.close()
                  }
                })
            })
        }
      }
    },
    async upload_images (item_id) {
      if (this.upload_files.length > 0) {

        let formData = new FormData()
        for (let i = 0; i < this.upload_files.length; i++) {
          formData.append('files[' + i + ']', this.upload_files[i])
        }
        api.post('/items/' + item_id + '/upload_images', formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
      }
    },
    delete_images (item_id) {
      if (this.delete_files.length > 0) {
        api.post('items/' + item_id + '/delete_images', this.delete_files)
          .then((res) => {
            console.log('Deleted images:', res.data)
          })
      }
    },
    close () {
      this.$emit('update:edit_dialog', false)
      this.loading = false
      this.upload_files = []
      this.delete_files = []
    },
    set_files (upload_files, delete_files) {
      this.upload_files = upload_files
      this.delete_files = delete_files
    }
  },
  watch: {
    item: {
      immediate: true,
      deep: true,
      handler () {
        this.local_item = JSON.parse(JSON.stringify(this.item))
      }
    }
  },
  computed: {
    filtered_categories: function () {
      let filtered = []
      this.item_types.forEach(item_type => {
        if (item_type.value == this.local_item.item_type) {
          filtered = this.categories.filter(function (category) { return category.parent_id == item_type.id })
        }
      })
      return filtered
    }
  },
  mounted () {
    this.categories = this.$store.getters.category_list
  }
}

</script>