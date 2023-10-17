<template>
  <div>
    <b-carousel id="carousel-homepage" v-model="slide" :interval="4000" controls indicators img-width="1024"
      img-height="480" @sliding-start="onSlideStart" @sliding-end="onSlideEnd">
      <b-carousel-slide v-for="(slideData, index) in listings" :key="index" :img-src="slideData.picture">
        <b-row cols="2" class="carousel-caption">
          <b-col cols="12" lg="6" md="6" sm="12">
            <h1>{{ slideData.name }}</h1>
            <p>{{ slideData.author }}</p>
          </b-col>
          <b-col class="btn-container" cols="12" lg="6" md="6" sm="12">
            <button v-on:click="buyNowClick(index)" variant="primary" class="buyButton">Buy now</button>
          </b-col>
        </b-row>
      </b-carousel-slide>
    </b-carousel>

    <b-modal ok-only id="loginModal" title="Login Required">
      <p>You need to be logged in to buy this piece.</p>
    </b-modal>
  </div>
</template>

<script>
import { BModal } from 'bootstrap-vue'
import { Api } from '../Api'
export default {
  data() {
    return {
      slide: 0,
      sliding: null,
      userLoggedIn: false,
      listings: []
    }
  },
  components: {
    BModal
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true
    },
    onSlideEnd(slide) {
      this.sliding = false
    },
    getUserDataFromLocalStorage() {
      // Retrieve user data from local storage
      const userData = localStorage.getItem('userData')
      if (userData) {
        this.userLoggedIn = true
      }
    },
    async fetchRandomListings() {
      try {
        const response = await Api.get('/random-listings')
        this.listings = response.data
      } catch (error) {
        console.log(error)
      }
    },
    buyNowClick(index) {
      if (this.userLoggedIn) {
        const listing = this.listings[index]
        localStorage.setItem('singleListing', JSON.stringify(listing))
        this.$router.push('listing')
      } else {
        this.$bvModal.show('loginModal')
      }
    }
  },
  mounted() {
    this.getUserDataFromLocalStorage()
    this.fetchRandomListings()
  }
}
</script>

<style>
#carousel-homepage .w-100 {
  width: auto !important;
}

#carousel-homepage img {
  padding-left: 5rem;
  padding-right: 5rem;
  padding-bottom: 10rem;
  max-height: 45vh;
  margin-left: auto;
  margin-right: auto;
}

#carousel-homepage .carousel-caption {
  max-width: 55vw;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px !important;
}

#carousel-homepage .carousel-inner {
  overflow: initial;
}

#carousel-homepage .carousel-caption h1 {
  font-size: 21px;
  font-weight: 800;
  text-align: left;
  color: #606C5D;

}

#carousel-homepage .carousel-control-next-icon,
#carousel-homepage .carousel-control-prev-icon,
#carousel-homepage li {
  filter: brightness(0.5);
}

#carousel-homepage .carousel-caption p {
  font-size: 15px;
  text-align: left;
  color: #606C5D;
  padding: 0;
}

#carousel-homepage .carousel-caption .artwork {
  width: 100%;
}

#carousel-homepage .carousel-caption .btn-primary {
  width: 100%;
  height: auto;
  margin-top: 1rem;
  margin-bottom: 0;
}

@media screen and (max-width:1200px) {

  #carousel-homepage .carousel-caption {
    max-width: 55vw;

  }

}

@media screen and (max-width:992px) {
  #carousel-homepage img {
    max-width: 95vw;

  }

  #carousel-homepage .carousel-caption {
    max-width: 100vw;
  }
}

@media screen and (max-width:768px) {
  #carousel-homepage img {
    margin-bottom: 20px;
  }

}
</style>

<style scoped>
.btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media screen and (max-width: 768px) {

  h1 {
    font-size: 14px !important;
  }

  p {
    font-size: 12px !important;
  }

  .buyButton {
    width: 100%;
  }

}
</style>
