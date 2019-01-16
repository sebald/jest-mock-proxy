# jest-mock-proxy

[![buid][ci-badge]][ci] [![buid][coverage-badge]][coverage] [![version][version-badge]][package] [![MIT License][license-badge]][license]

> Mock classes and objects with the power of proxies!

Creates a `Proxy` that will dynamically create spies when a property is accessed the first time.
Every subsequent access will use the same spy. In combination with TypeScript this allows us to create a mock for any class/object without having to specify all its properties and methods.

**tl;dr;**

1. The `Proxy` makes any property and method available on the mock at runtime.
2. TypeScript limits access to properties and methods to the specified generic.

## Install

_Requires node 8+._

```
$ yarn add -D jest-mock-proxy
```

or

```
$ npm install -D jest-mock-proxy
```

## Usage

```ts
// service.ts
export class Service {
  foo() {
    console.log('hello');
  }
  bar(s: string) {
    return s;
  }
}

// some.test.ts
import createMockProxy from 'jest-mock-proxy';
import { service } from './service';

const mock = createMockProxy<Service>();

mock.foo();

mock.bar.mockReturnValue('some string');
mock.bar('test'); // 'some string'
```

#### Example: Mock an elastic search client.

```ts
import { Client } from 'elasticsearch';
import createMockProxy from 'jest-mock-proxy';
import fixture from './__fixtures__/elastic-response.json';

// This is an imaginary service that depends on the elastic search client.
import createService from './createService';

const client = createMockProxy<Client>();
cosnt service = createService(client);

beforeEach(() => {
  client.mockClear();
  client.search.mockResolvedValue(fixture);
});

test('use service to query', async () => {
  await service.query('https://example.com?q=hello');
  expect(client.search.mock.calls).toMatchSnapshot();
});
```

<!-- LINKS -->

[ci]: https://travis-ci.org/sebald/jest-mock-proxy
[ci-badge]: https://img.shields.io/travis/sebald/jest-mock-proxy.svg?style=flat-square
[coverage]: https://codecov.io/gh/sebald/jest-mock-proxy
[coverage-badge]: https://img.shields.io/codecov/c/github/sebald/jest-mock-proxy.svg?style=flat-square
[license]: https://github.com/sebald/jest-mock-proxy/blob/master/LICENCE
[license-badge]: https://img.shields.io/npm/l/jest-mock-proxy.svg?style=flat-square
[package]: https://www.npmjs.com/package/jest-mock-proxy
[version-badge]: https://img.shields.io/npm/v/jest-mock-proxy.svg?style=flat-square
