<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="pb-3">Profil</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols=12
        sm=7
      >

        <v-form ref="form">
          <v-text-field
            type="email"
            label="E-post"
            v-model="user_data.email"
            outlined
            required
            disabled
          />
          <v-text-field
            label="Telefonnummer"
            v-model="user_data.phone"
            outlined
            disabled
            required
          />
          <v-text-field
            label="Fornavn"
            v-model="user_data.first_name"
            outlined
            required
          />
          <v-text-field
            label="Etternavn"
            v-model="user_data.last_name"
            outlined
            required
          />

        </v-form>
      </v-col>
      <v-col
        cols=12
        sm=5
        align="center"
      >
        <v-row dense>
          <v-col cols=12>
            <v-avatar size="200">
              <img
                :src="$store.getters.avatar_url('200x200')"
                @error="$event.target.src = $store.getters.noavatar_url('128x128')"
              >
              <!-- <img :src="avatar_url" @error="$event.target.src = $store.getters.noavatar_url + '128x128'"> -->
            </v-avatar>
          </v-col>
        </v-row>
        <v-dialog
          v-model="avatar_dialog"
          max-width="600px"
        >
          <template v-slot:activator="{ on,  }">
            <v-btn
              class="mt-5"
              v-on="on"
              color="accent"
            > Endre profilbilde</v-btn>
          </template>
          <avatar-upload
            :avatar_dialog.sync="avatar_dialog"
            :key="avatar_dialog"
          ></avatar-upload>
        </v-dialog>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import AvatarUpload from '../components/AvatarUpload.vue'

export default {
  name: 'Profile',
  data () {
    return {
      user_data: {
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
      },
      avatar_dialog: false,
    }
  },
  components: {
    'avatar-upload': AvatarUpload
  },
  methods: {

  },
  computed: {
  },
  mounted () {
    const user_id = this.$store.state.user.user_id
    this.$api.get('/user/id/' + user_id)
      .then(res => {
        this.user_data.email = res.data.email
        this.user_data.first_name = res.data.first_name
        this.user_data.last_name = res.data.last_name
        this.user_data.phone = res.data.phone
      })
  }
}

</script>