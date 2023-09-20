<template>
  <div>
    <AddListingVue></AddListingVue>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'
import AddListingVue from './AddListing.vue'

export default {
  name: 'home',
  data() {
    return {
      message: 'none'
    }
  },
  components: {
    AddListingVue
  },
  methods: {
    getMessage() {
      Api.get('/')
        .then(response => {
          this.message = response.data.message
        })
        .catch(error => {
          this.message = error
        })
    }
  }
}
</script>

<style>
.btn_message {
  margin-bottom: 1em;
}
</style>
