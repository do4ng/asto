export type Post = Record<string, string>;

export interface Category {
  name: string;
  posts: Post[];
}

export interface Config {
  title: string;
  category: Category[];
  directory?: string;
}

export default [
  {
    title: 'docs',
    category: [
      {
        name: 'Overview',
        posts: [{ overview: 'Overview' }, { installation: 'Installation' }],
      },
      {
        name: 'Loaders',
        posts: [
          { loaders: 'loaders' },
          { esbuild: 'Esbuild' },
          { webpack: 'Webpack' },
          { esm: 'Esmodule' },
          { asset: 'Asset' },
          { custom: 'Custom' },
        ],
      },
    ],
  },
] as Config[];
