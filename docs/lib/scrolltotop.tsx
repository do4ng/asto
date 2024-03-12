/* eslint-disable react-hooks/rules-of-hooks */

'use client';

import { useEffect } from 'react';
import { scrollTop } from './scrolltop';

export default function scrollToTop() {
  useEffect(() => {
    scrollTop();
  }, []);
  return null;
}
