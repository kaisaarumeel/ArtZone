<template>
<div class="single-listing">
      <div class="text-center">
      <img class="artwork" :src="picture">
      </div>
      <b-row class="bottom">
        <b-col cols="12" lg="6" class="author-name">
            <h1>{{name}}</h1>
            <p>{{author}}</p>
        </b-col>
        <b-col cols="12" lg="6">
          <b-button variant="primary">Buy now</b-button>
        </b-col>
      </b-row>
</div>
</template>

<script>

export default {
  mounted() {
    this.getData()
  },
  props: {
    id: String
  },
  data() {
    return {
      picture: null,
      name: null,
      author: null
    }
  },
  methods: {
    async getData() {
      this.picture = 'https://www.re-thinkingthefuture.com/wp-content/uploads/2023/01/A9049-Story-behind-the-Art-The-Last-Supper-Image-1.jpg'
      this.name = 'The Last Supper'
      this.author = 'Leonardo Da Vinci'
    }
  }
}

</script>
<style scoped>

  h1{
    font-size: 21px;
    font-weight: 600;
    text-align: left;
    padding-top: 1rem;
  }
  p{
    font-size: 15px;
    text-align: left;
    color: #606C5D;
    padding: 0;
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
