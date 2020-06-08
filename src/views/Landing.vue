<template>
  <v-container
    fluid
    class="home"
    style=""
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        sm=12
        md=12
        lg=8
        xl=6
        class="ma-0 px-4"
      >

        <v-row
          align="center"
          justify="center"
          class="pt-0"
        >

          <v-col
            md=4
            xs=12
            class="pl-10 mb-3 ml-0"
          >
            <v-row>
              <h1 class="display-1 white--text font-weight-bold ">
                Norges nye deleplattform
              </h1>
            </v-row>
            <v-row>
              <p class="body-1 white--text">
                Del ditt og ta del i nettverket sitt
              </p>
            </v-row>
            <v-row>
              <v-btn
                color="accent"
                rounded
                dark
                to="/signup"
              >
                Registrer
              </v-btn>
              <v-btn
                color="accent"
                rounded
                dark
                class="ml-4"
                to="/login"
              >
                Logg inn
              </v-btn>
            </v-row>

          </v-col>
          <v-col
            md=6
            xs=12
            class="mr-0"
          >
            <v-row
              justify="center"
              align="center"
            >
              <v-col>
                <v-img
                  class="mx-auto"
                  src="@/assets/images/sharecircle.png"
                  max-width=600
                />
              </v-col>
            </v-row>

          </v-col>

        </v-row>
      </v-col>

    </v-row>

  </v-container>

  <!--End off row-->
</template>

<style scoped>
.home {
  background: url(../assets/images/homebg.png) no-repeat top center;
  background-size: cover;
  position: relative;
  min-height: 900px;
  left: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  max-width: 100vw;
  right: 50%;
  width: 100vw;
}
.centered-image-container {
  text-align: center;
}
</style>

<script>

export default {
  name: 'Landing',
  data () {
    return {

    }
  },
  methods: {
  },
  created () {
    if (this.$store.getters.isLoggedIn) {
      this.$router.push('/dashboard')
    }
  }

};
</script>
