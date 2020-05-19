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
        <v-img
          src="https://placeimg.com/400/200/tech"
          aspect-ratio="2"
        >
        </v-img>
        <v-row class="ma-0">
          <v-col
            cols="auto"
            class="pa-0"
          >
            <v-card-title class="pb-0">
              {{ item.title }}
            </v-card-title>
            <v-card-subtitle class="pb-0 pt-3">{{ $store.getters.category_name(item.category_id) }}</v-card-subtitle>
          </v-col>
          <v-spacer></v-spacer>
          <v-col
            cols="auto"
            class="pa-0"
            v-if="item.on_loan"
          >
            <v-row
              class="ma-0 pa-4 pb-0"
              justify="end"
            >
              <v-chip
                color="red"
                dark
              >Utlånt</v-chip>
            </v-row>
            <v-row
              class="ma-0 pa-0 pb-0 caption"
              justify="center"
            >
              <div v-if="item.loaned_to_name">
                til {{ item.loaned_to_name}}
              </div>
              <div v-if="$store.getters.loans_by_id.includes(item.item_id)">til deg</div>
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
          <v-spacer></v-spacer>

          <v-dialog
            v-model="delete_dialog"
            persistent
            max-width="290"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="$store.getters.user_id == item.owner"
                color="red"
                dark
                v-on="on"
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
                >Avbryt</v-btn>
                <v-btn
                  color="red"
                  @click="delete_dialog = false; delete_item()"
                  dark
                >Slett</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn
            v-if="$store.getters.user_id == item.owner"
            color="orange"
            @click="edit_item"
            dark
          >Rediger</v-btn>
          <v-btn
            color="primary"
            @click="close"
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
      delete_dialog: false
    }
  },
  props: {
    item: Object,
    type: String,
    item_dialog: {
      default: false
    }
  },
  methods: {
    close () {
      this.$emit('update:item_dialog', false)
    },
    edit_item () {
      this.$emit('update:item_dialog', false)
      this.$emit('edit_item')
    },
    delete_item () {
      this.$emit('update:item_dialog', false)
      this.$emit('delete_item')
    }
  },
  mounted () {

  }
}

</script>