<template>
  <div>
    <v-dialog
      v-model="edit_dialog"
      max-width="500px"
      v-if="local_item"
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
            :items="filtered_categories"
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
        { text: 'Ting', value: 'thing', id: 1},
        { text: 'Bok', value: 'book', id: 2},
        { text: 'Kunnskap', value: 'skill', id: 3}
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
  computed: {
    filtered_categories: function () {
      let filtered = []
      this.item_types.forEach(item_type => {
        if (item_type.value == this.local_item.item_type) {
          filtered = this.categories.filter(function(category) {return category.parent_id == item_type.id})
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