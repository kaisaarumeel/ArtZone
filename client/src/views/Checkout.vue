<script>
/* eslint-disable */ 
import { StripeElementPayment } from '@vue-stripe/vue-stripe';

async function getPaymentIntent(){
    
}


export default {
    components: {
        StripeElementPayment,
    },
    data () {
        return {
        pk: 'pk_test_51NpDadKO47ufOaktkTaAml02MUFF7keMzi8Un5ycJo65jxW4VfGaqMNMBgBfhuJGEmCecmw0J7FbNq2dZbO4s9du00fpUwM8rg',
        elementsOptions: {
            appearance: {}, // appearance options
        },
        confirmParams: {
            return_url: 'http://localhost:8080/success', // success url
        },
        };
    },
    mounted () {
        this.generatePaymentIntent();
    },
    methods: {
        async generatePaymentIntent () {
        const paymentIntent = await getPaymentIntent(); // this is just a dummy, create your own API call
        this.elementsOptions.clientSecret = paymentIntent.client_secret;
        },
        pay () {
        this.$refs.paymentRef.submit();
        },
    },
};
</script>

<template>
    <div>
      <stripe-element-payment
        ref="paymentRef"
        :pk="pk"
        :elements-options="elementsOptions"
        :confirm-params="confirmParams"
      />
      <button @click="pay">Pay Now</button>
    </div>
  </template>
