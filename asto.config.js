const { esbuildLoader } = require('./packages/asto/dist');
const { esmLoader } = require('@asto/esm');

/**
 * @type {import("asto").BuildOptions[]}
 */
module.exports = [
  {
    loader: esbuildLoader({ nodeExternal: true }),
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
    loader: esbuildLoader({ nodeExternal: true }),
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
