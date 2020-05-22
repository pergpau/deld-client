<template>
  <div>
    <v-row>
      <v-col
        cols=12
        class="ma-0 pa-0"
      >
        <v-tabs
          v-model="tab"
          centered
          grow
        >
          <v-tab
            v-for="category in categories"
            :key="category"
            class="font-weight-bold"
          >
            {{ category }}
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        sm=6
        xs=12
        class="pa-0 ma-0"
        v-if="tab == 0"
      >
        <v-tabs
          v-model="sub_tab"
          centered
          grow
        >
          <v-tab
            v-for="sub_category in sub_categories"
            :key="sub_category"
            class="font-weight-bold"
          >
            {{ sub_category }}
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>
    <v-row class="ma-0">
      <v-col cols=12>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-tabs-items v-model="sub_tab">
              <v-tab-item>
                <item-overview
                  v-bind:rows="this.$store.getters.user_things"
                  v-bind:headers="getCurrentHeaders"
                  v-bind:editable="true"
                  item_type="thing"
                ></item-overview>

              </v-tab-item>
              <v-tab-item>
                <item-overview
                  v-bind:rows="this.$store.getters.user_books"
                  v-bind:headers="getCurrentHeaders"
                  v-bind:editable="true"
                  item_type='book'
                ></item-overview>
              </v-tab-item>
              <v-tab-item>
                <item-overview
                  v-bind:rows="this.$store.getters.user_skills"
                  v-bind:headers="getCurrentHeaders"
                  v-bind:editable="true"
                  item_type='skill'
                ></item-overview>
              </v-tab-item>
            </v-tabs-items>
          </v-tab-item>
          <v-tab-item>
            <item-overview
              v-bind:rows="this.$store.getters.loans"
              v-bind:headers="headers_loans"
              v-bind:loan_status="false"
            ></item-overview>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>

  </div>
</template>

<script>

import ItemOverview from '../components/ItemOverview'

export default {
  name: 'Dashboard',
  data () {
    return {
      tab: null,
      sub_tab: 0,
      dialog: false,
      categories: ['mine ting', 'lån'],
      sub_categories: ['ting', 'bøker', 'kunnskap'],
      item_headers: [
        { text: 'Kategori', value: 'category_id', align: 'start', width: "1%" },
        { text: 'Ting', value: 'title', width: "1%" },
        { text: 'Beskrivelse', value: 'description', width: "80%" },
        { text: 'Status', value: 'on_loan', width: "1%" },
        { text: 'Lånt til', value: 'loaned_to_name', width: "10%" },
        { text: 'Sist utlånt', value: 'last_loaned_date', width: "1%" },
      ],
      book_headers: [
        { text: 'Kategori', value: 'category_id', align: 'start' },
        { text: 'Tittel', value: 'title' },
        { text: 'Forfatter', value: 'author' },
        { text: 'Beskrivelse', value: 'description' },
        { text: 'Rating', value: 'rating' },
        { text: 'Status', value: 'on_loan' },
        { text: 'Lånt til', value: 'loaned_to_name' },
        { text: 'Sist utlånt', value: 'last_loaned_date' },
      ],
      skill_headers: [
        { text: 'Kategori', value: 'category_id', align: 'start' },
        { text: 'Tittel', value: 'title' },
        { text: 'Beskrivelse', value: 'description' },
      ],
      headers_loans: [
        { text: 'Kategori', value: 'category_id', align: 'start' },
        { text: 'Ting', value: 'title' },
        { text: 'Beskrivelse', value: 'description' },
        { text: 'Lånt fra', value: 'loaned_from_name' },
        { text: 'Lånedato', value: 'last_loaned_date' },
      ],
    }
  },
  components: {
    'item-overview': ItemOverview
  },
  computed: {
    getCurrentHeaders () {
      if (this.sub_tab == 0) {
        return this.item_headers
      }
      if (this.sub_tab == 1) {
        return this.book_headers
      }
      if (this.sub_tab == 2) {
        return this.skill_headers
      } 
      return []
    }
  },
  mounted () {
    this.$store.dispatch('get_user_items')
    this.$store.dispatch('get_user_loans')
  }
}

</script>