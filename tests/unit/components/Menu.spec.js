import { shallowMount, createLocalVue } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import MenuVue from '@/components/Menu.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const wrapper = shallowMount(MenuVue, {
  localVue,
  stubs: ['router-link']
});

describe('Menu', () => {
  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});