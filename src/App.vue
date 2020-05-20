<template>
  <v-app>
    <Navbar></Navbar>
    <v-content>
      <v-container fluid>
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            lg="8"
            md="10"
            sm="12"
          >
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
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