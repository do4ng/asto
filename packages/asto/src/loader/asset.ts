import fs from 'node:fs';
import path from 'node:path';

import { Loader } from '$asto/types/loader';

const copy = (src: string, dest: string) => {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach((childItemName) => {
      copy(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};
export const assetLoader = () =>
  <Loader<never>>{
    name: 'asset',
    builders: {
      asset: (ctx) => {
        if (!ctx.output) {
          return {
            success: false,
            reason: "ctx.output wasn't provided.",
          };
        }

        copy(ctx.input, ctx.output);

        return {
          success: true,
        };
      },
    },
  };
