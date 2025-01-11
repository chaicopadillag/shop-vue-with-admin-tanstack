import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../store/auth.store';

export const isAdminGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();

  if (authStore.authStatus === 'checking') {
    return next();
  }

  if (authStore.isAdmin) {
    console.log({ isAdmin: authStore.isAdmin });
    next();
  } else {
    next({ name: 'home-shop' });
  }
};
