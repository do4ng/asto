import { join, parse } from 'node:path';

import { watch } from 'chokidar';

import { BuildOptions } from '$asto/types/config';
import { Builder, Loader, LoaderContext } from '$asto/types/loader';

import { assetLoader } from '../loader/asset';

import { error } from '../logger';
import { Spinner } from '../spinner';
import { esbuildLoader } from '../loader/esbuild';

function applyLoaders(options: BuildOptions) {
  const builder: Record<string, Builder<any>> = {
    ...assetLoader().builders,
  };

  const applyBuilder = (
    name: string,
    { type, newBuilder }: { type: string; newBuilder: Builder<any> }
  ) => {
    if (builder[type]) {
      error(`[loader/${name}] already existing builder (type: ${type})`);
      return;
    }

    builder[type] = newBuilder;
  };

  const apply = (loader: Loader<any>) => {
    if (loader.build) {
      applyBuilder(loader.name || 'unknown', { type: 'build', newBuilder: loader.build });
    }

    Object.keys(loader.builders || {}).forEach((type) => {
      applyBuilder(loader.name || 'unknown', { type, newBuilder: loader.builders[type] });
    });
  };

  if (Array.isArray(options.loader || [])) {
    ((options.loader as Loader<any>[]) || []).forEach((loader) => {
      apply(loader);
    });
  } else {
    apply(options.loader as Loader<any>);
  }

  return builder;
}

export function createContext({
  options,
  builderOptions,
  input,
  output,
}: {
  options: BuildOptions;
  builderOptions: any;
  input: string;
  output: string;
}): LoaderContext<any> {
  return {
    options: builderOptions,
    astoOptions: options,
    input,
    output,
  };
}

export async function build(options: BuildOptions) {
  const builder = applyLoaders(options);
  const startTime = performance.now();

  // default loader

  if (!builder.build) {
    builder.build = esbuildLoader().build;
  }

  let time = performance.now();

  const unexistBuilder = (name: string) => {
    error(`builder.${name} isn't exist.`);
  };

  for await (const entryPoint of options.entryPoints) {
    console.log();
    time = performance.now();

    if (typeof entryPoint === 'string') {
      if (!builder.build) {
        unexistBuilder('build');
        return;
      }
      const spinner = new Spinner({
        message: `Building ${entryPoint.cyan}`,
      });

      spinner.start();

      const result = await builder.build(
        createContext({
          options,
          builderOptions: {},
          input: entryPoint,
          output: join(options.out, `${parse(entryPoint).name}.js`),
        })
      );

      if (result.success) {
        spinner.stop(
          `${'✓'.green} Building ${entryPoint.cyan} ${
            `${(performance.now() - time).toFixed(2)}ms`.gray
          }`
        );
      } else {
        spinner.stop(
          `${'✖'.red} Building ${entryPoint.cyan} ${
            `${(performance.now() - time).toFixed(2)}ms`.gray
          }`
        );
      }
    } else {
      if (!entryPoint.builder) entryPoint.builder = 'build';
      if (!builder[entryPoint.builder]) {
        unexistBuilder(entryPoint.builder);
        return;
      }

      const spinner = new Spinner({
        message: `Building ${entryPoint.input.cyan}`,
      });

      spinner.start();

      const result = await builder[entryPoint.builder](
        createContext({
          options,
          builderOptions: entryPoint.options,
          input: entryPoint.input,
          output: entryPoint.output,
        })
      );

      if (result.success) {
        spinner.stop(
          `${'✓'.green} Building ${entryPoint.input.cyan} ${
            `${(performance.now() - time).toFixed(2)}ms`.gray
          }`
        );
      } else {
        spinner.stop(
          `${'✖'.red} Building ${entryPoint.input.cyan} ${
            `${(performance.now() - time).toFixed(2)}ms`.gray
          }`
        );
      }
    }
  }

  console.log();
  console.log();
  console.log(`Done in ${`${(performance.now() - startTime).toFixed(2)}ms`.green}`);
}

export async function asto(options: BuildOptions) {
  if (options.watch) {
    let watching = false;

    console.clear();

    console.log(`${options.entryPoints.length} entrypoints detected`.yellow.dim);

    await build(options);

    console.log('\nWatcher is watching..'.blue);

    const watcher = watch(options.watchTarget || '.', {
      ignored: ['dist/**/*'],
      ...options.watchOptions,
    });

    watcher.on('change', async () => {
      if (!watching) {
        watching = true;

        console.clear();
        console.log(`${options.entryPoints.length} entrypoints detected`.yellow.dim);

        await build(options);

        watching = false;
      }
    });
  } else {
    await build(options);
  }
}
