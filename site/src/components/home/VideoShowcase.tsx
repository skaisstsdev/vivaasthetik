'use client';

import { useTranslations } from 'next-intl';
import ScrollExpandMedia from './ScrollExpandMedia';

export default function VideoShowcase() {
  const t = useTranslations('VideoShowcase');

  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/video2_desktop.mov"
      mobileMediaSrc="/video2_mobile.mov"
      bgImageSrc="/stranica1.webp"
      title={t('title')}
    />
  );
}
