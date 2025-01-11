import { getProductsPaginate } from '@/modules/products/actions/get-products-paginate.action';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, ref, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

export const useGetProducts = () => {
  const route = useRoute();
  const queryClient = useQueryClient();

  const currentPage = ref(1);

  const {
    isPending,
    isError,
    data: products,
  } = useQuery({
    queryKey: ['products', { page: currentPage }],
    queryFn: () => getProductsPaginate(currentPage.value),
  });

  watch(
    () => route.query,
    ({ page }) => {
      console.log({ page });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      currentPage.value = isNaN(page as any) ? 1 : Number(page as any);
      console.log({ currentPage: currentPage.value });

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    {
      immediate: true,
    },
  );

  watchEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['products', { page: currentPage.value + 1 }],
      queryFn: () => getProductsPaginate(currentPage.value + 1),
    });
  });

  return {
    isPending,
    isError,
    products,
    currentPage: computed(() => currentPage.value),
  };
};
