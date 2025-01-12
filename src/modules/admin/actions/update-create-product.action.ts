import { shopApi } from '@/api/shopApi';
import { getImagesFullUrl } from '@/modules/products/actions/get-products-paginate.action';
import type { ProductType } from '@/modules/products/types/product.type';

export const updateOrCreateProduct = (product: Partial<ProductType>): Promise<ProductType> => {
  if (product.id) {
    return updateProduct(product);
  }

  return createProduct(product);
};

const updateProduct = async (product: Partial<ProductType>) => {
  try {
    const { id, ...productData } = product;
    const body = {
      ...productData,
      images: productData.images!.map(getImageProductFilenames),
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
    const { data } = await shopApi.post('/products', product);
    return data;
  } catch (error) {
    console.log('Error creating product', error);
    throw new Error('Error creating product');
  }
};
