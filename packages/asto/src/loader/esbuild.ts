import fs from 'node:fs';
import path, { join } from 'node:path';

import { BuildOptions, build } from 'esbuild';

import { Loader, LoaderContext } from '$asto/types/loader';
import { esbuildNodeExternals } from './plugins/node-externals';
import { EsbuildLoaderOptions } from '$asto/types';

// eslint-disable-next-line prefer-regex-literals
const nodeModules = new RegExp(/^(?:.*[\\\/])?node_modules(?:[\\\/].*)?$/);

export const filenamePlugin = {
  name: 'dirname',

  setup(build) {
    build.onLoad({ filter: /.*/ }, ({ path: filePath }) => {
      if (!filePath.match(nodeModules)) {
        let contents = fs.readFileSync(filePath, 'utf8');
        const loader = path.extname(filePath).substring(1);
        const dirname = path.dirname(filePath);
        contents = contents
          .replace('__dirname', `"${dirname.replace(/\\/g, '\\\\')}"`)
          .replace('__filename', `"${filePath.replace(/\\/g, '\\\\')}"`);
        return {
          contents,
          loader,
        };
      }
    });
  },
};

export const esbuildLoader = (options?: EsbuildLoaderOptions) => {
  function esbuild(ctx: LoaderContext<EsbuildLoaderOptions>) {
    const plugins = (options?.plugins || []).concat(ctx.options?.plugins || []);

    // plugins.push(filenamePlugin);

    if (options?.nodeExternal || ctx.options?.nodeExternal) {
      plugins.push(esbuildNodeExternals);
    }

    const esbuildOptions = Object.keys(options || {})
      .filter((key) => key !== 'nodeExternal')
      .reduce((obj, key) => {
        obj[key] = options[key];
        return obj;
      }, {});

    const buildOptions: BuildOptions = {
      entryPoints: [ctx.input],
      logLevel: 'silent',
      bundle: true,
      minify: true,
      platform: 'node',

      ...(esbuildOptions || {}),
      ...(ctx.options || {}),
      plugins,
    };

    if (ctx.output) {
      buildOptions.outfile = ctx.output;
    } else {
      buildOptions.outdir = ctx.astoOptions?.out || join(process.cwd(), 'dist');
    }
    // console.log(buildOptions);

    return new Promise((resolve) => {
      build(buildOptions as BuildOptions)
        .then(() => {
          resolve({ success: true });
        })
        .catch((e) => {
          resolve({
            success: false,
            reason: `${e.errors.map((err) => err.text).join(', ')}`,
          });
        });
    });
  }

  return <Loader<EsbuildLoaderOptions>>{
    name: 'esbuild-loader',
    build: esbuild,
    builders: {
      esbuild,
    },
  };
};
