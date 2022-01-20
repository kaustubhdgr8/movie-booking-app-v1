<template>
  <div class="container">
    <br>
    <h1 class="display-3">Book tickets</h1>
    <br>
    <div class="row" v-if="!bookingDone">
      <div class="col-sm-12">
        <app-shows @showSeats="showSeats($event)"></app-shows>
      </div>
    </div>
    <br>
    <div class="row" v-if="!hideSeats">
      <div class="col-sm-12">
        <app-seats :showNumber="showNumber" :key="componentKey"></app-seats>
      </div>
    </div>
  </div>
</template>

<script>
import ShowsVue from "../components/Shows.vue";
import SeatsVue from "../components/Seats.vue";

export default {
  data() {
    return {
      hideSeats: true,
      showNumber: 0,
      componentKey: 0
    };
  },
  computed: {
    bookingDone() {
      return this.$store.getters.getBookingStatus;
    }
  },
  methods: {
    showSeats(showIndex) {
      if (showIndex !== this.showNumber) {
        this.componentKey++;
      }
      this.hideSeats = false;
      this.showNumber = showIndex;
    }
  },
  components: {
    appShows: ShowsVue,
    appSeats: SeatsVue
  },
  beforeCreate() {
    this.$store.dispatch('bookingDone', false);
  },
};
</script>
