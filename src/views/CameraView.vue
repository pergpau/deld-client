<template>
  <div class="camera-modal">
    <video
      ref="video"
      class="camera-stream"
    />
    <div class="camera-modal-container">
      <v-btn
        class="mx-2"
        fab
        dark
        small
        color="pink"
        @click="capture"
      >
        <v-icon dark>mdi-heart</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script> 
export default {
  data () {
    return {
      mediaStream: null
    }
  },
  mounted () {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(mediaStream => {
        this.mediaStream = mediaStream
        this.$refs.video.srcObject = mediaStream
        this.$refs.video.play()
      })
      .catch(error => console.error('getUserMedia() error:', error))
  },
  methods: {
    async capture () {
      const capture = new ImageCapture(this.mediaStream.getVideoTracks()[0])
      const photoBlob = await capture.takePhoto();
      console.log(photoBlob)
    }
  }
}
</script>

<style scoped>
.camera-modal-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  align-items: center;
  margin-bottom: 24px;
}
.take-picture-button {
  display: flex;
}
.camera-modal {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  background-color: white;
  z-index: 10;
}
.camera-stream {
  width: 100%;
  max-height: 100%;
}
</style>