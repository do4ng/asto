import fs, { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { Loader } from '$asto/types/loader';

const copy = (src: string, dest: string, replace: Record<string, string>) => {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach((childItemName) => {
      copy(path.join(src, childItemName), path.join(dest, childItemName), replace);
    });
  } else {
    let target = readFileSync(src).toString();

    Object.keys(replace).forEach((r) => {
      target = target.replace(r, replace[r]);
    });

    writeFileSync(dest, target);
    fs.copyFileSync(src, dest);
  }
};
export const assetLoader = () =>
  <Loader<any>>{
    name: 'asset',
    builders: {
      asset: (ctx) => {
        if (!ctx.output) {
          return {
            success: false,
            reason: "ctx.output wasn't provided.",
          };
        }

        copy(ctx.input, ctx.output, ctx.options?.replace || []);

        return {
          success: true,
        };
      },
    },
  };
