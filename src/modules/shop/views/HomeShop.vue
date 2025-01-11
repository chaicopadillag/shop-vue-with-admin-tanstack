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
import { useGetProducts } from '@/modules/common/composables/useGetProducts';
import ProductGrid from '@/modules/products/components/ProductGrid.vue';
import TabMenu from '@/modules/shop/components/TabMenu.vue';

const { isError, isPending, products, currentPage } = useGetProducts();
</script>
