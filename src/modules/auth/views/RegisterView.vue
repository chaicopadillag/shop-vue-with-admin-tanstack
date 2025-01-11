<template>
  <h1 class="text-2xl font-semibold mb-4">Register</h1>
  <form @submit.prevent="onSubmit">
    <!-- Username Input -->
    <div class="mb-4">
      <label for="fullName" class="block text-gray-600">Full Name</label>
      <input
        type="text"
        id="fullName"
        name="fullName"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
        v-model="formRegister.fullName"
      />
    </div>

    <!-- Username Input -->
    <div class="mb-4">
      <label for="email" class="block text-gray-600">Email</label>
      <input
        type="text"
        id="email"
        name="email"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
        v-model="formRegister.email"
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
        v-model="formRegister.password"
      />
    </div>
    <!-- Remember Me Checkbox -->
    <div class="mb-4 flex items-center">
      <input
        type="checkbox"
        id="remember"
        name="remember"
        class="text-blue-500"
        v-model="formRegister.remember"
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
    <RouterLink :to="{ name: 'login' }" class="hover:underline">Login Here</RouterLink>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { registerAction } from '../actions/register.action';
import { useAuthStore } from '../store/auth.store';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const formRegister = reactive({
  fullName: '',
  email: '',
  password: '',
  remember: false,
});

const onSubmit = async () => {
  const { remember, ...body } = formRegister;

  if (!body.fullName || !body.email || !body.password) {
    toast.error('Please fill in all fields');
    return;
  }

  if (remember) {
    localStorage.setItem('email', body.email);
  } else {
    localStorage.removeItem('email');
  }

  try {
    const { data, message, status } = await registerAction(body);

    if (status !== 200 && status !== 201) {
      toast.error(message);
      return;
    }

    if (!data) return;

    authStore.setAuthUser(data.user, data.token);
    const lastPath = localStorage.getItem('lastPath') ?? '/';
    router.replace(lastPath);
  } catch (error) {
    console.log('Error registering user:', error);
  }
};
</script>
