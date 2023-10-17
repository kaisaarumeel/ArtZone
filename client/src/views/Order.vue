<script>
import { Api } from '../Api'
import Reviews from '../components/Reviews.vue'
export default {
  components: {
    Reviews
  },
  data() {
    return {
      isReceived: false,
      isShipped: false,
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
      isSubmitted: false,
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
        setTimeout(() => {
        // Set the isSubmitted to true to update the button label
          this.isSubmitted = true
        }, 1000) // 2-second delay
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
      this.usersRating = stars
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
        const linkObject = JSON.parse(this.$route.query.link)
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
      try {
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
          if (this.isShipped === true && !this.isSeller) this.isReceived = true
          this.successMsg = 'Changes saved successfully'
          if (this.isShipped && this.isReceived) return this.$router.push('/profile')
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
          setTimeout(() => {
            this.failureMsg = ''
          }, 3000)
        }
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
            this.usersRating = this.reviews[i].rating
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
    showReceivedModal() {
      if (this.isSeller) return this.updateOrder()
      if (!this.isSeller && this.isShipped === false) return this.updateOrder()
      this.$refs.receivedModal.show()
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
<div class="single-order p-4 mt-3 mt-md-0 p-md-5">

  <b-modal id="modal-1" modal-class="reviews w-100 p-5" hide-backdrop>
    <Reviews :reviews="reviews" :seller="order.seller"></Reviews>
    </b-modal>
    <b-modal @ok="updateOrder()" ref="receivedModal" title="Warning!">
      <p>When you mark an order as received, it will be deleted from your order page! Would you like to proceed?</p>
    </b-modal>
<b-row cols="2">
  <b-col sm="12" md="12" lg="8" cols="12" >
    <div class="text-center">
    <img class="border artwork w-100" :src="listing.picture">
    </div>
  </b-col>
  <b-col sm="12" md="12" lg="4" cols="12">
    <div class="border p-3 mt-2">
    <h1 class="font-weight-bold text-left">{{listing.name}}</h1>
    <p class="text-left">{{listing.author}} <br>Sold by <span class="seller font-weight-bold" v-b-modal.modal-1>{{order.seller }} ⭐{{rating}}</span></p>
    <p class="text-left mb-0"><strong>Description</strong></p>
    <p class="text-left">{{ listing.description }}</p>

      <b-row cols="1">
        <b-col class="listing-price text-left m-2"><span><span class="price font-weight-bold">SEK: {{ listing.price }}</span> <sup>+ free shipping</sup></span></b-col>
      </b-row>
      <p class="text-left mb-0"><strong>Status</strong></p>

      <p class="text-left">
            <span v-if="isShipped && isReceived"> Shipped and received </span>
              <span v-if="isShipped && !isReceived"> Shipped </span>
              <span v-if="!isShipped"> Not Shipped yet </span>

          </p>
          <p class="text-left mb-0"><strong>Delivery Status</strong></p>

          <p class="text-left">
              <a v-if="!isShipped || !isReceived" class="updateDelivery" @click="showReceivedModal()"> Mark as {{ orderUpdateText }}
              </a>

          </p>
          <p class="red" v-if="failureMsg.length>0">{{ failureMsg }}</p>
          <div v-if="!this.isSeller" >
          <p class="text-left mb-0">
            <strong v-if="!disallowReview">Add Review</strong>
            <strong v-else>Review</strong>
          </p>
          <span class="text-left">
            <textarea :disabled="disallowReview" v-model="reviewDescription"></textarea>
            <div class="star-rating">
              <span :class="usersRating>=index? 'fa fa-star checked' : 'fa fa-star' " v-for="(index) in 5" :key="index" @click="updateStar(index)"></span>
              </div>
              <p class="red" v-if="addReviewError">{{reviewErrorMessage}}</p>
              <button v-if="!disallowReview" @click="postReview()" class="btn mt-2 w-100 reviewBtn btn-primary">{{ isSubmitted ? "Submitted" : "Submit Review" }}</button>
            </span>
        </div>
    </div>

  </b-col>
</b-row>
</div>

</template>

<style scoped>

textarea {
  max-height: 80px;
    background-color: #50604c21;
    border: none;
    border-radius: 0px;
  width:100%;
}
.fa:hover {
  cursor: pointer;
}
.checked {
  color:orange;
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

img{
    max-width: fit-content;
    max-height: 80vh;
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
