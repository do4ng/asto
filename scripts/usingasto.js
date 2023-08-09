const { asto } = require('asto');
const { webpackLoader } = require('@asto/webpack');

asto({
  loader: webpackLoader({
    typescript: true,
    nodeExternals: true,
  }),
  entryPoints: [
    {
      input: './packages/asto/src/index.ts',
      output: './packages/asto/dist/index.js',
    },
    {
      input: './packages/webpack/src/index.ts',
      output: './packages/webpack/dist/index.js',
    },
  ],
});
