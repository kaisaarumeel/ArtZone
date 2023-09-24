<script>
import sha256 from 'crypto-js/sha256'
import { Api } from '../Api.js'
import CryptoJS from 'crypto-js'
export default {
  data() {
    return {
      data: {
        userEmail: '',
        password: ''
      },
      loginRespose: '',
      success: false
    }
  },
  methods: {
    async logUserIn() {
      console.log(this.data)
      const request = Object.assign(this.data)
      console.log(request)
      request.password = sha256(request.password).toString(CryptoJS.enc.Hex)
      console.log(request)
      const response = await Api.post('users/login', request, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        localStorage.setItem('sessionKey', response.data.key)
        this.success = true
        this.$router.push({ path: '/' })
      } else {
        this.loginRespose = 'Something went wrong.'
      }
    }
  }
}
</script>

<template>
    <div class="pl-5 pr-5 pb-5">
        <b-row>
            <b-col cols="12" md="6">
                <h4 class="text-center">
                    <span class="fontThickness">Sign up</span>
                    <span> to </span>
                    <span class="fontThickness">Artzone</span>
                </h4>
                <b-form-group class="label" label="Email*" label-for="input-1">
                    <b-form-input
                    id="input-1"
                    v-model="data.userEmail"
                    placeholder="Enter your email"
                    type="email"
                    required
                    class="input-field"
                    ></b-form-input>
                </b-form-group>
                <b-form-group class="label" label="password" label-for="input-2">
                    <b-form-input
                    id="input-2"
                    v-model="data.password"
                    placeholder="Enter your password"
                    required
                    type="password"
                    class="input-field"
                    ></b-form-input>
                </b-form-group>
                <div class="text-center">
                    <b-button v-on:click="logUserIn()" variant="primary">Log in</b-button>
                </div>
                <p v-if="!success"> {{loginRespose}} </p>
            </b-col>
            <b-col cols="6">
                <img class="pl-2 pr-5 text-center" src="../../public/SignupImage.png"
                alt="Sign up images">
            </b-col>
        </b-row>
    </div>
</template>

<style scoped>
  .fontThickness{
    font-size: 140%;
    font-weight: bold;
  }
  .input-field {
    background: #FFF4F4;
    color: #606C5D;
    mix-blend-mode: multiply;
    border-radius: 0;
  }
  .label {
      color: #606C5D;
      font-size: 14px;
      padding: 0 ;
  }
  ::placeholder {
      opacity: 0.6 !important;
      color: #606C5D;
  }
  img{
    width: 100%;
    height: auto;
  }
  @media screen and (max-width:768px) {
    img{
        display:none;
    }
  }
</style>
