import './assets/main.css';

import '@/config/yup';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(VueQueryPlugin);
app.use(createPinia());
app.use(router);
app.use(Toast);

app.mount('#app');
