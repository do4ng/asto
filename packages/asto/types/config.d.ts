import { WatchOptions } from 'chokidar';
import { Loader } from './loader';

export interface EntryPointOptions {
  input: string;
  output?: string;
  builder?: string;
  options?: any;
}
export type EntryPoint = string | EntryPointOptions;

export interface BuildOptions {
  entryPoints: EntryPoint[];
  out?: string;
  loader?: Loader<any> | Loader<any>[];
}

export interface Watcher {
  watchTarget?: string[] | string;
  watchOptions?: WatchOptions;
}
