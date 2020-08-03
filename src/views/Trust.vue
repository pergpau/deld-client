<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn
          color="primary"
          dark
          justify="left"
          class="mb-2"
          @click.stop="new_trust"
        >Stol på ny person</v-btn>
        <trust-dialog
          :trust_dialog.sync="trust_dialog"
          v-bind:user_trusts="user_trusts_circle1"
          v-bind:add_user="add_user"
          @outside_click="trust_dialog = false"
          @add_trust="add_trust"
        ></trust-dialog>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-slider
          v-model="circles"
          label="Tillitssirkel"
          :tick-labels="['1','2','3']"
          max="3"
          min="1"
          step="1"
          ticks="always"
          tick-size="4"
        ></v-slider>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card class="mx-auto">
          <v-dialog
            v-model="delete_trust_dialog"
            persistent
            max-width="290"
          >
            <v-card>
              <v-card-title class="headline">Sikker?</v-card-title>
              <v-card-text>Klikker du slett vil ikke personen lenger kunne se dine ting</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  @click="delete_trust_dialog = false"
                  dark
                >Avbryt</v-btn>
                <v-btn
                  color="red"
                  @click="delete_trust_dialog = false; delete_trust(delete_trusted_user)"
                  dark
                >Slett</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-list>
            <v-card-title class="headline">Jeg stoler på {{ user_trusts_by_circle.length}} personer</v-card-title>
            <v-list-item
              v-for="person in user_trusts_by_circle"
              :key="person.first_name"
            >
              <v-list-item-avatar>
                   <img :src="$store.getters.person_avatar_url(person.user_id,'36x36')" @error="$event.target.src = $store.getters.noavatar_url('36x36')">
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="person.first_name + ' ' + person.last_name">
                </v-list-item-title>

              </v-list-item-content>
              <v-list-item-action
                class="ma-0"
                v-if="user_trusts.some(user => user.user_id === person.user_id && user.circle == 1)"
              >
                <v-btn
                  icon
                  @click="delete_trust_dialog = true; delete_trusted_user = person.user_id"
                >
                  <v-icon color="red">
                    mdi-account-remove
                  </v-icon>
                </v-btn>

              </v-list-item-action>

            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col class="sm=6 xs=12">
        <v-card class="mx-auto">
          <v-list>
            <v-card-title class="headline">{{ trusts_users_by_circle.length}} personer stoler på meg</v-card-title>
            <v-list-item
              v-for="person in trusts_users_by_circle"
              :key="person.first_name"
            >
              <v-list-item-avatar>
                <img :src="$store.getters.person_avatar_url(person.user_id,'36x36')" @error="$event.target.src = $store.getters.noavatar_url('36x36')">
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="person.first_name + ' ' + person.last_name"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action
                class="ma-0"
                v-if="!user_trusts.some(user => user.user_id === person.user_id && user.circle == 1)"
              >
                <v-btn
                  icon
                  @click="trust_dialog = true; add_user = person"
                >
                  <v-icon color="green">
                    mdi-account-plus
                  </v-icon>
                </v-btn>
              </v-list-item-action>

            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TrustDialog from '../components/TrustDialog'
import { mapState } from 'vuex'

export default {
  name: 'Trust',
  data () {
    return {
      user_trusts: [],
      trusts_user: [],
      add_user: null,
      trust_dialog: false,
      delete_trust_dialog: false,
      delete_trusted_user: null,
      circles: 1
    }
  },
  components: {
    'trust-dialog': TrustDialog,
  },
  methods: {
    new_trust () {
      this.trust_dialog = true
    },
    add_trust (new_trusted_users) {
      /* new_trusted_users.forEach(user => {
        user['circle'] = 1
        this.user_trusts.push(user)
      }) */
      this.$store.dispatch('add_trusted_users', new_trusted_users)
        .then(() => this.refresh_trusted_by_user())
      this.add_user = null
    },
    delete_trust (user_id) {
      this.$store.dispatch('delete_trusted_user', user_id)
        .then(() => this.refresh_trusted_by_user())
      /* this.user_trusts = this.user_trusts.filter(user => {
        return user.user_id !== user_id
      }) */

    },
    refresh_trusts_user () {
      const user_id = this.$store.state.user.user_id
      this.$api.get('/user/' + user_id + '/trusts_user')
        .then(result => this.trusts_user = result.data)
    },
    refresh_trusted_by_user () {
      const user_id = this.$store.state.user.user_id
      this.$api.get('/user/' + user_id + '/trusted_by_user')
        .then(result => this.user_trusts = result.data)
    },
  },
  computed: {
    trusts_users_by_circle () {
      return this.trusts_user.filter(user => user.circle <= this.circles)
    },
    user_trusts_by_circle () {
      return this.user_trusts.filter(user => user.circle <= this.circles)
    },
    user_trusts_circle1 () {
      return this.user_trusts.filter(user => user.circle === 1)
    },
     ...mapState(['avatar_url'])
  },
  mounted () {
    this.refresh_trusts_user()
    this.refresh_trusted_by_user()
  }
}

</script>