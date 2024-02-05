import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import BookingVue from '@/views/Booking.vue';
import SeatsVue from "@/components/Seats.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

let store, bookingStatus, wrapper;
const getters = {
  getBookingStatus: () => bookingStatus
};
const actions = {
  bookingDone: (val) => {
    bookingStatus = val;
  }
};

describe('Booking', () => {
  beforeEach(() => {
    bookingStatus = false;
    store = new Vuex.Store({
      getters,
      actions
    });
    wrapper = shallowMount(BookingVue, {
      store,
      localVue
    });
  });

  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('gets booking status from store', () => {
    expect(getters.getBookingStatus()).toBe(bookingStatus);
  });

  it('does not render child component Seats initially', () => {
    expect(wrapper.find(SeatsVue).exists()).not.toBe(true);
  });

  it('renders child component Seats on show selection event', () => {
    wrapper.vm.showSeats(0);
    expect(wrapper.find(SeatsVue).exists()).toBe(true);
  });
});