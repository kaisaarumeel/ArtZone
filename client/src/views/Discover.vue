<template>
  <div>
    <b-modal ok-only ref="loginModal" title="Login Required">
      <p>You need to be logged in to buy this piece.</p>
    </b-modal>

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
          :name="listing.name"
          :author="listing.author"
          :price="listing.price"
          :picture="listing.picture"
          :description="listing.description"
          :creator="listing.creator"
          :sold="listing.sold"
          :id="listing._id"
          @show-login-modal="showLoginModal"
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
import ListingPreviewVue from '../components/ListingPreview.vue'
import { Api } from '../Api'

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
    showLoginModal() {
      this.$refs.loginModal.show()
    },
    async fetchListings() {
      try {
        const response = await Api.get(`/listings/page/${this.currentPage}`, {
          params: {
            sortBy: this.sort,
            showSold: false
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
  gap: 3rem;
}
@media screen and (max-width:1200px) {
    .listing-grid {
     grid-template-columns: repeat(2, 1fr);
    }
}
@media screen and (max-width:768px) {
    .listing-grid {
     grid-template-columns: repeat(1, 1fr);
     padding: 1rem !important;
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
