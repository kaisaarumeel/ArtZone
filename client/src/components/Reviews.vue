<script>
export default {
  mounted() {
    this.getData()
  },
  props: {
    email: String,
    seller: String
  },
  data() {
    return {
      reviews: [],
      avg: 0
    }
  },
  methods: {
    async getData() {
      for (let i = 0; i < 10; i++) {
        const entry = {
          description: 'Their art curation is fantastic, and the buying experience was a breeze',
          rating: Math.random() * 5
        }
        this.reviews.push(entry)
      }
      let avg = 0
      for (let i = 0; i < this.reviews.length; i++) {
        avg += this.reviews[i].rating
      }
      this.avg = parseInt(avg / this.reviews.length)
    }
  }
}
</script>
<template>
    <div>
        <div class="profile-wrapper">
            <h2>Seller profile</h2>
            <p class="underline">{{ seller }}</p>
        </div>
        <div>
            <b-row cols="2">
                <b-col class="text-center">
                    <p>Average rating: <span v-for="index in avg" :key="index" >⭐</span></p>
                </b-col>
                <b-col class="text-center">
                    <p>Member since: <span class="bold">2022-08-01</span></p>
                </b-col>
            </b-row>
            <hr>
        </div>
        <div class="reviews-wrapper">
        <div v-for="(review, index) in reviews" :key="index">
            <div class="box">
                <p>{{ review.description }} ⭐ {{ review.rating }}</p>
            </div>
        </div>
         </div>

    </div>
</template>
<style scoped>
.profile-wrapper {
    margin-bottom:0.5rem;
}
.underline{
    text-decoration:underline;
}
.bold {
    font-weight:600
}
p{
    font-weight:300;
    margin-bottom:0px;
}
h2 {
    font-size: 1.3rem;
}
h3 {
    font-weight:300;
}
.box {
    margin-top:1rem;
    padding:0.5rem;
    border:1px solid #F7E6C4;
}

.box p{
    margin-bottom:0px;
}

.reviews-wrapper::-webkit-scrollbar {
  width: 5px;
border-radius:30px;
}

/* Track */
.reviews-wrapper::-webkit-scrollbar-track {
  background: #3c433a;
  border-radius:30px;
}
/* Handle */
.reviews-wrapper::-webkit-scrollbar-thumb {
  background: #F7E6C4;
  border-radius:30px;
}

/* Handle on hover */
.reviews-wrapper::-webkit-scrollbar-thumb:hover {
  background: hsl(40, 76%, 87%);
}
.reviews-wrapper{
    max-height:10rem;
    overflow-x:hidden;
    overflow-y:scroll;
    padding-left: 1rem;
    padding-right: 1rem;

}
</style>
