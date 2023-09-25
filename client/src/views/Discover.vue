<template>
  <div>

    <div class="d-flex justify-content-end align-items-center pr-5">
      <b-dropdown id="price-dropdown" right text="Sort by:">
        <b-dropdown-item @click="sortListings('descending')">Price: highest first</b-dropdown-item>
        <b-dropdown-item @click="sortListings('ascending')">Price: lowest first</b-dropdown-item>
      </b-dropdown>
    </div>
  <div class="overflow-auto">

    <div class="listing-grid pr-5 pl-5 pt-2 pb-5">
        <ListingPreviewVue
          v-for="(listing, index) in listings"
          :key="index"
          :picture="listing.picture"
          :name="listing.name"
          :author="listing.author"
          :price="listing.price"
          :id="listing.id"
        ></ListingPreviewVue>
      </div>

        <b-pagination
      v-model="currentPage"
      pills :total-rows= "totalPages * perPage"
      :per-page="perPage"
      aria-controls="listings"
      size="sm"
      align="center"
      @input="changePage"
    ></b-pagination>
  </div>
    </div>
</template>

<script>
import axios from 'axios'
import ListingPreviewVue from '../components/ListingPreview.vue'

export default {
  data() {
    return {
      listings: [],
      perPage: 6,
      currentPage: 1,
      totalPages: 0,
      sort: ''
    }
  },
  components: {
    ListingPreviewVue
  },
  methods: {
    async fetchListings() {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/listings/page/${this.currentPage}`, {
          params: {
            sortBy: this.sort
          }
        })
        this.listings = response.data.listings
        this.totalPages = response.data.totalPages
      } catch (error) {
        console.error(error)
      }
    },
    sortListings(sortOrder) {
      // Update the sort property with the new sort order
      this.sort = sortOrder
      // Fetch sorted listings
      this.fetchListings()
    },
    changePage(page) {
      // Update the currentPage and fetch new listings when a page pill is clicked
      this.currentPage = page
      this.fetchListings(this.sort)
    }
  },
  mounted() {
    this.fetchListings(this.sort)
  },
  computed: {
    rows() {
      return this.totalPages
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
@media screen and (max-width:1200px) {
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
