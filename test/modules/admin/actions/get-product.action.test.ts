import { shopApi } from '@/api/shopApi';
import { getProductById } from '@/modules/admin/actions/get-product.action';
import AxiosMockAdapter from 'axios-mock-adapter';
import { fakeProducts } from '../../../mock/fake-products';

describe('GetProductAction', () => {
  const apiShopMock = new AxiosMockAdapter(shopApi);

  it('Debe retornar objeto de tipo ProductType con campos vacios por parametro "create"', async () => {
    const product = await getProductById('create');

    expect(product).toEqual({
      id: '',
      title: '',
      price: 0,
      description: '',
      slug: '',
      stock: 0,
      sizes: [],
      gender: '',
      tags: [],
      images: [],
      user: {},
    });
  });

  it('Debe retornar un producto con el id valido uuid', async () => {
    const uuidProduct = '008ea87d-a16c-4c25-9de3-8a14bae089cd';
    const productMock = fakeProducts.find((p) => p.id === uuidProduct);

    apiShopMock.onGet(`/products/${uuidProduct}`).reply(200, productMock);

    const product = await getProductById(uuidProduct);

    expect(product.id).toStrictEqual(uuidProduct);
    expect(product.title).toEqual(productMock?.title);
    expect(product).toEqual(
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

  it('Debe de prevenir el error al obtener el producto en el servicio', async () => {
    const uuidProduct = '008ea87d-a16c-4c25-9de3-8a14bae089cd';

    apiShopMock.onGet(`/products/${uuidProduct}`).reply(() => {
      throw new Error('Unit test error call api get product');
    });

    await expect(getProductById(uuidProduct)).rejects.toThrow('Error getting product');
  });
});
