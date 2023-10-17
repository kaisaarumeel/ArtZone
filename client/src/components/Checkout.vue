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
    this.generatePaymentIntent()
  },
  methods: {
    async generatePaymentIntent() {
      const userData = localStorage.getItem('userData')
      if (userData === null) return window.location.replace('/login')
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

      paypal.Buttons({
        style: {
          layout: 'horizontal'
        },
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
            const errorDetail = Array.isArray(orderData.details) && orderData.details[0]

            if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
              return actions.restart() // Recoverable state, per:
              // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
            }

            if (errorDetail) {
              this.showError = true
              return
            }

            // Successful capture!
            const transaction = orderData.purchase_units[0].payments.captures[0]
            self.success = true
            self.transaction = transaction.id
          }).catch(() => {
            self.showError = true
            setTimeout(() => {
              self.showError = false
            }, 3000)
          })
        }

      }).render('#paypal-button-container')
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
        <router-link to="/profile">
        <div class="paid-orders p-3">
          <strong>My orders</strong>
        </div>
      </router-link>
      </div>
    </div>
  </div>
</template>
<style scoped>
.error {
  color: red;
}

.payment {
  background-image: url(../../public/bg.png);
  background-repeat: repeat;
  background-size: contain;
  background-blend-mode: multiply;
}

.paid {
  background: #ffc439;
  border-radius: 4px;
  width: 100%;
}

.paid-orders {
  background-color: #2C2E2F;
  color: #fff;
  border-radius: 2px;
}

.paid-orders a {
  color: #fff !important;
}

.pay {
  color: #00457c;
  font-size: 1.2rem;
  font-weight: 600;

}

.pal {
  color: #0079C1;
  font-size: 1.2rem;
  font-weight: 600;
}

.paid-orders:hover {
  background-color: #585858 !important;
  cursor: pointer;
}

.paid-orders p {
  position: static;
  visibility: visible;
  max-width: 0%;
  opacity: 0;
  overflow: hidden;
  animation: show-text 1s 0s forwards;
  font-weight: 600;
}

@keyframes show-text {
  0% {
    max-width: 0%;
    opacity: 0;
    overflow: hidden;
  }

  100% {
    max-width: 100%;
    opacity: 1;
  }
}</style>
