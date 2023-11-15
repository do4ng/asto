const { webpackLoader } = require('@asto/webpack');
const { esmLoader } = require('@asto/esm');

/**
 * @type {import("asto").BuildOptions[]}
 */
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
      {
        input: './packages/esm/src/index.ts',
        output: './packages/esm/dist/index.js',
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
  {
    loader: esmLoader(),
    entryPoints: [
      {
        input: './packages/asto/dist/index.js',
      },
      { input: './packages/esm/dist/index.js' },
    ],
  },
];
