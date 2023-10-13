<script>
export default {
  props: {
    reviews: Array,
    seller: String
  },
  computed: {
    avg: function () {
      let avg = 0
      for (let i = 0; i < this.reviews.length; i++) {
        avg += this.reviews[i].rating
      }
      return (avg / this.reviews.length)
    }
  }
}
</script>
<template>
  <div class="reviews p-2">
    <div class="profile-wrapper mb-1">
      <h2>Seller profile</h2>
      <p class="underline">{{ seller }}</p>
    </div>
    <div>
      <b-row cols="2">
        <b-col class="text-center">
          <span>Average rating: </span>
          <div class="star-rating">
              <span :class="avg>=index? 'fa fa-star checked' : 'fa fa-star' " v-for="(index) in 5" :key="index"></span>
              </div>

        </b-col>
        <b-col class="text-center">
          <p class="font-weight-light">Total ratings: <span class="font-weight-bold">{{ reviews.length }}</span></p>
        </b-col>
      </b-row>
      <hr>
    </div>
    <div class="reviews-wrapper px-3">
      <div v-for="(review, index) in reviews" :key="index">
        <div class="box">
          <p>{{ review.description }} ⭐ {{ review.rating }}</p>
        </div>
      </div>
    </div>

  </div>
</template>
<style scoped>
.starRatingGrey {
  filter: grayscale(1);
}

.checked {
  color:orange;
}

.reviews {
  background-image: url(../../public/bg.png);
  background-repeat: repeat;
  background-size: contain;
  background-blend-mode: multiply;
}

.underline {
  text-decoration: underline;
}

p {
  margin-bottom: 0px;
}

h2 {
  font-size: 1.3rem;
}

.box {
  margin-top: 1rem;
  padding: 0.5rem;
  border: 1px solid #F7E6C4;
}

.box p {
  margin-bottom: 0px;
}

.reviews-wrapper::-webkit-scrollbar {
  width: 5px;
  border-radius: 30px;
}

/* Track */
.reviews-wrapper::-webkit-scrollbar-track {
  background: #3c433a;
  border-radius: 30px;
}

/* Handle */
.reviews-wrapper::-webkit-scrollbar-thumb {
  background: #F7E6C4;
  border-radius: 30px;
}

/* Handle on hover */
.reviews-wrapper::-webkit-scrollbar-thumb:hover {
  background: hsl(40, 76%, 87%);
}

.reviews-wrapper {
  max-height: 10rem;
  overflow-x: hidden;
  overflow-y: scroll;

}</style>
