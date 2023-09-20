<template>
 <div class="page-container">
    <div class="image-container col-6"><img class="image" src="painting.jpeg" alt="Picture"></div>
    <div class="input-fields-container col-6">
        <h1>Add a new listing</h1>

    <b-form @submit="onSubmit" v-if="show">
      <b-form-group class="label" id="input-group-1" label="Title:" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.title"
          placeholder="Enter the title of the artwork"
          required
          class="input-field"
          maxlength="50"
        ></b-form-input>
      </b-form-group>

       <b-form-group class="label" label="Author:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.author"
          placeholder="Enter the author of the artwork"
          required
          class="input-field"
        ></b-form-input>
      </b-form-group>

    <b-form-group class="label" label="Price:" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.price"
          placeholder="Enter the price of the artwork in SEK"
          required
          type="number"
          class="input-field"
          min="0"
        ></b-form-input>
      </b-form-group>

        <b-form-group class="label" label="Description:" label-for="description">
      <b-form-textarea
      id="description"
      v-model="form.description"
      placeholder="Describe the artwork..."
      rows="3"
      :maxlength="1000"
      class="input-field"
    ></b-form-textarea>
     </b-form-group>

     <p>Add an image of your artwork:</p>
    <b-form-file
      v-model="form.picture"
      :state="Boolean(form.picture)"
      placeholder="Choose a file or drop it here..."
      drop-placeholder="Drop file here..."
      required
    ></b-form-file>

        <div class="btn-container">
            <b-button type="submit" variant="primary">Add listing</b-button>
        </div>

    </b-form>

    </div>
</div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      form: {
        title: '',
        author: '',
        price: null,
        description: '',
        picture: null
      },
      show: true
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()

      // Create a FormData object to send the form data including the image file
      const formData = new FormData()
      formData.append('name', this.form.title)
      formData.append('author', this.form.author)
      formData.append('price', this.form.price)
      formData.append('description', this.form.description)
      formData.append('picture', this.form.picture)

      // Make the POST request using Axios
      axios.post('/users/bob@gmail.com/listings', formData)
        .then(response => {
        // Handle the successful response, e.g., show a success message or redirect
          console.log(response.data)
          alert('Listing added successfully')
          // Reset the form
          this.form.title = ''
          this.form.author = ''
          this.form.price = null
          this.form.description = ''
          this.form.picture = null
        })
        .catch(error => {
        // Handle errors, e.g., show an error message
          console.error(error)
          alert('Error adding listing. Please try again.')
        })
    }
  }
}
</script>
<style>
.page-container{
    display: flex;
    justify-content: center;
}
.image{
    height: auto;
    width: 100%;
    padding: 3rem;
}
.image-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
h1 {
    font-weight: bold !important;
    text-align: center;
}

p {
    font-size: 14px;
}

.btn-container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}

.input-fields-container {
    margin-right: 3rem;
}

.input-field {
    background: #FFF4F4 !important;
    color: #606C5D !important;
    mix-blend-mode: multiply !important;
    border-radius: 0 !important;
    width: 100% !important;
}
.label {
    color: #606C5D !important;
    font-size: 14px !important;
    padding: 0 !important;
}
::placeholder {
    opacity: 0.6 !important;
}
:focus {
    background-color: #FFF4F4 !important; /* Set the background color while focused */
    color: #606C5D !important; /* Set the text color while focused */
  }

.custom-file-label {
    border: none !important;
    border-radius: 0 !important;
    width: 100% !important;
}

.custom-file-label::after {
    background: #606C5D !important;
    color: #F7E6C4 !important;
    border-radius: 0 !important;
}

@media screen and (max-width:900px) {
    .image {
        display: none;
    }

    .page-container {
    flex-direction: column;
}
.input-fields-container {
    max-width: 100% !important;
}

}
</style>
