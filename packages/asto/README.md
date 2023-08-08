# Asto

Esbuild based typescript/javascript package bundler.

```
$ npm i --save-dev asto
```

## Usage

```js
const { asto } = require('asto');

asto({
  entryPoints: [
    'src/index.ts',
    {
      input: 'assets',
      output: 'dist/assets',
      builder: 'asset',
    },
  ],
});
```

## License

MIT
