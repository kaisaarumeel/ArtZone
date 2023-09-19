<script>
import { StripeElementPayment } from '@vue-stripe/vue-stripe'

async function getPaymentIntent(id) {
  // Default options are marked with *
  const data = { id }
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
    body: JSON.stringify(data)
  })
  return await response.json()
}

export default {
  components: {
    StripeElementPayment
  },
  props: {
    id: String,
    success: Boolean
  },
  data() {
    return {
      pk: 'pk_test_51NpDadKO47ufOaktkTaAml02MUFF7keMzi8Un5ycJo65jxW4VfGaqMNMBgBfhuJGEmCecmw0J7FbNq2dZbO4s9du00fpUwM8rg',
      elementsOptions: {
        appearance: {
          theme: 'flat',
          variables: {
            colorPrimary: '#F7E6C4',
            colorBackground: '#F7E6C4',
            colorText: '#606C5D',
            colorDanger: '#df1b41',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '2px',
            borderRadius: '0px'
          },
          rules: {
            '.Input': {
              border: '1px solid #606C5D'

            },
            '.Label': {
              color: '#F7E6C4'
            }

          }

        }
      },
      confirmParams: {
        return_url: document.location.href // success url
      },
      intentReceived: false
    }
  },
  mounted() {
    this.generatePaymentIntent()
  },
  methods: {
    async generatePaymentIntent() {
      const paymentIntent = await getPaymentIntent(this.id) // this is just a dummy, create your own API call
      this.elementsOptions.clientSecret = paymentIntent.clientSecret
      this.intentReceived = true
    },
    pay() {
      this.$refs.paymentRef.submit()
    }
  }
}
</script>

<template>
    <div class="payment">
      <div class="payment-window m-auto p-4">
        <div v-if="!this.success" class="unpaid">
          <p>Enter <strong>your payment</strong> details</p>
            <stripe-element-payment
              v-if="this.intentReceived===true"
              ref="paymentRef"
              :pk="pk"
              :elements-options="elementsOptions"
              :confirm-params="confirmParams"
            />
            <button class="mt-2 btn btn-primary" @click="pay">Pay SEK 129,000,000</button>
        </div>
        <div v-else class="unpaid">
          <p>Thank you for <strong>your order!</strong></p>

            <a href="" class="mt-2 btn btn-primary" @click="pay">Show my orders</a>
        </div>
      </div>
    </div>
  </template>
<style scoped>
  .payment{
    background-image: url(../../public/bg.png);
    background-repeat: repeat;
    background-size: contain;
    background-blend-mode: multiply;
  }
  .payment-window button {
    width: 100%;

  }
  p{
    margin-bottom: 0.5rem;
  }
  button,a{
    border:1px solid #F7E6C4;
  }
  button:hover,a:hover {
    text-decoration: underline;
    color:#F7E6C4;
    border:1px solid #F7E6C4;

  }
</style>
