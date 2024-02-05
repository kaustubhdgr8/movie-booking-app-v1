import { mount, createLocalVue } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ShowsVue from '@/components/Shows.vue';
import Shows from '@/assets/shows.json';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const wrapper = mount(ShowsVue, {
  localVue,
  data() {
    return {
      selectedShow: null,
      showHelpMsg: true,
      showsList: Shows
    };
  }
});

describe('Shows: render', () => {
  it('is a Vue Instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('displays a help message initially', () => {
    expect(wrapper.find('.alert').exists()).toBe(true);
  });

  it('displays the available shows', () => {
    expect(wrapper.text().indexOf('Show 1') >= 0).toBe(true);
  });

  it('displays the available shows', () => {
    expect(wrapper.text().indexOf('Show 1') >= 0).toBe(true);
  });
});

describe('Shows: user interaction', () => {
  it('hides the help message when user clicks on a show', () => {
    wrapper.vm.viewSeats(0);
    expect(wrapper.vm.showHelpMsg).toBe(false);
    expect(wrapper.find('.alert').exists()).not.toBe(true);
  });

  it('selected show index is read successfully', () => {
    expect(wrapper.vm.selectedShow).toBe(0);
  });

  it('selected show is highlighted', () => {
    expect(wrapper.find('.active-show').exists()).toBe(true);
  });

  it('show seats event is emitted', () => {
    expect(wrapper.emitted().showSeats[0]).toEqual([wrapper.vm.selectedShow]);
  });

  it('another selection of show index is read successfully', () => {
    wrapper.vm.viewSeats(2);
    expect(wrapper.vm.selectedShow).toBe(2);
  });

  it('show seats event is emitted with the new selection', () => {
    expect(wrapper.emitted().showSeats[1]).toEqual([wrapper.vm.selectedShow]);
  });
});