<template>
  <v-container>
    <v-row>
      <v-col align="center">
        <v-btn
          :small="$vuetify.breakpoint.xsOnly"
          class="mx-2"
          rounded
          :color="current_category === 'thing' ? 'accent' : 'primary'"
          @click="search('thing')"
        >Ting</v-btn>
        <v-btn
          :small="$vuetify.breakpoint.xsOnly"
          class="mx-2"
          rounded
          :color="current_category === 'book' ? 'accent' : 'primary'"
          @click="search('book')"
        >Bøker</v-btn>
        <v-btn
          :small="$vuetify.breakpoint.xsOnly"
          class="mx-2"
          rounded
          :color="current_category === 'skill' ? 'accent' : 'primary'"
          @click="search('skill')"
        >Kunnskap</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        align="center"
        v-if="current_category"
      >
        <v-btn
          v-if="current_category !== 'skill'"
          :small="$vuetify.breakpoint.xsOnly"
          class="mx-2"
          rounded
          :color="available ? 'accent' : 'primary'"
          @click="available ? available = false : available = true"
        >
          Ledig
          <v-icon right v-if="available" small>mdi-check-circle-outline</v-icon>
          <v-icon right v-if="!available" small>mdi-checkbox-blank-circle-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div v-if="current_category !== null">
          <v-text-field
            v-model="search_query"
            append-icon="mdi-magnify"
            label="Søk etter beskrivelser eller eiere"
            single-line
            hide-details
            clearable
          ></v-text-field>
          <item-overview
            v-bind:rows="filtered_items"
            v-bind:headers="headers"
            :search.sync="search_query"
            type="items"
          ></item-overview>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import ItemOverview from '../components/ItemOverview'

export default {
  name: 'Search',
  data () {
    return {
      search_query: '',
      current_category: null,
      headers: [
        { text: 'Kategori', value: 'category_id', align: 'start', width: "15%" },
        { text: 'Navn', value: 'title', width: "10%" },
        { text: 'Beskrivelse', value: 'description', width: "50%" },
        { text: 'Eier', value: 'first_name', width: "10%" },
        { text: 'Status', value: 'on_loan', width: "15%" },
      ],
      search_results: [],
      available: false
    }
  },
  components: {
    'item-overview': ItemOverview
  },
  // TODO: Effektivisere denne
  methods: {
    search (category) {
      this.current_category = category
      this.$api.get('/search')
        .then(res => {
          this.search_results = res.data.filter(item => item.item_type === category)
        })
    }

  },
  computed: {
    filtered_items () {
      let filtered_items = this.search_results
      if (this.available === true) {
        filtered_items = filtered_items.filter(item => item.on_loan === false)
      }
      return filtered_items
    }
  },
  mounted () {

  }
}

</script>