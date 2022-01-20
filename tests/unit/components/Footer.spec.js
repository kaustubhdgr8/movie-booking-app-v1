import { shallowMount } from '@vue/test-utils';
import FooterVue from '@/components/Footer.vue';

const testData = 'Mock footer data';
const wrapper = shallowMount(FooterVue, {
  data() {
    return {
      copyrightData: testData
    };
  }
});

describe('Footer', () => {
  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('renders the correct content', () => {
    expect(wrapper.text()).toEqual(testData);
  });
});