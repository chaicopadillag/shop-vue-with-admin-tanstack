/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductView from '@/modules/admin/views/ProductView/ProductView.vue';
import { useQuery } from '@tanstack/vue-query';
import { mount } from '@vue/test-utils';
import type { Mock } from 'vitest';
import { ref } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { fakeProducts } from '../../../mock/fake-products';
import InputText from '@/modules/common/components/InputText.vue';

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

  test('should submit form data success', async () => {
    const wrapper = mount(ProductView, {
      props: { id: 'xxxxxxxx' },
      global: {
        plugins: [router],
      },
    });
    const form = wrapper.find('form');

    await form.trigger('submit');
    await new Promise((r) => setTimeout(r, 100));
    expect(mutateSpy).toHaveBeenCalled();
    expect(mutateSpy).toHaveBeenCalledWith({
      description:
        'Introducing the Tesla Chill Collection. The Men’s Chill Crew Neck Sweatshirt has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The sweatshirt features a subtle thermoplastic polyurethane T logo on the chest and a Tesla wordmark below the back collar. Made from 60% cotton and 40% recycled polyester.',
      gender: 'men',
      id: '008ea87d-a16c-4c25-9de3-8a14bae089cd',
      images: ['1740176-00-A_0_2000.jpg', '1740176-00-A_1.jpg'],
      price: 75,
      sizes: ['XS', 'S', 'L', 'XL', 'XXL'],
      slug: 'mens_chill_crew_neck_sweatshirt',
      stock: 7,
      title: 'Men’s Chill Crew Neck Sweatshirt',
    });
  });

  test('should not submit form data success', async () => {
    const wrapper = mount(ProductView, {
      props: { id: 'xxxxxxxx' },
      global: {
        plugins: [router],
      },
    });
    const form = wrapper.find('form');
    const titleInput = wrapper.findComponent(InputText);
    titleInput.vm.$emit('update:modelValue', '');

    await form.trigger('submit');
    await new Promise((r) => setTimeout(r, 100));
    expect(mutateSpy).not.toHaveBeenCalled();
  });
});
