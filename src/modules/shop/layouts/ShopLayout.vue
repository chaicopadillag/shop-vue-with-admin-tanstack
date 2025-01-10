<template>
  <header-navbar />
  <router-view />
  <footer-shop />
</template>

<script lang="ts" setup>
import HeaderNavbar from '@/modules/shop/components/HeaderNavbar.vue';
import FooterShop from '../components/FooterShop.vue';
</script>
