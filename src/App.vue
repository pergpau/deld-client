<template>
  <v-app>
    <Navbar></Navbar>
    <v-container
      fluid
      class="pa-0 ma-0"
    >
      <v-row
        align="center"
        justify="center"
        no-gutters
      >
        <v-col
          sm=12
          md=12
          lg=8
          xl=6
          class="ma-0 px-0"
        >
          <v-content>
            <router-view />
          </v-content>
        </v-col>
      </v-row>
    </v-container>
  </v-app>

</template>



<script>

import Navbar from './components/Navbar'

export default {
  name: 'App',
  components: {
    Navbar
  },
  data () {
    return {
      //
    }
  },
  mounted () {
    if (this.$store.getters.isLoggedIn && !this.$store.state.categories) {
      this.$store.dispatch('set_categories')
    }

  }

}
</script>