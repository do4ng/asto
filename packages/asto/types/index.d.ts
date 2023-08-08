import type esbuild from 'esbuild';

import type { BuildOptions } from './config';
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

export function asto(options: BuildOptions): Promise<void>;
export function esbuildLoader(
  options?: esbuild.BuildOptions
): Loader<esbuild.BuildOptions>;
