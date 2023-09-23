<template>
  <div>

    <div class="d-flex justify-content-end align-items-center pr-5">
      <b-dropdown id="price-dropdown" right text="Sort by:">
        <b-dropdown-item>Price: highest first</b-dropdown-item>
        <b-dropdown-item>Price: lowest first</b-dropdown-item>
      </b-dropdown>
    </div>
  <div class="overflow-auto">

    <div class="listing-grid pr-5 pl-5 pt-2 pb-5">
        <ListingPreviewVue
          v-for="(listing, index) in listings"
          :key="index"
          :picture="listing.picture"
          :name="listing.title"
          :author="listing.author"
        ></ListingPreviewVue>
      </div>

        <b-pagination
      v-model="currentPage"
      pills :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
      size="sm"
      align="center"
    ></b-pagination>
  </div>
    </div>
</template>

<script>
import ListingPreviewVue from '../components/ListingPreview.vue'

export default {
  data() {
    return {
      listings: [
        { title: 'Listing 1', picture: 'https://www.re-thinkingthefuture.com/wp-content/uploads/2023/01/A9049-Story-behind-the-Art-The-Last-Supper-Image-1.jpg', author: 'Author 1', captionHTML: '<div class="row bottom"><div class="col"><h1>The Last Supper</h1><p>Leonardo Da Vinci</p></div><div class="col"><button class="btn btn-primary">Buy now</button></div></div>' },
        { title: 'Listing 2', picture: 'https://www.re-thinkingthefuture.com/wp-content/uploads/2023/01/A9049-Story-behind-the-Art-The-Last-Supper-Image-1.jpg', author: 'Author 1', captionHTML: '<div class="row bottom"><div class="col"><h1>The Last Supper</h1><p>Leonardo Da Vinci</p></div><div class="col"><button class="btn btn-primary">Buy now</button></div></div>' },
        { title: 'Listing 3', picture: 'https://www.re-thinkingthefuture.com/wp-content/uploads/2023/01/A9049-Story-behind-the-Art-The-Last-Supper-Image-1.jpg', author: 'Author 1', captionHTML: '<div class="row bottom"><div class="col"><h1>The Last Supper</h1><p>Leonardo Da Vinci</p></div><div class="col"><button class="btn btn-primary">Buy now</button></div></div>' },
        { title: 'Listing 1', picture: 'https://www.re-thinkingthefuture.com/wp-content/uploads/2023/01/A9049-Story-behind-the-Art-The-Last-Supper-Image-1.jpg', author: 'Author 1', captionHTML: '<div class="row bottom"><div class="col"><h1>The Last Supper</h1><p>Leonardo Da Vinci</p></div><div class="col"><button class="btn btn-primary">Buy now</button></div></div>' },
        { title: 'Listing 2', picture: 'https://www.re-thinkingthefuture.com/wp-content/uploads/2023/01/A9049-Story-behind-the-Art-The-Last-Supper-Image-1.jpg', author: 'Author 1', captionHTML: '<div class="row bottom"><div class="col"><h1>The Last Supper</h1><p>Leonardo Da Vinci</p></div><div class="col"><button class="btn btn-primary">Buy now</button></div></div>' },
        { title: 'Listing 3', picture: 'https://www.re-thinkingthefuture.com/wp-content/uploads/2023/01/A9049-Story-behind-the-Art-The-Last-Supper-Image-1.jpg', author: 'Author 1', captionHTML: '<div class="row bottom"><div class="col"><h1>The Last Supper</h1><p>Leonardo Da Vinci</p></div><div class="col"><button class="btn btn-primary">Buy now</button></div></div>' }
      ],
      perPage: 1,
      currentPage: 1
    }
  },
  components: {
    ListingPreviewVue
  },
  methods: {
    /*
    // Fetch listings for the current page
    async fetchListings() {
      // Make an API request to your backend to fetch listings for the current page
      // You can use axios or a similar library to make the request
      const response = await axios.get(`/listings/page/${this.page}`)
      this.listings = response.data.listings
      this.totalPages = response.data.totalPages
      this.hasNextPage = response.data.hasNextPage
    },
    */
    // Navigate to the previous page
  },
  /*
  created() {
    // Fetch listings when the component is created (initial load)
    this.fetchListings()
  } */
  computed: {
    rows() {
      return this.listings.length
    }
  }
}
</script>
<style scoped>

.listing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem; /* Adjust the gap between listings */
}
@media screen and (max-width:992px) {
    .listing-grid {
     grid-template-columns: repeat(2, 1fr);
    }
}
@media screen and (max-width:768px) {
    .listing-grid {
     grid-template-columns: repeat(1, 1fr);
    }
}

</style>
<style>
.b-pagination-pills .page-item .page-link {
    color: #606C5D !important;
    border: none !important;
    background: none !important;
}

.page-link:focus {
    box-shadow: 0 0 0 0.2rem rgba(96, 108, 93, 0.25) !important;

}

.page-item.active .page-link {
    color: #F7E6C4 !important;
    background-color: #606C5D !important;
}

.btn-secondary.dropdown-toggle {
    border: none !important;
    background: none !important;
    color: #606C5D !important;
}

.btn-secondary:not(:disabled):not(.disabled):active, .btn-secondary:not(:disabled):not(.disabled).active, .show > .btn-secondary.dropdown-toggle {
    border: none !important;
    background: none !important;
    color: #606C5D !important;
}

.dropdown-menu {
    background: #606C5D !important;
    color: #F7E6C4 !important;
    border-radius: 0 !important;
}

a.dropdown-item {
    color: #F7E6C4 !important;
    background: #606C5D !important;

}

a.dropdown-item:hover{
    color: #F7E6C4 !important;
    background: #485246!important;
}
</style>
