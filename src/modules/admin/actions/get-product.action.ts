import { shopApi } from '@/api/shopApi';
import type { ProductType } from '@/modules/products/types/product.type';

export const getProductById = async (id: string) => {
  try {
    const { data } = await shopApi.get<ProductType>(`/products/${id}`);

    return data;
  } catch (error) {
    console.log('Error in getProductById', error);

    throw new Error('Error getting product');
  }
};
