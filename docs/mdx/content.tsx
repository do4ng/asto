'use client';

import { components } from './components';
import { runMdx } from './run';

interface Props {
  content: string;
}

export const Content = (props: Props): JSX.Element => {
  const { content } = props;
  const MDX: any = runMdx(content);
  return <MDX components={components} />;
};
