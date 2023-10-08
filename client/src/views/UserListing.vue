<script>
import { Api } from '../Api.js'

async function beautifyLongNumber(num) {
  let result = ''
  const array = num.toString().split('')
  let counter = 0
  for (let i = 0; i < array.length; i++) {
    result += array[i]
    if (counter === 2 && i + 1 < array.length) {
      result += ','
      counter = 0
    } else {
      counter++
    }
  }
  return result
}

export default {
  props: ['link'],
  mounted() {
    this.getData()
  },
  data() {
    return {
      picture: null,
      name: null,
      author: null,
      seller: null,
      sellerRating: null,
      description: null,
      price: null,
      sellerReviewsName: null,
      success: false,
      reviews: [],
      id: ''
    }
  },
  methods: {
    async getData() {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'))
        const listing = await Api.get(this.link, {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': userData.sessionKey
          }
        })
        if (listing.status === 200) {
          const reviews = await Api.get('users/' + userData.userEmail + '/reviews')
          this.reviews = reviews.data
          this.picture = listing.data.picture
          this.name = listing.data.name
          this.author = listing.data.author
          this.seller = listing.data.creator
          this.sellerRating = reviews.data.length
          this.description = listing.data.description
          this.price = await beautifyLongNumber(listing.data.price)
          this.sellerReviewsName = this.seller + '  ⭐' + this.sellerRating
          this.id = listing.data._id
        }
      } catch (err) {
        console.log(err)
      }
    },
    async deleteListing() {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'))
        const response = await Api.delete('/users/' + userData.userEmail + '/listings/' + this.id, {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': userData.sessionKey
          }
        })
        if (response.status === 204) {
          this.$router.push({ name: 'profile' })
        }
      } catch (err) {

      }
    }
  }
}

</script>

<template>
<div class="single-listing p-5">

  <b-row cols="2">
    <b-col sm="12" md="12" lg="8" cols="12" >
      <div class="text-center">
      <img class="border artwork w-100" :src="picture">
      </div>
    </b-col>
    <b-col sm="12" md="12" lg="4" cols="12">
      <div class="border p-3 mt-2">
        <h1 class="font-weight-bold text-left">{{name}}</h1>
        <p class="text-left">{{author}} <br>Sold by <span class="seller font-weight-bold">{{seller }} ⭐{{sellerRating}}</span></p>
        <p class="text-left mb-0"><strong>Description</strong></p>
        <p class="text-left">{{ description }}</p>

        <b-row cols="1">
          <b-col class="listing-price text-left m-2"><span><span class="price font-weight-bold">SEK: {{ price }}</span> <sup>+ free shipping</sup></span></b-col>
          <b-col class="pb-5 text-center">
            <b-button variant="primary" class="m-2" @click="deleteListing()"> Delete Listing </b-button>
          </b-col>
        </b-row>
      </div>
    </b-col>
  </b-row>
</div>
</template>

<style scoped>
  .border{
    border:1px solid #606C5D !important;
  }
  .seller{
    text-decoration: underline;
    overflow-wrap: break-word;
  }
  h1{
    font-size: 21px;
  }
  p{
    font-size: 15px;
  }
  .price{
    font-size: 21px;
  }
  .artwork{
    max-width: fit-content;
    max-height: 80vh;
  }

  .btn-primary{
    width:80%;
  }
  .modal-header,.modal-content,.modal-footer,#modal-1 {
    background-color: #606C5D;
  }

  @media screen and (max-width:576px){
    .single-listing{
      padding:2rem;
    }
  }
</style>
