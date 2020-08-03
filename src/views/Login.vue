<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card
          max-width="400px"
          class="mt-10 mx-auto"
        >
          <v-card-title class="pb-3">
            <h2>Logg inn</h2>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-text-field
                label="E-post"
                prepend-icon="mdi-account-circle"
                v-model="email"
                :rules="email_rules"
                required
                autofocus
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
              color="accent"
              @click="login"
              :disabled="!valid"
            >Logg inn</v-btn>
          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'Login',
  data () {
    return {
      valid: false,
      showPassword: false,
      email: '',
      email_rules: [
        v => !!v || 'Skriv e-posten din'
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
        const email = this.email
        const password = this.password
        this.$store.dispatch('login', { email, password })
          .then(() => this.$router.push('/dashboard'))
          .catch(err => {
            if (err.response.status == 401) {
              this.errormessage = "Ugyldig brukernavn eller passord. Hvis du er en ny bruker må du også sjekke e-posten vi har sendt deg."
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
