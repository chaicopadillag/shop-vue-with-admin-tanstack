import { shopApi } from '@/api/shopApi';
import AxiosMockAdapter from 'axios-mock-adapter';

describe('Shop API', () => {
  const axiosMock = new AxiosMockAdapter(shopApi);

  it('should create an axios instance with the correct base URL', () => {
    expect(shopApi.defaults.baseURL).toBe(import.meta.env.VITE_SHOP_API_URL);
    expect(shopApi.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('debe de leer el token desde local storage y establacer en la cabecera de Authorization en el interceptor', async () => {
    axiosMock.onGet('/test').reply(200, { status: 200 });

    const token = '3a6c29d6-6374-44d6-9b7d-ae766a11a974';

    localStorage.setItem('token', token);

    const { config } = await shopApi.get('/test');
    expect(config.headers.Authorization).toStrictEqual(`Bearer ${token}`);
  });
});
