<template>
  <v-container>
    <h1 class="pb-3">Søk</h1>
    <v-spacer></v-spacer>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Søk her"
      single-line
      hide-details
    ></v-text-field>
    <item-overview
      v-bind:rows="search_results"
      v-bind:headers="headers"
      :search.sync="search"
      type="items"
    ></item-overview>
  </v-container>
</template>

<script>

import ItemOverview from '../components/ItemOverview'

export default {
  name: 'Search',
  data () {
    return {
      search: '',
      headers: [
        { text: 'Kategori', value: 'category_id', align: 'start', width: "15%"},
        { text: 'Ting', value: 'title', width: "10%" },
        { text: 'Beskrivelse', value: 'description', width: "55%" },
        { text: 'Eier', value: 'first_name', width: "10%" },
        { text: 'Status', value: 'on_loan', width: "10%" },
      ],
      search_results: []
    }
  },
  components: {
    'item-overview': ItemOverview
  },
  methods: {
  },
  mounted () {
    this.$api.get('/search')
      .then(res => {
        this.search_results = res.data
      })
  }
}

</script>