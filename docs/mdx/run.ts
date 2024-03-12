import { runSync } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { MDXContent } from 'mdx/types';

export const runMdx = (code: any): MDXContent => {
  const mdx = runSync(code, runtime as any);
  const { default: Content } = mdx;
  return Content;
};
