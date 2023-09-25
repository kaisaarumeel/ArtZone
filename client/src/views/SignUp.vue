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
      const newUser = Object.assign(user)
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
            const data = {
              userEmail: newUser.userEmail,
              sessionKey: loginResponse.data.key
            }
            localStorage.setItem('userData', JSON.stringify(data))
            this.$router.push({ path: '/' })
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
    <b-row>
      <b-col class="pl-5 pr-3" md="6">
        <ProfileForm v-on:user-creation="createUser($event)">Create Account</ProfileForm>
      </b-col>
      <b-col md="6">
        <img class="pl-2 pr-5 text-center" src="../../public/SignupImage.png"
        alt="Sign up images">
      </b-col>
       <b-col cols="12" md="6">
          <p class="text-center error" v-if="!success">
            Error registering user. Please make sure that you have given valid credentials.
          </p>
          <p class="text-center">
            <span>Already have an account? </span>
            <span class="signInLink">
              <router-link to="/user/login">Sign in</router-link>
            </span>
          </p>
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
