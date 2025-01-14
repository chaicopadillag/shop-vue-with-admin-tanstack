/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';

import { shopApi } from '@/api/shopApi';
import { updateOrCreateProduct } from '@/modules/admin/actions/update-create-product.action';
import AxiosMockAdapter from 'axios-mock-adapter';

const productPayload: any = {
  title: 'Handmade Steel Hat',
  price: 180,
  description:
    'Incidunt expedita atque voluptate facilis quisquam recusandae. Sint consequatur quia maiores modi velit sed voluptatum. Itaque nihil at vel. Dolor consequatur dicta corrupti qui quod. Laboriosam maiores eum qui dolores iure dolores.',
  stock: 120,
  sizes: ['XS', 'S', 'L', 'XL', 'XXL'],
  gender: 'men',
  tags: ['sweatshirt'],
  images: ['1740176-00-C_0_2000.jpg', '1740176-00-B_1.jpg'],
};
const apiShopMock = new AxiosMockAdapter(shopApi);

describe('Create Product', () => {
  test('Debe de Crear Un product', async () => {
    const productMock = {
      ...productPayload,
      id: '86976b39-a499-4d5f-a242-ec3e6ff5280f',
      user: {
        id: '568bea9d-66a6-4800-8823-c0fa02d95284',
        email: 'test1@google.com',
        fullName: 'Test One',
        isActive: true,
        roles: ['admin'],
      },
    };

    apiShopMock.onPost('/products').reply(201, productMock);

    const product = await updateOrCreateProduct(productPayload);

    expect(product).toStrictEqual(productMock);
  });

  test('Debe de Prevenir el ERROR del API de Crear Un product', async () => {
    apiShopMock.onPost('/products').reply(() => {
      throw new Error('Unit test error call api create product');
    });

    await expect(updateOrCreateProduct(productPayload)).rejects.toThrow('Error creating product');
  });
});

describe('Update Product', () => {
  test('Debe de Actualizar el product', async () => {
    const productUpdatePayload: any = {
      id: '9de8ebd4-5cb3-4b5f-a2c9-eaa3a2a13dd1',
      ...productPayload,
    };
    const productMock = {
      ...productPayload,
      title: 'Rustic Concrete Table',
      price: 200,
      description:
        'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
      stock: 120,
      images: [
        `${import.meta.env.VITE_SHOP_API_URL}/files/product/1740176-00-C_0_2000.jpg`,
        `${import.meta.env.VITE_SHOP_API_URL}/files/product/1740176-00-B_1.jpg`,
      ],
      user: {
        id: '568bea9d-66a6-4800-8823-c0fa02d95284',
        email: 'test1@google.com',
        fullName: 'Test One',
        isActive: true,
        roles: ['admin'],
      },
    };

    apiShopMock.onPatch(`/products/${productUpdatePayload.id}`).reply(200, productMock);

    const product = await updateOrCreateProduct(productUpdatePayload);

    expect(product).toStrictEqual(productMock);
  });

  test('Debe de Prevenir el ERROR del API de Update product', async () => {
    const updatePayload: any = {
      id: '9de8ebd4-5cb3-4b5f-a2c9-eaa3a2a13dd1',
      ...productPayload,
    };

    apiShopMock.onPatch(`/products/${updatePayload.id}`).reply(() => {
      throw new Error('Unit test error call api update product');
    });

    await expect(updateOrCreateProduct(updatePayload)).rejects.toThrow('Error updating product');
  });
});

describe('Subida Archivo', () => {
  const filePath = path.join(__dirname, '../../../mock/t-shirt.jpg');
  const fileImage = new File([fs.readFileSync(filePath)], 't-shirt.jpg', { type: 'image/jpeg' });

  test('Debe de Subir Subir archivo cuando actualiza o se crea un producto', async () => {
    const productUpdatePayload: any = {
      id: '9de8ebd4-5cb3-4b5f-a2c9-eaa3a2a13dd1',
      ...productPayload,
      images: [...productPayload.images, fileImage],
    };

    const mockUploadFile = {
      secureUrl: `${import.meta.env.VITE_SHOP_API_URL}/files/product/85e9cb09-bd34-4a19-b06f-ab3facbaaa4d.jpg`,
    };

    const productMock = {
      ...productPayload,
      title: 'Rustic Concrete Table',
      price: 200,
      description:
        'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
      stock: 120,
      images: [
        `${import.meta.env.VITE_SHOP_API_URL}/files/product/1740176-00-C_0_2000.jpg`,
        `${import.meta.env.VITE_SHOP_API_URL}/files/product/1740176-00-B_1.jpg`,
        mockUploadFile.secureUrl,
      ],
      user: {
        id: '568bea9d-66a6-4800-8823-c0fa02d95284',
        email: 'test1@google.com',
        fullName: 'Test One',
        isActive: true,
        roles: ['admin'],
      },
    };
    apiShopMock.onPost(`/files/product`).reply(200, mockUploadFile);

    apiShopMock.onPatch(`/products/${productUpdatePayload.id}`).reply(200, productMock);

    const product = await updateOrCreateProduct(productUpdatePayload);

    expect(product).toStrictEqual(productMock);
    expect(product.images.pop()).toStrictEqual(mockUploadFile.secureUrl);
  });

  test('Debe de Prevenir el ERROR del API de Subida de Archivo del producto', async () => {
    const updatePayload: any = {
      id: '9de8ebd4-5cb3-4b5f-a2c9-eaa3a2a13dd1',
      ...productPayload,
      images: [...productPayload.images, fileImage],
    };

    apiShopMock.onPost(`/files/product`).reply(() => {
      throw new Error('Unit Test error in service upload file image');
    });

    apiShopMock.onPatch(`/products/${updatePayload.id}`).reply(200, {});

    await expect(updateOrCreateProduct(updatePayload)).rejects.toThrow('Error updating product');
  });
});
