# @asto/webpack

Webpack loader for [asto](https://github.com/do4ng/asto).

## Installation

```
$ npm i --save-dev @asto/webpack webpack
```

```js
const { asto } = require('asto');
const { webpackLoader } = require('@asto/webpack');

asto({
  loader: webpackLoader(
    {
      typescript: true, // for typescript
      nodeExternals: true, // Exclude node_modules from bundle
      cli: false, // Add banner for cli
    },
    {
      /* webpack options */
    }
  ),
  entryPoints: ['src/index.ts'],
});
```

## License

MIT
