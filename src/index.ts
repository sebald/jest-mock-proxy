export const createMockProxy = <T>(objectName = 'mock') => {
  const cache = new Map<any, jest.Mock>();
  const handler: ProxyHandler<object> = {
    get: (_, name) => {
      if (name === 'mockClear') {
        return () => cache.clear();
      }

      if (!cache.has(name)) {
        cache.set(name, jest.fn().mockName(`${objectName}.${String(name)}`));
      }

      return cache.get(name);
    },
  };
  return new Proxy({}, handler) as jest.Mocked<T> & { mockClear(): void };
};

export const createProxyFromMock = <T extends new (...args: any[]) => any>(
  mock: T
) => {
  if (!jest.isMockFunction(mock)) {
    throw new Error(
      `Expected ${mock} to be a jest mock.\n` +
        `If you want to mock a module, make sure you have called "jest.mock('<module name>')".`
    );
  }

  const proxy = createMockProxy<InstanceType<T>>();
  mock.mockImplementation(() => proxy);
  return proxy;
};
