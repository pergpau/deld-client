<template>
  <div>
    <v-dialog
      v-model="edit_dialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ form_title }}</span>
        </v-card-title>
        <v-card-text>
          <v-select
            :items="item_types"
            v-model="local_item.item_type"
            label="Hovedkategori"
            outlined
          ></v-select>

          <v-select
            :items="categories"
            v-model="local_item.category_id"
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

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            dark
            @click.stop="close()"
          >Avbryt</v-btn>
          <v-btn
            color="green"
            dark
            @click="save()"
          >Lagre</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  name: 'EditDialog',
  data () {
    return {
      local_item: JSON.parse(JSON.stringify(this.item)),
      categories: [],
      item_types: [
        { text: 'Ting', value: 'thing' },
        { text: 'Bok', value: 'book' },
        { text: 'Kunnskap', value: 'skill' }
      ],
    }
  },
  props: {
    item: Object,
    value: Boolean,
    form_title: String,
    edit_dialog: {
      default: false
    },
    current_index: Number
  },
  methods: {
    save: function () {
      if (this.current_index > -1) {
        this.$store.dispatch('update_item', {old: this.item, new: this.local_item})
      } else {
        this.$store.dispatch('push_new_item', this.local_item)
      }
      this.local_item = { item_type: this.local_item.item_type }
      this.$emit('update:edit_dialog', false)
    },
    close () {
      this.$emit('update:edit_dialog', false)
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
  mounted () {
    this.categories = this.$store.getters.category_list
  }
}

</script>