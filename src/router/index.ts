import { dashboardRouter } from '@/modules/admin/router';
import { authRouter } from '@/modules/auth/router';
import ShopLayout from '@/modules/shop/layouts/ShopLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'shop',
      component: ShopLayout,
      // beforeEnter: authGuard,
      children: [
        {
          path: '',
          name: 'home-shop',
          component: () => import('@/modules/shop/views/HomeShop.vue'),
        },
      ],
    },
    authRouter,
    dashboardRouter,
  ],
});

export default router;
