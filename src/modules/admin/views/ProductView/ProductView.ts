/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProductById } from '@/modules/admin/actions/get-product.action';
import { updateOrCreateProduct } from '@/modules/admin/actions/update-create-product.action';
import InputText from '@/modules/common/components/InputText.vue';
import TextArea from '@/modules/common/components/TextArea.vue';
import type { ProductType } from '@/modules/products/types/product.type';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useFieldArray, useForm } from 'vee-validate';
import { defineComponent, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import * as yup from 'yup';

const sizesButtons = ['L', 'M', 'S', 'XL', 'XS', 'XXL'];

const validationSchema = yup.object<ProductType>({
  title: yup.string().required().min(3),
  slug: yup.string().required(),
  description: yup.string().required().min(125).max(1000),
  price: yup.number().required(),
  stock: yup.number().required().min(1),
  sizes: yup.array(yup.string().required().oneOf(sizesButtons)).required().min(1),
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
    const toast = useToast();

    const { values, errors, defineField, handleSubmit, resetForm } = useForm<ProductType>({
      validationSchema,
    });
    const [title, titleAttrs] = defineField('title');
    const [slug, slugAttrs] = defineField('slug');
    const [description, descriptionAttrs] = defineField('description');
    const [price, priceAttrs] = defineField('price');
    const [stock, stockAttrs] = defineField('stock');
    const [gender, genderAttrs] = defineField('gender');
    const imageFileList = ref<File[]>([]);

    const {
      fields: sizeFields,
      push: pushSize,
      remove: removeSize,
    } = useFieldArray<string>('sizes');

    const { fields: productImagesList } = useFieldArray<string>('images');

    const {
      isError,
      isLoading,
      data: product,
    } = useQuery({
      queryKey: ['product', props.id],
      queryFn: () => getProductById(props.id),
      retry: false,
    });

    const {
      data: updatedProduct,
      isPending,
      isSuccess,
      isError: isUpdateError,
      mutate,
    } = useMutation({
      mutationFn: updateOrCreateProduct,
    });

    const resetProductForm = (product: ProductType) => {
      resetForm({
        values: {
          id: product?.id,
          title: product.title,
          slug: product.slug,
          description: product.description,
          price: product.price,
          stock: product.stock,
          sizes: product.sizes,
          images: product.images,
          gender: product.gender,
        },
      });
    };

    watch(
      product,
      (product) => {
        if (!product) {
          return;
        }
        resetProductForm(product);
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

    watch(isSuccess, (isSuccessMudated) => {
      if (isSuccessMudated) {
        toast.success('Product save successfully');

        router.replace(`/dashboard/products/${updatedProduct.value!.id}`);

        resetProductForm(updatedProduct.value!);
        imageFileList.value = [];
      }
    });

    watch(isUpdateError, (isErr) => {
      if (isErr) {
        toast.error('Error saving product');
      }
    });

    const hasSize = (size: string) => sizeFields.value.some((field) => field.value === size);

    const createUrlImage = (file: File) => URL.createObjectURL(file);

    const onImageFileChange = (event: Event) => {
      const imageFiles = (event.target as HTMLInputElement).files;

      if (imageFiles && imageFiles.length) {
        for (const imageFile of imageFiles) {
          imageFileList.value.push(imageFile);
        }
      }
    };

    const toggleSize = (size: string) => {
      if (sizeFields.value.some((field) => field.value === size)) {
        removeSize(sizeFields.value.findIndex((field) => field.value === size));
      } else {
        pushSize(size);
      }
    };

    const onSubmit = handleSubmit((values) => {
      const body: any = {
        ...values,
        images: [...values.images, ...imageFileList.value],
      };
      mutate(body);
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
      productImagesList,
      sizeFields,
      isPending,
      imageFileList: imageFileList.value,
      onSubmit,
      toggleSize,
      hasSize,
      createUrlImage,
      onImageFileChange,
    };
  },
});
