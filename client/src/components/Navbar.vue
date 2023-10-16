<template>
  <div class="nav-bar">
    <b-navbar toggleable="lg">
      <router-link to="/">
        <b-navbar-nav class="logo">
          <img class="logo" src="../../public/logo.png">
        </b-navbar-nav>
      </router-link>
      <b-navbar-toggle target="nav-collapse" class="pages"></b-navbar-toggle>

      <b-collapse class="pages" id="nav-collapse" is-nav>

        <div class="middle">
          <router-link to="/discover">
            <button size="sm" class="discover-btn" :class="{ 'active': currentRoute === '/discover' }">Discover</button>
          </router-link>
          <router-link to="/add-listing">
            <button size="sm" class="sell-btn" :class="{ 'active': currentRoute === '/add-listing' }">Sell your
              artwork</button>
          </router-link>
          <button size="sm" class="about-us-btn" @click="navigateToAboutUs()">About us</button>

        </div>
        <b-navbar-nav class="ml-auto">

          <b-navbar-nav>
            <!-- Using 'button-content' slot -->
            <div class="login text-right">
              <div class="profile" v-if="userData !== null">
                <router-link to="/profile">
                  <img src="../../public/profile.png">
                </router-link>
                <b-button class="pl-2 pr-2 btn-primary btn" @click="logOut()">Log out </b-button>
              </div>
              <div class="login" v-else>
                <router-link to="/login">
                  <button class="sign-in-btn">Sign in</button>
                </router-link>
                <router-link to="/register">
                  <div class="text-center">
                    <b-button variant="primary" size="sm" class="sign-up-btn">Sign up for free</b-button>
                  </div>
                </router-link>
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
      isResponsive: false,
      currentRoute: '/'
    }
  },
  watch: {
    $route(to) {
      this.currentRoute = to.path
    }
  },
  computed: {
    userData: function () { return localStorage.getItem('userData') }
  },
  methods: {
    navigateToAboutUs() {
      const aboutUsSection = document.getElementById('aboutUsSection')
      localStorage.setItem('sessionKey', '')
      if (aboutUsSection) {
        aboutUsSection.scrollIntoView({ behavior: 'smooth' })
      } else {
        this.$router.push('/').then(() => {
          const aboutUsSection = document.getElementById('aboutUsSection')
          if (aboutUsSection) {
            aboutUsSection.scrollIntoView({ behavior: 'smooth' })
          }
        })
      }
    },
    async logOut() {
      localStorage.removeItem('userData')
      window.location.replace('/')
    }
  }
}

</script>

<style scoped>
nav {
  margin-left: 1rem;
  margin-right: 1rem;
}

.logo {
  width: 100px;
  height: auto;
}

.btn {
  margin-left: 1rem;
}

.active {
  color: #F1C376 !important;
  text-decoration: underline !important;
}

.nav-bar {
  margin-top: 1rem;
}

img {
  width: 8%;
  height: auto;
}

.profile-btn {
  background: none;
  border: none;
  color: #606C5D;
  font-weight: bold;
  width: 10cm;
  height: auto;
}

.logo {
  text-decoration: underline;
  text-decoration-color: #606C5D;
  font-size: 24;
  color: #606C5D;
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
  margin-top: 0.2rem;
}

.login {
  display: flex;
  flex-direction: row;
  min-width: 255px;
}

.middle {
  width: 100%;
  display: flex;
  justify-content: flex-start;

}

.discover-btn,
.about-us-btn,
.sell-btn {
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
    margin-right: 1.5rem !important;
  }

  img {
    width: 6%;
    height: auto;
  }

  .btn {
    margin-right: 2rem;
  }
}</style>
