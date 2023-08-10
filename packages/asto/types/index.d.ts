import type esbuild from 'esbuild';

import type { BuildOptions, Watcher } from './config';
import type { Loader, LoaderContext } from './loader';

export * from './config';
export * from './loader';

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
}): LoaderContext<any>;

export function asto(options: BuildOptions | BuildOptions[]): Promise<void>;
export function watch(
  options: BuildOptions | BuildOptions[],
  watchOptions?: Watcher
): Promise<void>;
export function esbuildLoader(
  options?: esbuild.BuildOptions
): Loader<esbuild.BuildOptions>;
