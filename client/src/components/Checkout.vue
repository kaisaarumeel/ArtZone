<script>
/* global paypal */
import { Api } from '../Api'
export default {
  props: {
    id: String,
    email: String
  },
  data() {
    return {

      success: false,
      showError: false,
      transaction: ''
    }
  },
  mounted() {
    console.log(this.id)
    console.log(this.email)

    this.generatePaymentIntent()
  },
  methods: {
    async generatePaymentIntent() {
      const userData = localStorage.getItem('userData')
      if (userData === null) window.location.replace('/login')
      const parsedData = JSON.parse(userData)
      if (parseInt(Date.now() / 1000) > parsedData.expiry) {
        this.$router.push('login')
      }
      const headers = {
        'X-Auth-Token': parsedData.sessionKey
      }
      const payload = {
        id: this.id, email: this.email, buyer: parsedData.userEmail
      }
      const orderPayload = {
        seller: this.email,
        listing: this.id
      }
      const self = this

      const buttons = paypal.Buttons({

        // Call your server to set up the transaction
        createOrder: function (data, actions) {
          return Api.post('checkout', payload, { headers }).then(function (res) {
            return res.data
          }).then(function (orderData) {
            return orderData.id
          })
        },
        onError: function (data, actions) {
          self.showError = true
          setTimeout(() => {
            self.showError = false
          }, 3000)
          return true
        },

        // Call your server to finalize the transaction
        onApprove: function (data, actions) {
          orderPayload.paypalOrderId = data.orderID
          return Api.post('users/' + parsedData.userEmail + '/orders', orderPayload, { headers }).then(function (res) {
            return res.data
          }).then((orderData) => {
            // Three cases to handle:
            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            //   (2) Other non-recoverable errors -> Show a failure message
            //   (3) Successful transaction -> Show confirmation or thank you

            // This example reads a v2/checkout/orders capture response, propagated from the server
            // You could use a different API or structure for your 'orderData'
            const errorDetail = Array.isArray(orderData.details) && orderData.details[0]

            if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
              return actions.restart() // Recoverable state, per:
              // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
            }

            if (errorDetail) {
              this.showError = true
              return
            }

            // Successful capture! For demo purposes:
            const transaction = orderData.purchase_units[0].payments.captures[0]
            self.success = true
            self.transaction = transaction.id
            // Replace the above to show a success message within this page, e.g.
            // const element = document.getElementById('paypal-button-container');
            // element.innerHTML = '';
            // element.innerHTML = '<h3>Thank you for your payment!</h3>';
            // Or go to another URL:  actions.redirect('thank_you.html');
          }).catch(() => {
            self.showError = true
            setTimeout(() => {
              self.showError = false
            }, 3000)
          })
        }

      }).render('#paypal-button-container')
      console.log(buttons)
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
        <p class="p-2 error" v-if="showError">An error occurred. Please try again later.</p>

        <div v-if="!this.success" class="unpaid">
          <div id="paypal-button-container"></div>
        </div>
        <div v-else>
            <div class="paid">
            <p class="py-3"><span class="pay">Your order</span> <strong class="pal">is confirmed!</strong></p>
          </div>
          <div class="paid-orders">
            <p href="" class="py-3">My orders</p>
          </div>
        </div>

      </div>
    </div>
  </template>
<style scoped>
.error {
  color:red;
}
  .payment{
    background-image: url(../../public/bg.png);
    background-repeat: repeat;
    background-size: contain;
    background-blend-mode: multiply;
  }
  button,a{
    border:1px solid #F7E6C4;
  }
.paid{
  background: #ffc439;
  border-radius: 4px;
  width:100%;
}

.paid-orders{
  border-radius: 4px;
  background-color: #2C2E2F;
  color:#fff;
}
.pay {
    color:#00457c;
    font-size:1.2rem;
    font-weight: 600;

}
.pal{
 color:#0079C1;
 font-size:1.2rem;
  font-weight: 600;
}
.paid-orders:hover {
  background-color: #585858 !important;
  cursor: pointer;
}
.paid-orders p{    position: static;
    visibility: visible;
    max-width: 0%;
    opacity: 0;
    overflow: hidden;
    animation: show-text 1s 0s forwards;
    font-weight: 600;
  }

@keyframes show-text {
  0%{
    max-width: 0%;
    opacity: 0;
    overflow: hidden;
  }
  100% {
    max-width: 100%;
    opacity: 1;
}
}
</style>
