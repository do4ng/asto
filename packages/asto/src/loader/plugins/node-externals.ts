import { Plugin } from 'esbuild';

export const esbuildNodeExternals: Plugin = {
  name: 'dirname',

  setup(build) {
    build.onResolve({ filter: /.*/ }, (path) => {
      if (!path.path.startsWith('.')) {
        return {
          external: true,
        };
      }
    });
  },
};
