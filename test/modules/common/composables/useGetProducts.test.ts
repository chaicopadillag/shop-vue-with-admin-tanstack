import { useGetProducts } from '@/modules/common/composables/useGetProducts';
import { fakeProducts } from '../../../mock/fake-products';

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    query: {
      page: 1,
    },
  })),
}));

const prefetchQuerySpy = vi.fn();

vi.mock('@tanstack/vue-query', () => ({
  useQueryClient: vi.fn(() => ({
    prefetchQuery: prefetchQuerySpy,
  })),
  useQuery: vi.fn(() => ({
    isPending: false,
    isError: false,
    data: fakeProducts,
  })),
}));

describe('useGetProducts composable', () => {
  test('should return defaults data', () => {
    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;
    const { currentPage, isError, isPending, products } = useGetProducts();

    expect(currentPage.value).toEqual(1);
    expect(isError).toBe(false);
    expect(isPending).toBe(false);
    expect(products).toEqual(fakeProducts);
    expect(scrollToSpy).toBeCalledWith({
      top: 0,
      behavior: 'smooth',
    });

    expect(prefetchQuerySpy).toBeCalledWith({
      queryKey: ['products', { page: 2 }],
      queryFn: expect.any(Function),
    });
  });
});
