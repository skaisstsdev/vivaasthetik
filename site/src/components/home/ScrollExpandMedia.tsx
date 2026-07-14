'use client';

import { ReactNode } from 'react';

interface Props {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  mobileMediaSrc?: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  scrollToExpand?: string;
  children?: ReactNode;
}

export default function ScrollExpandMedia({
  children,
}: Props) {
  return (
    <>
      {children && (
        <div className="bg-white relative z-30">
          {children}
        </div>
      )}
    </>
  );
}
