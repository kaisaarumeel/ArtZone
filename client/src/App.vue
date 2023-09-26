<template>
  <div id="app">
    <div id="nav">
      <router-link to="/"></router-link>
    </div>
    <NavbarVue></NavbarVue>
    <!-- Render the content of the current page view -->
    <router-view/>
  </div>
</template>

<script>
import NavbarVue from './components/Navbar.vue'
export default {
  components: {
    NavbarVue
  }
}
</script>

<style>
#app {
  font-family: 'Inter', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button {
padding-left: 2rem;
padding-right: 2rem;
padding-top: 0.5rem;
padding-bottom: 0.5rem;
background-color: #606C5D;
color: #F7E6C4;
border-radius: 0;
border: none;
}

</style>
