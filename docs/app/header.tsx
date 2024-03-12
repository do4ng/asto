'use client';

import 'remixicon/fonts/remixicon.css';

import Link from 'next/link';
import { Popover } from '@/components/popper';
import docs from '@/docs';

export function Header() {
  return (
    <>
      <header className="header-container text">
        <div className="header">
          <Link className="item-1 logo" href="/">
            {docs.name}
          </Link>

          <div className="item-2">
            {docs.header.map((item) => {
              if (item.type === 'popover') {
                return (
                  <>
                    <Popover text={item.title} key={item.title}>
                      {item.children.map((child) => (
                        <>
                          <div className="menu-item text-inter">
                            <Link href={child.href} className="menu-container">
                              <div className="menu-icon">
                                <i className={child.icon}></i>
                              </div>
                              <div className="menu-content">
                                <h4>{child.title}</h4>
                                {child.description}
                              </div>
                            </Link>
                          </div>
                        </>
                      ))}
                    </Popover>
                  </>
                );
              }
              return (
                <Link href={item.href} className="btn focuser" key={item.title}>
                  {item.title}
                </Link>
              );
            })}
          </div>

          <div className="item-3">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/zely-js/zely"
            >
              <i className="ri-github-fill"></i>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
