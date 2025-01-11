import { isAuthenticatedGuard } from '@/modules/auth/guards/isAuthenticated.guard';
import type { RouteRecordRaw } from 'vue-router';

export const dashboardRouter: RouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboard',
  beforeEnter: [isAuthenticatedGuard],
  redirect: { name: 'dashboard-home' },
  component: () => import('@/modules/admin/layouts/DashboardLayout.vue'),
  children: [
    {
      path: '',
      name: 'dashboard-home',
      component: () => import('@/modules/admin/views/DashboardView.vue'),
    },
  ],
};
