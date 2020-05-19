<template>
  <div>
    <v-row
      align="center"
      justify="center"
    >
      <v-card
        width="600px"
      >
        <v-card-title class="pb-3">
          <h2>Registrer deg</h2>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              label="Brukernavn"
              v-model="username"
              outlined
              required
            />
            <v-text-field
              label="Fornavn"
              v-model="first_name"
              outlined
              required
            />
            <v-text-field
              label="Etternavn"
              v-model="last_name"
              outlined
              required
            />
            <v-text-field
              type="email"
              label="E-post"
              v-model="email"
              outlined
              required
            />
            <v-text-field
              type="number"
              label="Telefonnummer"
              v-model="phone"
              outlined
              required
            />
            <v-text-field
              :type="showPassword ? 'text' : 'password'"
              label="Passord"
              v-model="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              outlined
              required
            />
            <v-text-field
              :type="showPasswordConfirmed ? 'text' : 'password'"
              label="Bekreft passord"
              v-model="password_confirm"
              :append-icon="showPasswordConfirmed ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPasswordConfirmed = !showPasswordConfirmed"
              outlined
              required
            />
          </v-form>
        </v-card-text>
        <v-alert
          v-if="error_message"
          outlined
          type="error"
        >
          {{ this.error_message}}
        </v-alert>
        <v-alert
          v-if="success_message"
          outlined
          type="success"
        >
          {{ this.success_message }} {{ this.countdown }}
        </v-alert>
        <v-card-actions class="justify-center pb-6">
          <v-btn
            type="submit"
            color="success"
            @click="register"
          >Registrer ny bruker</v-btn>
        </v-card-actions>

      </v-card>
    </v-row>
  </div>
</template>

<script>
import api from '../services/api.js'

export default {
  name: 'SignUp',
  data () {
    return {
      showPassword: false,
      showPasswordConfirmed: false,
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirm: '',
      phone: '',
      error_message: '',
      success_message: '',
      countdown: 3
    }
  },
  methods: {
    register: function () {
      let user_data = {
        username: this.username,
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        phone: this.phone,
        password: this.password,
      }
      api.post('/register', user_data)
        .then(() => {
          this.error_message = ''
          this.success_message = 'Du er registrert og videresendes til innlogging om... '
          this.countDownTimer()
          setTimeout(() => {
            this.countdown = 3
            this.$router.push("/login")
          }, this.countdown * 1000)
        })
        .catch(err => {
          console.log(err)
          this.error_message = "Noe gikk galt. Prøv igjen."
        })
    },
    countDownTimer () {
      if (this.countdown > 0) {
        setTimeout(() => {
          this.countdown -= 1
          this.countDownTimer()
        }, 1000)
      }
    }
  }
}

</script>