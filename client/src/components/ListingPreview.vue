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
  props: {
    picture: String,
    name: String,
    author: String,
    price: Number,
    id: Number
  }
}

</script>
<style scoped>

.single-listing {
  padding: 1rem;
  border: 1px solid #606C5D;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
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
    max-height: 30vh;
    width: auto;
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
