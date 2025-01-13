/* eslint-disable @typescript-eslint/no-explicit-any */
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

describe('Update Product', () => {
  const apiShopMock = new AxiosMockAdapter(shopApi);

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
