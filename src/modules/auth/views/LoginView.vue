<template>
  <h1 class="text-2xl font-semibold mb-4">Login</h1>
  <form @submit.prevent="onSubmit">
    <!-- Username Input -->
    <div class="mb-4">
      <label for="email" class="block text-gray-600">Correo</label>
      <input
        type="text"
        id="email"
        name="email"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
        v-model="formSignIn.email"
        ref="inputEmail"
      />
    </div>
    <!-- Password Input -->
    <div class="mb-4">
      <label for="password" class="block text-gray-600">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
        v-model="formSignIn.password"
        ref="inputPassword"
      />
    </div>
    <!-- Remember Me Checkbox -->
    <div class="mb-4 flex items-center">
      <input
        type="checkbox"
        id="remember"
        name="remember"
        class="text-blue-500"
        v-model="formSignIn.remember"
      />
      <label for="remember" class="text-gray-600 ml-2">Remember Me</label>
    </div>
    <!-- Forgot Password Link -->
    <div class="mb-6 text-blue-500">
      <a href="#" class="hover:underline">Forgot Password?</a>
    </div>
    <!-- Login Button -->
    <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
    >
      Login
    </button>
  </form>
  <!-- Sign up  Link -->
  <div class="mt-6 text-blue-500 text-center">
    <RouterLink :to="{ name: 'register' }" class="hover:underline">Sign up Here</RouterLink>
  </div>
</template>

<script lang="ts" setup>
import { HttpStatusCode } from 'axios';
import { reactive, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { loginAction } from '../actions/login.action';
import { useAuthStore } from '../store/auth.store';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const inputEmail = ref<HTMLInputElement | null>(null);
const inputPassword = ref<HTMLInputElement | null>(null);

const formSignIn = reactive({
  email: '',
  password: '',
  remember: false,
});

watchEffect(() => {
  if (localStorage.getItem('email')) {
    formSignIn.email = localStorage.getItem('email') ?? '';
    formSignIn.remember = true;
  }
});

const onSubmit = async () => {
  if (!formSignIn.email) {
    inputEmail.value?.focus();
    return;
  } else if (!formSignIn.password) {
    inputPassword.value?.focus();
    return;
  }

  if (formSignIn.remember) {
    localStorage.setItem('email', formSignIn.email);
  } else {
    localStorage.removeItem('email');
  }
  const lastPath = localStorage.getItem('lastPath') ?? '/';

  try {
    const { data, status, message } = await loginAction(formSignIn.email, formSignIn.password);

    if (status === HttpStatusCode.Ok && data) {
      authStore.setAuthUser(data.user, data.token);
      router.replace(lastPath);
    } else {
      toast.error(message);
      authStore.logout();
    }
  } catch (error) {
    console.log('Error en el login:', error);
  }
};
</script>
