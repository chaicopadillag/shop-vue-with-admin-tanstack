<template>
  <div>
    <div
      class="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white dark:bg-gray-700 text-black dark:text-white"
    >
      <HeaderTop />
      <SidebarMenu />
      <div class="h-full ml-14 mt-14 mb-10 md:ml-64">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HeaderTop from '../components/HeaderTop.vue';
import SidebarMenu from '../components/SidebarMenu.vue';
</script>
