import { Loader } from 'asto';
import webpack from 'webpack';

export interface WebpackLoaderOptions {
  /**
   * default: `false`
   */
  typescript?: boolean;
  tsloader?: any;
  /**
   * default: `true`
   */
  nodeExternals?: boolean;

  stats?(stats: webpack.Stats);

  cli?: boolean;
}

export function webpackLoader(
  options?: WebpackLoaderOptions,
  webpackOptions?: webpack.Configuration
): Loader<webpack.Configuration>;
