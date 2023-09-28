<template>
<div class="user-preview mt-4">
      <b-row>
        <b-col cols="8" class="user-email">
            <h5 class="p-2">{{userEmail}}</h5>
        </b-col>
        <b-col cols="4"  class="btn-container">
          <b-button v-on:click="banUser()" variant="primary">Ban user</b-button>
        </b-col>
      </b-row>
</div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    userEmail: String

  },
  methods: {
    async banUser() {
      try {
        const headers = 'X-Auth-Token'
        const response = await axios.delete(`http://localhost:3000/api/v1/users/${this.userEmail}`, { headers })
        if (response.status === 200) {
          console.log(`User with email "${this.userEmail}" has been banned.`)
        } else {
          console.error(`Failed to ban user with email "${this.userEmail}".`)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
}

</script>
<style scoped>
.user-email {
    color: #F7E6C4;
    background: #606C5D;
    display: flex;
    align-items: center;
}
.btn-container {
    display: flex;
    justify-content: center;
}
</style>
