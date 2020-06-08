<template>
  <v-container>
        <h1 class="pb-3">Profil</h1>
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
          <v-text-field
            type="number"
            label="Telefonnummer"
            v-model="user_data.phone"
            outlined
            required
          />
        </v-form>
  </v-container>
</template>

<script>

export default {
  name: 'Profile',
  data () {
    return {
      user_data: {
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
      }
    }
  },
  methods: {

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