const { join } = require('path');
const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

const base = {
  target: 'esnext',
  bundle: true,
  platform: 'node',
  minify: true,
};

const build = (
  pkg,
  entryPoint = 'src/index.ts',
  out = { cjs: 'dist/index.js', esm: null },
  cfg = {}
) => {
  console.log(join(process.cwd(), 'packages', pkg, 'package.json'));
  const pkgBase = {
    entryPoints: [join(process.cwd(), 'packages', pkg, entryPoint)],
    plugins: [
      // @ts-ignore
      nodeExternalsPlugin({
        packagePath: join(process.cwd(), 'packages', pkg, 'package.json'),
        devDependencies: true,
      }),
    ],
    external: ['esbuild'],
  };
  if (out.cjs) {
    // @ts-ignore
    esbuild.build({
      outfile: join(process.cwd(), 'packages', pkg, out.cjs),
      ...pkgBase,
      ...base,
      ...cfg,
      format: 'cjs',
      define: {
        __ESM__: 'false',
      },
    });
  }

  if (out.esm) {
    // @ts-ignore
    esbuild.build({
      outfile: join(process.cwd(), 'packages', pkg, out.esm),
      ...pkgBase,
      ...base,
      ...cfg,
      format: 'esm',
      define: {
        __ESM__: 'true',
      },
    });
  }
};

build('asto');
build('webpack');
