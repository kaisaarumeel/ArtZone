<template>
  <div class="home-page">
    <h1 class="header pb-5 pt-5 text-center">
      <span class="bold-text">Discover</span> and <span class="bold-text">sell</span> <br> your <span class="bold-text">artwork</span>.
    </h1>
    <ArtCarouselVue></ArtCarouselVue>
    <b-row class="about-us mt-4 align-items-center" id="aboutUsSection">
      <b-col cols="12" lg="4" md="6"><img src="images/wave.jpeg" alt="Painting" class="painting p-5"></b-col>
      <b-col class="text-container pr-5 pt-5" cols="12" lg="8" md="6"><h2 class="">About us</h2><p class="text-justify">At Artzone, we believe that art is more than just paint on canvas or sculptures in a gallery; it's a powerful form of expression that connects individuals and cultures worldwide. Our mission is to create a vibrant and inclusive online community where artists of all backgrounds can showcase their creativity, share their stories, and find new audiences for their work. Whether you're a seasoned artist or a passionate art enthusiast, ArtZone provides a platform for you to explore, appreciate, and acquire unique pieces of art.
        <br>
        <br>
        We have developed this platfrom with love and care. Here you can sell your own art or artwork made by another author. The platfrom offers a wide range of artwork, starting with paintings and drawings and ending with sculptures or graphical design. Join us on this creative journey, and together, let's celebrate the beauty and diversity of the art world. </p></b-col>
    </b-row>
  </div>

</template>

<script>
import ArtCarouselVue from '../components/ArtCarousel.vue'

export default {
  name: 'home',
  components: {
    ArtCarouselVue
  }
}
</script>

<style scoped>

h1 {
  color: #606C5D;
}
.header {
  font-size: 36px;
}

.bold-text {
  font-weight:900;
}

.painting {
  width: 100%;
  height: auto;
}
.about-us {
  background: #606C5D;
}
p {
  color: #F7E6C4;
}
h2 {
  color: #F7E6C4;
}
@media (max-width: 768px){
  p {
    padding-top: 1rem;
  }

  .header {
    padding-top: 3rem;
    font-size: 36px;
  }

  .text-container {
    padding: 3rem;
    padding-top: 0 !important;
  }

}
</style>
