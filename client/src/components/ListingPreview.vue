<template>
<div class="single-listing">
      <div class="text-center">
      <img class="border artwork" :src="picture">
      </div>
      <div class="bottom">
        <div class="author-name">
            <h1>{{name}}</h1>
            <p>{{author}}</p>
        </div>
            <b-button variant="primary">Buy now</b-button>
      </div>
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
  .border{
    border:1px solid #606C5D !important;
    padding:1rem;
  }

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
    max-width: fit-content;
  }
    .bottom {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    padding-bottom: 0;
    margin: 0;
    }
  .btn-primary{
    width:40%;
    height: 50px;
    margin-top:1rem;
    margin-bottom: 0;
  }

  @media screen and (max-width:576px){

    .bottom {
        flex-direction: column;
    }

    .btn-primary {
        width:100%;
    }

    h1 {
        font-size: 16px;
    }
  }
</style>
