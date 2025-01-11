import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../store/auth.store';

export const isAuthenticatedGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();

  if (authStore.authStatus === 'checking') {
    console.log({ isAuthenticatedGuard: 'checking' });
    return next();
  }

  if (authStore.authStatus === 'unauthenticated') {
    console.log({ isAuthenticatedGuard: 'unauthenticated' });
    next({ name: 'login' });
  } else {
    next();
  }
};
