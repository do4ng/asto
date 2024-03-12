export interface Docs {
  name: string;
  description: string;

  github: string;

  index: {
    content: string;
    href: string;
  }[];

  header: Array<
    | {
        type: 'popover';
        title: string;
        children: Array<{
          title: string;
          href: string;
          icon: string;
          description?: string;
        }>;
      }
    | { title: string; href: string; type: 'link' }
  >;
}

export default {
  name: 'asto',
  description: 'Next-gen Typescript/Javascript package bundler.',
  index: [
    {
      content: 'Overview',
      href: '/docs/overview',
    },
    {
      content: 'Installation',
      href: '/docs/installation',
    },
  ],
  header: [
    {
      title: 'Docs',
      type: 'popover',
      children: [
        {
          title: 'Overview',
          href: '/docs/overview',
          description: 'Introduction about asto.',
          icon: 'ri-book-open-line',
        },
        {
          title: 'Installation',
          href: '/docs/installation',
          description: 'Installation Guide',
          icon: 'ri-book-open-line',
        },
      ],
    },
    {
      title: 'Loaders',
      type: 'link',
      href: '/docs/loaders',
    },
    {
      title: 'Blog',
      type: 'link',
      href: '/blog',
    },
  ],
} as Docs;
