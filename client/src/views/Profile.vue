<script>
import { Api } from '../Api'
import ProfileForm from '../components/ProfileForm.vue'
import sha256 from 'crypto-js/sha256'
import CryptoJS from 'crypto-js'

export default {
  components: {
    ProfileForm
  },
  data() {
    return {
      afterUpdateUser: null,
      updateError: '',
      changes: '',
      changeSuccess: false,
      success: false,
      orders: null,
      orderLinks: null,
      listings: null,
      isAdmin: false,
      allListings: [],
      listingFetched: false,
      user: null
    }
  },
  methods: {
    async updateUser(user) {
      try {
        this.afterUpdateUser = structuredClone(user)
        this.afterUpdateUser.password = sha256(this.afterUpdateUser.password).toString(CryptoJS.enc.Hex)
        console.log(this.afterUpdateUser)
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (userData.expiray < Date.now()) this.$router.push('/')
        const url = `/users/${userData.userEmail}`
        const response = await Api.patch(url, this.afterUpdateUser, {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': userData.sessionKey
          }
        })
        if (response.status === 200) {
          this.changes = 'Your changes have been saved.'
          this.changeSuccess = true
          this.success = true
          setTimeout(() => {
            this.changeSuccess = false
            this.success = false
          }, 3000)
          if (this.afterUpdateUser.userEmail !== userData.userEmail) {
            userData.userEmail = this.afterUpdateUser.userEmail
          }
        }
      } catch (err) {
        console.log(err)
        this.updateError = 'Could not save changes. Please provide correct credentials'
      }
    },
    async getListings() {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (userData.expiry < parseInt(Date.now() / 1000)) return this.$router.push('/')
        const url = `users/${userData.userEmail}/listings/`
        const response = await Api.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': userData.sessionKey
          }
        })
        if (response.status === 200) {
          for (const key in response.data) {
            const image = `<img class="table-listing-picture" src="${response.data[key].picture}">`
            response.data[key].picture = image
            delete response.data[key].description
            delete response.data[key].creator
            delete response.data[key].sold
            delete response.data[key]._id
          }
          this.listings = response.data
        }
      } catch (err) {
        console.log(err)
      }
    },
    async fetchListings() {
      try {
        if (!this.usersFetched) {
          let page = 1
          let hasNextPage = true

          while (hasNextPage) {
            const response = await Api.get(`/listings/page/${page}`)
            this.allListings.push(...response.data.listings)
            hasNextPage = response.data.hasNextPage

            page++ // Move to the next page
            this.listingFetched = true
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    async getOrders() {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (userData.expiry < parseInt(Date.now() / 1000)) return this.$router.push('/')
        const url = `/users/${userData.userEmail}/orders/`
        const response = await Api.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': userData.sessionKey
          }
        })
        if (response.status === 200) {
          this.orders = response.data.orders
          for (const key in this.orders) {
            delete this.orders[key]._id
            delete this.orders[key].hash
            delete this.orders[key].paypalOrderId
            if (this.orders[key].seller === this.user.userEmail) {
              delete this.orders[key].seller
            } else {
              delete this.orders[key].buyer
            }
          }
          this.orderLinks = response.data.links
          await this.fetchListings()
          for (const key in this.orders) {
            console.log(this.orders[key])
            for (const id in this.allListings) {
              console.log(this.allListings[id])
              if (this.orders[key].listing === this.allListings[id]._id) {
                this.orders[key].listing = `<img class="table-listing-picture" src="${this.allListings[id].picture}">`
              }
            }
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
    async goToAdminPage() {
      this.$router.push('/admin-board')
    },
    async logOut() {
      localStorage.removeItem('userData')
      this.$router.push('/')
    },
    async goToListing() {
      alert('bob')
    },
    async goToOrder() {
      alert('bob')
    },
    async getUser() {
      const userData = JSON.parse(localStorage.getItem('userData'))
      try {
        const url = `/users/${userData.userEmail}`
        const response = await Api.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': userData.sessionKey
          }
        })
        if (response.status === 200) {
          this.user = response.data
          const user = response.data
          console.log(response.data)
          this.isAdmin = user.isAdmin
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
    await this.getUser()
    await this.getListings()
    await this.getOrders()
  }
}
</script>

<template>
    <div>
        <b-row class="mb-5 ml-5 mr-5">
            <b-col cols="12">
                <h4 class="fontThickness profileHeader"> My Profile </h4>
            </b-col>
            <b-col cols="12" md="6">
                <ProfileForm isLoggedIn="true" v-on:user-creation="updateUser($event)"> Save Changes </ProfileForm>
                <p class="succes" v-if="changeSuccess"> {{changes}} </p>
                <p class="error" v-if="!success"> {{updateError}} </p>
            </b-col>
            <b-col class="mt-2" cols="12" md="6">
                <h4> Listings </h4>
                <div class="w-100 listings mt-2 mb-2">
                    <b-table @row-clicked="redirect()" class="profile-page-listings table-header-colour" :items="listings">
                        <template #cell(picture)="data">
                            <span v-html="data.value"></span>
                        </template>
                    </b-table>
                </div>
                <h4> Orders </h4>
                <div class="w-100 orders mt-2">
                    <b-table class="profile-page-listings table-header-colour" :items="orders">
                        <template #cell(listing)="data">
                            <span v-html="data.value"></span>
                        </template>
                    </b-table>
                </div>
            </b-col>
            <b-col cols="6" class="pt-3 text-left">
                <b-button class="pl-2 pr-2 btn-primary btn" @click="logOut()">Log out </b-button>
            </b-col>
            <b-col cols="6" class="pt-3 text-right">
                <b-button v-if="isAdmin" @click="goToAdminPage()" class="pl-2 pr-2 btn-primary btn">
                    Admin page
                </b-button>
            </b-col>
        </b-row>
    </div>
</template>

<style scoped>
  .listings, .orders{
    max-height: 35vh;
    overflow-y: scroll;
    background-color: #FFF4F4;
    border-color: #FFF4F4;
    mix-blend-mode: multiply;
  }
  .success{
    color: #21450e;
  }
  .error{
    color: red;
  }
  .fontThickness{
    font-size: 180%;
    font-weight: bold;
  }
  @media screen and (max-width: 768px) {
    .profileHeader {
        text-align: center;
    }
  }
</style>

<style>
    .profile-page-listings .table-listing-picture {
        width: 150px;
        height: auto;
    }
    .table-header-colour thead tr{
        background-color: #606C5D;
        color: #F7E6C4;
    }
    .profile-page-listings thead {
    position: sticky;
    width: 100%;
    top: 0;
    z-index: 1;
    }
    .profile-page-listings td{
        vertical-align: unset !important;

    }
    .profile-page-listings tr{
        transition: 0.3s;
    }
    .profile-page-listings tr:hover {
        cursor: pointer;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }
</style>
