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
          v-bind:user_trusts="user_trusts"
          v-bind:add_user="add_user"
          @outside_click="trust_dialog = false"
          @add_trust="add_trust"
        ></trust-dialog>
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
            <v-card-title class="headline">Jeg stoler på {{ user_trusts.length}} personer</v-card-title>
            <v-list-item
              v-for="person in user_trusts"
              :key="person.first_name"
            >
              <v-list-item-avatar>
                <v-img :src="person.avatar_url"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="person.first_name + ' ' + person.last_name"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
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
            <v-card-title class="headline">{{ trusts_user.length}} personer stoler på meg</v-card-title>
            <v-list-item
              v-for="person in trusts_user"
              :key="person.first_name"
            >
              <v-list-item-avatar>
                <v-img :src="person.avatar_url"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="person.first_name + ' ' + person.last_name"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action v-if="!user_trusts.some(user => user.user_id === person.user_id)">
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

export default {
  name: 'Trust',
  data () {
    return {
      user_trusts: [],
      trusts_user: [],
      add_user: null,
      trust_dialog: false,
      delete_trust_dialog: false,
      delete_trusted_user: null
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
      new_trusted_users.forEach(user => {
        this.user_trusts.push(user)
      })
      this.$store.dispatch('add_trusted_users', new_trusted_users)
      this.add_user = null
    },
    delete_trust (user_id) {
      this.$store.dispatch('delete_trusted_user', user_id)
      this.user_trusts = this.user_trusts.filter(user => {
        return user.user_id !== user_id
      })

    },
    refresh () {
      const user_id = this.$store.state.user.user_id
      this.$api.get('/user/' + user_id + '/trusted_by_user')
        .then(result => this.user_trusts = result.data)

      this.$api.get('/user/' + user_id + '/trusts_user')
        .then(result => this.trusts_user = result.data)
    }
  },
  mounted () {
    this.refresh()
  }
}

</script>