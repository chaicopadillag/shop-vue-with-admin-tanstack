<template>
  <div>
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement)?.value ?? '')"
      @blur="$emit('blur')"
      :placeholder="placeholder"
      :class="[
        'shadow h-32 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
        { 'border-red-500': error },
      ]"
    ></textarea>
    <span v-if="error" class="text-red-500 text-xs">{{ error }}</span>
  </div>
</template>

<script lang="ts" setup>
type Props = {
  modelValue?: string;
  placeholder?: string;
  error?: string;
};

defineProps<Props>();

defineEmits(['update:modelValue', 'blur']);
</script>

<style scoped>
.form-control {
  @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none dark:bg-gray-700 dark:text-white;
}
</style>
