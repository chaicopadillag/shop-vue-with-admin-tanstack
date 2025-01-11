<template>
  <SpinnerBlocksShuffle v-if="authStore.authStatus === 'checking'" />
  <router-view />
  <VueQueryDevtools />
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';

import { verifyToken } from '@/modules/auth/actions/verify-token.action';
import { useRoute, useRouter } from 'vue-router';
import SpinnerBlocksShuffle from './modules/common/components/SpinnerBlocksShuffle.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

authStore.$subscribe(
  async (_, state) => {
    try {
      if (state.authStatus === 'checking') {
        const auth = await verifyToken();
        authStore.setAuthUser(auth.user, auth.token);
        return;
      }
    } catch (error) {
      console.log(`Error AuthChecking: ${JSON.stringify(error)}`);
      authStore.logout();
    }

    console.log({ path: route.path });

    if (state.authStatus === 'authenticated' && route.path.startsWith('/auth/')) {
      router.push({ name: 'home-shop' });
      return;
    }
  },
  {
    immediate: true,
  },
);
</script>
