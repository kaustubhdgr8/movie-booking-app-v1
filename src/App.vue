<template>
  <div id="app">
    <app-menu></app-menu>
    <div class="container">
      <router-view></router-view>
    </div>
    <br>
    <app-footer></app-footer>
  </div>
</template>

<script>
import MenuVue from './components/Menu.vue';
import FooterVue from './components/Footer.vue';

export default {
  name: 'app',
  components: {
    appMenu: MenuVue,
    appFooter: FooterVue
  }
}
</script>
