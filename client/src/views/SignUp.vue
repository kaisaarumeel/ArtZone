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
      session: null,
      success: true
    }
  },
  methods: {
    async createUser(user) {
      let loginData = null
      const newUser = structuredClone(user)
      newUser.password = sha256(newUser.password).toString(CryptoJS.enc.Hex)
      Api.post('users/register', newUser, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        if (response.status === 201) {
          loginData = {
            userEmail: newUser.userEmail,
            password: newUser.password
          }
        } else {
          this.success = false
          return
        }
        Api.post('users/login', loginData, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((loginResponse) => {
          if (loginResponse.status === 200) {
            const expiryDate = parseInt(Date.now() / 1000) + 3600
            const data = {
              userEmail: newUser.userEmail,
              sessionKey: loginResponse.data.key,
              expiry: expiryDate
            }
            localStorage.setItem('userData', JSON.stringify(data))
            this.$router.push({ path: '/' })
            location.reload()
          }
        }).catch((err) => {
          console.error(err)
          alert('Error loging user. Please try again.')
        })
      }).catch((err) => {
        console.error(err)
        this.success = false
      })
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
    <b-row class="m-3">
      <b-col md="6">
        <ProfileForm :isLoggedIn="false" :usedForRegister="true" v-on:form-data="createUser($event)">Create Account</ProfileForm>
      <p class="text-center error" v-if="!success">
            Error registering user. Please make sure that you have given valid credentials.
          </p>
          <p class="text-center">
            <span>Already have an account? </span>
            <span class="signInLink">
              <router-link to="/login">Sign in</router-link>
            </span>
          </p>
      </b-col>
      <b-col md="6">
        <img class="text-center" src="../../public/SignupImage.png"
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
  .error{
    color: red;
  }
  .fontThickness{
    font-size: 140%;
    font-weight: bold;
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
