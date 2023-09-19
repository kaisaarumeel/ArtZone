<template>
  <div class="home-page">
    <h1 class="header">
      <span class="bold-text">Discover</span> and <span class="bold-text">sell</span> <br> your <span class="bold-text">artwork</span>.
    </h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. At urna condimentum mattis pellentesque id nibh tortor id. Imperdiet massa tincidunt nunc pulvinar. Sed faucibus turpis in eu mi. Duis at tellus at urna. Sodales neque sodales ut etiam sit amet nisl purus. Diam volutpat commodo sed egestas egestas. Enim sit amet venenatis urna cursus eget nunc scelerisque. Et malesuada fames ac turpis egestas sed tempus urna et. Pharetra magna ac placerat vestibulum lectus mauris. Nisl condimentum id venenatis a condimentum vitae sapien. Enim facilisis gravida neque convallis a cras semper auctor. Dui nunc mattis enim ut tellus elementum sagittis. Velit laoreet id donec ultrices tincidunt. Vel fringilla est ullamcorper eget nulla facilisi etiam. Tristique risus nec feugiat in fermentum posuere. Amet facilisis magna etiam tempor orci. Sit amet nisl purus in mollis nunc sed id. Montes nascetur ridiculus mus mauris vitae ultricies leo integer.

Vitae et leo duis ut diam quam nulla porttitor massa. Massa ultricies mi quis hendrerit dolor magna eget est. Turpis cursus in hac habitasse platea. Vitae tortor condimentum lacinia quis. Venenatis urna cursus eget nunc scelerisque viverra. Ac tortor vitae purus faucibus ornare suspendisse sed nisi lacus. Nisi quis eleifend quam adipiscing vitae. Ut sem nulla pharetra diam sit amet nisl suscipit. Ut aliquam purus sit amet luctus venenatis lectus magna fringilla. Ut tortor pretium viverra suspendisse. Lacus suspendisse faucibus interdum posuere lorem.

Eget nunc lobortis mattis aliquam. Ut venenatis tellus in metus. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus. Nunc congue nisi vitae suscipit tellus mauris a. Pharetra vel turpis nunc eget. Diam ut venenatis tellus in metus vulputate eu scelerisque felis. Quis commodo odio aenean sed adipiscing. Et magnis dis parturient montes nascetur ridiculus mus mauris. Scelerisque felis imperdiet proin fermentum leo vel. Velit aliquet sagittis id consectetur purus ut. Ornare massa eget egestas purus viverra accumsan. Urna et pharetra pharetra massa massa. Augue neque gravida in fermentum et sollicitudin ac orci. Est ante in nibh mauris cursus mattis molestie. Faucibus purus in massa tempor nec. Nibh tortor id aliquet lectus. Elementum integer enim neque volutpat ac tincidunt vitae semper quis. Metus aliquam eleifend mi in nulla posuere. Vel orci porta non pulvinar neque laoreet suspendisse interdum.

Phasellus egestas tellus rutrum tellus pellentesque eu. Et malesuada fames ac turpis egestas maecenas. Neque viverra justo nec ultrices dui sapien. Libero volutpat sed cras ornare arcu. Tellus at urna condimentum mattis pellentesque id nibh tortor id. Enim ut sem viverra aliquet eget sit amet. Nunc vel risus commodo viverra maecenas accumsan lacus vel facilisis. Sed elementum tempus egestas sed sed risus pretium quam. Orci ac auctor augue mauris augue neque gravida in. Velit ut tortor pretium viverra. Nisl vel pretium lectus quam id leo in vitae turpis. Vitae tempus quam pellentesque nec. Varius vel pharetra vel turpis nunc. Urna condimentum mattis pellentesque id nibh. Nunc sed augue lacus viverra vitae. Viverra tellus in hac habitasse platea dictumst vestibulum rhoncus est. Accumsan lacus vel facilisis volutpat est velit egestas dui. Rhoncus urna neque viverra justo nec ultrices.

Eu non diam phasellus vestibulum lorem. Vestibulum lectus mauris ultrices eros in cursus turpis massa tincidunt. Pellentesque id nibh tortor id aliquet. Curabitur gravida arcu ac tortor dignissim convallis aenean et. Posuere lorem ipsum dolor sit amet. Id venenatis a condimentum vitae sapien. At elementum eu facilisis sed odio morbi quis commodo. Imperdiet nulla malesuada pellentesque elit eget gravida. Metus dictum at tempor commodo ullamcorper. Ultrices in iaculis nunc sed augue lacus viverra. Ultricies tristique nulla aliquet enim tortor at auctor urna. Odio ut sem nulla pharetra diam sit amet.</p>
    <div class="about-us" id="aboutUsSection">
      <div><img src="images/wave.jpeg" alt="Painting" class="painting"></div>
      <div><h2>About us</h2><p>At Artzone, we believe that art is more than just paint on canvas or sculptures in a gallery; it's a powerful form of expression that connects individuals and cultures worldwide. Our mission is to create a vibrant and inclusive online community where artists of all backgrounds can showcase their creativity, share their stories, and find new audiences for their work. Whether you're a seasoned artist or a passionate art enthusiast, ArtZone provides a platform for you to explore, appreciate, and acquire unique pieces of art.
        <br>
        <br>
        We have developed this platfrom with love and care. Here you can sell your own art or artwork made by another author. The platfrom offers a wide range of artwork, starting with paintings and drawings and ending with sculptures or graphical design. Join us on this creative journey, and together, let's celebrate the beauty and diversity of the art world. </p></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  methods: {

  }
}
</script>

<style>

h1 {
  color: #606C5D;
}
.header {
  font-size: 64px;
  text-align: center;
  justify-content: center;
}

@media (max-width: 768px){
  .header {
    font-size: 36px;
  }
}
.bold-text {
  font-weight:900;
}

.painting {
  width: 400px;
  height: auto;
  padding: 1rem;
  padding-bottom: 0;

}
.about-us {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #606C5D;
  margin-top: 2rem;
}

p {
  color: #F7E6C4;
  padding: 3rem;
}

h2 {
  color: #F7E6C4;
  text-align: end;
  padding-right: 3rem;
  padding-top: 1rem;
}

@media (max-width: 768px){
  .about-us {
    flex-direction: column;
    text-align: center;
  }

.painting {
    width: 100%;
  }

  p {
    padding-top: 1rem;
  }

  .header {
    padding-top: 3rem;
  }
}

</style>
