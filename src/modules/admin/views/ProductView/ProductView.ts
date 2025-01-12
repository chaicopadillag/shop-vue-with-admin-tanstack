import InputText from '@/modules/common/components/InputText.vue';
import TextArea from '@/modules/common/components/TextArea.vue';
import type { ProductType } from '@/modules/products/types/product.type';
import { useQuery } from '@tanstack/vue-query';
import { useFieldArray, useForm } from 'vee-validate';
import { defineComponent, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import { getProductById } from '../../actions/get-product.action';

const sizesButtons = ['L', 'M', 'S', 'XL', 'XS', 'XXL'];

const validationSchema = yup.object<ProductType>({
  title: yup.string().required().min(3),
  slug: yup.string().required(),
  description: yup.string().required().min(125).max(1000),
  price: yup.number().required(),
  stock: yup.number().required().min(1),
  sizes: yup.array(yup.string().required().oneOf(sizesButtons)).required(),
  gender: yup.string().required().oneOf(['men', 'women', 'kid']),
  images: yup.array(yup.string().required()),
});

export default defineComponent({
  components: { InputText, TextArea },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const { values, errors, defineField, handleSubmit, resetForm } = useForm<ProductType>({
      validationSchema,
    });

    const {
      fields: sizeFields,
      push: pushSize,
      remove: removeSize,
    } = useFieldArray<string>('sizes');

    const { fields: imageFiles } = useFieldArray<string>('images');
    const {
      isError,
      isLoading,
      data: product,
    } = useQuery({
      queryKey: ['product', props.id],
      queryFn: () => getProductById(props.id),
      retry: false,
    });

    watch(
      product,
      (newProduct) => {
        if (!newProduct) {
          return;
        }

        resetForm({
          values: {
            title: newProduct.title,
            slug: newProduct.slug,
            description: newProduct.description,
            price: newProduct.price,
            stock: newProduct.stock,
            sizes: newProduct.sizes,
            images: newProduct.images,
          },
        });
      },
      {
        immediate: true,
        deep: true,
      },
    );

    watchEffect(() => {
      if (!isLoading.value && isError.value) {
        router.replace('/dashboard/products');
      }
    });

    const [title, titleAttrs] = defineField('title');
    const [slug, slugAttrs] = defineField('slug');
    const [description, descriptionAttrs] = defineField('description');
    const [price, priceAttrs] = defineField('price');
    const [stock, stockAttrs] = defineField('stock');
    const [gender, genderAttrs] = defineField('gender');

    const hasSize = (size: string) => sizeFields.value.some((field) => field.value === size);

    const toggleSize = (size: string) => {
      if (sizeFields.value.some((field) => field.value === size)) {
        removeSize(sizeFields.value.findIndex((field) => field.value === size));
      } else {
        pushSize(size);
      }
    };

    const onSubmit = handleSubmit((values) => {
      console.log(values);
    });

    return {
      sizesButtons,
      title,
      titleAttrs,
      slug,
      slugAttrs,
      description,
      descriptionAttrs,
      price,
      priceAttrs,
      stock,
      stockAttrs,
      gender,
      genderAttrs,
      product,
      isLoading,
      errors,
      values,
      imageFiles,
      sizeFields,
      onSubmit,
      toggleSize,
      hasSize,
    };
  },
});
