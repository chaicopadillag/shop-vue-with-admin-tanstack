import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { AuthStatus, UserType } from '../types/auth-types';

export const useAuthStore = defineStore('auth', () => {
  const authUser = ref<UserType>();
  const authStatus = ref<AuthStatus>('checking');
  const token = ref(useLocalStorage('token', ''));

  const setAuthUser = (user: UserType, jwt: string) => {
    authUser.value = user;
    authStatus.value = 'authenticated';
    token.value = jwt;
  };

  const logout = () => {
    authUser.value = undefined;
    authStatus.value = 'unauthenticated';
    token.value = undefined;
  };

  const isAdmin = computed(() => authUser.value?.roles.includes('admin'));

  return {
    authStatus,
    token,
    authUser,
    isAdmin,
    setAuthUser,
    logout,
  };
});
