<template>
  <div>
    <div
      v-if="editable"
      align="right"
    >
      <v-btn
        color="primary"
        dark
        justify="right"
        class="mb-3 mr-3 hidden-xs-only"
        @click.stop="new_item"
      >Legg til</v-btn>
      <v-btn
      class="hidden-sm-and-up"
        color="primary"
        dark
        small
        fixed
        bottom
        right
        fab
        @click.stop="new_item"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <edit-dialog
        v-if="current_item"
        :edit_dialog.sync="edit_dialog"
        v-bind:form_title="form_title"
        v-bind:item="current_item"
        v-bind:current_index="current_index"
        @outside_click="edit_dialog = false"
      ></edit-dialog>
    </div>
    <v-data-table
      ref="p"
      v-bind="$attrs"
      class="hidden-xs-only truncate"
      :headers="headers"
      :items="rows"
      :sort-desc="[false, true]"
      @click:row="open_item"
      :footer-props="{itemsPerPageText: 'Treff per side'}"
      no-results-text="Ingen treff"
    >
      <template v-slot:no-data>
        Ingen data å vise
      </template>

      <template v-slot:item.category_id="{ item }">
        <span>{{ $store.getters.category_name(item.category_id) }}</span>
      </template>
      <template v-slot:item.description="{ item }">
        <div class="truncated">{{ truncate(item.description)}}</div>
      </template>
      <template v-slot:item.rating="{ item }">
        <v-rating
          v-model="item.rating"
          background-color="white"
          color="yellow accent-4"
          half-increments
          dense
          readonly
          x-small
        ></v-rating>
      </template>
      <template v-slot:item.on_loan="{ item }">
        <v-chip
          v-if="item.on_loan"
          color="accent"
          dark
          small
        >Utlånt</v-chip>
      </template>
      <template v-slot:item.last_loaned_date="{ item }">
        <span v-if="item.last_loaned_date">{{ new Date(item.last_loaned_date).toLocaleDateString("nb-NO", $store.getters.date_options) }}</span>
      </template>

    </v-data-table>

    <item-dialog
      v-if="item_dialog"
      :item_dialog.sync="item_dialog"
      v-bind:item="current_item"
      v-bind:current_index="current_index"
      @edit_item="edit_item"
      @delete_item="delete_item"
      @outside_click="item_dialog = false"
    ></item-dialog>

    <v-list
      two-line
      class="hidden-sm-and-up"
    >
      <template v-for="(item, index) in rows">
        <v-list-item
          :key="item.title"
          @click="open_item(item)"
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
            <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>

          </v-list-item-content>

          <v-list-item-action>
            <v-chip
              small
              v-if="item.on_loan && loan_status == true"
              color="red"
              dark
            >Utlånt</v-chip>

          </v-list-item-action>

        </v-list-item>
        <v-divider :key="index"></v-divider>
      </template>
    </v-list>

  </div>

</template>

<script>

import EditDialog from '../components/EditDialog'
import ItemDialog from '../components/ItemDialog'

export default {
  name: 'ItemOverview',
  data () {
    return {
      edit_dialog: false,
      item_dialog: false,
      form_title: '',
      current_index: -1,
      current_item: null
    }
  },
  props: {
    editable: {
      default: false,
      type: Boolean
    },
    headers: Array,
    rows: Array,
    loan_status: {
      default: true,
      type: Boolean
    },
    item_type: String,
  },
  components: {
    'edit-dialog': EditDialog,
    'item-dialog': ItemDialog
  },
  methods: {
    truncate (str) {
      if (str.length < 65) return str
      if (screen.width > 1500) {
        return str.slice(0, screen.width / 9) + '...'
      } else {
        return str.slice(0, screen.width / 12) + '...'
      }
    },
    new_item () {
      this.current_index = -1
      this.current_item = { item_type: this.item_type }
      this.form_title = 'Ny'
      this.edit_dialog = true
    },
    edit_item () {
      this.form_title = 'Rediger'
      this.edit_dialog = true
    },
    delete_item () {
      this.$store.dispatch('delete_item', this.current_item)
    },
    open_item (item) {
      this.current_index = this.rows.indexOf(item)
      this.current_item = item
      this.item_dialog = true
    },
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Ny' : 'Endre'
    },
  },

  mounted () {

  }
}

</script>