import fs from 'node:fs';
import path, { join } from 'node:path';

import { BuildOptions, build } from 'esbuild';

import { Loader, LoaderContext } from '$asto/types/loader';

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

export const esbuildLoader = (options?: BuildOptions) => {
  function esbuild(ctx: LoaderContext<BuildOptions>) {
    const plugins = (options?.plugins || []).concat(ctx.options?.plugins || []);

    // plugins.push(filenamePlugin);

    const buildOptions = {
      entryPoints: [ctx.input],
      bundle: true,
      minify: true,
      platform: 'node',
      ...(options || {}),
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
          resolve({ success: false, reason: e });
        });
    });
  }

  return <Loader<BuildOptions>>{
    name: 'esbuild-loader',
    build: esbuild,
    builders: {
      esbuild,
    },
  };
};
