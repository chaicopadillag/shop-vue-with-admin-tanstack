import { shopApi } from '@/api/shopApi';
import { getImagesFullUrl } from '@/modules/products/actions/get-products-paginate.action';
import type { ProductType } from '@/modules/products/types/product.type';

export const getProductById = async (id: string) => {
  try {
    const { data } = await shopApi.get<ProductType>(`/products/${id}`);

    const product = {
      ...data,
      images: data.images.map(getImagesFullUrl),
    };
    return product;
  } catch (error) {
    console.log('Error in getProductById', error);

    throw new Error('Error getting product');
  }
};
