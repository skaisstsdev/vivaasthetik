'use client';

import { useTranslations } from 'next-intl';
import ScrollExpandMedia from './ScrollExpandMedia';

export default function VideoShowcase() {
  const t = useTranslations('VideoShowcase');

  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/video1_desktop.mp4"
      mobileMediaSrc="/video1_mobile.mp4"
      bgImageSrc="/stranica1.webp"
      title={t('title')}
    />
  );
}
