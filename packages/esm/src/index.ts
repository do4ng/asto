import { join, parse } from 'node:path';

import { c2es } from 'c2es';

import type { TransformOptions } from 'c2es';
import type { Loader } from 'asto';

export function esmLoader(opts?: TransformOptions): Loader<TransformOptions> {
  return {
    name: '@asto/esm',
    build(ctx) {
      const parsed = parse(ctx.input);

      const output = ctx.output || join(parsed.dir, `${parsed.name}.mjs`);

      const options: TransformOptions = {
        dynamicImport: true,
        insert: {
          beforeImport: [
            'import path from"node:path";',
            'import{fileURLToPath}from"node:url";',
          ].join(''),
          afterImport: [
            'const __dirname = path.dirname(fileURLToPath(import.meta.url));',
            'const __filename = fileURLToPath(import.meta.url);',
          ].join('\n'),
        },
        ...(opts || {}),
        ...(ctx.options || {}),
      };

      return new Promise((resolve) => {
        try {
          c2es(ctx.input, output, options);
          resolve({ success: true });
        } catch (e) {
          resolve({ success: false, reason: e });
        }
      });
    },
  };
}
