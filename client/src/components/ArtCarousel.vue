<template>
  <div>
    <b-carousel
      id="carousel-homepage"
      v-model="slide"
      :interval="4000"
      controls
      indicators
      img-width="1024"
      img-height="480"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
    >

     <!-- <b-carousel-slide
      <b-row class="bottom">
        <b-col cols="12" lg="6" class="author-name">
            <h1>{{name}}</h1>
            <p>{{author}}</p>
        </b-col>
        <b-col cols="12" lg="6">
          <b-button variant="primary">Buy now</b-button>
        </b-col>
      </b-row>

        <ListingPreviewVue></ListingPreviewVue>
      </b-carousel-slide> -->
      <b-carousel-slide
      v-for="(slideData, index) in listings"
        :key="index"
        :img-src="slideData.picture"
        :caption-html="slideData.captionHTML"
      ></b-carousel-slide>

    </b-carousel>

  </div>
</template>

<script>

export default {
  data() {
    return {
      slide: 0,
      sliding: null,
      isLargeScreen: window.innerWidth > 768,
      listings: [
        { title: 'Listing 1', picture: 'https://www.re-thinkingthefuture.com/wp-content/uploads/2023/01/A9049-Story-behind-the-Art-The-Last-Supper-Image-1.jpg', author: 'Author 1', captionHTML: '<div class="row bottom"><div class="col"><h1>The Last Supper</h1><p>Leonardo Da Vinci</p></div><div class="col"><button class="btn btn-primary">Buy now</button></div></div>' },
        { title: 'Listing 2', picture: 'https://www.re-thinkingthefuture.com/wp-content/uploads/2023/01/A9049-Story-behind-the-Art-The-Last-Supper-Image-1.jpg', author: 'Author 1', captionHTML: '<div class="row bottom"><div class="col"><h1>The Last Supper</h1><p>Leonardo Da Vinci</p></div><div class="col"><button class="btn btn-primary">Buy now</button></div></div>' },
        { title: 'Listing 3', picture: 'https://www.re-thinkingthefuture.com/wp-content/uploads/2023/01/A9049-Story-behind-the-Art-The-Last-Supper-Image-1.jpg', author: 'Author 1', captionHTML: '<div class="row bottom"><div class="col"><h1>The Last Supper</h1><p>Leonardo Da Vinci</p></div><div class="col"><button class="btn btn-primary">Buy now</button></div></div>' }
        // Add more listing data objects as needed
      ]
    }
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

<style>

#carousel-homepage img {
    /* padding: 10rem; */
    padding-left: 5rem;
    padding-right: 5rem;
    padding-bottom: 10rem;
    max-width: 65vw;
    margin-left: auto;
    margin-right: auto;
}
#carousel-homepage .carousel-caption {
    max-width: 55vw;
    margin-left: auto;
    margin-right: auto;
}

#carousel-homepage .carousel-inner {
  overflow: initial;
}
#carousel-homepage .carousel-caption h1{
    font-size: 21px;
    font-weight: 800;
    text-align: left;
    padding-top: 1rem;
    color: #606C5D;

  }

  #carousel-homepage .carousel-control-next-icon, #carousel-homepage .carousel-control-prev-icon, #carousel-homepage li {
    filter: brightness(0.5);
  }
  #carousel-homepage .carousel-caption p{
    font-size: 15px;
    text-align: left;
    color: #606C5D;
    padding: 0;
  }

  #carousel-homepage .carousel-caption .artwork{
    width:100%;
  }
  #carousel-homepage .carousel-caption .btn-primary{
    width:100%;
    height: auto;
    margin-top:1rem;
    margin-bottom: 0;
  }

  @media screen and (max-width:576px){

    #carousel-homepage .carousel-caption h1 {
        font-size: 16px;
    }

  }

  @media screen and (max-width:1200px){

    #carousel-homepage img {
  max-width: 65vw;

}
#carousel-homepage .carousel-caption {
  max-width: 55vw;

}

}
@media screen and (max-width:992px){
  #carousel-homepage img {
  max-width: 95vw;

}
#carousel-homepage .carousel-caption {
  max-width: 100vw;
}
}

</style>
<style scoped>

</style>
