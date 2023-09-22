<template>
<div class="nav-bar">
  <b-navbar toggleable="lg">
    <b-navbar-nav class="logo">
      Artzone
      </b-navbar-nav>
    <b-navbar-toggle target="nav-collapse" class="pages"></b-navbar-toggle>

    <b-collapse class="pages" id="nav-collapse" is-nav>

<div class="middle">
            <button size="sm" class="discover-btn" href="#">Discover</button>
            <button size="sm" class="about-us-btn" @click="navigateToAboutUs">About us</button>
            <button size="sm" class="sell-btn" href="#">Sell your artwork</button>
    </div>
  <b-navbar-nav class="ml-auto">

        <b-navbar-nav>
          <!-- Using 'button-content' slot -->
          <div class="login">
            <button class="sign-in-btn" href="#">Sign in</button>
            <div class="text-center">
              <b-button variant="primary" size="sm" class="sign-up-btn" href="#">Sign up for free</b-button>
            </div>
          </div>
        </b-navbar-nav>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
</template>

<script>

// @ is an alias to /src

export default {
  name: 'navbar',
  data() {
    return {
      isResponsive: false
    }
  },
  methods: {
    navigateToAboutUs() {
      const aboutUsSection = document.getElementById('aboutUsSection')

      if (aboutUsSection) {
        aboutUsSection.scrollIntoView({ behavior: 'smooth' })
      }
      this.toggleResponsiveMenu()
    }
  }
}

</script>

<style scoped>

.nav-bar {
  padding: 2rem;
}
.logo {
    text-decoration: underline;
    text-decoration-color: #606C5D;
    font-size: 24;
    color: #606C5D;
    padding-left: 1rem;
    font-weight: bold;
}

.sign-in-btn {
    background: none;
    border: none;
    color: #606C5D;
    font-weight: bold;
    min-width: 100px;
}

.navbar-toggler {
  border: none !important;
}

.sign-up-btn {
    margin-top:0.2rem;
}
.login {
    display: flex;
    flex-direction: row;
    min-width: 250px;
}

.middle {
  padding-left: 10rem;
  width: 100%;
  display: flex;
  justify-content: center;

}

.discover-btn, .about-us-btn, .sell-btn {
color: #606C5D;
background: none;
}

@media screen and (max-width:992px) {
  .middle {
    flex-direction: column;
    align-items: flex-end;
    margin-right: 1rem;
  }

  .login {
    flex-direction: column;
    align-items: flex-end;
  }

  .sign-up-btn {
    background: none !important;
    border: none !important;
    color: #606C5D !important;
    font-weight: bold !important;
    font-size: 16px !important;
    margin-right: 1.5rem!important;
  }

}

</style>
