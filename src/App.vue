<template>
  <router-view />
  <VueQueryDevtools />
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';

import { verifyToken } from '@/modules/auth/actions/verify-token.action';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

authStore.$subscribe(
  async (_, state) => {
    if (state.authStatus === 'authenticated' && route.path.includes('auth')) {
      router.push({ name: 'dashboard' });
      return;
    }

    if (state.authStatus === 'unauthenticated') {
      router.push({ name: 'login' });
      return;
    }

    try {
      if (state.authStatus === 'checking') {
        const auth = await verifyToken();
        authStore.setAuthUser(auth.user, auth.token);
      }
    } catch (error) {
      console.log(`Error AuthChecking: ${JSON.stringify(error)}`);
      authStore.logout();
    }
  },
  {
    immediate: true,
  },
);
</script>
