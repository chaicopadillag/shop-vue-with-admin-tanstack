import ProductsView from '@/modules/admin/views/ProductsView.vue';
import router from '@/router';
import { shallowMount } from '@vue/test-utils';
import { fakeProducts } from '../../../mock/fake-products';

vi.mock('@/modules/common/composables/useGetProducts', () => ({
  useGetProducts: vi.fn(() => ({
    isError: false,
    isPending: false,
    products: fakeProducts,
    currentPage: 1,
  })),
}));

describe('<ProductsView/>', () => {
  test('should render default values', () => {
    const wrapper = shallowMount(ProductsView, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find('table').exists()).toBeTruthy();
    expect(wrapper.findAll('tbody tr').length).toStrictEqual(10);
  });
});
