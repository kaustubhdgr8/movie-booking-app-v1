import { mount, createLocalVue } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';
import SeatsVue from '@/components/Seats.vue';
import SeatLayout from '@/assets/seatLayout.json';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

let bookingStatus = false;
const showNumber = 1;

const getters = {
  getSeatsData: () => SeatLayout,
  getBookingStatus: () => bookingStatus
};
const actions = {
  blockSeats: (data) => {
    let seatsData = getters.getSeatsData();
    for (const selectedSeat of data.platinum) {
      for (const seat of seatsData[data.showNumber][0].platinum) {
        if (selectedSeat === seat.seat) {
          seat.booked = true;
          break;
        }
      }
    }
    for (const selectedSeat of data.gold) {
      for (const seat of seatsData[data.showNumber][1].gold) {
        if (selectedSeat === seat.seat) {
          seat.booked = true;
          break;
        }
      }
    }
    for (const selectedSeat of data.silver) {
      for (const seat of seatsData[data.showNumber][2].silver) {
        if (selectedSeat === seat.seat) {
          seat.booked = true;
          break;
        }
      }
    }
    bookingStatus = data.bookingStatus;
  },
  bookingDone(val) {
    bookingStatus = val;
  }
};
let store = new Vuex.Store({
  getters,
  actions
});

const wrapper = mount(SeatsVue, {
  localVue,
  store,
  stubs: ['router-link'],
  data() {
    return {
      selectedPlatinum: [],
      selectedGold: [],
      selectedSilver: [],
      platinumCost: 300,
      goldCost: 200,
      silverCost: 100,
      taxRate: 0.2,
      sbCessRate: 0.01,
      kkCessRate: 0.01,
      stoppedRedirect: false,
      timerInterval: null,
      timer: 10,
      cost: {
        subTotal: 0,
        tax: 0,
        sbCess: 0,
        kkCess: 0,
        total: 0
      }
    };
  },
  computed: {
    optionsPlatinum() {
      return getters.getSeatsData()[showNumber][0].platinum;
    },
    optionsGold() {
      return getters.getSeatsData()[showNumber][1].gold;
    },
    optionsSilver() {
      return getters.getSeatsData()[showNumber][2].silver;
    },
    totalTickets() {
      return (
        this.selectedPlatinum.length +
        this.selectedGold.length +
        this.selectedSilver.length
      );
    },
    bookingDone() {
      return getters.getBookingStatus();
    }
  }
});

describe('Seats: render', () => {
  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it ('display tax breakup message', () => {
    expect(wrapper.find('.alert-warning').exists()).toBe(true);
  });

  it ('book button is disabled initially', () => {
    expect(wrapper.find('button').attributes('disabled')).toBe('disabled');
    expect(wrapper.find('.badge-light').exists()).not.toBe(true);
  });

  it ('all seats are loaded', () => {
    expect(wrapper.vm.optionsPlatinum.length).toEqual(getters.getSeatsData()[showNumber][0].platinum.length);
    expect(wrapper.vm.optionsGold.length).toEqual(getters.getSeatsData()[showNumber][1].gold.length);
    expect(wrapper.vm.optionsSilver.length).toEqual(getters.getSeatsData()[showNumber][2].silver.length);
  });

  it ('initially no seats are selected', () => {
    expect(wrapper.vm.totalTickets).toEqual(0);
    expect(wrapper.find('.badge').text()).toEqual("0");
  });
});

describe('Seats: user selection', () => {
  it('when user selects at least one seat, button is enabled and number of seats selected is shown on it', () => {
    wrapper.vm.selectedPlatinum.push("A1");
    expect(wrapper.vm.totalTickets).toEqual(1);
    expect(wrapper.find('button').attributes('disabled')).not.toBe('disabled');
    expect(wrapper.find('.badge-light').text()).toEqual(wrapper.vm.totalTickets.toString());
  });

  it('button is disabled when user unchecks all the seats', () => {
    wrapper.vm.selectedPlatinum = [];
    expect(wrapper.vm.totalTickets).toEqual(0);
    expect(wrapper.find('button').attributes('disabled')).toBe('disabled');
    expect(wrapper.find('.badge-light').exists()).not.toBe(true);
  });
});

describe('Seats: booking', () => {
  let currentTime;

  it('booking charges are calculated', () => {
    wrapper.vm.selectedGold.push("B4", "B5");
    wrapper.vm.calculateCost();
    expect(wrapper.vm.cost.subTotal).toEqual(400);
    expect(wrapper.vm.cost.tax).toEqual(80);
    expect(wrapper.vm.cost.sbCess).toEqual(4);
    expect(wrapper.vm.cost.kkCess).toEqual(4);
    expect(wrapper.vm.cost.total).toEqual(488);
  });

  it('blocks the selected seats', () => {
    actions.blockSeats({
      showNumber: showNumber,
      platinum: wrapper.vm.selectedPlatinum,
      gold: wrapper.vm.selectedGold,
      silver: wrapper.vm.selectedSilver,
      bookingStatus: true,
      cost: wrapper.vm.cost
    });
    expect(getters.getBookingStatus()).toEqual(true);
  });

  it('timer started', () => {
    wrapper.vm.startTimer();
    expect(wrapper.vm.timerInterval).toBeTruthy();
    wrapper.vm.stopRedirection();
    currentTime = wrapper.vm.timerInterval;
  }); 

  it('timer stopped', () => {
    expect(wrapper.vm.timerInterval).toEqual(currentTime);
  }, 2000);
});