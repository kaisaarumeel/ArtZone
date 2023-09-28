<template>
<div class="admin-board-container">
    <div>
            <button size="sm" class="user-btn" @click="showUsers" :class="{ active: activeTab === 'users' }">Users</button>
            <button size="sm" class="listing-btn" @click="showListings" :class="{ active: activeTab === 'listings' }">Listings</button>

    </div>
  <div class="users-container">
       <div class="user" v-if="activeTab === 'users'">
        <UserVue
          v-for="(user, index) in users"
          :key="index"
          :userEmail="user.userEmail"
        ></UserVue>
      </div>
      <div v-else>
        <div class="w-100 listings mt-2 mb-2">
            <b-table responsive class="admin-page-listings" :items="listings">
            <template #cell(picture)="data">
                <span v-html="data.value"></span>
            </template>
            <template #cell(_id)="" v-if="false">
            </template>
            <template #cell(deleteListing)="data">
                <button @click="deleteListing(data.item.creator, data.item._id)" class="btn btn-primary">Delete Listing</button>
            </template>
        </b-table>
        </div>
      </div>

  </div>
</div>
</template>

<script>
import axios from 'axios'
import UserVue from '../components/User.vue'

export default {
  data() {
    return {
      users: [],
      listings: [],
      totalPages: 0,
      activeTab: 'users',
      usersFetched: false,
      listingsFetched: false,
      sort: '',
      delete: ''
    }
  },
  components: {
    UserVue
  },
  methods: {
    async fetchUsers() {
      try {
        if (!this.usersFetched) {
          let page = 1
          let hasNextPage = true

          while (hasNextPage) {
            const response = await axios.get(`http://localhost:3000/api/v1/users/page/${page}`)
            this.users.push(...response.data.users)
            hasNextPage = response.data.hasNextPage

            page++ // Move to the next page
            this.usersFetched = true
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    async fetchListings() {
      try {
        if (!this.listingsFetched) {
          let page = 1
          let hasNextPage = true

          while (hasNextPage) {
            const response = await axios.get(`http://localhost:3000/api/v1/listings/page/${page}`, {
              params: {
                sortBy: this.sort
              }
            })
            console.log(response.data)
            for (const key in response.data.listings) {
              const image = `<img class="table-listing-picture" src="${response.data.listings[key].picture}">`
              response.data.listings[key].picture = image
              response.data.listings[key].deleteListing = ''
            }
            this.listings.push(...response.data.listings)
            console.log(this.listings)
            hasNextPage = response.data.hasNextPage

            page++ // Move to the next page
            this.listingsFetched = true
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    showUsers() {
      this.activeTab = 'users'
      this.fetchUsers()
    },
    showListings() {
      this.activeTab = 'listings'
      this.fetchListings()
    },
    async deleteListing(userEmail, listingID) {
      console.log(userEmail, listingID)
      const userData = JSON.parse(localStorage.getItem('userData'))
      const headers = {
        'X-Auth-Token': userData.sessionKey
      }
      try {
        const response = await axios.delete(`http://localhost:3000/api/v1/users/${userEmail}/listings/${listingID}`, { headers })
        if (response.status === 204) {
        // The listing was successfully deleted, you update local data
          this.listings = this.listings.filter(listing => listing._id !== listingID)
        } else {
          console.error('Failed to delete listing')
        }
      } catch (error) {
        console.error(error)
      }
    }
  },
  mounted() {
    this.fetchUsers()
    this.fetchListings()
  },
  computed: {
    rows() {
      return this.totalPages
    }
  }
}
</script>
<style scoped>
.admin-board-container {
    margin-left: 5rem;
    margin-right: 5rem;
}
.user-btn, .listing-btn{
color: #606C5D;
background: none;
}

.active {
  color: #F1C376 !important;
  text-decoration: underline !important;
}

@media screen and (max-width:768px) {
    .admin-board-container {
    margin-left: 2rem;
    margin-right: 1rem;
}
}
</style>
<style>
    .admin-page-listings .table-listing-picture {
        width: 150px;
        height: auto;
    }
    .admin-page-listings td{
        color: #606C5D;
        vertical-align: unset !important;
        border: none !important;

    }
    .admin-page-listings th {
        border: none !important;

    }
    .admin-page-listings tr{
        transition: 0.3s;
        color: #606C5D;
        border: none;
    }
    .admin-page-listings tr:hover {
        cursor: pointer;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }
</style>
