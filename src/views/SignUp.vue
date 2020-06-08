<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card
          max-width="600px"
          class="mt-10 mx-auto"
        >
          <v-card-title class="pb-3">
            <h2>Registrer deg</h2>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-text-field
                type="email"
                label="E-post"
                v-model="email"
                :rules="email_rules"
                outlined
                required
              />
              <v-text-field
                label="Fornavn"
                v-model="first_name"
                outlined
                :rules="first_name_rules"
                required
              />
              <v-text-field
                label="Etternavn"
                v-model="last_name"
                outlined
                :rules="last_name_rules"
                required
              />
              <v-text-field
                label="Telefonnummer"
                v-model="phone"
                :rules="phone_rules"
                outlined
                required
              />
              <v-text-field
                :type="showPassword ? 'text' : 'password'"
                label="Passord"
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :rules="password_rules"
                outlined
                required
              />
              <v-text-field
                :type="showPasswordConfirmed ? 'text' : 'password'"
                label="Bekreft passord"
                v-model="password_confirm"
                :append-icon="showPasswordConfirmed ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPasswordConfirmed = !showPasswordConfirmed"
                :rules="password_confirm_rules"
                outlined
                required
                @keyup.enter="register"
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
              color="accent"
              @click="register"
              :disabled="!valid"
            >Registrer ny bruker</v-btn>
          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from '../services/api.js'

export default {
  name: 'SignUp',
  data () {
    return {
      valid: false,
      showPassword: false,
      showPasswordConfirmed: false,
        email: '',
        email_rules: [
          v => !!v || 'Du må skrive e-posten din',
  
          v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Adressen må være gyldig',
          /* v => /.+@.+\.[A-Za-z]+[^0-9]/.test(v) || 'Adressen må være gyldig', */
        ],
     /*  username: '',
      username_rules: [
        v => !!v || 'Du må skrive et brukernavn',
        v => v && v.length > 5 || 'Brukernavnet må ha minst 6 tegn',
        v => /^[0-9a-zA-Z]+$/.test(v) || 'Kun bokstaver og tall er tillatt',
      ], */
      first_name: '',
      first_name_rules: [
        v => !!v || 'Du må skrive et fornavn'
      ],
      last_name: '',
      last_name_rules: [
        v => !!v || 'Du må skrive et etternavn'
      ],
      phone: '',
      phone_rules: [
        v => !!v || 'Du må skrive et telefonnummer',
        v => /^[0-9/+]+$/.test(v) || 'Kun tall og + er tillatt',
      ],
      password: '',
      password_rules: [
        v => v.length > 5 || 'Passordet må være 6 tegn eller lengre'
      ],
      password_confirm: '',
      password_confirm_rules: [
        v => !!v || 'Gjenta passordet over',
        v => v == this.password || 'Begge passordfeltene må være helt like'
      ],
      error_message: '',
      success_message: '',
    }
  },
  methods: {
    register: function () {
      if (this.$refs.form.validate()) {
        const user_data = {
          email: this.email,
          first_name: this.first_name,
          last_name: this.last_name,
          phone: this.phone,
          password: this.password,
        }
        api.post('/register', user_data)
          .then(() => {
            this.$refs.form.reset()
            this.error_message = ''
            this.success_message = 'Du er registrert. Før du kan logge inn må du klikke på lenken vi har sendt deg på e-post. '
          })
          .catch(err => {
            console.log(err)
            this.error_message = "Noe gikk galt. Prøv igjen."
          })
      }
    },
  }
}

</script>