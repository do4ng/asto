import { join, parse } from 'path';
import type { BuildOutput, Loader, LoaderContext } from 'asto';

import webpack from 'webpack';

function webpackBuilder(ctx: LoaderContext<webpack.Configuration>): Promise<BuildOutput> {
  return new Promise((resolve) => {
    const compiler = webpack({
      entry: ctx.input,
      output: {
        path: ctx.astoOptions?.out || join(process.cwd(), 'dist'),
        filename: ctx.output || `${parse(ctx.input).name}.js`,
      },
      ...(ctx.options || {}),
    });

    compiler.run(() => {
      resolve({
        success: true,
      });
      compiler.close(() => {});
    });
  });
}

export function webpackLoader(): Loader<webpack.Configuration> {
  return {
    name: '@asto/webpack',
    build: webpackBuilder,
    builders: {
      webpack: webpackBuilder,
    },
  };
}
