import Vue from 'vue';
import Router from 'vue-router';
import Booking from './views/Booking.vue';
import Sales from './views/Sales.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/booking',
      name: 'booking',
      component: Booking
    },
    {
      path: '/sales',
      name: 'sales',
      component: Sales
    },
    {
      path: '*',
      redirect: '/booking'
    }
  ]
});
