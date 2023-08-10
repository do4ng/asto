import { join, relative } from 'path';
import { existsSync } from 'fs';

import animaux from 'animaux';
import * as core from '../index';
import loadModule from '../webpack';
import { error } from '../logger';

const app = new animaux.Program('asto');

app
  .option('--config, -c', 'Provide config file path', 'asto.config.js')
  .option('--watch, -w', 'Whether to monitor files.', false);

app.action((options) => {
  if (!existsSync(join(process.cwd(), options.config || 'asto.config.js'))) {
    error('cannot load config file. (asto.config.js)');
  }
  if (options.watch) {
    let watchOptions = {};

    if (existsSync(join(process.cwd(), 'asto.watch.js'))) {
      watchOptions = loadModule(
        relative(__dirname, join(process.cwd(), options.config || 'asto.watch.js'))
      );
    }

    core.watch(
      loadModule(
        relative(__dirname, join(process.cwd(), options.config || 'asto.config.js'))
      ),
      watchOptions
    );
  } else {
    core.asto(
      loadModule(
        relative(__dirname, join(process.cwd(), options.config || 'asto.config.js'))
      )
    );
  }
});

app.parse(process.argv);
