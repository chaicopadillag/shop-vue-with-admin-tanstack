/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductView from '@/modules/admin/views/ProductView/ProductView.vue';
import { useQuery } from '@tanstack/vue-query';
import { mount } from '@vue/test-utils';
import type { Mock } from 'vitest';
import { ref } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { fakeProducts } from '../../../mock/fake-products';

const router = createRouter({
  routes: [
    {
      path: '/',
      name: 'products',
      component: () => import('@/modules/admin/layouts/DashboardLayout.vue'),
    },
  ],
  history: createWebHistory(import.meta.env.BASE_URL),
});

const replaceSpy = vi.fn();

vi.mock('vue-router', async (originalVueRouter) => {
  const props: any = await originalVueRouter();

  return {
    ...props,
    useRouter: vi.fn(() => ({
      replace: replaceSpy,
    })),
  };
});

const mutateSpy = vi.fn();

vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn(() => ({
    isError: ref(true),
    isLoading: ref(false),
    data: ref(null),
  })),
  useMutation: vi.fn(() => ({
    data: ref(fakeProducts.at(0)),
    isPending: ref(false),
    isSuccess: ref(true),
    isError: ref(false),
    mutate: mutateSpy,
  })),
}));

describe('<ProductView/>', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Debe de redireccionar a /dashboard/products', () => {
    const wrapper = mount(ProductView, {
      props: { id: 'xxxxxxxx' },
      global: {
        plugins: [router],
      },
    });
    expect(replaceSpy).toHaveBeenCalledWith('/dashboard/products');
  });

  test('Debe de mostrar el producto en el formulario', () => {
    const fakeProduct = fakeProducts.at(0);
    (useQuery as Mock).mockReturnValue({
      isError: ref(false),
      isLoading: ref(false),
      data: ref(fakeProduct),
    });

    const wrapper = mount(ProductView, {
      props: { id: 'aacfce45-6868-4a9f-babd-5ddf737c784d' },
      global: {
        plugins: [router],
      },
    });
    const productValues = Object.values(fakeProduct!);

    const customInputs = wrapper.findAllComponents({ name: 'InputText' });
    const customTextArea = wrapper.findComponent({ name: 'TextArea' });
    const sizeButtons = wrapper.findAll('button.flex-1');

    expect(customInputs.length).toBe(4);
    customInputs.forEach((input) => {
      const modelValue = input.props('modelValue');

      expect(productValues).include(modelValue);
    });

    expect(productValues).toContain(customTextArea.props('modelValue'));

    sizeButtons.forEach((btn) => {
      if (fakeProduct?.sizes.includes(btn.text())) {
        expect(btn.classes()).toContain('bg-blue-500');
      } else {
        expect(btn.classes()).toContain('bg-blue-100');
      }
    });
  });
});
