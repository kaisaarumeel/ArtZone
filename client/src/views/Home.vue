<template>
  <div class="home-page">
    <h1 class="header">
      <span class="bold-text">Discover</span> and <span class="bold-text">sell</span> <br> your <span class="bold-text">artwork</span>.
    </h1>
    <ArtCarouselVue></ArtCarouselVue>
    <div class="about-us" id="aboutUsSection">
      <div><img src="images/wave.jpeg" alt="Painting" class="painting"></div>
      <div><h2>About us</h2><p>At Artzone, we believe that art is more than just paint on canvas or sculptures in a gallery; it's a powerful form of expression that connects individuals and cultures worldwide. Our mission is to create a vibrant and inclusive online community where artists of all backgrounds can showcase their creativity, share their stories, and find new audiences for their work. Whether you're a seasoned artist or a passionate art enthusiast, ArtZone provides a platform for you to explore, appreciate, and acquire unique pieces of art.
        <br>
        <br>
        We have developed this platfrom with love and care. Here you can sell your own art or artwork made by another author. The platfrom offers a wide range of artwork, starting with paintings and drawings and ending with sculptures or graphical design. Join us on this creative journey, and together, let's celebrate the beauty and diversity of the art world. </p></div>
    </div>
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

<style>

h1 {
  color: #606C5D;
}
.header {
  font-size: 36px;
  text-align: center;
  justify-content: center;
  padding-bottom: 1rem;
}

@media (max-width: 768px){
  .header {
    font-size: 36px;
  }
}
.bold-text {
  font-weight:900;
}

.painting {
  width: 400px;
  height: auto;
  padding: 1rem;
  padding-bottom: 0;

}
.about-us {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #606C5D;
  margin-top: 2rem;
}

p {
  color: #F7E6C4;
  padding: 3rem;
}

h2 {
  color: #F7E6C4;
  text-align: end;
  padding-right: 3rem;
  padding-top: 1rem;
}

@media (max-width: 768px){
  .about-us {
    flex-direction: column;
    text-align: center;
  }

.painting {
    width: 100%;
  }

  p {
    padding-top: 1rem;
  }

  .header {
    padding-top: 3rem;
  }
}

</style>
