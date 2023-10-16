import axios from 'axios'

export const Api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_ENDPOINT : 'http://localhost:3000/api/v1'
})
