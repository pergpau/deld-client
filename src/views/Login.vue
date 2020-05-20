<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-card
      width="400px"
      class="mt-10 mx-a"
    >
      <v-card-title class="pb-3">
        <h2>Login</h2>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-text-field
            label="Brukernavn"
            prepend-icon="mdi-account-circle"
            v-model="username"
            :rules="username_rules"
            required
          />
          <v-text-field
            :type="showPassword ? 'text' : 'password'"
            label="Passord"
            v-model="password"
            :rules="password_rules"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            @keyup.enter="login"
            required
          />
        </v-form>
      </v-card-text>
      <v-alert
        v-if="errormessage"
        dense
        outlined
        type="error"
      >
        {{ this.errormessage}}
      </v-alert>
      <v-card-actions class="justify-center pb-6">
        <v-btn
          color="success"
          @click="login"
          :disabled="!valid"
        >Logg inn</v-btn>
      </v-card-actions>

    </v-card>
  </v-row>
</template>

<script>

export default {
  name: 'Login',
  data () {
    return {
      valid: false,
      showPassword: false,
      username: '',
      username_rules: [
        v => !!v || 'Skriv brukernavnet ditt'
      ],
      password: '',
      password_rules: [
        v => !!v || 'Skriv passordet ditt'
      ],
      errormessage: ''
    }
  },
  methods: {
    login: function () {
      if (this.$refs.form.validate()) {
        const username = this.username
        const password = this.password
        this.$store.dispatch('login', { username, password })
          .then(() => this.$router.push('/dashboard'))
          .catch(err => {
            if (err.response.status == 401) {
              this.errormessage = "Ugyldig brukernavn eller passord"
            }
          })
      }
    },
    validate () {
      this.$refs.form.validate()
    },
  }

};
</script>
