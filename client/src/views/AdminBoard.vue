<template>
<div class="admin-board-container">
    <div>
            <button size="sm" class="user-btn" @click="showUsers" :class="{ active: activeTab === 'users' }">Users</button>
            <button size="sm" class="listing-btn" @click="showListings" :class="{ active: activeTab === 'listings' }">Listings</button>
            <button size="sm" class="listing-btn" @click="showReviews" :class="{ active: activeTab === 'reviews' }">Reviews</button>

    </div>
  <div class="users-container">
       <div class="user" v-if="activeTab === 'users'">
        <UserVue
          v-for="(user, index) in users"
          :key="index"
          :userEmail="user.userEmail"
        ></UserVue>
      </div>
      <div v-if="activeTab === 'listings'">
        <div class="w-100 listings mt-2 mb-2">
            <b-table v-if="this.listings.length>0" responsive class="admin-page-table" :items="listings" :fields="listingFields">
            <template #cell(picture)="data">
                <span v-html="data.value"></span>
            </template>
            <template #cell(deleteListing)="data">
                <button @click="deleteListing(data.item.creator, data.item._id)" class="btn btn-primary">Delete Listing</button>
            </template>
        </b-table>
        <div v-else><p>There are no listings in the system.</p></div>
        </div>
      </div>
            <div v-if="activeTab === 'reviews'">
              <div class="w-100 mt-4 mb-4 d-flex justify-content-center justify-content-md-end">
                 <button @click="confirmDeleteAllReviews" class="btn btn-primary">Delete all reviews</button>
              </div>
        <div class="w-100 reviews mt-2 mb-2">
            <b-table v-if="this.reviews.length>0" responsive class="admin-page-table" :items="reviews" :fields="reviewFields">
            <template #cell(deleteReview)="data">
                <button @click="deleteReview(data.item.userEmail, data.item._id)" class="btn btn-primary">Delete Review</button>
            </template>
        </b-table>
        <div v-else><p>There are no reviews in the system.</p></div>
        </div>
      </div>

  </div>
</div>
</template>

<script>
import UserVue from '../components/User.vue'
import { Api } from '../Api'

export default {
  data() {
    return {
      users: [],
      isAdmin: false,
      listings: [],
      reviews: [],
      totalPages: 0,
      activeTab: 'users',
      usersFetched: false,
      listingsFetched: false,
      reviewsFetched: false,
      sort: '',
      delete: '',
      listingFields: [
        { key: 'name', label: 'Name' },
        { key: 'author', label: 'Author' },
        { key: 'price', label: 'Price' },
        { key: 'picture', label: 'Picture' },
        { key: 'description', label: 'Description' },
        { key: 'creator', label: 'Creator' },
        { key: 'sold', label: 'Sold' },
        { key: 'deleteListing', label: 'Delete Listing' }
      ],
      reviewFields: [
        { key: 'userEmail', label: 'User Email' },
        { key: 'description', label: 'Description' },
        { key: 'rating', label: 'Rating' },
        { key: 'deleteReview', label: 'Delete Review' }
      ]
    }
  },
  components: {
    UserVue
  },
  methods: {
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
    async fetchUsers() {
      try {
        if (!this.usersFetched) {
          let page = 1
          let hasNextPage = true
          const userData = JSON.parse(localStorage.getItem('userData'))

          while (hasNextPage) {
            const response = await Api.get(`/users/page/${page}`, {
              headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': userData.sessionKey
              }
            })
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
            const response = await Api.get(`/listings/page/${page}`, {
              params: {
                sortBy: this.sort,
                showSold: true
              }
            })
            if (Array.isArray(response.data.listings) && response.data.listings.length > 0) {
              for (const key in response.data.listings) {
                const image = `<img class="table-listing-picture" src="${response.data.listings[key].picture}">`
                response.data.listings[key].picture = image
                response.data.listings[key].deleteListing = ''
              }
              this.listings.push(...response.data.listings)
            }
            hasNextPage = response.data.hasNextPage

            page++ // Move to the next page
            this.listingsFetched = true
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    async fetchReviews() {
      const userData = JSON.parse(localStorage.getItem('userData'))
      try {
        if (!this.reviewsFetched) {
          const response = await Api.get('/reviews', {
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Token': userData.sessionKey
            }
          })
          if (Array.isArray(response.data.reviews) && response.data.reviews.length > 0) {
            for (const key in response.data.reviews) {
              response.data.reviews[key].deleteListing = ''
            }
            this.reviews = response.data.reviews
            this.reviewsFetched = true
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
    showReviews() {
      this.activeTab = 'reviews'
      this.fetchReviews()
    },
    async deleteListing(userEmail, listingID) {
      const userData = JSON.parse(localStorage.getItem('userData'))
      const headers = {
        'X-Auth-Token': userData.sessionKey
      }
      try {
        const response = await Api.delete(`/users/${userEmail}/listings/${listingID}`, { headers })
        if (response.status === 204) {
        // The listing was successfully deleted, you update local data
          this.listings = this.listings.filter(listing => listing._id !== listingID)
        } else {
          console.error('Failed to delete listing')
        }
      } catch (error) {
        console.error(error)
      }
    },
    async deleteReview(userEmail, reviewID) {
      const userData = JSON.parse(localStorage.getItem('userData'))
      const headers = {
        'X-Auth-Token': userData.sessionKey
      }
      try {
        const response = await Api.delete(`/users/${userEmail}/reviews/${reviewID}`, { headers })
        if (response.status === 204) {
        // The listing was successfully deleted, you update local data
          this.reviews = this.reviews.filter(review => review._id !== reviewID)
        } else {
          console.error('Failed to delete review')
        }
      } catch (error) {
        console.error(error)
      }
    },
    async confirmDeleteAllReviews() {
      const confirmed = window.confirm('Are you sure you want to delete all reviews in the system?')

      if (confirmed) {
        // If user confirms, proceed with deletion
        await this.deleteAllReviews()
      }
    },
    async deleteAllReviews() {
      const userData = JSON.parse(localStorage.getItem('userData'))
      const headers = {
        'X-Auth-Token': userData.sessionKey
      }
      try {
        const response = await Api.delete('/reviews', { headers })
        if (response.status === 204) {
        // The listing was successfully deleted, you update local data
          this.reviews = []
        } else {
          console.error('Failed to delete reviews')
        }
      } catch (error) {
        console.error(error)
      }
    }
  },
  async mounted() {
    await this.getUser()
    if (!this.isAdmin) {
      window.location.replace('/')
    } else {
      this.fetchUsers()
      this.fetchListings()
    }
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
    .admin-page-table .table-listing-picture {
        width: 150px;
        height: auto;
    }
    .admin-page-table td{
        color: #606C5D;
        vertical-align: unset !important;
        border: none !important;

    }
    .admin-page-table th {
        border: none !important;

    }
    .admin-page-table tr{
        transition: 0.3s;
        color: #606C5D;
        border: none;
    }
    .admin-page-table tr:hover {
        cursor: pointer;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }
</style>
