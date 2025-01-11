import type { RouteRecordRaw } from 'vue-router';

export const dashboardRouter: RouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboard',
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
