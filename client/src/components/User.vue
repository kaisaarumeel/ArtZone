<template>
<div class="user-preview mt-4">
      <b-row>
        <b-col cols="8" class="user-email">
            <h5 class="p-2">{{userEmail}}</h5>
        </b-col>
        <b-col cols="4"  class="btn-container">
         <b-button @click="banUser" variant="primary" v-if="!isBanned">Ban User</b-button>
        <b-button variant="danger" v-else>Banned</b-button>
        </b-col>
      </b-row>
</div>
</template>

<script>
import { Api } from '../Api'

export default {
  props: {
    userEmail: String

  },
  data() {
    return {
      isBanned: false
    }
  },
  methods: {
    async banUser() {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'))
        const headers = {
          'X-Auth-Token': userData.sessionKey
        }
        await Api.delete(`/users/${this.userEmail}`, { headers })
        this.isBanned = true
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
