import createMockProxy from '.';

test('create mock proxy', () => {
  const mock = createMockProxy<{
    foo(): void;
    bar(s: string): string;
  }>();

  expect(jest.isMockFunction(mock.bar)).toBeTruthy();
  expect(jest.isMockFunction(mock.foo)).toBeTruthy();

  mock.foo();
  mock.bar('foo');
  expect(mock.foo).toHaveBeenCalledTimes(1);
  expect(mock.bar).toHaveBeenCalledWith('foo');
});

test('mock proxy allows to set return values', () => {
  const mock = createMockProxy<{
    foo(s: string): number;
  }>();

  mock.foo.mockReturnValue(42);
  expect(mock.foo('foo')).toMatchInlineSnapshot(`42`);

  mock.foo.mockReturnValue(123);
  expect(mock.foo('foo')).toMatchInlineSnapshot(`123`);
});

test('clean up mock data', () => {
  const mock = createMockProxy<{
    foo(s: string): number;
  }>();
  mock.foo.mockReturnValue(1);

  mock.foo('foo');
  mock.mockClear();
  expect(mock.foo.mock.calls).toMatchInlineSnapshot(`Array []`);
});
