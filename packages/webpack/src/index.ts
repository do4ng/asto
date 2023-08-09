import { join, parse } from 'path';
import type { BuildOutput, Loader, LoaderContext } from 'asto';

import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

import { WebpackLoaderOptions } from '$webpack';

export function webpackLoader(
  options: WebpackLoaderOptions = {},
  webpackOptions: webpack.Configuration = {}
): Loader<webpack.Configuration> {
  const webpackBuilder = (
    ctx: LoaderContext<webpack.Configuration>
  ): Promise<BuildOutput> =>
    new Promise((resolve) => {
      const buildOptions: webpack.Configuration = {
        entry: ctx.input,
        output: {
          filename: ctx.output || join('dist', `${parse(ctx.input).name}.js`),
          path: process.cwd(),
          libraryTarget: 'umd',
          library: 'asto',
        },
        mode: (process.env.NODE_ENV as any) || 'production',
        target: 'node',

        ...(webpackOptions || {}),
        ...(ctx.options || {}),
      };

      /*
      console.log({
        output: {
          // path: ctx.astoOptions?.out || join(process.cwd(), 'dist'),
          filename: ctx.output || `${parse(ctx.input).name}.js`,
        },
      });
      */

      if (options?.typescript) {
        if (!buildOptions?.resolve) buildOptions.resolve = {};
        if (!buildOptions?.resolve.extensions) buildOptions.resolve.extensions = [];
        if (!buildOptions?.module) buildOptions.module = {};
        if (!buildOptions?.module.rules) buildOptions.module.rules = [];

        buildOptions.resolve.extensions.push('.ts');
        buildOptions.resolve.extensions.push('.tsx');

        buildOptions.module.rules.push({
          test: /\.([cm]?ts|tsx)$/,
          loader: 'ts-loader',
          options: options?.tsloader || {},
        });
      }

      if (options?.cli) {
        if (!buildOptions?.plugins) buildOptions.plugins = [];

        buildOptions.plugins.push(
          new webpack.BannerPlugin({
            banner: '#!/usr/bin/env node',
            raw: true,
          })
        );
      }

      if (options?.nodeExternals) {
        if (!buildOptions?.externals) buildOptions.externals = [];
        if (!buildOptions?.externalsPresets) buildOptions.externalsPresets = {};

        (buildOptions.externals as Array<any>).push(nodeExternals());

        buildOptions.externalsPresets.node = true;
      }

      const compiler = webpack(buildOptions);

      compiler.run((err, stats) => {
        if (options?.stats) options.stats(stats);
        if (err) {
          resolve({ success: false, reason: err });
        }
        resolve({
          success: true,
        });
        compiler.close(() => {});
      });
    });

  return {
    name: '@asto/webpack',
    build: webpackBuilder,
    builders: {
      webpack: webpackBuilder,
    },
  };
}
