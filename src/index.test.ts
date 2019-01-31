import Foo from './fixture/foo';
import { createMockProxy, createProxyFromMock } from '.';

// API: createMockProxy
// ---------------
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

// API: createProxyFromMock
// ---------------
jest.mock('./fixture/foo');

test('input must be a mock', () => {
  expect(() => createProxyFromMock(class {}))
    .toThrowErrorMatchingInlineSnapshot(`
"Expected class {
    } to be a jest mock.
If you want to mock a module, make sure you have called \\"jest.mock('<module name>')\\"."
`);
});

test('import will be mocked behind the scences', () => {
  const mockedFoo = createProxyFromMock(Foo);
  const foo = new Foo();

  // Use any, because TypeScript does not know how jest mocking works.
  expect((mockedFoo as any) === foo).toBeTruthy();
});

test('proxy from mocked class', () => {
  const mockedFoo = createProxyFromMock(Foo);
  const foo = new Foo();

  mockedFoo.hello.mockReturnValue('I am mocked!');
  expect(foo.hello()).toMatchInlineSnapshot(`"I am mocked!"`);

  mockedFoo.waitFor.mockResolvedValue('...');
  expect(
    foo.waitFor('this will not be returned, becaue it was mocked')
  ).resolves.toMatchInlineSnapshot(`"..."`);
});
