<template>
  <div>
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value ?? '')"
      @blur="$emit('blur')"
      :placeholder="placeholder"
      :class="['form-control', { 'border-red-500': error }]"
    />
    <span v-if="error" class="text-red-500 text-xs">{{ error }}</span>
  </div>
</template>

<script lang="ts" setup>
type Props = {
  modelValue?: string;
  placeholder?: string;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'number';
};

withDefaults(defineProps<Props>(), {
  type: 'text',
});

defineEmits(['update:modelValue', 'blur']);
</script>

<style scoped>
.form-control {
  @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none dark:bg-gray-700 dark:text-white;
}
</style>
