# Asto

A tiny typescript/javascript package bundler.

---

- 📦 **typescript supported**
- 🛠️ **Extendable Loader**
- 🔥 **very tiny (9kb)**

---

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

## Watch

You can build whenever a file changes with the watch option.

```js
const { watch } = require('asto');

watch(
  {
    entryPoints: [
      /* ... */
    ],
  },
  {
    /* watch options */
  }
);
```

## Webpack Loader

Asto's default loader is [esbuild](https://esbuild.github.io/), but you can increase stability further with the [webpack](https://webpack.js.org/) loader.

```
$ npm i --save-dev @asto/webpack
```

```js
const { asto } = require('asto');
const { webpackLoader } = require('@asto/webpack');

asto({
  loader: webpackLoader(
    {
      typescript: true, // for typescript
      nodeExternals: true,
    },
    {
      /* webpack options */
    }
  ),
  entryPoints: [
    'src/index.ts',
    {
      // copy directory
      input: 'assets',
      output: 'dist/assets',
      builder: 'asset',
    },
  ],
});
```

## ESM Transformer

Install a loader that converts commonjs code to esm!

```
$ npm i --save-dev @asto/esm
```

```js
const { asto } = require('asto');
const { esmLoader } = require('@asto/esm');

asto({
  loader: esmLoader(),
  entryPoints: [
    {
      input: 'src/index.js',
    },
  ],
});
```

## License

MIT
