<script>
import { Api } from '../Api.js'
import ProfileForm from '../components/ProfileForm.vue'
import sha256 from 'crypto-js/sha256'
import CryptoJS from 'crypto-js'

export default {
  components: {
    ProfileForm
  },
  data() {
    return {
      user: null,
      session: null
    }
  },
  methods: {
    async createUser(user) {
      const newUser = Object.assign(user)
      newUser.password = sha256(user.password).toString(CryptoJS.enc.Hex)
      const response = await Api.post('http://localhost:3000/api/v1/users/register', newUser, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.data
    }
  }
}

</script>

<template>
  <div>
    <b-row>
      <b-col md="7" sm="12">
        <h4 class="title text-center">
          <span class="fontThickness">Sign up</span>
          <span> to </span>
          <span class="fontThickness">Artzone</span>
        </h4>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="pl-5 pr-3" md="6">
        <ProfileForm v-on:user-creation="createUser($event)">Create Account</ProfileForm>
      </b-col>
      <b-col md="6">
        <img class="pl-2 pr-5 text-center" src="../../public/SignupImage.png"
        alt="Sign up images">
      </b-col>
    </b-row>
  </div>
</template>

<style scoped>
  img{
    width: 100%;
    height: auto;
  }

  .fontThickness{
    font-size: 140%;
    font-weight: bold;
  }
  .signInText{
    margin-left: 17%;
  }
  .signInLink{
    text-decoration-line: underline;
    text-decoration-color: #606C5D;
  }
  @media screen and (max-width:768px){
    img{
        display:none;
    }
    .signInText{
        margin-left: 33%;
    }

  }
</style>
