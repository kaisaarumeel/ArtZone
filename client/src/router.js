import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import SingleListing from './views/SingleListing.vue'
import SignUp from './views/SignUp.vue'
import SignIn from './views/SignIn.vue'
import AddListing from './views/AddListing.vue'
import Discover from './views/Discover.vue'

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
      path: '/user/register',
      name: 'sign up',
      props: true,
      component: SignUp
    },
    {
      path: '/user/login',
      name: 'sign in',
      props: true,
      component: SignIn
    },
    {
      path: '/add-listing',
      name: 'addListing',
      component: AddListing
    },
    {
      path: '/discover',
      name: 'discover',
      component: Discover
    }
  ]
})
