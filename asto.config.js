const { webpackLoader } = require('@asto/webpack');

module.exports = [
  {
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
  },
  {
    loader: webpackLoader({
      typescript: true,
      nodeExternals: true,
      cli: true,
    }),
    entryPoints: [
      {
        input: './packages/asto/src/bin/bin.ts',
        output: './packages/asto/dist/bin.js',
      },
    ],
  },
];
