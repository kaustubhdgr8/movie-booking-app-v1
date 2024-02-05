import Vue from 'vue';
import Vuex from 'vuex';
import SeatLayout from './assets/seatLayout.json';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    bookingStatus: false,
    seatsData: SeatLayout,
    totalCost: {
      revenue: 0,
      tax: 0,
      sbCess: 0,
      kkCess: 0,
    }
  },
  getters: {
    getBookingStatus(state) {
      return state.bookingStatus;
    },
    getSeatsData(state) {
      return state.seatsData;
    },
    getTotalCost(state) {
      return state.totalCost;
    }
  },
  mutations: {
    bookSeats(state, data) {
      for (const selectedSeat of data.platinum) {
        for (const seat of state.seatsData[data.showNumber][0].platinum) {
          if (selectedSeat === seat.seat) {
            seat.booked = true;
            break;
          }
        }
      }
      for (const selectedSeat of data.gold) {
        for (const seat of state.seatsData[data.showNumber][1].gold) {
          if (selectedSeat === seat.seat) {
            seat.booked = true;
            break;
          }
        }
      }
      for (const selectedSeat of data.silver) {
        for (const seat of state.seatsData[data.showNumber][2].silver) {
          if (selectedSeat === seat.seat) {
            seat.booked = true;
            break;
          }
        }
      }
      state.totalCost.revenue += +(data.cost.subTotal).toFixed(2);
      state.totalCost.tax += +(data.cost.tax).toFixed(2);
      state.totalCost.sbCess += +(data.cost.sbCess).toFixed(2);
      state.totalCost.kkCess += +(data.cost.kkCess).toFixed(2);
    },
    bookingDone(state, val) {
      state.bookingStatus = val;
    }
  },
  actions: {
    blockSeats({dispatch, commit}, data) {
      commit('bookSeats', data);
      dispatch('bookingDone', data.bookingStatus);
    },
    bookingDone({commit}, val) {
      commit('bookingDone', val);
    }
  }
});
