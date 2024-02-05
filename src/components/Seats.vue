<template>
  <div>
    <div class="seat-selection" v-if="!bookingDone">
      <b-list-group>
        <b-list-group-item class="d-flex justify-content-between align-items-center">
          <b-form-group :label="`Platinum (₹${platinumCost})`">
            <b-form-checkbox-group id="checkbox-group-1" v-model="selectedPlatinum" name="platinum">
              <b-form-checkbox
                v-for="seat in optionsPlatinum"
                :value="seat.seat"
                :key="seat.seat"
                :class="{'unavailable-seat': seat.empty}"
                :disabled="seat.booked"
                v-b-tooltip.hover
                :title="seat.booked ? 'This seat is already booked' : null"
              >{{seat.seat}}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
          <b-badge variant="primary" pill>{{selectedPlatinum.length}}</b-badge>
        </b-list-group-item>
        <b-list-group-item class="d-flex justify-content-between align-items-center">
          <b-form-group :label="`Gold (₹${goldCost})`">
            <b-form-checkbox-group id="checkbox-group-2" v-model="selectedGold" name="gold">
              <b-form-checkbox
                v-for="seat in optionsGold"
                :value="seat.seat"
                :key="seat.seat"
                :class="{'unavailable-seat': seat.empty}"
                :disabled="seat.booked"
                v-b-tooltip.hover
                :title="seat.booked ? 'This seat is already booked' : null"
              >{{seat.seat}}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
          <b-badge variant="primary" pill>{{selectedGold.length}}</b-badge>
        </b-list-group-item>
        <b-list-group-item class="d-flex justify-content-between align-items-center">
          <b-form-group :label="`Silver (₹${silverCost})`">
            <b-form-checkbox-group id="checkbox-group-3" v-model="selectedSilver" name="silver">
              <b-form-checkbox
                v-for="seat in optionsSilver"
                :value="seat.seat"
                :key="seat.seat"
                :class="{'unavailable-seat': seat.empty}"
                :disabled="seat.booked"
                v-b-tooltip.hover
                :title="seat.booked ? 'This seat is already booked' : null"
              >{{seat.seat}}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
          <b-badge variant="primary" pill>{{selectedSilver.length}}</b-badge>
        </b-list-group-item>
      </b-list-group>
      <br />
      <b-alert
        show
        variant="warning"
      >Please note that all the bookings would be charged a service tax of 14% along with Swachh Bharat Cess and Krishi Kalyan Cess at a rate of 0.5% each.</b-alert>
      <b-button variant="primary" class="float-right" @click="bookTickets" :disabled="totalTickets === 0">
        Book tickets
        <b-badge variant="light" v-if="totalTickets !== 0">{{totalTickets}}</b-badge>
      </b-button>
      <br />
      <br />
    </div>
    <b-alert show variant="success" v-if="bookingDone">
      <h4 class="alert-heading">Booking successful for 'Show {{showNumber + 1}}'</h4>
      <hr />
      <p>Here are the details of your booking:</p>
      <div>
        Seats selected:
        <ul>
          <li v-if="selectedPlatinum.length !== 0">
            Platinum:
            <strong>{{selectedPlatinum.join(', ')}}</strong>
          </li>
          <li v-if="selectedGold.length !== 0">
            Gold:
            <strong>{{selectedGold.join(', ')}}</strong>
          </li>
          <li v-if="selectedSilver.length !== 0">
            Silver:
            <strong>{{selectedSilver.join(', ')}}</strong>
          </li>
        </ul>
      </div>
      <div>
        Cost incurred:
        <ul>
          <li id="total">SubTotal: ₹{{cost.subTotal}}</li>
          <li id="tax">Service Tax @14%: ₹{{cost.tax}}</li>
          <li id="sbCess">Swachh Bharat Cess @0.5%: ₹{{cost.sbCess}}</li>
          <li id="kkCess">Krishi Kalyan Cess @0.5%: ₹{{cost.kkCess}}</li>
          <li id="net">
            <strong>Total: ₹{{cost.total}}</strong>
          </li>
        </ul>
      </div>
    </b-alert>
    <b-alert show fade variant="warning" v-if="bookingDone && !stoppedRedirect">
      You will be redirected to the "Sales" page in {{timer}} seconds.
      <a href class="alert-link" @click.prevent="stopRedirection">Click here to cancel redirection</a>
    </b-alert>
    <b-button variant="primary" class="float-right" v-if="stoppedRedirect">
      <router-link tag="span" to="sales">Go to Sales page</router-link>
    </b-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedPlatinum: [],
      selectedGold: [],
      selectedSilver: [],
      platinumCost: 320,
      goldCost: 280,
      silverCost: 240,
      taxRate: 0.14,
      sbCessRate: 0.005,
      kkCessRate: 0.005,
      stoppedRedirect: false,
      timerInterval: null,
      timer: 30,
      cost: {
        subTotal: 0,
        tax: 0,
        sbCess: 0,
        kkCess: 0,
        total: 0
      }
    };
  },
  props: ["showNumber"],
  computed: {
    optionsPlatinum() {
      return this.$store.getters.getSeatsData[this.showNumber][0].platinum;
    },
    optionsGold() {
      return this.$store.getters.getSeatsData[this.showNumber][1].gold;
    },
    optionsSilver() {
      return this.$store.getters.getSeatsData[this.showNumber][2].silver;
    },
    totalTickets() {
      return (
        this.selectedPlatinum.length +
        this.selectedGold.length +
        this.selectedSilver.length
      );
    },
    bookingDone() {
      return this.$store.getters.getBookingStatus;
    }
  },
  methods: {
    bookTickets() {
      this.calculateCost();
      this.blockSeats();
      this.startTimer();
    },
    calculateCost() {
      this.cost.subTotal =
        this.selectedPlatinum.length * this.platinumCost +
        this.selectedGold.length * this.goldCost +
        this.selectedSilver.length * this.silverCost;
      this.cost.tax = +(this.cost.subTotal * this.taxRate).toFixed(2);
      this.cost.sbCess = +(this.cost.subTotal * this.sbCessRate).toFixed(2);
      this.cost.kkCess = +(this.cost.subTotal * this.kkCessRate).toFixed(2);
      this.cost.total =
        +(this.cost.subTotal +
        this.cost.tax +
        this.cost.sbCess +
        this.cost.kkCess).toFixed(2);
    },
    blockSeats() {
      this.$store.dispatch("blockSeats", {
        showNumber: this.showNumber,
        platinum: this.selectedPlatinum,
        gold: this.selectedGold,
        silver: this.selectedSilver,
        bookingStatus: true,
        cost: this.cost
      });
    },
    stopRedirection() {
      this.stoppedRedirect = true;
      clearInterval(this.timerInterval);
    },
    startTimer() {
      this.timerInterval = setInterval(() => {
        this.timer--;
      }, 1000);
    }
  },
  watch: {
    timer(val) {
      if (val === 0) {
        clearInterval(this.timerInterval);
        this.$router.push({
          name: "sales"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
}
.unavailable-seat {
  visibility: hidden;
}
</style>