import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProductView',
  setup() {
    const sizes = ['L', 'M', 'S', 'XL', 'XS', 'XXL'];

    return {
      sizes,
    };
  },
});
