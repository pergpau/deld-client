<template>
  <div>
    <v-card max-width="600px">
      <v-card-title>
        Bekreft telefonnummeret {{phone}}
      </v-card-title>

      <v-card-text>
        <v-row dense>
          <v-col
            cols=12
            class="ma-0 pa-0"
          >
            For å sjekke om telefonnummeret ditt tilhører deg må vi sende deg en SMS.
            <v-row dense>
              <v-col
                cols=12
                class="ma-0 pa-0"
              >
                <v-btn
                  class="mt-5 mb-10"
                  id="send-button"
                  color="primary"
                  :loading=loading_sms
                >
                  Send SMS nå
                </v-btn>

              </v-col>
            </v-row>
            <div v-if="show_code_items">
              <v-text-field
                v-model="code"
                label="Skriv koden du fikk på SMS her"
                outlined
                :rules="code_rules"
              >

              </v-text-field>

              <v-btn
                color="primary"
                @click="send_code()"
                :loading=loading_code
              >
                Bekreft kode
              </v-btn>
            </div>
            <v-row dense>
              <v-col
                cols=12
                class="ma-0 pa-0 mt-4"
              >
                <v-alert
                  v-if="error_message"
                  outlined
                  type="error"
                >
                  {{ this.error_message}}
                </v-alert>
              </v-col>
            </v-row>

          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<script src="https://www.gstatic.com/firebasejs/7.15.5/firebase-app.js"></script>
<script>

import * as firebase from 'firebase/app';
import 'firebase/auth';

var firebaseConfig = {
  apiKey: "AIzaSyDjYLlisIjTrf4Cuy5kCXOu1Gr6KWUmR6I",
  authDomain: "del-d-280811.firebaseapp.com",
  databaseURL: "https://del-d-280811.firebaseio.com",
  projectId: "del-d-280811",
  storageBucket: "del-d-280811.appspot.com",
  messagingSenderId: "696512255308",
  appId: "1:696512255308:web:b40463ecc50da52836abe9"
};

firebase.initializeApp(firebaseConfig);

export default {
  name: 'PhoneVerification',
  data () {
    return {
      code: '',
      code_rules: [
        v => (v && /^[0-9]+$/.test(v) && v.length == 6) || 'Skriv nøyaktig 6 tall',
      ],
      confirmer: null,
      show_sms_button: false,
      show_code_items: false,
      loading_sms: false,
      loading_code: false,
      error_message: '',
      recaptchaVerifier: null
    }
  },
  props: {
    phone: {
      type: String,
      default: '+4712345678'
    }
  },
  methods: {
    send_sms () {
      this.loading_sms = true
      firebase.auth().signInWithPhoneNumber(this.phone, this.recaptchaVerifier)
        .then(confirmationResult => {
          this.confirmer = confirmationResult
          this.show_code_items = true
          this.loading_sms = false
        }).catch(error => {
          this.error_message = error
          //this.error_message = 'Noe gikk galt. Er telefonnummeret gyldig?'
          this.loading_sms = false
        });
    },
    send_code () {
      this.loading_code = true
      this.confirmer.confirm(this.code)
        .then(response => {
          //this.error_message = 'Confirmer ferdig'
          firebase.auth().currentUser.getIdToken(true)
            .then(token => {
              //this.error_message = 'getIdToken ferdig'
              this.$api.post('/verify_phone', { token: token })
                .then(result => {
                  this.loading_code = false
                  this.close()
                })
                .catch(result => {
                  console.log(error)
                  this.error_message = 'Noe gikk galt. Prøv igjen'
                  this.loading_code = false
                })
            }).catch(error => {
              this.error_message = 'Noe gikk galt. Prøv igjen'
              this.loading_code = false
            })
        })
        .catch(error => {
          if (error.code === 'auth/invalid-verification-code') {
            this.error_message = 'Feil kode. Sikker på den stemmer?'
            this.loading_code = false
          }
        })
    },
    close () {
      this.$emit('close')
      this.$emit('update:phone_dialog', false)
      this.$emit('update:success_message', 'Du er registrert og telefonnummeret er bekreftet. Men før du kan logge inn må du også klikke på lenken vi har sendt deg på e-post.')
      this.error_message = ''
    }
  },
  mounted () {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('send-button', {
      'size': 'invisible',
      'callback': (response => {
        this.send_sms()
      }),
      'expired-callback': (response => {
        grecaptcha.reset(widgetId);
      })
    })
    this.recaptchaVerifier.render().then(function (widgetId) {
      window.recaptchaWidgetId = widgetId;
    });
  }
}

</script>