/* eslint-disable @typescript-eslint/no-unused-vars */
import { shopApi } from '@/api/shopApi';
import { getImagesFullUrl } from '@/modules/products/actions/get-products-paginate.action';
import type { ProductType } from '@/modules/products/types/product.type';

export const updateOrCreateProduct = (product: Partial<ProductType>): Promise<ProductType> => {
  if (product.id && product.id !== '') {
    return updateProduct(product);
  }

  return createProduct(product);
};

const updateProduct = async (product: Partial<ProductType>) => {
  try {
    const { id, images, ...productData } = product;
    const imageUploads = await processImages(images || []);

    const body = {
      ...productData,
      images: imageUploads.map(getImageProductFilenames),
    };

    const { data } = await shopApi.patch<ProductType>(`/products/${id}`, body);

    return {
      ...data,
      images: data.images.map(getImagesFullUrl),
    };
  } catch (error) {
    console.log('Error updating product', error);
    throw new Error('Error updating product');
  }
};

const getImageProductFilenames = (url: string) => {
  return url.startsWith('http') ? (url.split('/').pop() ?? '') : url;
};

const createProduct = async (product: Partial<ProductType>) => {
  try {
    const { id: _, images, ...restProduct } = product;
    const imageUploads = await processImages(images || []);

    const body = {
      ...restProduct,
      images: imageUploads.map(getImageProductFilenames),
    };

    const { data } = await shopApi.post('/products', body);
    return data;
  } catch (error) {
    console.log('Error creating product', error);
    throw new Error('Error creating product');
  }
};

const processImages = async (images: (string | File)[]) => {
  const imageUploadeds = images.filter((image) => typeof image === 'string');
  const imageFiles = images.filter((image) => image instanceof File);

  if (imageFiles.length === 0) {
    return imageUploadeds;
  }

  const imageUploadedsFiles = await Promise.all(imageFiles.map(uploadFileImage));

  return [...imageUploadeds, ...imageUploadedsFiles];
};

const uploadFileImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await shopApi.post<{ secureUrl: string }>('/files/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.secureUrl;
  } catch (error) {
    console.log('Error uploading image', error);
    throw new Error('Error uploading image');
  }
};
