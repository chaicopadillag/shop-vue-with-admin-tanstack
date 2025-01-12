import { shopApi } from '@/api/shopApi';
import type { ProductType } from '@/modules/products/types/product.type';

export const updateOrCreateProduct = (product: Partial<ProductType>) => {
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
      images: getImageProductFilenames(productData.images || []),
    };

    const { data } = await shopApi.patch(`/products/${id}`, body);

    return data;
  } catch (error) {
    console.log('Error updating product', error);
    throw new Error('Error updating product');
  }
};

const getImageProductFilenames = (imageUrls: string[]) => {
  return imageUrls.map((url) => {
    if (url.startsWith('http')) {
      return url.split('/').pop() || '';
    }
    return url;
  });
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
