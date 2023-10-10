<script>
import { Api } from '../Api'
import Reviews from '../components/Reviews.vue'
export default {
  components: {
    Reviews
  },
  props: ['link'],
  data() {
    return {
      isReceived: false,
      isShipped: false,
      starWidth: 0,
      reviewErrorMessage: '',
      addReviewError: false,
      usersRating: 0,
      reviewDescription: '',
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
      reviews: null,
      rating: 0,
      orderUpdateText: '',
      isSeller: true,
      disallowReview: false
    }
  },
  methods: {
    async postReview() {
      const reviewTarget = this.isSeller === false ? this.order.seller : this.order.buyer
      const payload = {
        order: this.order.hash,
        description: this.reviewDescription,
        rating: this.usersRating
      }
      const userData = JSON.parse(localStorage.getItem('userData'))
      try {
        await Api.post(`/users/${reviewTarget}/reviews`, payload, {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': userData.sessionKey

          }
        })
      } catch (err) {
        switch (err.response.status) {
          case 400:
            this.reviewErrorMessage = 'Missing description.'
            break
          case 403:
            this.reviewErrorMessage = 'Already reviewed.'
            break
          default:
            this.reviewErrorMessage = 'Unknown error.'
            break
        }

        this.addReviewError = true
        setTimeout(() => {
          this.addReviewError = false
        }, 3000)
      }
    },
    async updateStar(stars) {
      if (this.disallowReview) return
      const starShare = 80 / 5
      this.starWidth = starShare * stars
      this.usersRating = stars
      this.postReview()
    },
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

        this.listing = this.listings.find(listing => listing._id === order.data.listing)
        this.order = order.data
        if (this.order.seller === userData.userEmail) {
          this.orderUpdateText = 'Shipped'
          this.isShipped = this.order.isShipped
        } else {
          this.orderUpdateText = 'Received'
          this.isReceived = this.order.isReceived
          this.isSeller = false
        }
        this.isShipped = this.order.isShipped
        this.isReceived = this.order.isReceived
      } catch (err) {
        console.log(err)
      }
    },
    async updateOrder() {
      // const oldOrder = structuredClone(this.order)
      try {
        // this.order.isReceived = this.isReceived
        // this.order.isShipped = this.isShipped
        // eslint-disable-next-line eqeqeq
        // if (oldOrder == this.order) {
        // eslint-disable-next-line no-useless-return
        // return
        // }
        const userData = JSON.parse(localStorage.getItem('userData'))
        const url = `/users/${userData.userEmail}/orders/${this.order._id}`
        let payload
        if (this.order.seller === userData.userEmail) {
          payload = {
            isShipped: true,
            buyer: this.order.buyer
          }
        } else {
          payload = {
            isReceived: true,
            seller: this.order.seller
          }
        }
        const response = await Api.patch(url, payload, {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': userData.sessionKey
          }
        })
        if (response.status === 200) {
          this.successMsg = 'Changes saved successfully'
          await this.getOrder()
        }
      } catch (err) {
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (err.response.status === 403) {
          if (this.order.seller === userData.userEmail) {
            this.failureMsg = 'You cannot change the shipping status of an order that is received by the buyer'
          } else {
            this.failureMsg = 'You need to wait for your order to be shipped'
          }
          // this.order = structuredClone(oldOrder)
        }
        console.log(err)
      }
    },
    async getSellerReviews() {
      try {
        const url = `/users/${this.order.seller}/reviews`
        const reviews = await Api.get(url)
        this.reviews = reviews.data
        this.rating = reviews.data.length
        for (let i = 0; i < this.reviews.length; i++) {
          if (this.order.hash === this.reviews[i].orderHash) {
            this.disallowReview = true
            this.reviewDescription = this.reviews[i].description
            this.starWidth = this.reviews[i].rating * (80 / 5)
          } else {
            console.log(this.order.hash)
            console.log(this.reviews[i].orderHash)
          }
        }
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
    console.log(this.isShipped)
  }

}
</script>

<template>
  <div>
    <b-modal id="modal-1" modal-class="reviews w-100 p-5" hide-backdrop>
    <Reviews :reviews="reviews" :seller="order.seller"></Reviews>
  </b-modal>
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
            <p class=""> By {{listing.author}} <br>Sold by <span class="seller font-weight-bold" >{{order.seller}} ⭐{{sellerRating}}</span></p>
          <p class="text-left mb-0"><strong>Description</strong></p>
          <p class="text-left">{{ listing.description }}</p>

          <p class="text-left mb-0"><strong>Price</strong></p>
          <p class="text-left"><span><span class="">SEK {{ listing.price }}</span> <sup>+
                  free shipping</sup></span></p>
          <p class="text-left mb-0"><strong>Status</strong></p>
          <p class="text-left">
            <span v-if="isShipped && isReceived"> Shipped and received </span>
              <span v-if="isShipped"> Shipped </span>
              <span v-if="!isShipped"> Not Shipped yet </span>

          </p>
          <p class="text-left mb-0"><strong>Delivery Status</strong></p>

          <p class="text-left">
              <a v-if="!isShipped || !isReceived" class="updateDelivery" @click="updateOrder()"> Mark as {{ orderUpdateText }}
              </a>
          </p>

          <p class="text-left mb-0">
            <strong v-if="!disallowReview">Add Review</strong>
            <strong v-else>Review</strong>
          </p>
          <span class="text-left">
            <textarea :disabled="disallowReview" v-model="reviewDescription"></textarea>
            <div class="star-rating">
                <span class="starRatingGrey">
                  <span v-for="(index) in 5" :key="index" @click="updateStar(index)">⭐</span>
                </span><span :style="'width:' + this.starWidth + 'px'" class="starRating">
                  <span v-for="(index) in 5" :key="index" @click="updateStar(index)">⭐</span>
                </span>
              </div>
              <p class="red" v-if="addReviewError">{{reviewErrorMessage}}</p>
            </span>

          <b-row cols="1">
            <b-col class="pb-5 text-center">

            </b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<style scoped>
textarea {
  max-height: 80px;
}

.red {
  color:red
}
.updateDelivery {
  color:#606C5D;
  text-decoration: underline;
}
.updateDelivery:hover {
  color:#3c433a;
  cursor: pointer;
}
img {
  width: 80%;
  height: auto;
}

h1 {
  font-size: 21px;
}

p {
  font-size: 15px;
}

.starRatingGrey {
  filter: grayscale(1);

}
.starRatingGrey:hover,.starRating:hover{
  cursor: pointer;
}

.starRating {
  position: absolute;
  margin-left: -80px;
  overflow: hidden;
}

.price {
  font-size: 21px;
}

.artwork {
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
    overflow-wrap: break-word;
  }
</style>
