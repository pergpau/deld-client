<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-card
      width="600px"
      class="mt-10 mx-a"
    >
      <v-card-title class="pb-3">
          <h3> Bekrefter e-post-adresse...</h3>
      </v-card-title>
      <v-card-text>
      </v-card-text>
      <v-alert
        v-if="errormessage"
        dense
        outlined
        type="error"
      >
        {{ this.errormessage}}
      </v-alert>
      <v-alert
        v-if="success_message"
        outlined
        type="success"
      >
        {{ this.success_message }} {{ this.countdown }}
      </v-alert>

    </v-card>
  </v-row>
</template>

<script>

export default {
  name: 'Verify',
  data () {
    return {
      verified: false,
      errormessage: '',
      success_message: '',
      countdown: 3
    }
  },
  methods: {
    countDownTimer () {
      if (this.countdown > 0) {
        setTimeout(() => {
          this.countdown -= 1
          this.countDownTimer()
        }, 1000)
      }
    }
  },
  mounted () {
    this.$api.get('/verify/' + this.$route.params.validation_hash)
      .then(() => {
        this.error_message = ''
        this.verified = true
        this.success_message = 'E-post-adressen er bekreftet og du videresendes til innlogging om... '
        this.countDownTimer()
        setTimeout(() => {
          this.countdown = 3
          this.$router.push("/login")
        }, this.countdown * 1000)
      })
      .catch(error => {
        if (error.response.status == 404) {
          this.errormessage = "Valideringskoden finnes ikke i systemet."
        }      })
  }
}
</script>