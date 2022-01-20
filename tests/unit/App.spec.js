import { shallowMount } from '@vue/test-utils';
import AppVue from '@/App.vue';
import MenuVue from '@/components/Menu.vue';
import FooterVue from '@/components/Footer.vue';

const wrapper = shallowMount(AppVue, {
  stubs: ['router-view']
});

describe('App', () => {
  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('renders child component Menu', () => {
    expect(wrapper.find(MenuVue).exists()).toBe(true);
  });

  it('renders child component Footer', () => {
    expect(wrapper.find(FooterVue).exists()).toBe(true);
  });
});
