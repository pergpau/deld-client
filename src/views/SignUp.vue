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
                :prefix="country_code"
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
            {{ this.success_message }}
          </v-alert>
          </v-card-text>
          
          <v-card-actions class="justify-center pb-6">
            <v-dialog
              v-model="phone_dialog"
              max-width="400px"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  type="submit"
                  color="accent"
                  @click="register"
                  :disabled="!valid"
                >Registrer ny bruker</v-btn>
              </template>
              <phone-verification
                :phone_dialog.sync="phone_dialog"
                :success_message.sync="success_message"
                :key="phone"
                :phone="phone_and_country_code"
                @close="clear()"
              ></phone-verification>
            </v-dialog>

          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from '../services/api.js'
import PhoneVerification from '../components/PhoneVerification.vue'

export default {
  name: 'SignUp',
  data () {
    return {
      phone_dialog: false,
      valid: false,
      showPassword: false,
      showPasswordConfirmed: false,
      country_code: '+47',
      email: '',
      email_rules: [
        v => !!v || 'Du må skrive e-posten din',

        v => (v && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)) || 'Adressen må være gyldig',
      ],
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
        v => (v && /^[0-9/+]+$/.test(v)) || 'Kun tall og + er tillatt',
      ],
      password: '',
      password_rules: [
        v => (v && v.length > 5) || 'Passordet må være 6 tegn eller lengre'
      ],
      password_confirm: '',
      password_confirm_rules: [
        v => !!v || 'Gjenta passordet over',
        v => (v && v == this.password) || 'Begge passordfeltene må være helt like'
      ],
      error_message: '',
      success_message: '',
    }
  },
  components: {
    'phone-verification': PhoneVerification,
  },
  methods: {
    register: function () {
      if (this.$refs.form.validate()) {
        const user_data = {
          email: this.email,
          first_name: this.first_name,
          last_name: this.last_name,
          phone: this.phone_and_country_code,
          password: this.password,
        }
        api.post('/register', user_data)
          .then(() => {
            this.error_message = ''
            this.phone_dialog = true

          })
          .catch(err => {
            console.log(err)
            this.error_message = "Noe gikk galt. Prøv igjen."
          })
      }
    },
    clear () {
      this.$refs.form.reset()
    }

  },
  computed: {
    phone_and_country_code () {
      return this.country_code + this.phone
    }
  }
}

</script>