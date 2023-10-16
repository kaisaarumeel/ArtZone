<template>
 <b-row class="page-container">
    <b-col cols="6"   class="image-container"><img class="image p-5" src="/painting.jpeg" alt="Picture"></b-col>
    <b-col cols="12" lg="6"  class="p-5">
        <h1>Add a new listing</h1>

      <b-form-group class="label" id="input-group-1" label="Title*" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="listing.name.value"
          placeholder="Enter the title of the artwork"
          required
          class="input-field"
          maxlength="50"
        ></b-form-input>
      </b-form-group>

       <b-form-group class="label" label="Author*" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="listing.author.value"
          placeholder="Enter the author of the artwork"
          required
          class="input-field"
        ></b-form-input>
      </b-form-group>

    <b-form-group class="label" label="Price*" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="listing.price.value"
          placeholder="Enter the price of the artwork in SEK"
          required
          type="number"
          class="input-field"
          min="0"
        ></b-form-input>
      </b-form-group>

        <b-form-group class="label" label="Description" label-for="description">
      <b-form-textarea
      id="description"
      v-model="listing.description.value"
      placeholder="Describe the artwork..."
      rows="3"
      :maxlength="1000"
      class="input-field"
    ></b-form-textarea>
     </b-form-group>

     <p>Image*</p>
    <b-form-file
      v-model="listing.picture.value"
      :state="Boolean(listing.picture.value)"
      placeholder="Choose a file or drop it here..."
      drop-placeholder="Drop file here..."
      required
      class="create-listing-file-input"
    ></b-form-file>

        <div class="btn-container">
            <b-button v-on:click="createListing()" type="submit" variant="primary">Add listing</b-button>
            <p v-if="success">Listing created!</p>
            <p v-if="showError">Invalid or missing values.</p>
            <p v-if="showUnauthorized">Session expired, redirecting...</p>
        </div>

    </b-col>
</b-row>
</template>
<script>
import { Api } from '../Api.js'
export default {
  data() {
    return {
      listing: {
        name: {
          value: '',
          required: true
        },
        author: {
          value: '',
          required: true
        },
        price: {
          value: '',
          required: true
        },
        description: {
          value: '',
          required: false
        },
        picture: {
          value: null,
          required: true
        }
      },
      success: false,
      showError: false,
      showUnauthorized: false
    }
  },
  mounted() {
    const userData = localStorage.getItem('userData')
    if (userData === null) window.location.replace('/login')
    const parsedData = JSON.parse(userData)
    if (parseInt(Date.now() / 1000) > parsedData.expiry) {
      window.location.replace('/login')
    }
  },
  methods: {
    async createListing() {
      for (const key in this.listing) {
        if (!this.listing[key].value && this.listing[key].required) {
          this.showError = true
          setTimeout(() => {
            this.showError = false
          }, 3000)
          break
        }
      }
      if (this.showError) return

      const reader = new FileReader()
      reader.readAsDataURL(this.listing.picture.value)
      const state = this
      reader.onloadend = async function () {
        const payload = {}
        for (const key in state.listing) {
          payload[key] = state.listing[key].value
        }
        payload.picture = reader.result
        const userData = JSON.parse(localStorage.getItem('userData'))

        const headers = {
          'X-Auth-Token': userData.sessionKey
        }

        Api.post('users/' + userData.userEmail + '/listings', payload, { headers })
          .then(response => {
            // Handle the successful response, e.g., show a success message or redirect
            state.success = true
            for (const key in state.listing) {
              state.listing[key].value = null
            }
            setTimeout(() => {
              state.success = false
            }, 3000)
          })
          .catch(() => {
            state.showError = true
            setTimeout(() => {
              state.showError = false
            }, 1500)
          })
      }
    }
  }
}
</script>
<style scoped>
.btn-container {
    gap: 12px;
    align-items: baseline;
}
.image{
    height: auto;
    width: 100%;
}
.image-container {
    display: flex;
    align-items: center;
}
h1 {
    font-weight: bold;
    text-align: center;
}

p {
    font-size: 14px;
}

.btn-container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

.input-field {
    background: #50604c21;
    border-radius: 0;
}

.label {
    color: #606C5D;
    font-size: 14px;
    padding: 0 ;
}
::placeholder {
    opacity: 0.6 !important;
}
.input-field:focus {
    background-color: #50604c21 !important; /* Set the background color while focused */
    color: #606C5D !important; /* Set the text color while focused */
  }

.custom-file-label {
    border: none;
    border-radius: 0;
}

.custom-file-label::after {
    background: #50604c21;
    color: #F7E6C4;
    border-radius: 0;
}

@media screen and (max-width:1000px) {
    .image {
        display: none;
    }

}
</style>
<style>
.create-listing-file-input input ,.create-listing-file-input label{
    background: #50604c21;
    color: #606C5D;

    border-radius: 0;

}
.create-listing-file-input .custom-file-label::after {
    background: transparent;
    color:  #606C5D;
    border-radius: 0;
    opacity: 0.6;
}

.create-listing-file-input .custom-file-label span {
   opacity: 0.6;
}

</style>
