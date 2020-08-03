<template>
  <div>
    <v-dialog
      v-model="trust_dialog"
      max-width="500px"
      @click:outside="close()"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Ny tillitserklæring</span>
        </v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="select"
            :loading="loading"
            :items="people"
            :search-input.sync="search"
            @change="add"
            hide-no-data
            hide-selected
            return-object
            item-text='first_name'
            item-value='phone'
            flat
            no-filter
            clearable
            label="Skriv telefonnummeret til personen du vil stole på"
          >
            <template v-slot:item="{ item }">
              <v-list-item-avatar>
                <img :src="$store.getters.person_avatar_url(item.user_id,'36x36')" @error="$event.target.src = $store.getters.noavatar_url('36x36')">
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.first_name + ' ' + item.last_name"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon color="green">mdi-account-plus</v-icon>
              </v-list-item-action>

            </template>
          </v-autocomplete>
          <v-alert
            v-if="errormessage"
            dense
            outlined
            type="error"
          >
            {{ this.errormessage}}
          </v-alert>
        </v-card-text>
        <v-card-text
          v-if="new_trusts.length > 0"
          class="headline"
        >
          Jeg vil stole på...
        </v-card-text>
        <v-list>
          <v-list-item
            v-model="new_trusts"
            v-for="person in new_trusts"
            :key="person.first_name"
          >
            <v-list-item-avatar>
              <img :src="$store.getters.person_avatar_url(person.user_id,'36x36')" @error="$event.target.src = $store.getters.noavatar_url('36x36')">
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="person.first_name + ' ' + person.last_name"></v-list-item-title>
            </v-list-item-content>

          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            dark
            @click.stop="close()"
          >Avbryt</v-btn>
          <v-btn
            color="green"
            dark
            @click="save()"
          >Lagre</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TrustDialog',
  data () {
    return {
      new_trusts: [],
      people: [],
      loading: false,
      search: null,
      select: null,
      errormessage: ''
    }
  },
  props: {
    trust_dialog: {
      default: false
    },
    user_trusts: Array,
    add_user: Object
  },
  watch: {
    search (val) {
      val && this.query_number(val)
    },
    add_user (user) {
      if (user != null) {
        this.new_trusts.push(user)
      }
    }
  },
  methods: {
    query_number (val) {
      this.loading = true
      this.$api.get('/user/phone_number/' + val)
        .then(
          result => {
            this.people = result.data
            this.loading = false
          })
    },
    add (new_user) {
      this.errormessage = ''
      if (this.user_trusts.some(user => user.user_id === new_user.user_id) ||
        this.new_trusts.some(user => user.user_id === new_user.user_id)) {
        this.errormessage = 'Du stoler allerede på denne personen'
      } else if (this.$store.getters.user_id === new_user.user_id) {
        this.errormessage = 'Du bør helst stole på deg selv, men det går ikke på Del-D.no'
      } else {
        this.new_trusts.push(new_user)
      }
      this.$nextTick(() => {
        this.select = null
        this.search = null
      })
    },
    save () {
      if (this.new_trusts.length > 0) {
        this.$emit('add_trust', this.new_trusts)
      }
      this.close()
    },
    close () {
      this.new_trusts = []
      this.errormessage = ''
      this.$emit('update:trust_dialog', false)
    }
  },

  computed: {
    ...mapState(['avatar_url'])
  },
  mounted () {
  }
}

</script>