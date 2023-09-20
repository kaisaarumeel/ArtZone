<script>
import Reviews from '../components/Reviews.vue'
import Checkout from '../components/Checkout.vue'
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
  mounted() {
    this.checkParams()
    this.getData()
  },
  components: {
    Reviews,
    Checkout
  },
  props: {
    id: String
  },
  data() {
    return {
      picture: null,
      name: null,
      author: null,
      seller: null,
      sellerRating: null,
      description: null,
      size: null,
      type: null,
      material: null,
      condition: null,
      price: null,
      sellerReviewsName: null,
      success: false
    }
  },
  methods: {
    async checkParams() {
      const urlParams = new URLSearchParams(document.location.search)
      const paymentIntent = urlParams.get('payment_intent')
      if (paymentIntent == null) return
      this.success = true
      this.$refs.paymentModalTrigger.click()
      // User has completed order

      /*
      const payload = {
        seller: 'bobylon@gmail.com',
        listing: '65099d75307bfd3b8c80920b',
        payment_intent: paymentIntent
      }
      const response = await fetch('http://localhost:3000/api/v1/checkout/', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(payload)
      })
      return await response.json() */
    },
    async getData() {
      this.picture = 'https://www.re-thinkingthefuture.com/wp-content/uploads/2023/01/A9049-Story-behind-the-Art-The-Last-Supper-Image-1.jpg'
      this.name = 'The Last Supper'
      this.author = 'Leonardo Da Vinci'
      this.seller = 'bobman123@gmail.com'
      this.sellerRating = 23
      this.description = `The Last Supper,” a masterpiece by Leonardo da Vinci, is a large
        mural painting that covers the back wall of the dining hall at the Convent of Santa Maria delle
        Grazie in Milan, Italy.
        The painting depicts the dramatic scene from the final days of Jesus Christ,
        as described in the Gospel of John, 13:21, where Jesus announces that on
        e of his twelve apostles would betray him. The moment captured by da Vin
        ci is filled with astonishment, disbelief, and shock, as each apostle re
        acts differently to the news, questioning who the traitor amongst them is.`
      this.size = '123x30 cm'
      this.type = 'Oil'
      this.material = 'Canvas'
      this.condition = 'Mint'
      this.price = await beautifyLongNumber(129000000)
      this.sellerReviewsName = this.seller + '  ⭐' + this.sellerRating
    }
  }
}

</script>
<template>
<div class="single-listing">
  <b-modal id="modal-2" modal-class="reviews" hide-backdrop>
    <Checkout :id="this.id" :success="this.success"></Checkout>
  </b-modal>
  <b-modal id="modal-1" modal-class="reviews" hide-backdrop>
    <Reviews :email='seller' :seller='sellerReviewsName'></Reviews>
  </b-modal>
  <b-row cols="2">
    <b-col sm="12" md="12" lg="8" cols="12" >
      <div class="text-center">
      <img class="border artwork" :src="picture">
      </div>
    </b-col>
    <b-col sm="12" md="12" lg="4" cols="12">
      <div class="border">
      <h1>{{name}}</h1>
      <p>{{author}} <br> by <span class="seller" v-b-modal.modal-1>{{seller }} ⭐{{sellerRating}}</span></p>
      <p>{{ description }}</p>
        <b-row cols="2">
          <b-col><span>Size: {{ size }}</span></b-col>
          <b-col><span>Type: {{ type }}</span></b-col>
        </b-row>
        <b-row cols="2">
          <b-col>Material: {{ material }}</b-col>
          <b-col>Condition: {{ condition}}</b-col>
        </b-row>
        <b-row cols="1">
          <b-col class="listing-price"><span><span class="price">SEK: {{ price }}</span> <sup>+ free shipping</sup></span></b-col>
        </b-row>
      </div>
      <div class="text-center">
        <b-button id="payment-button" ref="paymentModalTrigger" v-b-modal.modal-2 variant="primary">Buy now</b-button>
      </div>
    </b-col>
  </b-row>
</div>
</template>
<style scoped>
  .border{
    border:1px solid #606C5D !important;
    padding:1rem;
  }
  .seller{
    text-decoration: underline;
    font-weight: 600;
  }
  h1{
    font-size: 21px;
    font-weight: 600;
    text-align: left;
  }
  p{
    font-size: 15px;
    text-align: left;
  }
  .price{
    font-weight: 600;
    font-size: 21px;
  }
  .listing-price{
    text-align: center;
    margin:1rem;

  }
  .artwork{
    width:100%;
    max-width: fit-content;
    max-height: 80vh;
  }
  .single-listing{
    padding:5rem;
  }

  .btn-primary{
    width:80%;
    margin-top:1rem;

  }
  .modal-header,.modal-content,.modal-footer,#modal-1 {
    background-color: #606C5D;

  }

  .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #606C5D !important;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.3rem;
    outline: 0;
}

  @media screen and (max-width:576px){
    .single-listing{
      padding:2rem;
    }
  }
</style>
