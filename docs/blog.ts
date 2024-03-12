export interface Post {
  title: string;
  date: string;
}

export default [
  {
    title: 'This is blog',
    date: '24-01-02',
  },
] satisfies Post[];
