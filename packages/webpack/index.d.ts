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
}

export function webpackLoader(
  options?: WebpackLoaderOptions,
  webpackOptions?: webpack.Configuration
): Loader<webpack.Configuration>;
