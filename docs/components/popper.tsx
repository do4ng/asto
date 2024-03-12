'use client';

import { usePopper } from 'react-popper';
import { useEffect, useState } from 'react';

export function Popover({ children, text }: { children: React.ReactNode; text: string }) {
  const [referenceEl, setReferenceEl] = useState<HTMLElement | null>(null);
  const [popperEl, setPopperEl] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceEl, popperEl, {
    placement: 'bottom-start',
  });

  const showPopover = () => {
    // @ts-ignore
    popperEl?.setAttribute('data-show', true);
  };

  useEffect(() => {
    const hidePopover = () => {
      popperEl?.removeAttribute('data-show');
    };

    document.addEventListener('mousedown', hidePopover);

    return () => {
      document.removeEventListener('mousedown', hidePopover);
    };
  }, [popperEl, referenceEl]);

  return (
    <div>
      <button
        className="popover btn text"
        onClick={() => {
          showPopover();
        }}
        ref={setReferenceEl}
      >
        {text} <i className="ri-arrow-down-s-line"></i>
      </button>
      <div
        className="popover-menu"
        ref={setPopperEl}
        style={styles.popper}
        {...attributes.popper}
      >
        {children}
      </div>
    </div>
  );
}
