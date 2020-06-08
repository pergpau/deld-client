<template>
  <v-container
    fluid
    class="pa-0"
    style="background:#648cff"
  >
    <v-row class="ma-0" align="center" justify="center">
      <v-col
        sm=12
        md=12
        lg=8
        xl=6
        class="pa-0"
      >
        <v-app-bar
          color="primary"
          dark
          clipped-left
          flat
        >
          <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
            class="hidden-md-and-up"
          >
          </v-app-bar-nav-icon>
          <v-toolbar-title
            class="display-1 font-weight-bold"
            style="cursor: pointer"
            @click="goHome"
          >
            Del-D
          </v-toolbar-title>
          <v-spacer>
          </v-spacer>
          <div class="hidden-sm-only hidden-xs-only">
            <v-btn
              v-for="item in activeMenuItems()"
              :key="item.title"
              :to="item.route"
              @click="item.action ? handleFunctionCall(item.action) : ''; drawer = false"
              text
            >

              <v-icon
                left
                dark
              >{{ item.icon }}</v-icon>
              {{ item.title }}
            </v-btn>
          </div>
          <div v-if="this.$store.getters.isLoggedIn">
            <v-menu
              right
              :close-on-click="closeOnClick"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  v-on="on"
                  class="pr-0"
                >
                  {{ showName}}
                  <v-avatar
                    right
                    size="36px"
                    class="ml-2"
                  >
                    <img :src="showAvatar">
                  </v-avatar>
                </v-btn>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item) in user_items"
                  :key="item.title"
                  :to="item.route"
                  @click="item.action ? handleFunctionCall(item.action) : ''"
                >

                  <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

        </v-app-bar>
        <v-navigation-drawer
          v-model="drawer"
          app
          temporary
          class="primary"
          dark
        >
          <v-list>

            <v-list-item
              v-for="item in activeMenuItems(all=true)"
              :key="item.title"
              :to="item.route"
              @click="item.action ? handleFunctionCall(item.action) : ''; drawer = false"
              link
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>

export default {
  name: 'Navbar',
  data () {
    return {
      drawer: false,
      closeOnClick: true,
      nav_items: [
        { title: 'Søk', icon: 'mdi-magnify', route: '/search', showLoggedIn: true },
        /* { title: 'Del', icon: 'mdi-briefcase-plus', route: '/share', showLoggedIn: true }, */
        { title: 'Oversikt', icon: 'mdi-clipboard-text', route: '/dashboard', showLoggedIn: true },
        { title: 'Tillit', icon: 'mdi-account-group', route: '/trust', showLoggedIn: true },
        { title: 'Registrer', icon: 'mdi-account-plus', route: '/signup', showLoggedIn: false },
        { title: 'Logg inn', icon: 'mdi-login', route: '/login', showLoggedIn: false },
      ],
      user_items: [
        { title: 'Profil', icon: 'mdi-account-circle', route: '/profile', showLoggedIn: true },
        { title: 'Logg ut', icon: 'mdi-logout', action: 'logout', showLoggedIn: true },
      ]
    }
  },
  methods: {
    handleFunctionCall (function_name) {
      this[function_name]()
    },
    logout: function () {
      console.log("logging out")
      this.$api.post('/logout')
        .then(() => {
          this.$store.dispatch('logout')
            .then(() => {
              this.$router.push('/')
            })
        }
        )
    },
    goHome: function () {
      this.$router.push('/').catch(() => { })
    },
    activeMenuItems: function (all = false) {
      let new_array = this.nav_items
      if (this.$store.getters.isLoggedIn) {
        if (all) {
          new_array = new_array.concat(this.user_items)
        }
        return new_array.filter(item => {
          return item.showLoggedIn
        })
      } else {
        return new_array.filter(item => {
          return !item.showLoggedIn
        })
      }
    },
  },
  computed: {

    showName: function () {
      return this.$store.state.user.first_name
    },
    showAvatar: function () {
      return this.$store.state.user.avatar_url
    }
  }
}
</script>