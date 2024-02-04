import { join, parse } from 'node:path';

import chokidar from 'chokidar';

import { BuildOptions, Watcher } from '$asto/types/config';
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
    { type, newBuilder }: { type: string; newBuilder: Builder<any> },
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

async function buildWithOptions(options: BuildOptions) {
  const builder = applyLoaders(options);

  // default loader

  if (!builder.build) {
    builder.build = esbuildLoader().build;
  }

  const time = performance.now();

  options.out = options.out || '.';

  const unexistBuilder = (name: string) => {
    error(`builder.${name} isn't exist.`);
  };

  const spinner = new Spinner({
    message: 'Preparing...'.gray,
  });
  const $result = {
    success: [],
    failed: [],
  };
  const $reason = [];

  spinner.start();

  for await (const entryPoint of options.entryPoints) {
    if (typeof entryPoint === 'string') {
      if (!builder.build) {
        unexistBuilder('build');
        return;
      }

      spinner.edit(`${'∘'.cyan} ${'[build]'.gray} Building ${entryPoint.cyan.bold}`);

      const result = await builder.build(
        createContext({
          options,
          builderOptions: {},
          input: entryPoint,
          output: join(
            options.out,
            parse(entryPoint).dir,
            `${parse(entryPoint).name}.out.js`,
          ),
        }),
      );

      if (result.success) {
        $result.success.push(entryPoint);
      } else {
        $result.failed.push(entryPoint);
        $reason.push(result.reason);
      }
    } else {
      if (!entryPoint.builder) entryPoint.builder = 'build';
      if (!builder[entryPoint.builder]) {
        unexistBuilder(entryPoint.builder);
        return;
      }

      spinner.edit(
        `${'∘'.cyan} ${'[build]'.gray} Building ${entryPoint.input.cyan.bold}`,
      );

      const result = await builder[entryPoint.builder](
        createContext({
          options,
          builderOptions: entryPoint.options,
          input: entryPoint.input,
          output: entryPoint.output,
        }),
      );

      if (result.success) {
        $result.success.push(entryPoint.input);
      } else {
        $result.failed.push(entryPoint.input);
        $reason.push(result.reason);
      }
    }
  }

  spinner.stop();

  return {
    success: $result.success,
    failed: $result.failed,
    reason: $reason,
    time: performance.now() - time,
  };
}

export async function build(options: BuildOptions | BuildOptions[]) {
  let output: { success: string[]; failed: string[]; time: number; reason: string[] } = {
    success: [],
    failed: [],
    reason: [],
    time: 0,
  };

  if (Array.isArray(options)) {
    for await (const opt of options) {
      const $output = await buildWithOptions(opt);

      output.success.push(...$output.success);
      output.failed.push(...$output.failed);
      output.reason.push(...$output.reason);
      output.time += $output.time;

      console.log();
    }
  } else {
    output = await buildWithOptions(options);
  }

  const total = output.success.length + output.failed.length;

  console.log();
  console.log(`Build Finished. ${`(${output.time.toFixed(2)}ms)`.bold}`.gray);

  // console.log('│'.gray);
  console.log(
    `${'├─'.gray} ${' SUCCESS '.green.bold}: ${`${
      String(output.success.length).green.bold
    }`}${` /${total} files`.green.dim}`,
  );
  console.log(
    `${'└─'.gray} ${' FAILED  '.red.bold}: ${`${String(output.failed.length).red.bold}`}${
      ` /${total} files`.red.dim
    }`,
  );

  console.log(
    `${output.failed
      .map((a, index) => ` - ${a.red.bold} - ${output.reason[index].red}`)
      .join('\n')}`,
  );

  console.log(`Done in ${`${output.time.toFixed(2)}ms`.green}`);
}

export async function asto(options: BuildOptions | BuildOptions[]) {
  await build(options);
}

export async function watch(
  options: BuildOptions | BuildOptions[],
  watchOptions: Watcher = {},
) {
  const callbacks = {
    onChange: null,
  };

  let watching = false;

  console.clear();

  await build(options);

  console.log('\nWatcher is watching..'.blue);

  const watcher = chokidar.watch(watchOptions.watchTarget || '.', {
    ignored: ['dist/**/*'],
    ...watchOptions.watchOptions,
  });

  watcher.on('change', async (path) => {
    if (watchOptions?.onChange) watchOptions.onChange(path);
    if (!watching) {
      watching = true;

      console.clear();

      if (callbacks.onChange) await callbacks.onChange({ path });

      await build(options);

      watching = false;
    }
  });

  return {
    onChange: (callback: Function) => {
      callbacks.onChange = callback;
    },
  };
}
