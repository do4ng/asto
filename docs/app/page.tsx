'use client';

import Index from '@/components';
import docs from '@/docs';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    document.querySelector('html')?.setAttribute('class', 'dark');
  });

  return (
    <>
      {' '}
      <div className="title-container">
        <div className="title">
          <h1 dangerouslySetInnerHTML={{ __html: docs.description }}></h1>
          <div className="actions">
            {docs.index.map((item) => (
              <Link href={item.href} key={item.href}>
                <button className="btn text">{item.content}</button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Index></Index>
    </>
  );
}
