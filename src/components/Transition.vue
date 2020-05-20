<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-alert
      v-if="message"
      :type="success"
    >
      {{ this.message }}
    </v-alert>

  </v-row>
</template>

<script>

export default {
  name: 'Verify',
  data () {
    return {
    }
  },
  props: {
    message: String,
    type: String
  }
}

</script>