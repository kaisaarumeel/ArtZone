<script>
import Reviews from '../components/Reviews.vue'
import Checkout from '../components/Checkout.vue'
import { Api } from '../Api.js'

export default {
  mounted() {
    this.checkParams()
    this.getData()
  },
  components: {
    Reviews,
    Checkout
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
      id: '',
      ready: false
    }
  },
  methods: {
    async checkParams() {
      const urlParams = new URLSearchParams(document.location.search)
      const paymentIntent = urlParams.get('payment_intent')
      if (paymentIntent == null) return
      this.success = true
      this.$refs.paymentModalTrigger.click()
    },
    async getData() {
      const unparsedListing = localStorage.getItem('singleListing')
      if (unparsedListing === null) this.$router.push('/')
      const parsedListing = JSON.parse(unparsedListing)
      const reviews = await Api.get('users/' + parsedListing.creator + '/reviews')
      this.reviews = reviews.data
      this.picture = parsedListing.picture
      this.name = parsedListing.name
      this.author = parsedListing.author
      this.seller = parsedListing.creator
      this.sellerRating = reviews.data.length
      this.description = parsedListing.description
      this.price = (parsedListing.price)
      this.sellerReviewsName = this.seller + '  ⭐' + this.sellerRating
      this.id = parsedListing._id
      this.ready = true
    }
  }
}

</script>
<template>
<div class="single-listing p-5">

  <b-modal id="modal-1" modal-class="reviews w-100" hide-backdrop>
    <Reviews :reviews="reviews" :email='seller' :seller='sellerReviewsName'></Reviews>
  </b-modal>
  <b-row cols="2">
    <b-col sm="12" md="12" lg="8" cols="12" >
      <div class="text-center">
      <img class="border artwork w-100" :src="picture">
      </div>
    </b-col>
    <b-col sm="12" md="12" lg="4" cols="12">
      <div class="border p-3 mt-2">
      <h1 class="font-weight-bold text-left">{{name}}</h1>
      <p class="text-left">{{author}} <br>Sold by <span class="seller font-weight-bold" v-b-modal.modal-1>{{seller }} ⭐{{sellerRating}}</span></p>
      <p class="text-left mb-0"><strong>Description</strong></p>
      <p class="text-left">{{ description }}</p>

        <b-row cols="1">
          <b-col class="listing-price text-left m-2"><span><span class="price font-weight-bold">SEK: {{ price }}</span> <sup>+ free shipping</sup></span></b-col>
        </b-row>
      </div>
      <div class="text-center mt-2">
        <div id="modal-2" modal-class="w-100" hide-backdrop>
    <Checkout v-if="ready" :email="seller" :id="id"></Checkout>
  </div>
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
