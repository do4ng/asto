import visit from 'unist-util-visit';
import type * as mdast from 'mdast';
import type * as unified from 'unified';
import { toString } from 'mdast-util-to-string';

export const plugin: unified.Plugin<[], mdast.Root> = () => (tree) => {
  // @ts-ignore
  visit(tree, 'heading', (node) => {
    // @ts-ignore
    const html = toString(node);

    (node as any).type = 'html';
    (node as any).children = undefined;
    (node as any).value = `<h${(node as any).depth} id="${html
      .toLowerCase()
      .replace(/ /g, '-')}"><a href="#${html
      .toLowerCase()
      .replace(/ /g, '-')}">#</a>${html}</h${(node as any).depth}>`;
  });
};
