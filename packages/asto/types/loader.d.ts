import { BuildOptions } from './config';

export interface LoaderContext<T> {
  input: string;
  output?: string;

  options?: T;

  astoOptions?: BuildOptions;
}

export interface BuildOutput {
  success: boolean;
  reason?: any;
}

export type Builder<T> = (ctx: LoaderContext<T>) => Promise<BuildOutput> | BuildOutput;

export interface Loader<T> {
  name?: string;

  build?(ctx: LoaderContext<T>): Promise<BuildOutput> | BuildOutput;

  builders?: Record<string, Builder<T>>;
}
