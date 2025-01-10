<script lang="ts" setup>
import ChevronLeftIcon from '../icons/ChevronLeftIcon.vue';
import ChevronRightIcon from '../icons/ChevronRightIcon.vue';

defineProps<{ page: number; hasMoreData: boolean }>();
</script>

<template>
  <div class="flex justify-center my-4">
    <button
      type="button"
      :disabled="page === 1"
      @click="$router.push({ query: { page: page - 1 } })"
      class="flex items-center justify-center px-4 h-10 me-3 text-base font-medium bg-blue-500 text-white border border-blue-300 rounded-lg hover:bg-blue-600"
    >
      <chevron-left-icon />
      Anterior
    </button>
    <button
      type="button"
      :disabled="!hasMoreData"
      @click="$router.push({ query: { page: page + 1 } })"
      class="flex items-center justify-center px-4 h-10 text-base font-medium bg-blue-500 text-white border border-blue-300 rounded-lg hover:bg-blue-600"
    >
      Siguiente
      <chevron-right-icon />
    </button>
  </div>
</template>
