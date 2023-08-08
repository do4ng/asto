import { Loader } from 'asto';
import webpack from 'webpack';

export function webpackLoader(): Loader<webpack.Configuration>;
