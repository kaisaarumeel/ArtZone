<template>
  <div>
    <b-carousel
      id="carousel-1"
      v-model="slide"
      :interval="4000"
      controls
      indicators
      img-width="1024"
      img-height="480"
      style="text-shadow: 1px 1px 2px #333;"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
    >

      <b-carousel-slide
        v-for="(slideData, index) in listings"
        :key="index"
        :img-blank="true"
      >
        <ListingPreviewVue :listing="slideData"></ListingPreviewVue>
      </b-carousel-slide>

    </b-carousel>

    <p class="mt-4">
      Slide #: {{ slide }}<br>
      Sliding: {{ sliding }}
    </p>
  </div>
</template>

<script>
import ListingPreviewVue from './ListingPreview.vue'
export default {
  data() {
    return {
      slide: 0,
      sliding: null,
      isLargeScreen: window.innerWidth > 768,
      listings: [
        { title: 'Listing 1', picture: 'image1.jpg', author: 'Author 1' },
        { title: 'Listing 2', picture: 'image2.jpg', author: 'Author 2' },
        { title: 'Listing 3', picture: 'image3.jpg', author: 'Author 3' }
        // Add more listing data objects as needed
      ]
    }
  },
  components: {
    ListingPreviewVue
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true
    },
    onSlideEnd(slide) {
      this.sliding = false
    }
  }
}
</script>

<style scoped>

</style>
