<template>
  <div>
    <div class="flex flex-wrap items-center px-4 py-2">
      <div class="relative w-full max-w-full flex-grow flex-1">
        <h3 class="font-semibold text-base text-gray-900 dark:text-gray-50">Productos</h3>
      </div>
      <div class="relative w-full max-w-full flex-grow flex-1 text-right">
        <router-link
          to="/dashboard/products/new"
          class="rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600"
        >
          New Product
        </router-link>
      </div>
    </div>
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
    <div class="mt-4 mx-4">
      <div class="w-full overflow-hidden rounded-lg shadow-xs">
        <div class="w-full overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr
                class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
              >
                <th class="px-4 py-3">Producto</th>
                <th class="px-4 py-3">Precio</th>
                <th class="px-4 py-3">Stock</th>
                <th class="px-4 py-3">Tallas</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              <tr
                class="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                v-for="product in products"
                :key="product.id"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center text-sm">
                    <div class="relative hidden w-8 h-8 mr-3 rounded md:block">
                      <img
                        class="object-cover w-full h-full rounded"
                        :src="product.images[0]"
                        alt=""
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <p class="font-semibold">
                        <router-link :to="{ name: 'product', params: { id: product.id } }">{{
                          product.title
                        }}</router-link>
                      </p>
                      <p class="text-xs text-gray-600 dark:text-gray-400 capitalize">
                        {{ product.gender }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm">${{ product.price }}</td>
                <td class="px-4 py-3 text-xs">
                  {{ product.stock }}
                </td>
                <td class="px-4 py-3 text-sm">{{ product.sizes.join(',') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="flex justify-center items-center px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700"
        >
          <PaginationButtons
            v-if="products"
            :has-more-data="products.length === 12"
            :page="currentPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import PaginationButtons from '@/modules/common/components/PaginationButtons.vue';
import { useGetProducts } from '@/modules/common/composables/useGetProducts';

const { isError, isPending, products, currentPage } = useGetProducts();
</script>
