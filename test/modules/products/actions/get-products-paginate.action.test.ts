import { shopApi } from '@/api/shopApi';
import { getProductsPaginate } from '@/modules/products/actions/get-products-paginate.action';
import AxiosMockAdapter from 'axios-mock-adapter';
import { fakeProducts } from '../../../mock/fake-products';

describe('GetProductsPaginateAction', () => {
  const apiShop = new AxiosMockAdapter(shopApi);

  test('Debe de retornar los los 10 primero productos pro default', async () => {
    const productsUri = '/products';
    const url = new RegExp(`${productsUri}/*`);

    apiShop.onGet(url).reply(200, fakeProducts);

    const products = await getProductsPaginate();

    expect(products.length).toStrictEqual(10);
    expect(products.at(0)).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        price: expect.any(Number),
        description: expect.any(String),
        stock: expect.any(Number),
        sizes: expect.any(Array),
        gender: expect.any(String),
        tags: expect.any(Array),
        images: expect.any(Array),
        user: expect.anything(),
      }),
    );
  });

  test('Las imagenes debe tener url completo => http://', async () => {
    const productsUri = '/products';
    const url = new RegExp(`${productsUri}/*`);

    apiShop.onGet(url).reply(200, fakeProducts);

    const products = await getProductsPaginate();

    products.forEach((product) => {
      product.images.forEach((image) => {
        expect(image.startsWith('http')).toBeTruthy();
      });
    });
  });

  test('Debe de prevenir el error al obtener products paginado', async () => {
    const productsUri = '/products';
    const url = new RegExp(`${productsUri}/*`);

    apiShop.onGet(url).reply(() => {
      throw new Error('Unit test error call api get products');
    });

    await expect(getProductsPaginate()).rejects.toThrow('Error getting products');
  });
});
