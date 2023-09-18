<template>
  <div class="nav-bar responsive">
    <button class="hamburger" @click="toggleResponsiveMenu">&#9776;</button>
    <div class="pages" :class="{ 'show': isResponsive }">
      <div class="logo"><h3>Artzone</h3></div>
      <div class="middle">
        <button class="discover-btn">Discover</button>
        <button class="about-us-btn" @click="navigateToAboutUs">About us</button>
        <button class="sell-btn">Sell your artwork</button>
      </div>
      <hr class="menu-line" v-if="isResponsive">
      <div class="login">
      <div>
          <img class="profile-pic" src="profile.png" alt="Profile">
          <button class="sign-in-btn">Sign in</button>
      </div>
      <button>Sign up for free</button>

      </div>
    </div>
  </div>
</template>

<script>

// @ is an alias to /src

export default {
  name: 'home',
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
    },
    toggleResponsiveMenu() {
      this.isResponsive = !this.isResponsive

      if (this.isResponsive) {
        document.body.addEventListener('click', this.closeMenuOnClickOutside)
      } else {
        document.body.removeEventListener('click', this.closeMenuOnClickOutside)
      }
    },
    closeMenuOnClickOutside(event) {
      if (
        this.isResponsive &&
        event.target.closest('.nav-bar') === null
      ) {
        this.isResponsive = false
        document.body.removeEventListener('click', this.closeMenuOnClickOutside)
      }
    }
  }
}

</script>

<style>

.logo {
    text-decoration: underline;
    text-decoration-color: #606C5D;
    font-size: 24;
    color: #606C5D;
}
.profile-pic {
    width: 20px;
    height: 20px;
    opacity: 60%;
}
.sign-in-btn {
    background: none;
    border: none;
    color: #606C5D;
    font-weight: bold;
    padding-left: 1rem;
}
.menu-line {
  display: none;
}
.nav-bar {
    display: flex;
    width: 100vw;
    flex-direction: row;
    justify-content: space-between;
    padding: 1rem;
    padding-bottom: 3rem;
    align-items: center;
}

.login {
    display: flex;
    flex-direction: row;

}

.pages {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
}

.middle {
  margin-right: 10rem;
  margin-left: auto;
}
@media screen and (max-width: 1250px) {
  .middle {
    margin-right: 5rem;
    margin-left: auto;
  }
}
.discover-btn, .about-us-btn, .sell-btn {
color: #606C5D;
background: none;
}

.hamburger {
  display: none;
  font-size: 36px;
  cursor: pointer;
  color: #606C5D;
}

/* Menu styles for screens less than 768px */
@media screen and (max-width: 1050px) {
  .nav-bar.responsive .pages {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    background-color: #F7E6C4;
    z-index: 1;
    text-align: center;
    transform: translateY(-100%);
    justify-content: center;
    position: fixed;
  }

  .menu-line {
    display: block;
    border-top: 1px solid #606C5D; /* Set the color and style of the line */
    width: 80%
  }

  .nav-bar.responsive  {
    display: flex;
    flex-direction: column;
  }

  .nav-bar.responsive .logo {
    display: none;
  }

  .nav-bar.responsive .login, .middle{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

   .nav-bar.responsive .sign-in-btn{
    font-weight: normal;
  }

.nav-bar.responsive button{
    background: none;
    color: #606C5D;
  }

  .nav-bar.responsive .profile-pic{
    display: none;
  }
  .nav-bar.responsive .pages.show {
    transform: translateY(0);
  }

  .nav-bar.responsive .hamburger {
    display: block;
    background: none;
    position: absolute;
    top: 0.5rem;
    left: 1rem;
  }
}
</style>
