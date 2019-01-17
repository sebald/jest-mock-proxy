export default class Foo {
  hello() {
    return 'I am foo!';
  }

  waitFor(it: string) {
    return Promise.resolve(it);
  }
}
