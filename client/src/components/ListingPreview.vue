<template>
<div class="single-listing">
      <div class="text-center">
      <img class="artwork" :src="picture">
      </div>
      <b-row class="bottom">
        <b-col cols="6" class="author-name">
            <h1>{{name}}</h1>
            <p>{{author}}</p>
        </b-col>
        <b-col cols="6">
          <router-link :to="{ name: 'listing', params: { id: id } }">
          <b-button variant="primary">{{price}} <sup>SEK</sup></b-button>
          </router-link>
        </b-col>
      </b-row>
</div>
</template>

<script>

export default {
  mounted() {
    this.getData()
  },
  data() {
    return {
      picture: null,
      name: null,
      author: null,
      price: null,
      id: null
    }
  },
  methods: {
    async getData() {
      this.picture = 'https://www.re-thinkingthefuture.com/wp-content/uploads/2023/01/A9049-Story-behind-the-Art-The-Last-Supper-Image-1.jpg'
      this.name = 'The Last Supper'
      this.author = 'Leonardo Da Vinci'
      this.price = 200000
      this.id = 1
    }
  }
}

</script>
<style scoped>

  h1{
    font-size: 16px;
    font-weight: 600;
    text-align: left;
    padding-top: 1rem;
    margin: 0;
  }
  p{
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
  .artwork{
    width:100%;
  }
  .btn-primary{
    width:100%;
    height: auto;
    margin-top:1rem;
    margin-bottom: 0;
  }

  @media screen and (max-width:576px){

    h1 {
        font-size: 16px;
    }

  }
</style>
