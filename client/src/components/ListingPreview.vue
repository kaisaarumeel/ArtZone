<template>
  <div v-on:click="buyNowClick()" class="single-listing">
    <div class="text-center">
      <img class="artwork" :src="picture">
    </div>
    <b-row class="bottom">
      <b-col cols="6" class="author-name">
        <h1>{{ name }}</h1>
        <p>{{ author }}</p>
      </b-col>
      <b-col cols="6">
        <b-button variant="primary">{{ price }} <sup>SEK</sup></b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>

export default {
  data() {
    return {
      listing: {
        name: '',
        author: '',
        price: null,
        picture: '',
        description: '',
        creator: '',
        sold: false,
        id: ''
      },
      userLoggedIn: false
    }
  },
  props: {
    name: String,
    author: String,
    price: Number,
    picture: String,
    description: String,
    creator: String,
    sold: Boolean,
    id: String

  },
  methods: {
    buyNowClick() {
      if (!this.userLoggedIn) {
        this.$emit('show-login-modal')
      } else {
        const listing = {
          name: this.name,
          author: this.author,
          price: this.price,
          picture: this.picture,
          description: this.description,
          creator: this.creator,
          sold: this.sold,
          _id: this.id
        }
        localStorage.setItem('singleListing', JSON.stringify(listing))
        this.$router.push('listing')
      }
    },
    getUserDataFromLocalStorage() {
      const userData = localStorage.getItem('userData')
      if (userData) {
        this.userLoggedIn = true
      }
    }
  },
  mounted() {
    this.getUserDataFromLocalStorage()
  }
}

</script>
<style scoped>
.single-listing:hover {
  cursor: pointer;
}

.single-listing {
  padding: 1rem;
  border: 1px solid #606C5D;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  padding-top: 1rem;
  margin: 0;
}

p {
  font-size: 14px;
  text-align: left;
  color: #606C5D;
  padding: 0;
  margin: 0;
}

.price p {
  font-size: 16px;
  text-align: left;
  padding-top: 0.5rem;
  margin: 0;
}

.artwork {
  max-height: 30vh;
  width: auto;
}

.btn-primary {
  width: 100%;
  height: auto;
  margin-top: 1rem;
  margin-bottom: 0;
}

@media screen and (max-width:576px) {

  .artwork {
    max-width: 80vw;
    height: auto;
  }

  h1 {
    font-size: 16px;
  }

}

.artwork {
  max-height: 30vh;
  width: auto;
}</style>
