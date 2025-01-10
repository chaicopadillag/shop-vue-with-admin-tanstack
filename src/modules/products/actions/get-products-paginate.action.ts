import { shopApi } from '@/api/shopApi';
import type { ProductType } from '../types/product.type';

export const getProductsPaginate = async (page = 1, limit = 12) => {
  try {
    // retraso de 2 segundos
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    const { data } = await shopApi.get<ProductType[]>(
      `/products?limit=${limit}&offset=${limit * page}`,
    );

    return data.map((product) => ({
      ...product,
      images: product.images.map(getImagesFullUrl),
    }));
  } catch (error) {
    console.log('Error getting products', error);
    throw new Error('Error getting products');
  }
};

export const getImagesFullUrl = (imageUrl: string) => {
  return imageUrl.startsWith('http')
    ? imageUrl
    : `${import.meta.env.VITE_SHOP_API_URL}/files/product/${imageUrl}`;
};
