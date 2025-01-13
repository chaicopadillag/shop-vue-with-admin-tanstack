import HeaderTop from '@/modules/admin/components/HeaderTop.vue';
import SidebarMenu from '@/modules/admin/components/SidebarMenu.vue';
import DashboardLayout from '@/modules/admin/layouts/DashboardLayout.vue';
import { shallowMount } from '@vue/test-utils';
import { RouterView } from 'vue-router';
describe('<DashboardLayout/>', () => {
  it('should render the component', async () => {
    const wrapper = shallowMount(DashboardLayout, {
      global: {
        stubs: ['router-view'],
      },
    });
    expect(wrapper.findComponent(RouterView).exists()).toBeTruthy();
    expect(wrapper.findComponent(HeaderTop).exists()).toBeTruthy();
    expect(wrapper.findComponent(SidebarMenu).exists()).toBeTruthy();
  });
});
