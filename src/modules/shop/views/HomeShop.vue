<template>
  <tab-menu />
  <div v-if="isPending" class="flex items-center justify-center min-h-96">
    <div
      style="border-top-color: transparent"
      class="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin"
    ></div>
    <p class="ml-2">cargando...</p>
  </div>

  <div
    v-if="isError"
    class="font-regular relative mb-4 block w-full rounded-lg bg-red-500 p-4 text-base leading-5 text-white opacity-100 max-w-xl mx-auto"
  >
    Upz! se ha producido un error, por favor intenta nuevamente.
  </div>
  <product-grid v-if="products" :products="products" />
  <pagination-buttons v-if="products" :has-more-data="products.length === 12" :page="currentPage" />
</template>

<script lang="ts" setup>
import PaginationButtons from '@/modules/common/components/PaginationButtons.vue';
import { getProductsPaginate } from '@/modules/products/actions/get-products-paginate.action';
import ProductGrid from '@/modules/products/components/ProductGrid.vue';
import TabMenu from '@/modules/shop/components/TabMenu.vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { ref, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

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
</script>
