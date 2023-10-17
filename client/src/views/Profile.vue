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
      updatedUserData: null,
      updateError: '',
      changes: '',
      changeSuccess: false,
      success: false,
      orders: null,
      orderLinks: null,
      listings: null,
      isAdmin: false,
      allListings: [],
      user: null,
      deleteMessage: '',
      listingFields: [
        { key: 'name', label: 'Name' },
        { key: 'author', label: 'Author' },
        { key: 'price', label: 'Price' },
        { key: 'picture', label: 'Picture' },
        { key: 'deleteListing', label: 'Delete Listing' }
      ],
      orderFields: [
        { key: 'seller', label: 'Seller' },
        { key: 'buyer', label: 'Buyer' },
        { key: 'listing', label: 'Listing' },
        { key: 'isReceived', label: 'Received' },
        { key: 'isShipped', label: 'Shipped' }
      ]
    }
  },
  methods: {
    async updateUser(user) {
      try {
        const totallyDifferent = user.totallyDifferent
        delete user.totallyDifferent
        this.updatedUserData = structuredClone(user)
        if (this.updatedUserData.password.length > 0) {
          this.updatedUserData.password = sha256(this.updatedUserData.password).toString(CryptoJS.enc.Hex)
        } else {
          delete this.updatedUserData.password
        }

        const userData = JSON.parse(localStorage.getItem('userData'))
        if (userData.expiry < parseInt(Date.now() / 1000)) { localStorage.removeItem('userData'); return this.$router.push('/login') }
        const url = `/users/${userData.userEmail}`

        const response = totallyDifferent
          ? await Api.put(url, this.updatedUserData, {
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Token': userData.sessionKey
            }
          })
          : await Api.patch(url, this.updatedUserData, {
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Token': userData.sessionKey
            }
          })

        if (response.status === 200) {
          this.changes = 'Your changes have been saved.'
          this.changeSuccess = true
          this.success = true
          if (this.updatedUserData.userEmail !== undefined && this.updatedUserData.userEmail !== userData.userEmail) {
            localStorage.removeItem('userData')
            localStorage.removeItem('singleListing')
            window.location.replace('/')
          }
          setTimeout(() => {
            this.changeSuccess = false
            this.success = false
          }, 3000)
          if (this.updatedUserData.userEmail !== userData.userEmail) {
            userData.userEmail = this.updatedUserData.userEmail
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
            if (response.length === 0) {
              hasNextPage = false; return
            } else {
              this.allListings.push(...response.data.listings)
              hasNextPage = response.data.hasNextPage

              page++ // Move to the next page
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    async onRowClicked(item) {
      const link = JSON.stringify(item.link)
      this.$router.push({ name: 'singleOrder', query: { link } })
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
          if (this.orders === undefined) return
          this.orderLinks = response.data.links

          for (let i = 0; i < this.orders.length; i++) {
            this.orders[i].link = this.orderLinks[i]
            if (this.orders[i].seller === this.user.userEmail) {
              this.orders[i].seller = 'you'
            } else {
              this.orders[i].buyer = 'you'
            }
          }

          await this.fetchListings()
          for (const key in this.orders) {
            for (const id in this.allListings) {
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
          this.isAdmin = user.isAdmin
        }
      } catch (err) {
        console.log(err)
      }
    },
    async deleteListing(id, sold) {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'))

        const response = await Api.delete('/users/' + userData.userEmail + '/listings/' + id, {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': userData.sessionKey
          }
        })
        if (response.status === 204) {
          await this.getListings().then(result => { this.deleteMessage = 'Listing deleted successfully.' })
        }
      } catch (err) {
        if (err.response.status === 403) {
          this.deleteMessage = 'There is an order on your listing. You cannot delete it. Your listing will be deleted when it is received by the buyer.'
        }
        console.log(err)
      }
    },
    async deleteAllListings() {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'))
        const response = await Api.delete('/users/' + userData.userEmail + '/listings', {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': userData.sessionKey
          }
        })
        if (response.status === 204) {
          await this.getListings().then(result => { this.deleteMessage = 'Listings deleted successfully. The listings with an order cannot be deleted.' })
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
          <b-col cols="12" class="ml-5 mb-2  text-left admin-btn-col">
                <b-button v-if="isAdmin" @click="goToAdminPage()" class="btn-primary btn">
                    Admin page
                </b-button>
          </b-col>
        <b-row class="mb-5 ml-2 ml-md-5 mr-2 mr-md-5">
            <b-col cols="12">
                <h4 class="fontThickness profileHeader"> My Profile </h4>
            </b-col>
            <b-col cols="12" md="6">
              <!--This component is re-used in many parts: if isLoggedIn is set to true I am accessing it under profile page-->
                <ProfileForm :isLoggedIn="true" v-on:form-data="updateUser($event)"> Save Changes </ProfileForm>
                <p class="succes" v-if="changeSuccess"> {{changes}} </p>
                <p class="error" v-if="!success"> {{updateError}} </p>
            </b-col>
            <b-col class="mt-2" cols="12" md="6">
                <h4>My Listings </h4>
                <button primary @click="deleteAllListings()" class="btn btn-primary float-left mb-2">Delete all listings</button>
                <label class="float-left pl-2">
                  {{deleteMessage}}
                </label>
                <div class="w-100 listings mt-2 mb-2">
                    <b-table class="profile-page-listings table-header-colour" :items="listings" :fields="listingFields">
                        <template #cell(picture)="data">
                            <span v-html="data.value"></span>
                        </template>
                        <template #cell(deleteListing)="data">
                            <button @click="deleteListing(data.item._id, data.item.sold)" class="btn btn-primary">Delete Listing</button>
                        </template>
                    </b-table>
                </div>
                <h4>My Orders </h4>
                <div class="w-100 orders mt-2">
                    <b-table @row-clicked="onRowClicked" class="profile-page-listings table-header-colour" :items="orders" :fields="orderFields">
                        <template #cell(listing)="data">
                            <span v-html="data.value"></span>
                        </template>
                    </b-table>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<style scoped>
  .listings, .orders{
    max-height: 35vh;
    overflow-y: scroll;
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
    .admin-btn-col {
      text-align: center !important;
      margin-left: unset !important;

    }
  }
</style>

<style>
    .profile-page-listings .table-listing-picture {
        width: 150px;
        height: auto;
    }
    .orders table{
      background-color: transparent;
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
    .table-header-colour thead tr:hover{
cursor: initial;
box-shadow: unset;
    }
</style>
