import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';
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

  return {
    authStatus,
    token,
    authUser,
    setAuthUser,
    logout,
  };
});
