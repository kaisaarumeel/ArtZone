<script>
import { Api } from '../Api'

export default {
  props: ['link'],
  data() {
    return {
      isReceived: false,
      isShipped: false,
      listing: {
        name: '',
        picture: '',
        price: '',
        description: '',
        creator: '',
        author: ''
      },
      listings: [],
      order: { seller: '' },
      successMsg: '',
      failureMsg: '',
      sellerReviews: null,
      sellerRating: 0,
      orderUpdateText: '',
      isSeller: true
    }
  },
  methods: {
    async fetchListings() {
      try {
        if (!this.usersFetched) {
          let page = 1
          let hasNextPage = true

          while (hasNextPage) {
            const response = await Api.get(`/listings/page/${page}`)
            if (response.length === 0) {
              hasNextPage = false; return
            } else {
              this.listings.push(...response.data.listings)
              hasNextPage = response.data.hasNextPage

              page++ // Move to the next page
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    async getOrder() {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'))
        const linkObject = JSON.parse(this.link)
        const order = await Api.get(linkObject.href, {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': userData.sessionKey
          }
        })
        console.log(this.listings)
        console.log(order.data)
        // eslint-disable-next-line eqeqeq
        this.listing = this.listings.find(listing => listing._id == order.data.listing)
        console.log(this.listing)
        this.order = order.data
        if (this.order.seller === userData.userEmail) {
          this.orderUpdateText = 'Shipped'
          this.isSeller = true
        } else {
          this.orderUpdateText = 'Received'
          this.isSeller = false
        }
      } catch (err) {
        console.log(err)
      }
    },
    async updateOrder() {
      const oldOrder = structuredClone(this.order)
      try {
        this.order.isReceived = this.isReceived
        this.order.isShipped = this.isShipped
        // eslint-disable-next-line eqeqeq
        if (oldOrder == this.order) {
          // eslint-disable-next-line no-useless-return
          return
        }
        const userData = JSON.parse(localStorage.getItem('userData'))
        const url = `/users/${userData.userEmail}/orders/${this.id}`
        let payload
        if (this.order.seller === userData.userEmail) {
          payload = {
            isShipped: this.order.isShipped,
            buyer: this.order.buyer
          }
        } else {
          payload = {
            isReceived: this.order.isReceived,
            seller: this.order.seller
          }
        }
        const response = await Api.patch(url, payload)
        if (response.status === 200) {
          this.successMsg = 'Changes saved successfully'
        }
      } catch (err) {
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (err.response.status === 403) {
          if (this.order.seller === userData.userEmail) {
            this.failureMsg = 'You cannot change the shipping status of an order that is received by the buyer'
          } else {
            this.failureMsg = 'You need to wait for your order to be shipped'
          }
          this.order = structuredClone(oldOrder)
        }
        console.log(err)
      }
    },
    async getSellerReviews() {
      try {
        const url = `/users/${this.order.seller}/reviews`
        const reviews = await Api.get(url)
        this.sellerReviews = reviews.data
        this.sellerRating = reviews.data.length
      } catch (err) {
        console.log(err)
      }
    }
  },
  async mounted() {
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (!userData) {
      return this.$router.push('/')
    }
    if (userData.expiry < parseInt(Date.now() / 1000)) {
      localStorage.removeItem('userData')
      return this.$router.push('/')
    }
    await this.fetchListings()
    await this.getOrder()
    await this.getSellerReviews()
  }
}
</script>

<template>
    <div>
      <b-row class="pl-5">
        <b-col cols="12">
        </b-col>
        <b-col cols="12">
        </b-col>
      </b-row>
      <b-row class="align-items-center pb-3 pl-5 pr-5">
        <b-col class="text-center" cols="12" md="8">

          <img class="pl-5 pr-5 text-center" :src="listing.picture">
        </b-col>
        <b-col cols="12" md="4" class="p-5 mt-2">
        <div class="border p-3">
                   <h1 class="font-weight-bold"> {{listing.name}} </h1>

                              <p class=""> By {{listing.author}} <br>Sold by <span class="seller font-weight-bold" v-b-modal.modal-1>{{order.seller}} ⭐{{sellerRating}}</span></p>

          <p class="text-left mb-0"><strong>Description</strong></p>
          <p class="text-left">{{ listing.description }}</p>
          <b-row cols="1">
            <b-col class="text-left m-2"><span><span class="price font-weight-bold">SEK: {{ listing.price }}</span> <sup>+ free shipping</sup></span></b-col>
            <b-col class="text-left">
              <h6 v-if="isShipped && isReceived"> Shipped and received </h6>
              <h6 v-if="isShipped"> Shipped </h6>
              <h6 v-if="!isShipped"> Not Shipped yet </h6>
            </b-col>
            <b-col class="pb-5 text-center">
              <b-button variant="primary" class="m-2" @click="updateOrder()"> Mark as {{orderUpdateText}} </b-button>
              <b-button variant="primary" class="m-2" v-if="!isSeller" @click="rateSeller()"> Rate the Seller </b-button>
            </b-col>
          </b-row>
        </div>
        </b-col>
      </b-row>
    </div>
</template>

<style scoped>
  img{
    width: 80%;
    height: auto;
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
  .border{
    border:1px solid #606C5D !important;
  }
  .seller{
    text-decoration: underline;
  }
</style>
