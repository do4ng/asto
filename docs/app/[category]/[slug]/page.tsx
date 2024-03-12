/* eslint-disable import/no-named-default */
/* eslint-disable no-use-before-define */

import React from 'react';
import Link from 'next/link';
import { readFileSync } from 'fs';
import { join } from 'path';

import { Category, default as parents } from '@/config';
import { compileMdx } from '@/mdx/compile';
import ScrollTop from '@/lib/scrolltotop';
import { Content } from '@/mdx/content';
import { TableOfContents } from './tableofcontents';

export async function generateStaticParams() {
  const pages = [];

  for (const parent of parents) {
    for (const category of parent.category) {
      for (const post of category.posts) {
        pages.push({ slug: Object.keys(post)[0], category: parent.title });
      }
    }
  }

  return pages;
}

export default async function Page({
  params,
}: {
  params: { slug: string; category: string };
}) {
  let target = null;
  let targetcategory = null;
  const posts = [];

  const config: { category: Category[]; directory: string } = {
    category: [],
    directory: '',
  };

  parents.forEach((parent) => {
    if (parent.title === params.category) {
      config.category = parent.category;
      config.directory = parent.directory || parent.title.toLowerCase();
    }
  });

  config.category.forEach((category) => {
    category.posts.forEach((post) => {
      posts.push(post);

      if (Object.keys(post)[0] === params.slug) {
        target = post;
        targetcategory = category.name;
      }
    });
  });

  if (!target) {
    return <>Page not found</>;
  }

  let raw: string = '';

  /*
  const raw = readFileSync(
    join(
      process.cwd(),
      'docs',
      (targetcategory || '').toLowerCase(),
      `${Object.keys(target as any)[0]}.mdx`,
    ),
  );
  */

  raw = readFileSync(
    join(
      process.cwd(),
      config.directory,
      (targetcategory || '').toLowerCase(),
      `${Object.keys(target as any)[0]}.mdx`,
    ),
  ).toString();

  const compiled = await compileMdx(raw);

  const postIndex = posts.findIndex((v) => Object.keys(v)[0] === params.slug);

  const previousPage = {
    url: Object.keys(posts[postIndex - 1] || {})[0],
    title: Object.values(posts[postIndex - 1] || {})[0],
  };

  const nextPage = {
    url: Object.keys(posts[postIndex + 1] || {})[0],
    title: Object.values(posts[postIndex + 1] || {})[0],
  };

  return (
    <>
      <ScrollTop></ScrollTop>
      <title>{`${Object.values(target as any)[0]} - zely`}</title>
      <div className="content-flex">
        <div className="post">
          <div className="intro">
            <h1>{Object.values(target as any)[0] as string}</h1>
          </div>
          <div className="content-container">
            <Content content={compiled}></Content>
          </div>
          <div className="prenext">
            {previousPage.title ? (
              <Link
                scroll={true}
                className="no-a"
                href={`/${config.directory}/${previousPage.url}`}
              >
                <h4>Previous Page</h4>

                <p>{previousPage.title as any}</p>
              </Link>
            ) : (
              <div></div>
            )}
            {nextPage.title ? (
              <Link
                scroll={true}
                className="no-a"
                href={`/${config.directory}/${nextPage.url}`}
              >
                <h4>Next Page</h4>
                <p>{nextPage.title as any}</p>
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>
        <TableOfContents></TableOfContents>
      </div>
    </>
  );
}
