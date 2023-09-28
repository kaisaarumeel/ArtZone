<template>
<div class="admin-board-container">
    <div class="middle">
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
        <!-- Your Listings component or content goes here -->
        <!-- Replace this with your Listings component -->
        <p>Listing component content goes here.</p>
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
      totalPages: 0,
      activeTab: 'users',
      usersFetched: false
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
            this.totalPages = response.data.totalPages
            this.users = [...this.users, ...response.data.users]
            hasNextPage = response.data.hasNextPage

            page++ // Move to the next page
            this.usersFetched = true
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    showUsers() {
      // Show the Users component and fetch users
      this.activeTab = 'users'
      this.fetchUsers()
    },
    showListings() {
      // Show the Listings component (or any other content)
      this.activeTab = 'listings'
    }
  },
  mounted() {
    this.fetchUsers()
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
