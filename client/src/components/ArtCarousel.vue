<template>
  <div class="carousel-container">
    <carousel :perPage="1" :pagination="false" :autoplay="true">
      <slide class="slide" v-for="(listing, index) in listings" :key="index">
            <ListingPreviewVue :listing="listing"></ListingPreviewVue>
      </slide>
    </carousel>
  </div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel'
import ListingPreviewVue from './ListingPreview.vue'

export default {
  components: {
    Carousel,
    Slide,
    ListingPreviewVue
  },
  data() {
    return {
      listings: [
        { title: 'Listing 1' },
        { title: 'Listing 2' },
        { title: 'Listing 3' },
        { title: 'Listing 3' },
        { title: 'Listing 3' },
        { title: 'Listing 3' },
        { title: 'Listing 3' }
      ]
    }
  }
}
</script>

<style>
.carousel-container {
  width: 40%;
  margin: 0 auto;
}

button.VueCarousel-dot--active {
  background-color: #606C5D !important ;
  outline: none !important;
}

.VueCarousel-dot {
    outline: #606C5D !important;
}

@media screen and (max-width:900px){
    .carousel-container {
  width: 90%;
  margin: 0 auto;
}
}

</style>
