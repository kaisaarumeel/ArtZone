<template>
  <div class="users-container">
       <div class="user">
        <UserVue
          v-for="(user, index) in users"
          :key="index"
          :userEmail="user.userEmail"
        ></UserVue>
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
      totalPages: 0
    }
  },
  components: {
    UserVue
  },
  methods: {
    async fetchUsers() {
      try {
        let page = 1
        let hasNextPage = true

        while (hasNextPage) {
          const response = await axios.get(`http://localhost:3000/api/v1/users/page/${page}`)
          this.totalPages = response.data.totalPages
          this.users = [...this.users, ...response.data.users]
          hasNextPage = response.data.hasNextPage

          page++ // Move to the next page
        }
      } catch (error) {
        console.error(error)
      }
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
.user {
    width: 80%;
}
.users-container {
    display: flex;
    justify-content: center;
}
</style>
