/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */

vi.mock('@tanstack/vue-query', () => ({
  VueQueryPlugin: 'VueQueryPlugin',
}));

vi.mock('@/router', () => ({
  default: 'router',
}));

vi.mock('vue-toastification', () => ({
  default: 'Toast',
}));

vi.mock('pinia', async (pinia) => {
  const mockPinia: any = await pinia();
  return {
    ...mockPinia,
    createPinia: vi.fn(() => 'pinia'),
  };
});

describe('main app', () => {
  const vue = require('vue');

  const useSpy = vi.fn();
  const mountSpy = vi.fn();

  const createAppSpy = vi.fn(() => ({
    use: useSpy,
    mount: mountSpy,
  }));

  vue.createApp = createAppSpy;

  it('should mount the app', async () => {
    await import('../src/main');
    expect(useSpy).toBeCalledTimes(4);
    expect(useSpy).toBeCalledWith('VueQueryPlugin');
    expect(useSpy).toBeCalledWith('pinia');
    expect(useSpy).toBeCalledWith('router');
    expect(useSpy).toBeCalledWith('Toast');

    expect(createAppSpy).toBeCalledTimes(1);
    expect(mountSpy).toBeCalledWith('#app');
  });
});
