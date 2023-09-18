import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import SingleListing from './views/SingleListing.vue'
import Checkout from './views/Checkout.vue'

Vue.use(Router)
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/listing/:id',
      name: 'listing',
      props: true,
      component: SingleListing
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout
    }
  ]
})
